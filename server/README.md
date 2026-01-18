# Checkpoint AI - Server

The backend for Checkpoint AI is a high-performance REST API built with Python and FastAPI. It is responsible for heavy-lifting tasks such as PDF text extraction, AI-powered claim verification, and context-aware question answering.

## Project Overview

This server acts as the reasoning engine for the Checkpoint AI platform. It exposes endpoints that accept document uploads, process them using Google's Gemini models, and return structured data about the validity of claims found within the text. It also maintains context for follow-up questions.

## Tech Stack

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
- **Server**: [Uvicorn](https://www.uvicorn.org/)
- **AI/LLM**: [Google GenAI SDK](https://ai.google.dev/) (Gemini models)
- **PDF Processing**: [PyMuPDF (fitz)](https://pymupdf.readthedocs.io/)
- **Data Processing**: BeautifulSoup4, Pandas, NumPy

## Application Info

The server runs on port `8000` by default and accepts CORS requests from the frontend (default `http://localhost:3000`).

### Key Features
- **Claim Extraction & Evaluation**: Extracts key claims from documents and scores their accuracy using AI.
- **Grounding**: Returns source URIs and titles for verified information.
- **Contextual Q&A**: Maintains a context window to answer user questions relevant to the processed document.

## Getting Started

### Prerequisites
- Python 3.10 or higher.
- A Google Cloud Project with Gemini API access.

### Configuration

Create a `.env` file in the `server/` directory with your Google Gemini API key:

```env
GOOGLE_API_KEY=your_google_api_key_here
```

### Installation & Execution

It is recommended to use a virtual environment or Conda environment to manage dependencies.

**Option A: Using venv (Standard Library)**
```bash
cd server
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt
python server.py
```

**Option B: Using Conda**
```bash
cd server
conda create --name checkpoint-ai python=3.11
conda activate checkpoint-ai
pip install -r requirements.txt
python server.py
```
The API will be available at `http://0.0.0.0:8000`.

## Project Files

### Major Directories & Files

- **`server.py`**: The main entry point for the FastAPI application. Defines routes and middleware.
    - `POST /generate`: Uploads a PDF, extracts text, and returns verification scores/claims.
    - `POST /answer`: Answers questions based on provided context.
- **`lib/`**: Library code for core functionality.
    - `ai.py`: Contains functions for interacting with Google GenAI (`extract_and_evaluate`, `answer_question`).
    - `utils.py`: Utility functions for file handling and text processing (`read_pdf_content`).
- **`prompts/`**: Text files containing the prompt engineering logic used by the AI models.
    - `extract_and_check.txt`: Prompt for extracting and verifying claims.
    - `generate_context.txt`: Prompt for updating context.
    - `reorganize_output.txt`: Prompt for formatting the AI response.
