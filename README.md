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

### Quick Start

1.  **Backend Setup**:
    Navigate to the `server/` directory, install dependencies, and start the server.
    ```bash
    cd server
    pip install -r requirements.txt
    python server.py
    ```
    The server runs on `http://0.0.0.0:8000`.

2.  **Frontend Setup**:
    Navigate to the `frontend/` directory, install dependencies, and start the development server.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The frontend runs on `http://localhost:3000`.

For detailed instructions, refer to the `README.md` files in the respective `frontend/` and `server/` directories.
