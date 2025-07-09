export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateImageFile = (base64: string): boolean => {
  if (!base64 || base64.length < 100) {
    return false;
  }
  
  // Check if it's a valid base64 image
  const imageRegex = /^data:image\/(jpeg|jpg|png|gif|webp);base64,/;
  return imageRegex.test(base64) || base64.length > 1000; // Fallback for non-data URLs
}; 