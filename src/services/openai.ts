import OpenAI from 'openai';

// Initialize the OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // For client-side usage
});

/**
 * Convert a base64 image to a File object
 */
export const base64ToFile = async (base64Data: string, filename = 'image.png'): Promise<File> => {
  const response = await fetch(base64Data);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
};

/**
 * Convert a File to a base64 string
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Process an image through the OpenAI API
 */
export const processImageWithOpenAI = async (imageFile: File): Promise<string> => {
  try {
    // Convert to base64 for easier manipulation
    const base64Image = await fileToBase64(imageFile);
    
    // Call the OpenAI API
    const response = await openai.images.edit({
      model: "gpt-image-1",
      image: imageFile,
      prompt: "Create the exact replica of this image, don't change a thing.",
    });

    // Extract the base64 image from the response
    if (response.data && response.data[0] && response.data[0].b64_json) {
      return `data:image/png;base64,${response.data[0].b64_json}`;
    } else {
      throw new Error('No image data received from OpenAI');
    }
  } catch (error) {
    console.error('Error processing image with OpenAI:', error);
    throw error;
  }
};