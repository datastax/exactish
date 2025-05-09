import React, { useRef, useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageSelect, 
  previewUrl, 
  disabled 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only PNG, JPG, JPEG, GIF, BMP, or WEBP files');
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && validateFile(files[0])) {
      onImageSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && validateFile(files[0])) {
      onImageSelect(files[0]);
    }
  };

  const handleClearImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageSelect(null as unknown as File);
  };

  return (
    <div className="w-full">
      <div 
        className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 
          ${isDragging ? 'border-purple-500 bg-purple-50' : 'border-gray-300'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpg,image/jpeg,image/gif,image/bmp,image/webp"
          className="hidden"
          disabled={disabled}
        />
        
        {previewUrl ? (
          <div className="relative w-full">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full max-h-80 object-contain rounded-md shadow-sm mx-auto"
            />
            {!disabled && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
                className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                disabled={disabled}
              >
                <X size={20} className="text-gray-700" />
              </button>
            )}
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm font-medium text-gray-900">
              Drag and drop an image, or click to select
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PNG, JPG, JPEG, GIF, BMP, WEBP up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader