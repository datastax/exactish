import React, { useState } from 'react';
import ImageUploader from './components/ImageUploader';
import IterationControl from './components/IterationControl';
import ResultGallery from './components/ResultGallery';
import ErrorDisplay from './components/ErrorDisplay';
import { useImageIteration } from './hooks/useImageIteration';
import { DemoHeroGeometric } from './components/ui/demo';

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
    <div className="min-h-screen bg-[#030303]">
      <DemoHeroGeometric />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-0 relative z-10 -mt-32">
        <div className="bg-transparent backdrop-filter backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-white/10 mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-white mb-2">This</h3>
                <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg border border-white/10">
                  <img src="/Before.jpeg" alt="Before" className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="hidden md:flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-right">
                <h3 className="text-xl font-bold text-white mb-2">To This</h3>
                <div className="relative w-full h-48 md:h-64 overflow-hidden rounded-lg border border-white/10">
                  <img src="/After.gif" alt="After" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {state.error && (
          <ErrorDisplay message={state.error} onDismiss={handleDismissError} />
        )}

        <div className="bg-transparent backdrop-filter backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-white/10">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                1
              </div>
              <h2 className="text-xl font-bold text-white ml-3">Upload Your Starting Image</h2>
            </div>
            <ImageUploader
              onImageSelect={setOriginalImage}
              previewUrl={state.originalImagePreview}
              disabled={state.isProcessing}
            />
          </div>
          
          <div className="border-t border-white/5 p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                2
              </div>
              <h2 className="text-xl font-bold text-white ml-3">Configure & Start</h2>
            </div>
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
            <div className="border-t border-white/5 p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  3
                </div>
                <h2 className="text-xl font-bold text-white ml-3">Results</h2>
              </div>
              <ResultGallery
                images={state.iterationImages}
                selectedImageIndex={selectedImageIndex}
                onSelectImage={setSelectedImageIndex}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 text-center text-sm text-blue-200">
          <div className="flex items-center justify-center">
            <span className="mr-2">Powered by</span>
            <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-md px-2 py-1">
              <img src="/langflow_logo.jpeg" alt="Langflow Logo" className="h-6" />
            </div>
          </div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none -z-10" />
      </main>
    </div>
  );
}

export default App;