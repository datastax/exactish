import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import IterationControl from './components/IterationControl';
import ResultGallery from './components/ResultGallery';
import ErrorDisplay from './components/ErrorDisplay';
import { useImageIteration } from './hooks/useImageIteration';

function App() {
  const {
    state,
    setOriginalImage,
    setIterations,
    startIterationProcess,
    resetState,
  } = useImageIteration();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleDismissError = () => {
    // Clear error message
    setOriginalImage(state.originalImage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <ImageIcon className="h-8 w-8 text-purple-600" />
              <h1 className="ml-2 text-xl font-bold text-gray-900">Image Iteration App</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <ErrorDisplay message={state.error} onDismiss={handleDismissError} />
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">1. Upload Your Starting Image</h2>
            <ImageUploader
              onImageSelect={setOriginalImage}
              previewUrl={state.originalImagePreview}
              disabled={state.isProcessing}
            />
          </div>
          
          <div className="border-t border-gray-200 p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">2. Configure & Start</h2>
            <IterationControl
              iterations={state.iterations}
              onIterationsChange={setIterations}
              currentIteration={state.currentIteration}
              isProcessing={state.isProcessing}
              onStart={startIterationProcess}
              onReset={resetState}
              disabled={!state.originalImage}
            />
          </div>
          
          {state.iterationImages.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">3. Results</h2>
              <ResultGallery
                images={state.iterationImages}
                selectedImageIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This application uses OpenAI's image API via Langflow to iteratively process images.
            Each iteration uses the prompt: "Create the exact replica of this image, don't change a thing."
          </p>
        </div>
      </main>
    </div>
  );
}

export default App;