# Backend API Server

FastAPI backend server for the Surgery Phase Predictor application.

## Setup

1. Create and activate a virtual environment (recommended):
```bash
python3 -m venv venv
source venv/bin/activate   # macOS/Linux
# Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

**Note:** `surgvlp` is not on PyPI. If your project uses it, install from your local clone or internal repo, e.g. `pip install -e /path/to/surgvlp`, after the step above.

3. Ensure required model files are available:
   - SurgVLP config: `../tests/config_surgvlp.py` (relative to project root)
   - Classifier checkpoint: `../output_all_phases/best_model_presentation.pth` (relative to project root)
   - `simple_classifier.py` module (should be in Python path or backend directory)

## Running the Server

### Test Server (No Model Dependencies) - Recommended for Frontend Development

For testing the frontend without ML model dependencies:

1. Install minimal dependencies:
```bash
pip install -r requirements-test.txt
```

2. Run the test server:
```bash
python server_test.py
```

The test server will:
- Accept frame uploads and echo back "frames received"
- Return mock predictions based on frame count
- Work without any model files or ML dependencies

### Production Server (With Model)

1. Install full dependencies:
```bash
pip install -r requirements.txt
```

2. Run the server:
```bash
python server.py
```

Or using uvicorn:
```bash
uvicorn server:app --host 0.0.0.0 --port 8000
```

### With auto-reload (development)
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /load-model` - Load the video classification model
- `POST /predict` - Predict surgical phase from frames (expects base64-encoded images)
- `GET /model-info` - Get information about the loaded model

## API Documentation

Once the server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Configuration

The server expects:
- SurgVLP config file path (default: `./tests/config_surgvlp.py`)
- Classifier checkpoint path (default: `output_all_phases/best_model_presentation.pth`)

These paths are relative to where the server is run from. If running from the `backend` directory, update paths accordingly or use absolute paths.
