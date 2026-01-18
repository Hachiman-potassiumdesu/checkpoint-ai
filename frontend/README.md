# Checkpoint AI - Frontend

The frontend for Checkpoint AI is a modern web application built with Next.js 15. It provides a clean, responsive interface for users to upload documents, view verification results, and interact with the AI assistant.

## Project Overview

This application serves as the client-side interface for the Checkpoint AI system. It handles user authentication, file uploads, and visualization of AI-generated insights (scores, explanations, and sources). It features a chat-like interface for Q&A and a dashboard for viewing document analysis.

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: [Firebase](https://firebase.google.com/)
- **AI Integration**: [Genkit](https://firebase.google.com/docs/genkit) (Firebase Genkit)

## Application Info

The application follows a modular architecture using Next.js App Router.

- **Authentication**: Users can sign up and sign in using Firebase Auth.
- **Document Analysis**: Users upload PDFs, which are sent to the backend for processing. Results are displayed with interactive verification scores.
- **Chat**: A chat interface allows users to ask follow-up questions based on the analyzed document context.

## Getting Started

### Prerequisites

- Node.js installed.
- A Firebase project for authentication.

### Configuration

Create a `.env.local` file in the `frontend/` directory with your Firebase configuration:

```env
NEXT_PUBLIC_API_KEY=your_firebase_api_key
NEXT_PUBLIC_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_PROJECT_ID=your_project_id
NEXT_PUBLIC_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_APP_ID=your_app_id
NEXT_PUBLIC_MEASUREMENT_ID=your_measurement_id
```

Add the URL to your backend server:

```env
NEXT_PUBLIC_API_URL=your-backend-url
```

### Installation

1.  Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Run the development server:

    ```bash
    npm run dev
    ```

4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Files

### Major Directories & Files

- **`src/app/`**: Contains the application routes and page layouts.
  - `page.tsx`: The main entry point (Landing/Home).
  - `layout.tsx`: Root layout definition.
  - `globals.css`: Global styles and Tailwind directives.
- **`src/components/`**: Reusable UI components.
  - `ui/`: Core UI primitives (Buttons, Cards, Inputs) from Shadcn.
  - `screens/`: Complex screen layouts (`homeScreen.tsx`, `appScreen.tsx`).
  - `auth-provider.tsx`: Context provider for handling authentication state.
  - `chat-view.tsx` & `chat-sidebar.tsx`: Components for the chat interface.
- **`src/lib/`**: Utility functions and configurations.
  - `firebase.ts`: Firebase initialization and configuration.
  - `utils.ts`: Helper functions (class merging, formatting).
  - `type.ts`: TypeScript type definitions.
- **`src/hooks/`**: Custom React hooks.
  - `use-auth.ts`: Hook to access user authentication status.
