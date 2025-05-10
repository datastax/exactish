import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  return (
    <div className="relative w-full bg-red-900 bg-opacity-20 backdrop-filter backdrop-blur-lg border border-red-300 border-opacity-30 rounded-xl p-4 mb-4 shadow-lg">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-300" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-red-100">{message}</p>
        </div>
      </div>
      <button
        className="absolute top-4 right-4 text-red-300 hover:text-red-100 transition-colors duration-200"
        onClick={onDismiss}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default ErrorDisplay;