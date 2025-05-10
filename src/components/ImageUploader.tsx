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
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200 
          ${isDragging ? 'border-blue-400 bg-purple-900 bg-opacity-50' : 'border-purple-300 border-opacity-50 bg-purple-800 bg-opacity-20'} 
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-purple-900 hover:bg-opacity-30'}`}
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
              className="w-full max-h-80 object-contain rounded-xl shadow-lg mx-auto"
            />
            {!disabled && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearImage();
                }}
                className="absolute top-2 right-2 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm rounded-full p-1 shadow-lg hover:bg-opacity-100 transition-all duration-200"
                disabled={disabled}
              >
                <X size={20} className="text-purple-700" />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <Upload className="w-12 h-12 text-blue-300 mb-3" />
            <p className="text-blue-200 font-medium">
              Drag & Drop or Click to Upload
            </p>
            <p className="mt-1 text-blue-300 text-sm">
              Accepted formats: PNG, JPG, JPEG, GIF, BMP, WEBP up to 10MB
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader