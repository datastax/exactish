import React from 'react';
import { RotateCcw } from 'lucide-react';

interface IterationControlProps {
  iterations: number;
  onIterationsChange: (iterations: number) => void;
  currentIteration: number;
  isProcessing: boolean;
  onStart: () => void;
  onReset: () => void;
  disabled: boolean;
}

const IterationControl: React.FC<IterationControlProps> = ({
  iterations,
  onIterationsChange,
  currentIteration,
  isProcessing,
  onStart,
  onReset,
  disabled
}) => {
  const progress = currentIteration > 0 
    ? Math.min((currentIteration / iterations) * 100, 100)
    : 0;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <label htmlFor="iterations" className="block text-sm font-medium text-gray-700">
          Number of Iterations
        </label>
        <span className="text-sm text-gray-500">{iterations}</span>
      </div>
      
      <input
        type="range"
        id="iterations"
        min="1"
        max="50"
        value={iterations}
        onChange={(e) => onIterationsChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
        disabled={isProcessing || disabled}
      />
      
      <div className="flex items-center gap-4">
        <button
          onClick={onStart}
          disabled={isProcessing || disabled}
          className={`flex-1 py-2 px-4 rounded-md text-white font-medium transition-all
            ${isProcessing || disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'}
          `}
        >
          {isProcessing ? 'Processing...' : 'Start Iteration Process'}
        </button>
        
        <button
          onClick={onReset}
          className="p-2 rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all"
          title="Reset"
        >
          <RotateCcw size={20} />
        </button>
      </div>
      
      {isProcessing && (
        <div className="w-full space-y-2">
          <div className="flex justify-between text-sm">
            <span>Iteration {currentIteration} of {iterations}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-purple-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IterationControl;