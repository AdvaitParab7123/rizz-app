export async function extractTextFromImage(base64: string): Promise<string> {
  // Placeholder: Replace with actual OCR logic
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        // Simulate OCR processing
        if (!base64 || base64.length < 100) {
          reject(new Error('Invalid image data'));
          return;
        }
        
        // Simulate different types of extracted text based on image size
        const imageSize = base64.length;
        let extractedText: string;
        
        if (imageSize < 1000) {
          extractedText = "Hey! How are you doing today?";
        } else if (imageSize < 5000) {
          extractedText = "That's really interesting! What do you think about this?";
        } else {
          extractedText = "Thanks for sharing that with me. I'd love to hear more about your thoughts on this topic!";
        }
        
        resolve(extractedText);
      } catch (error) {
        reject(new Error('Failed to extract text from image'));
      }
    }, 2000);
  });
} 