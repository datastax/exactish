import { useState, useCallback } from 'react';
import { processImageWithLangflow, base64ToFile, fileToBase64 } from '../services/langflow';
import { AppState } from '../types';
import { isNotificationPermissionGranted, sendNotification } from '../utils/notifications';
import { sendEmailNotification } from '../services/email';
import { createGifForEmail } from '../services/animation';

export const useImageIteration = () => {
  const [state, setState] = useState<AppState>({
    originalImage: null,
    originalImagePreview: null,
    iterations: 5,
    currentIteration: 0,
    isProcessing: false,
    iterationImages: [],
    error: null,
    notificationEmail: null,
  });

  const setOriginalImage = useCallback(async (file: File | null) => {
    if (!file) {
      setState(prev => ({
        ...prev,
        originalImage: null,
        originalImagePreview: null,
        iterationImages: [],
      }));
      return;
    }
    
    try {
      console.log('Setting original image:', {
        name: file.name,
        type: file.type,
        size: file.size
      });

      const preview = await fileToBase64(file);
      setState(prev => ({
        ...prev,
        originalImage: file,
        originalImagePreview: preview,
        error: null,
      }));
    } catch (error) {
      console.error('Error setting original image:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState(prev => ({
        ...prev,
        error: 'Failed to load the image: ' + errorMessage,
      }));
    }
  }, []);

  const setIterations = useCallback((count: number) => {
    setState(prev => ({
      ...prev,
      iterations: count,
    }));
  }, []);

  const resetState = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIteration: 0,
      isProcessing: false,
      iterationImages: [],
      error: null,
    }));
  }, []);
  
  const setNotificationEmail = useCallback((email: string | null) => {
    setState(prev => ({
      ...prev,
      notificationEmail: email,
    }));
  }, []);

  const startIterationProcess = useCallback(async () => {
    if (!state.originalImage) {
      setState(prev => ({
        ...prev,
        error: 'Please upload an image first',
      }));
      return;
    }

    try {
      console.log('Starting iteration process');
      setState(prev => ({
        ...prev,
        isProcessing: true,
        error: null,
        iterationImages: [],
        currentIteration: 0,
      }));

      // Add the original image as the first iteration
      const originalBase64 = await fileToBase64(state.originalImage);
      setState(prev => ({
        ...prev,
        iterationImages: [{
          id: 0,
          imageData: originalBase64,
          timestamp: Date.now(),
        }],
      }));

      let currentImage = state.originalImage;

      for (let i = 0; i < state.iterations; i++) {
        try {
          console.log(`Starting iteration ${i + 1}`);
          
          // Process the current image
          const resultImageBase64 = await processImageWithLangflow(currentImage);
          
          // Convert base64 back to File for next iteration
          currentImage = await base64ToFile(resultImageBase64);
          
          // Update state with the new image
          setState(prev => ({
            ...prev,
            currentIteration: i + 1,
            iterationImages: [
              ...prev.iterationImages,
              {
                id: i + 1,
                imageData: resultImageBase64,
                timestamp: Date.now(),
              },
            ],
          }));

          console.log(`Completed iteration ${i + 1}`);
        } catch (iterationError) {
          console.error(`Error in iteration ${i + 1}:`, iterationError);
          const errorMessage = `Error in iteration ${i + 1}: ${iterationError instanceof Error ? iterationError.message : 'Unknown error'}. Please try again later or contact support if the issue persists.`;
          setState(prev => ({
            ...prev,
            error: errorMessage,
            isProcessing: false,
          }));
          
          // Send error notification if permission is granted
          if (isNotificationPermissionGranted()) {
            sendNotification('Image Processing Error', {
              body: `There was an error processing your image in iteration ${i + 1}. Please check the application for details.`,
              icon: '/favicon.ico'
            });
          }
          
          // Send email notification if email is provided
          if (state.notificationEmail) {
            sendEmailNotification({
              email: state.notificationEmail,
              subject: 'Error Processing Your Image',
              message: `There was an error processing your image in iteration ${i + 1}. Please try again with a different image.`
            });
          }
          
          return;
        }
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
      }));
      console.log('Iteration process completed successfully');
      
      // Send completion notification if permission is granted
      if (isNotificationPermissionGranted()) {
        sendNotification('Image Processing Complete', {
          body: `Successfully completed ${state.iterations} iterations of your image.`,
          icon: '/favicon.ico'
        });
      }
      
      // Send email notification with GIF if email is provided
      if (state.notificationEmail && state.iterationImages.length > 0) {
        try {
          // Generate GIF from all iteration images
          const gifDataUri = await createGifForEmail(state.iterationImages);
          
          // Send email with the GIF
          sendEmailNotification({
            email: state.notificationEmail,
            subject: 'Your Image Processing is Complete',
            message: `Your image processing has completed successfully with ${state.iterations} iterations. We've attached a GIF showing all iterations of your image.`,
            imageData: gifDataUri
          });
        } catch (error) {
          console.error('Error creating GIF for email:', error);
          
          // Fallback to sending just the last image if GIF creation fails
          const lastImage = state.iterationImages[state.iterationImages.length - 1];
          sendEmailNotification({
            email: state.notificationEmail,
            subject: 'Your Image Processing is Complete',
            message: `Your image processing has completed successfully with ${state.iterations} iterations. We've attached the final result of your image processing.`,
            imageData: lastImage?.imageData
          });
        }
      }
    } catch (error) {
      console.error('Error during iteration process:', error);
      const errorMessage = error instanceof Error 
        ? `Error: ${error.message}. Please try again later or contact support if the issue persists.`
        : 'An unknown error occurred. Please try again later.';
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage,
      }));
      
      // Send error notification if permission is granted
      if (isNotificationPermissionGranted()) {
        sendNotification('Image Processing Error', {
          body: 'There was an error processing your image. Please check the application for details.',
          icon: '/favicon.ico'
        });
      }
      
      // Send email notification if email is provided
      if (state.notificationEmail) {
        sendEmailNotification({
          email: state.notificationEmail,
          subject: 'Error Processing Your Image',
          message: 'There was an error processing your image. Please try again with a different image.'
        });
      }
    }
  }, [state.originalImage, state.iterations]);

  return {
    state,
    setOriginalImage,
    setIterations,
    startIterationProcess,
    resetState,
    setNotificationEmail,
  };
};