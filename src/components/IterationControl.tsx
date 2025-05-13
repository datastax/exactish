import React, { useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

interface IterationControlProps {
  iterations: number;
  onIterationsChange: (iterations: number) => void;
  currentIteration: number;
  isProcessing: boolean;
  onReset: () => void;
  disabled: boolean;
}

const IterationControl: React.FC<IterationControlProps> = ({
  iterations,
  onIterationsChange,
  currentIteration,
  isProcessing,
  onReset,
  disabled
}) => {
  // Get the environment variable to determine if iteration controls should be shown
  const showIterationControls = import.meta.env.VITE_SHOW_ITERATION_CONTROLS === 'true';
  
  // Set iterations to 10 by default if controls are hidden
  useEffect(() => {
    if (!showIterationControls && iterations !== 10) {
      onIterationsChange(10);
    }
  }, [showIterationControls, iterations, onIterationsChange]);
  const progress = currentIteration > 0 
    ? Math.min((currentIteration / iterations) * 100, 100)
    : 0;

  return (
    <div className="w-full space-y-4">
      {showIterationControls ? (
        <>
          <div className="flex justify-between text-white/60 text-sm mb-1">
            <label htmlFor="iterations" className="block font-medium">
              Number of Iterations
            </label>
            <span>{iterations}</span>
          </div>
          
          <div className="bg-white/10 h-2 rounded-full w-full mb-6 relative">
            <div 
              className="absolute top-0 left-0 h-2 bg-gradient-to-r from-indigo-400 to-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${(iterations / 50) * 100}%` }}
            ></div>
            <input
              type="range"
              id="iterations"
              min="1"
              max="50"
              value={iterations}
              onChange={(e) => onIterationsChange(parseInt(e.target.value))}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
              disabled={isProcessing || disabled}
            />
          </div>
        </>
      ) : (
        /* Hidden iteration configuration - fixed at 10 */
        null
      )}
      
      {/* Reset button moved to top-right corner */}
      <div className="relative">
        <button
          onClick={onReset}
          className="absolute right-0 top-0 p-2 rounded-full text-white/60 bg-white/5 hover:bg-white/10 transition-all shadow-md"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      <div className="w-full mt-2">
        {!isProcessing && (
          <p className="text-sm text-white/60 mt-2">
            Processing usually takes between 3-5 minutes, as it calls the image edit model sequentially.
          </p>
        )}
        
        {isProcessing && (
          <div className="w-full space-y-2 mt-4">
            <div className="flex justify-between text-sm text-white/60">
              <span>Iteration {currentIteration} of {iterations}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-indigo-400 to-rose-400 h-2.5 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Processing usually takes between 3-5 minutes, as it calls the image edit model sequentially.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default IterationControl;