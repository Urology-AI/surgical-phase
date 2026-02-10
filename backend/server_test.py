"""
Simplified test server for frontend development.
No model dependencies - just echoes back frame receipt.
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import base64

app = FastAPI(title="Surgery Phase Predictor API - Test Server")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionRequest(BaseModel):
    frames: List[str]  # Base64 encoded images


class PredictionResponse(BaseModel):
    predicted_class: int
    predicted_phase: str
    confidence: float
    num_frames: int


# Mock phase names for testing
MOCK_PHASES = [
    "Preparation",
    "Calot Triangle Dissection",
    "Clipping and Cutting",
    "Gallbladder Dissection",
    "Gallbladder Packaging",
    "Cleaning and Coagulation",
    "Gallbladder Retraction",
    "Presentation"
]


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "device": "cpu",
        "model_loaded": True,
        "server_type": "test"
    }


@app.post("/load-model")
async def load_model():
    """Mock model loading - always succeeds"""
    return {
        "status": "success",
        "message": "Model loaded successfully (test mode)",
        "num_classes": len(MOCK_PHASES),
        "embedding_dim": 512,
        "device": "cpu",
        "server_type": "test"
    }


@app.post("/predict", response_model=PredictionResponse)
async def predict_phase(request: PredictionRequest):
    """
    Mock prediction endpoint - just confirms frames were received.
    Returns a mock prediction based on frame count.
    """
    if not request.frames:
        raise HTTPException(status_code=400, detail="No frames provided")
    
    num_frames = len(request.frames)
    
    # Mock prediction: cycle through phases based on frame count
    phase_index = (num_frames // 5) % len(MOCK_PHASES)
    predicted_phase = MOCK_PHASES[phase_index]
    
    # Mock confidence: higher for more frames
    confidence = min(0.7 + (num_frames * 0.01), 0.99)
    
    print(f"Received {num_frames} frames - Mock prediction: {predicted_phase} (confidence: {confidence:.2f})")
    
    return PredictionResponse(
        predicted_class=phase_index,
        predicted_phase=predicted_phase,
        confidence=confidence,
        num_frames=num_frames
    )


@app.get("/model-info")
async def get_model_info():
    """Get information about the mock model"""
    return {
        "num_classes": len(MOCK_PHASES),
        "embedding_dim": 512,
        "phase_mapping": {phase: idx for idx, phase in enumerate(MOCK_PHASES)},
        "device": "cpu",
        "server_type": "test"
    }


if __name__ == "__main__":
    import uvicorn
    print("=" * 60)
    print("Starting TEST SERVER (no model dependencies)")
    print("=" * 60)
    print("Endpoints:")
    print("  GET  /health - Health check")
    print("  POST /load-model - Mock model loading")
    print("  POST /predict - Echo frames received")
    print("  GET  /model-info - Model info")
    print("=" * 60)
    uvicorn.run(app, host="0.0.0.0", port=8000)
