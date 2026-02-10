# Surgery Phase Predictor

A modern, full-stack application for real-time surgical phase recognition using AI models. Features a React frontend and FastAPI backend with SurgVLP-based video classification.

## Features

- 🎥 **Video Upload & Playback** - Upload and play surgical videos with custom controls
- 🤖 **AI-Powered Predictions** - Real-time phase recognition using SurgVLP backbone with trained classifier
- ⚙️ **Configurable Settings** - Adjustable frame capture and prediction parameters
- 📊 **Real-time Statistics** - Monitor frame counts, confidence scores, and processing status
- 🎨 **Modern UI** - Beautiful, responsive design with smooth animations
- ♿ **Accessible** - Built with accessibility best practices
- 🔌 **RESTful API** - FastAPI backend with CORS support

## Architecture

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: FastAPI + PyTorch + SurgVLP
- **Model**: SurgVLP backbone with trained embedding classifier

## Getting Started

### Prerequisites

- **Node.js 18+** and npm/yarn (for frontend)
- **Python 3.8+** (for backend)
- **CUDA-capable GPU** (optional, but recommended for faster inference)

### Backend Setup

#### Option 1: Test Server (Recommended for Frontend Development)

For testing the frontend without ML model dependencies:

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate   # On macOS/Linux
# or on Windows: venv\Scripts\activate
```

3. Install minimal test dependencies:
```bash
pip install -r requirements-test.txt
```

4. Start the test server:
```bash
python server_test.py
```

The test server will echo back "frames received" and return mock predictions - perfect for frontend development!

#### Option 2: Production Server (With ML Model)

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate   # On macOS/Linux
# or on Windows: venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

**Note:** `surgvlp` is not on PyPI. Install from your local clone or internal repo if needed.

4. Ensure you have the required model files:
   - SurgVLP config file at `./tests/config_surgvlp.py` (relative to project root)
   - Trained classifier checkpoint at `output_all_phases/best_model_presentation.pth` (relative to project root)
   - `simple_classifier.py` module (for EmbeddingClassifier)

5. Start the FastAPI server:
```bash
python server.py
```

Or from the project root:
```bash
python backend/server.py
```

The server will start on `http://localhost:8000`

**API Endpoints:**
- `GET /health` - Health check endpoint
- `POST /load-model` - Load the video classification model
- `POST /predict` - Predict surgical phase from frames (expects base64-encoded images)
- `GET /model-info` - Get information about the loaded model

### Frontend Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

4. **Connect to Backend**: The backend URL defaults to `http://localhost:8000`. You can:
   - Use the default (pre-filled in the UI)
   - Set `VITE_BACKEND_URL` in a `.env` file (see `.env.example`)
   - Manually enter a different URL in the UI
   
   Then click "Test Connection"

### Building for Production

**Frontend:**
```bash
npm run build
```
The built files will be in the `dist` directory.

**Backend:**
The FastAPI server can be deployed using uvicorn or any ASGI server:
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8000
```

Or from the project root:
```bash
uvicorn backend.server:app --host 0.0.0.0 --port 8000
```

### Deploy to GitHub Pages

1. **Enable GitHub Pages** in your repo: **Settings → Pages → Source**: choose **GitHub Actions**.

2. **Repo name**: If your repo is not named `surgical-phase`, set the same base in `vite.config.js`:
   ```js
   base: process.env.GITHUB_PAGES === 'true' ? '/your-repo-name/' : '/',
   ```

3. **Deploy from your machine** (builds and pushes to `gh-pages` branch):
   ```bash
   npm install
   npm run deploy
   ```
   Or use the **GitHub Actions** workflow: push to `main` and the workflow will build and deploy automatically.

4. **Site URL**: `https://<username>.github.io/surgical-phase/` (replace with your repo name if different).

## Project Structure

```
surgical-phase/
├── backend/              # Backend FastAPI server
│   ├── server.py        # FastAPI application
│   └── requirements.txt # Python dependencies
├── src/                  # Frontend React application
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── BackendConnection.jsx
│   │   ├── ModelLoader.jsx
│   │   ├── ConfigurationPanel.jsx
│   │   ├── VideoUpload.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── ResultsPanel.jsx
│   │   └── ErrorDisplay.jsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useBackend.js
│   │   └── useVideoProcessing.js
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles
├── index.html
├── package.json         # Node.js dependencies
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## Usage

1. **Start Backend**: Run `python server.py` to start the FastAPI server
2. **Start Frontend**: Run `npm run dev` to start the React development server
3. **Connect to Backend**: Enter `http://localhost:8000` in the backend URL field and click "Test Connection"
4. **Load Model**: Once connected, click "Load Model" to initialize the AI model (this may take a few moments)
5. **Configure Settings**: Adjust frame capture parameters as needed:
   - **Frames per Prediction**: Number of frames to send for each prediction (default: 20)
   - **Min/Max Frames**: Buffer size for frame management
6. **Upload Video**: Select a surgical video file (MP4, AVI, MOV, etc.)
7. **Play & Predict**: Click play to start video playback and automatic phase prediction

## API Documentation

Once the server is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Technologies

**Frontend:**
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library

**Backend:**
- **FastAPI** - Modern Python web framework
- **PyTorch** - Deep learning framework
- **SurgVLP** - Surgical video-language pre-trained model
- **Uvicorn** - ASGI server

## Development

### Backend Development

The server uses FastAPI with automatic CORS middleware. To modify the server:
- Edit `backend/server.py` for API endpoints
- Update `backend/requirements.txt` for Python dependencies
- The server auto-reloads on code changes when using `uvicorn` with `--reload`
- Run from the `backend` directory or use module path: `uvicorn backend.server:app --reload`

### Frontend Development

The frontend uses Vite with hot module replacement:
- Edit files in `src/` for React components
- Styles are in `src/index.css` using Tailwind CSS
- Update `package.json` for Node.js dependencies

## Troubleshooting

**Backend Issues:**
- Ensure all model files are in the correct paths
- Check that CUDA is available if using GPU: `python -c "import torch; print(torch.cuda.is_available())"`
- Verify Python dependencies are installed: `pip list`

**Frontend Issues:**
- Clear browser cache if seeing stale code
- Check browser console for errors
- Verify backend URL is correct (default: `http://localhost:8000`)

**Connection Issues:**
- Ensure backend is running before connecting from frontend
- Check CORS settings if deploying to different domains
- Verify firewall isn't blocking port 8000

## License

MIT
