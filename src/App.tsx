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
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-0 relative z-10 -mt-80">
        <div className="bg-transparent backdrop-filter backdrop-blur-sm shadow-xl rounded-xl overflow-hidden border border-white/10 mb-8">
          <div className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="w-full md:w-5/12 text-center">
                <h3 className="text-xl font-bold text-white mb-2">From this...</h3>
                <div className="relative w-full aspect-square md:aspect-auto md:h-64 overflow-hidden rounded-lg border border-white/10">
                  <img src="/Before.jpeg" alt="Before" className="w-full h-full object-contain" />
                </div>
              </div>
              
              <div className="flex items-center justify-center py-2 md:py-0">
                <div className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-white/10 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 md:h-8 md:w-8 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
              
              <div className="w-full md:w-5/12 text-center">
                <h3 className="text-xl font-bold text-white mb-2">...to this</h3>
                <div className="relative w-full aspect-square md:aspect-auto md:h-64 overflow-hidden rounded-lg border border-white/10">
                  <img src="/After.gif" alt="After" className="w-full h-full object-contain" />
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
                isProcessing={state.isProcessing}
              />
            </div>
          )}
        </div>
        
        <div className="mt-6 pb-20 text-center">
          <a 
            href="https://langflow.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/30 border border-white/10 hover:bg-black/50 transition-colors duration-200 backdrop-filter backdrop-blur-sm"
          >
            <div className="h-5 w-5 overflow-hidden rounded-full bg-white/10 flex items-center justify-center">
              <img src="/langflow_logo.jpeg" alt="Langflow" className="h-4 w-4 object-cover" />
            </div>
            <span className="text-sm text-white/60 tracking-wide">
              Powered by Langflow
            </span>
          </a>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-transparent to-[#030303]/80 pointer-events-none -z-10" />
      </main>
    </div>
  );
}

export default App;