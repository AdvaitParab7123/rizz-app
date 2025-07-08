# Rizz App

A React Native app built with Expo for extracting text from images and generating replies.

## Tech Stack
- React Native + Expo + TypeScript
- React Navigation for screen transitions
- Firebase (Auth + Firestore)
- Expo Image Picker for image selection
- StyleSheet for styling (NativeWind configured but using StyleSheet for compatibility)

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Firebase:**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication and Firestore
   - Replace the placeholder values in `services/firebase.ts` with your actual Firebase config

3. **Run the app:**
   ```bash
   npm start
   ```
   Then scan the QR code with Expo Go app on your device.

## Project Structure
```
├── screens/
│   ├── LoginScreen.tsx      # Firebase email/password auth
│   ├── UploadScreen.tsx     # Image picker and processing
│   ├── ReplyScreen.tsx      # Display extracted text and replies
│   └── LoadingScreen.tsx    # Loading screen with logo
├── services/
│   ├── firebase.ts          # Firebase configuration
│   ├── extractTextFromImage.ts  # OCR placeholder function
│   └── generateReplies.ts   # AI reply generation placeholder
└── assets/
    └── logo-glow.png        # App logo
```

## Features
- **Login/Signup:** Firebase email/password authentication
- **Image Upload:** Pick images from device gallery
- **Text Extraction:** Extract text from images (placeholder implementation)
- **Reply Generation:** Generate 3 reply options from extracted text (placeholder)
- **Copy to Clipboard:** Copy generated replies to clipboard

## TODO
- Implement actual OCR service in `extractTextFromImage.ts`
- Implement actual AI service in `generateReplies.ts`
- Add proper error handling and validation
- Add loading states and better UX
- Configure Firebase project credentials 