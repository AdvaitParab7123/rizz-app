export interface AppError {
  code: string;
  message: string;
  details?: any;
}

export class AppError extends Error {
  public code: string;
  public details?: any;

  constructor(code: string, message: string, details?: any) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.details = details;
  }
}

export const handleFirebaseError = (error: any): AppError => {
  const errorCode = error.code || 'UNKNOWN_ERROR';
  let message = 'An unexpected error occurred';

  switch (errorCode) {
    case 'auth/user-not-found':
      message = 'No account found with this email address';
      break;
    case 'auth/wrong-password':
      message = 'Incorrect password';
      break;
    case 'auth/email-already-in-use':
      message = 'An account with this email already exists';
      break;
    case 'auth/weak-password':
      message = 'Password is too weak';
      break;
    case 'auth/invalid-email':
      message = 'Invalid email address';
      break;
    case 'auth/too-many-requests':
      message = 'Too many failed attempts. Please try again later';
      break;
    case 'auth/network-request-failed':
      message = 'Network error. Please check your connection';
      break;
    default:
      message = error.message || 'An unexpected error occurred';
  }

  return new AppError(errorCode, message, error);
};

export const logError = (error: AppError | Error, context?: string): void => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  };

  // In production, this would send to a logging service
  console.error('App Error:', errorInfo);
}; 