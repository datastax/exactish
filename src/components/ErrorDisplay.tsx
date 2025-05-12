import React, { useState } from 'react';
import { AlertCircle, X, ChevronDown, ChevronUp } from 'lucide-react';

interface ErrorDisplayProps {
  message: string;
  onDismiss: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onDismiss }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Extract a user-friendly message and technical details
  const hasLangflowError = message.includes('Invalid response from Langflow');
  
  let userMessage = message;
  let technicalDetails = '';
  
  if (message.includes(':')) {
    const parts = message.split(':');
    if (parts.length >= 2) {
      userMessage = parts[0].trim();
      technicalDetails = parts.slice(1).join(':').trim();
    }
  }
  
  return (
    <div className="relative w-full bg-red-900 bg-opacity-20 backdrop-filter backdrop-blur-lg border border-red-300 border-opacity-30 rounded-xl p-4 mb-4 shadow-lg">
      <div className="flex">
        <div className="flex-shrink-0 mt-0.5">
          <AlertCircle className="h-5 w-5 text-red-300" />
        </div>
        <div className="ml-3 flex-1">
          <div className="flex flex-col">
            <h3 className="text-sm font-medium text-red-200">
              {hasLangflowError ? 'Image Processing Error' : 'Error'}
            </h3>
            <p className="text-sm text-red-100 mt-1">
              {hasLangflowError 
                ? 'There was an error processing your image with the AI model. Please use a different image and start processing again.' 
                : userMessage}
            </p>
            
            {technicalDetails && (
              <div className="mt-2">
                <button 
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center text-xs text-red-200 hover:text-red-100 transition-colors"
                >
                  {showDetails ? (
                    <>
                      <ChevronUp size={14} className="mr-1" />
                      Hide technical details
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} className="mr-1" />
                      Show technical details
                    </>
                  )}
                </button>
                
                {showDetails && (
                  <div className="mt-2 p-2 bg-red-950 bg-opacity-50 rounded text-xs font-mono text-red-100 overflow-x-auto">
                    {technicalDetails}
                  </div>
                )}
              </div>
            )}
            
            <p className="text-xs text-red-200 mt-3">
              Please try again or contact support if the issue persists.
            </p>
          </div>
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