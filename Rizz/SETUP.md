# Rizzo App Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following Firebase configuration:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable Authentication with Email/Password
4. Create a web app in your project
5. Copy the configuration values to your `.env` file

## Installation

```bash
npm install
```

## Running the App

```bash
npm start
```

## Code Structure

- `components/` - Reusable UI components
- `constants/` - Theme and configuration constants
- `screens/` - Main app screens
- `services/` - API and business logic
- `types/` - TypeScript type definitions

## Features

- User authentication with Firebase
- Image upload and text extraction
- AI-powered reply generation
- Modern UI with animations
- Type-safe codebase 