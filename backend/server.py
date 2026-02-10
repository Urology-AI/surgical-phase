from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import torch
import torch.nn as nn
import surgvlp
from mmengine.config import Config
import numpy as np
from PIL import Image
import io
import base64
import cv2

# Import the classifier
from simple_classifier import EmbeddingClassifier

app = FastAPI(title="Surgery Phase Predictor API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model = None
device = "cuda" if torch.cuda.is_available() else "cpu"


class VideoClassificationModel(nn.Module):
    """
    Complete video classification model combining SurgVLP backbone with trained classifier.
    """
    def __init__(
        self,
        surgvlp_config_path: str,
        classifier_checkpoint_path: str,
        device: str = None
    ):
        """
        Args:
            surgvlp_config_path: Path to SurgVLP config file
            classifier_checkpoint_path: Path to trained classifier checkpoint
            device: Device to use (cuda/cpu)
        """
        super().__init__()
        
        self.device = device if device else ("cuda" if torch.cuda.is_available() else "cpu")
        
        # Load checkpoint to get architecture info
        checkpoint = torch.load(classifier_checkpoint_path, map_location=self.device)
        
        # Extract state dict and metadata
        if 'model_state_dict' in checkpoint:
            state_dict = checkpoint['model_state_dict']
            self.phase_to_idx = checkpoint.get('phase_to_idx', None)
        else:
            state_dict = checkpoint
            self.phase_to_idx = None
        
        # Detect architecture from checkpoint
        first_layer_weight = None
        for key in state_dict.keys():
            if 'classifier.0.weight' in key or (key == '0.weight'):
                first_layer_weight = state_dict[key]
                break
        
        if first_layer_weight is None:
            raise ValueError("Could not find first layer weight in checkpoint")
        
        embedding_dim = first_layer_weight.shape[1]
        
        # Find number of classes from last layer
        max_layer_idx = 0
        for key in state_dict.keys():
            if 'weight' in key:
                parts = key.replace('classifier.', '').split('.')
                if parts[0].isdigit():
                    max_layer_idx = max(max_layer_idx, int(parts[0]))
        
        last_layer_key = f'classifier.{max_layer_idx}.weight' if f'classifier.{max_layer_idx}.weight' in state_dict else f'{max_layer_idx}.weight'
        num_classes = state_dict[last_layer_key].shape[0]
        
        # Detect hidden dimensions
        hidden_dims = []
        layer_idx = 0
        while True:
            weight_key = f'classifier.{layer_idx}.weight' if f'classifier.{layer_idx}.weight' in state_dict else f'{layer_idx}.weight'
            if weight_key not in state_dict:
                break
            out_features = state_dict[weight_key].shape[0]
            if out_features != num_classes:
                hidden_dims.append(out_features)
            layer_idx += 3
        
        print(f"Detected architecture from checkpoint:")
        print(f"  Embedding dim: {embedding_dim}")
        print(f"  Hidden dims: {hidden_dims}")
        print(f"  Num classes: {num_classes}")
        print(f"  Phase mapping: {self.phase_to_idx}")
        
        # Load SurgVLP backbone
        configs = Config.fromfile(surgvlp_config_path)['config']
        self.backbone, self.preprocess = surgvlp.load(
            configs.model_config, 
            device=self.device
        )
        self.backbone.eval()
        
        # Freeze backbone
        for param in self.backbone.parameters():
            param.requires_grad = False
        
        # Initialize classifier with detected architecture
        self.classifier = EmbeddingClassifier(
            embedding_dim=embedding_dim,
            num_classes=num_classes,
            hidden_dims=hidden_dims,
            dropout=0.3
        ).to(self.device)
        
        # Load the trained weights
        self.classifier.load_state_dict(state_dict)
        self.classifier.eval()
        
        self.num_classes = num_classes
        self.embedding_dim = embedding_dim
    
    def get_video_embedding(self, frames: List[np.ndarray]) -> torch.Tensor:
        """
        Get mean-pooled embedding for a video from its frames.
        
        Args:
            frames: List of video frames (numpy arrays)
        
        Returns:
            Mean-pooled normalized embedding tensor (1, embedding_dim)
        """
        embeddings = []
        batch_size = 16
        
        with torch.no_grad():
            for i in range(0, len(frames), batch_size):
                batch_frames = frames[i:i+batch_size]
                
                # Convert to PIL and preprocess
                pil_frames = [Image.fromarray(frame) for frame in batch_frames]
                processed = torch.stack([
                    self.preprocess(pil_frame) for pil_frame in pil_frames
                ]).to(self.device)
                
                # Create dummy text tokens
                batch_len = len(batch_frames)
                batch_text = surgvlp.tokenize(["dummy"] * batch_len, device=self.device)
                
                # Extract embeddings
                output = self.backbone(processed, batch_text, mode='all')
                batch_embeddings = output['img_emb']
                embeddings.append(batch_embeddings)
        
        # Mean pooling across all frames
        all_embeddings = torch.cat(embeddings, dim=0)
        video_embedding = all_embeddings.mean(dim=0, keepdim=True)
        
        # Normalize
        video_embedding = video_embedding / video_embedding.norm(dim=-1, keepdim=True)
        
        return video_embedding


class PredictionRequest(BaseModel):
    frames: List[str]  # Base64 encoded images

class PredictionResponse(BaseModel):
    predicted_class: int
    predicted_phase: str
    confidence: float
    num_frames: int

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "device": device,
        "model_loaded": model is not None
    }

