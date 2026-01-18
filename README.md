# Checkpoint AI

Checkpoint AI is an intelligent document analysis and verification platform. It leverages advanced AI models to extract information from PDF documents, evaluate claims, and provide evidence-backed answers to user queries. The application consists of a modern, responsive frontend built with Next.js and a robust backend API powered by FastAPI and Google's Gemini models.

## Table of Contents

- [Project Overview](#project-overview)
- [Project Structure](#project-structure)
- [Application Info](#application-info)
- [Getting Started](#getting-started)

## Project Overview

Checkpoint AI allows users to upload documents (such as research papers or reports) and automatically verifies the claims made within them. The system scores these claims, provides explanations, and cites sources, effectively acting as a "checkpoint" for information integrity. Users can also interact with the document context through a Q&A interface.

## UI Screenshots

### Dashboard
![Dashboard](./sample_images/Dashboard.png)

### New Chat Interface
![New Chat](./sample_images/New%20Chat.png)

### AI Fact Checking
![AI Fact Check](./sample_images/AI%20fact%20check.png)

## Project Structure

The project is divided into two main components:

- **frontend/**: A Next.js 15 application providing the user interface, authentication, and chat capabilities.
- **server/**: A Python FastAPI backend that handles PDF processing, AI generation, and reasoning logic.

```
checkpoint-ai/
├── frontend/       # Next.js frontend application
├── server/         # FastAPI backend application
└── sample_images/  # Screenshots and demo images
```

## Application Info

- **Frontend Platform**: Web (Next.js)
- **Backend API**: REST (FastAPI)
- **AI/ML Engine**: Google Gemini (via Google GenAI SDK)
- **Authentication**: Firebase Auth

## Getting Started

To run the full application, you will need to set up and run both the frontend and backend services.

### Prerequisites

- Node.js (v18+ recommended)
- Python (v3.10+ recommended)
- A Google Cloud Project with Gemini API access
- A Firebase project for authentication

### Configuration

Before running the application, you need to set up the environment variables.

#### Backend Configuration
1. Create a `.env` file in the `server/` directory.
2. Add your Google Gemini API key:
   ```env
   GOOGLE_API_KEY=your_google_api_key_here
   ```

#### Frontend Configuration
1. Create a `.env.local` file in the `frontend/` directory.
2. Add your Firebase configuration keys:
   ```env
   NEXT_PUBLIC_API_KEY=your_firebase_api_key
   NEXT_PUBLIC_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_PROJECT_ID=your_project_id
   NEXT_PUBLIC_STORAGE_BUCKET=your_project_id.firebasestorage.app
   NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_APP_ID=your_app_id
   NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
   ```
3. Add the URL to your backend server:
   ```env
   NEXT_PUBLIC_API_URL=your-backend-url
   ```

### Installation & Execution

#### Backend (Python)

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
The server runs on `http://0.0.0.0:8000`.

#### Frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```
The frontend runs on `http://localhost:3000`.

For detailed instructions, refer to the `README.md` files in the respective `frontend/` and `server/` directories.
