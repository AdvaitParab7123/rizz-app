# The Rizzo App

A modern React Native app that helps users generate AI-powered conversation replies by analyzing screenshots of conversations.

## 🚀 Features

- **User Authentication**: Secure Firebase-based authentication with email/password
- **Image Upload**: Upload conversation screenshots with image validation
- **Text Extraction**: Extract text from images (placeholder for OCR integration)
- **AI Reply Generation**: Generate contextual conversation replies
- **Modern UI**: Beautiful animations and Matrix-style background effects
- **Type Safety**: Full TypeScript support with strict type checking
- **Error Handling**: Comprehensive error handling and user feedback

## 🏗️ Architecture

### Code Organization
```
Rizzo/
├── components/          # Reusable UI components
│   ├── MatrixRain.tsx   # Animated background component
│   ├── BackgroundGradient.tsx
│   ├── LoadingSpinner.tsx
│   └── index.ts
├── constants/           # Theme and configuration
│   └── theme.ts
├── screens/            # Main app screens
│   ├── LoginScreen.tsx
│   ├── UploadScreen.tsx
│   ├── ReplyScreen.tsx
│   └── LoadingScreen.tsx
├── services/           # Business logic and API calls
│   ├── authService.ts
│   ├── firebase.ts
│   ├── generateReplies.ts
│   └── extractTextFromImage.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── validation.ts
│   └── errorHandling.ts
└── App.tsx            # Main app component
```

### Key Improvements Made

1. **Type Safety**
   - Added comprehensive TypeScript interfaces
   - Strict type checking enabled
   - Proper type definitions for all components

2. **Code Organization**
   - Extracted reusable components
   - Centralized theme constants
   - Separated business logic into services
   - Created utility functions for validation and error handling

3. **Performance Optimizations**
   - Optimized animations with useNativeDriver
   - Reduced image quality for better performance
   - Proper cleanup of animation loops

4. **Error Handling**
   - Comprehensive Firebase error handling
   - User-friendly error messages
   - Proper error logging and context

5. **Security**
   - Removed hardcoded Firebase configuration
   - Environment variable validation
   - Input validation for all user inputs

6. **Code Quality**
   - ESLint configuration with strict rules
   - Consistent code formatting
   - Removed unused dependencies
   - Added proper JSDoc comments

## 🛠️ Setup

### Prerequisites
- Node.js (v16 or higher)
- Expo CLI
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Rizzo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Firebase Setup**
   - Create a Firebase project
   - Enable Authentication with Email/Password
   - Create a web app and copy configuration

5. **Run the app**
   ```bash
   npm start
   ```

## 📱 Usage

1. **Authentication**: Sign up or log in with email/password
2. **Upload Screenshot**: Select a conversation screenshot from your gallery
3. **Text Extraction**: The app will extract text from the image
4. **Generate Replies**: AI will generate contextual conversation replies
5. **Copy Replies**: Tap to copy any generated reply to your clipboard

## 🧪 Development

### Available Scripts
- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking

### Code Style
- Follow ESLint rules
- Use TypeScript for all new code
- Follow the established component structure
- Add proper error handling for all async operations

## 🔧 Configuration

### Theme Customization
Edit `constants/theme.ts` to customize colors, spacing, and typography.

### Firebase Configuration
Update environment variables in `.env` file for Firebase settings.

## 🚀 Deployment

### Expo Build
```bash
expo build:android
expo build:ios
```

### EAS Build (Recommended)
```bash
eas build --platform android
eas build --platform ios
```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support, please open an issue in the GitHub repository. 