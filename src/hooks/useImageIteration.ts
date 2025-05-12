import { useState, useCallback, useEffect } from 'react';
import { processImageWithLangflow, base64ToFile, fileToBase64 } from '../services/langflow';
import { AppState } from '../types';
import { requestNotificationPermission, sendNotification } from '../utils/notifications';

export const useImageIteration = () => {
  // Request notification permission when the hook is first used
  useEffect(() => {
    requestNotificationPermission();
  }, []);
  const [state, setState] = useState<AppState>({
    originalImage: null,
    originalImagePreview: null,
    iterations: 5,
    currentIteration: 0,
    isProcessing: false,
    iterationImages: [],
    error: null,
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
          
          // Send error notification
          sendNotification('Image Processing Error', {
            body: `There was an error processing your image in iteration ${i + 1}. Please check the application for details.`,
            icon: '/favicon.ico'
          });
          
          return;
        }
      }

      setState(prev => ({
        ...prev,
        isProcessing: false,
      }));
      console.log('Iteration process completed successfully');
      
      // Send completion notification
      sendNotification('Image Processing Complete', {
        body: `Successfully completed ${state.iterations} iterations of your image.`,
        icon: '/favicon.ico'
      });
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
      
      // Send error notification
      sendNotification('Image Processing Error', {
        body: 'There was an error processing your image. Please check the application for details.',
        icon: '/favicon.ico'
      });
    }
  }, [state.originalImage, state.iterations]);

  return {
    state,
    setOriginalImage,
    setIterations,
    startIterationProcess,
    resetState,
  };
};