import { IterationImage } from '../types';

// Get environment variables with fallbacks for development
const LANGFLOW_API_BASE_URL = import.meta.env.VITE_LANGFLOW_API_BASE_URL;
const LANGFLOW_FLOW_ID = import.meta.env.VITE_LANGFLOW_FLOW_ID;
const LANGFLOW_IMAGE_COMPONENT_KEY = import.meta.env.VITE_LANGFLOW_IMAGE_COMPONENT_KEY || 'ImageFile-GJs3c';

// Construct API URLs using environment variables
const LANGFLOW_RUN_API_URL = `${LANGFLOW_API_BASE_URL}/api/v1/run/${LANGFLOW_FLOW_ID}`;
const LANGFLOW_FILES_API_URL = `${LANGFLOW_API_BASE_URL}/api/v2/files`;

export const processImageWithLangflow = async (imageFile: File): Promise<string> => {
  try {
      console.log('Processing image:', {
        name: imageFile.name,
        type: imageFile.type,
        size: imageFile.size
      });

      // Step 1: Upload the file to get a path
      console.log('Step 1: Uploading file to Langflow...');
      const uploadFormData = new FormData();
      uploadFormData.append('file', imageFile);
      
      const uploadController = new AbortController();
      const uploadTimeoutId = setTimeout(() => uploadController.abort(), 60000); // 1 minute timeout
      
      const uploadResponse = await fetch(`${LANGFLOW_FILES_API_URL}?stream=false`, {
        method: 'POST',
        headers: {
          // 'x-api-key': '' // Add API key if needed
        },
        body: uploadFormData,
        signal: uploadController.signal
      });
      
      clearTimeout(uploadTimeoutId);
      
      if (!uploadResponse.ok) {
        const errorMessage = `File upload failed (Status ${uploadResponse.status}): ${uploadResponse.statusText || 'No error details available'}`;
        console.error('File upload not OK:', {
          status: uploadResponse.status,
          statusText: uploadResponse.statusText
        });
        throw new Error(errorMessage);
      }
      
      const uploadData = await uploadResponse.json();
      console.log('File upload successful:', uploadData);
      
      if (!uploadData.path) {
        throw new Error('Invalid upload response: Missing file path');
      }
      
      // Step 2: Process the image using the file path
      console.log('Step 2: Processing image with Langflow...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 180000); // 3 minutes timeout

      // Prepare request body
      const requestBody = {
        input_value: "Create the exact replica of this image, don't change a thing.",
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          [LANGFLOW_IMAGE_COMPONENT_KEY]: {
            path: [uploadData.path]
          }
        }
      };
      
      console.log('Sending request to Langflow API with body:', JSON.stringify(requestBody, null, 2));
      console.log('Request URL:', `${LANGFLOW_RUN_API_URL}?stream=false`);
      
      const response = await fetch(`${LANGFLOW_RUN_API_URL}?stream=false`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorMessage = `API request failed (Status ${response.status}): ${response.statusText || 'No error details available'}`;
        console.error('API Response not OK:', {
          status: response.status,
          statusText: response.statusText
        });
        
        // Try to get more error details if possible
        try {
          const errorData = await response.text();
          console.error('Error response body:', errorData);
        } catch (readError) {
          console.error('Could not read error response body');
        }
        throw new Error(errorMessage);
      }

      console.log('Received response from Langflow API');
      const data = await response.json();
      
      // Log the structure of the response
      console.log('Response structure:', {
        hasOutputs: !!data.outputs,
        outputsLength: data.outputs?.length,
        hasResults: !!data.outputs?.[0]?.outputs?.[0]?.results,
      });
      
      // Parse the nested JSON response to get the base64 image
      const messageText = data.outputs[0].outputs[0].results.message.text;
      console.log('Parsing message text...');
      
      const parsedMessage = JSON.parse(messageText);
      console.log('Parsed message structure:', {
        hasStatus: !!parsedMessage.status,
        hasImageData: !!parsedMessage.image_data_uri,
        status: parsedMessage.status
      });
      
      if (parsedMessage.status !== 'success' || !parsedMessage.image_data_uri) {
        throw new Error('Invalid response from Langflow: Missing required data');
      }

      if (!parsedMessage.image_data_uri.startsWith('data:image/')) {
        throw new Error('Invalid image data received from Langflow');
      }

      console.log('Successfully processed image');
      return parsedMessage.image_data_uri;
    } catch (error: unknown) {
      
      if (error instanceof Error && error.name === 'AbortError') {
        console.error('Request timeout error:', error);
        throw new Error('Request timed out after 3 minutes');
      }

      console.error('Error processing image with Langflow:', error instanceof Error ? error.message : 'Unknown error');
      throw error instanceof Error ? error : new Error('Unknown error processing image');
    }
};

export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      console.log('File converted to base64:', {
        success: true,
        dataLength: result.length,
        startsWithDataImage: result.startsWith('data:image/')
      });
      resolve(result);
    };
    reader.onerror = (event: ProgressEvent<FileReader>) => {
      console.error('Error converting file to base64:', event.target?.error || 'Unknown error');
      reject(event.target?.error || new Error('Failed to convert file to base64'));
    };
  });
};

export const base64ToFile = async (base64Data: string): Promise<File> => {
  try {
    console.log('Converting base64 to file:', {
      dataLength: base64Data.length,
      isValidFormat: base64Data.startsWith('data:image/')
    });

    const response = await fetch(base64Data);
    if (!response.ok) {
      throw new Error('Failed to fetch base64 data');
    }

    const blob = await response.blob();
    console.log('Created blob:', {
      size: blob.size,
      type: blob.type
    });

    const file = new File([blob], 'iteration.png', { type: 'image/png' });
    console.log('Created file:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    return file;
  } catch (error: unknown) {
    console.error('Error converting base64 to file:', error);
    throw new Error(`Failed to convert base64 to file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};