@app.post("/load-model")
async def load_model():
    """Load the video classification model"""
    global model
    
    try:
        model = VideoClassificationModel(
            surgvlp_config_path='../tests/config_surgvlp.py',
            classifier_checkpoint_path='../output_all_phases/best_model_presentation.pth',
            device=device
        )
        
        return {
            "status": "success",
            "message": "Model loaded successfully",
            "num_classes": model.num_classes,
            "embedding_dim": model.embedding_dim,
            "device": device
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to load model: {str(e)}")

def base64_to_numpy(base64_string: str) -> np.ndarray:
    """Convert base64 encoded image to numpy array (RGB)"""
    # Remove data URL prefix if present
    if ',' in base64_string:
        base64_string = base64_string.split(',')[1]
    
    # Decode base64
    img_data = base64.b64decode(base64_string)
    
    # Convert to PIL Image
    img = Image.open(io.BytesIO(img_data))
    
    # Convert to RGB if necessary
    if img.mode != 'RGB':
        img = img.convert('RGB')
    
    # Convert to numpy array
    return np.array(img)

@app.post("/predict", response_model=PredictionResponse)
async def predict_phase(request: PredictionRequest):
    """
    Predict surgical phase from a batch of frames.
    Frames should be base64 encoded images already at 640x360 resolution.
    """
    global model
    
    if model is None:
        raise HTTPException(status_code=400, detail="Model not loaded. Call /load-model first.")
    
    if not request.frames:
        raise HTTPException(status_code=400, detail="No frames provided")
    
    try:
        # Convert base64 frames to numpy arrays
        frames = []
        for frame_b64 in request.frames:
            frame_np = base64_to_numpy(frame_b64)
            
            # Verify/resize to 640x360 if needed (defensive programming)
            if frame_np.shape[:2] != (360, 640):
                frame_np = cv2.resize(frame_np, (640, 360))
            
            frames.append(frame_np)
        
        # Get video embedding
        with torch.no_grad():
            video_embedding = model.get_video_embedding(frames)
            
            # Get predictions
            logits = model.classifier(video_embedding)
            probabilities = torch.softmax(logits, dim=-1)
            predicted_class = logits.argmax(dim=-1).item()
            confidence = probabilities[0, predicted_class].item()
        
        # Get phase name
        predicted_phase = "Unknown"
        if model.phase_to_idx:
            idx_to_phase = {v: k for k, v in model.phase_to_idx.items()}
            predicted_phase = idx_to_phase.get(predicted_class, f"Class_{predicted_class}")
        
        return PredictionResponse(
            predicted_class=predicted_class,
            predicted_phase=predicted_phase,
            confidence=confidence,
            num_frames=len(frames)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.get("/model-info")
async def get_model_info():
    """Get information about the loaded model"""
    global model
    
    if model is None:
        raise HTTPException(status_code=400, detail="Model not loaded")
    
    return {
        "num_classes": model.num_classes,
        "embedding_dim": model.embedding_dim,
        "phase_mapping": model.phase_to_idx,
        "device": device
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)