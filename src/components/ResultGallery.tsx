import React, { useRef } from 'react';
import { ArrowLeft, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { IterationImage } from '../types';
import { createGif } from '../services/animation';

interface ResultGalleryProps {
  images: IterationImage[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
  isProcessing?: boolean; // Added isProcessing prop
}

const ResultGallery: React.FC<ResultGalleryProps> = ({
  images,
  selectedImageIndex,
  onSelectImage,
  isProcessing = false // Default to false if not provided
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Image download function removed as requested

  const handleDownloadGif = async () => {
    try {
      const blob = await createGif(images);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iterations-${Date.now()}.gif`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating GIF:', error);
    }
  };

  // Video download function removed as requested

  const scrollToImage = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    
    const scrollAmount = 200;
    const currentScroll = scrollRef.current.scrollLeft;
    
    scrollRef.current.scrollTo({
      left: direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount,
      behavior: 'smooth'
    });
  };

  if (images.length === 0) {
    return (
      <div className="w-full h-60 flex items-center justify-center bg-white/5 rounded-xl border border-white/10">
        <div className="text-center text-white/60">
          <ImageIcon className="mx-auto h-12 w-12 text-white/40" />
          <p className="mt-2 text-sm">Generated images will appear here</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="w-full rounded-xl overflow-hidden bg-white/5 flex items-center justify-center min-h-[300px] border border-white/10">
          <img 
            src={selectedImage.imageData} 
            alt={`Iteration ${selectedImage.id}`}
            className="max-w-full max-h-[400px] object-contain"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {/* Commented out image download button
            <button
              onClick={() => handleDownload(selectedImage.imageData)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
              title="Download current image"
            >
              <Download size={20} className="text-gray-700" />
            </button>
            */}
            
            {/* Only show Download GIF button when there are multiple images AND processing is complete */}
            {images.length > 1 && !isProcessing && (
              <>
                <button
                  onClick={handleDownloadGif}
                  className="bg-gradient-to-r from-indigo-400 to-rose-400 text-white rounded-lg px-4 py-2 text-sm font-medium shadow-md hover:from-indigo-500 hover:to-rose-500 transition-all duration-200"
                >
                  Download GIF
                </button>
                
                {/* Commented out video download button
                <button
                  onClick={handleDownloadVideo}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
                  title="Download as Video"
                >
                  <Film size={20} className="text-gray-700" />
                </button>
                */}
              </>
            )}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex space-x-2">
          {selectedImageIndex > 0 && (
            <button
              onClick={() => onSelectImage(selectedImageIndex - 1)}
              className="bg-white/20 backdrop-filter backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white/30 transition-all"
            >
              <ArrowLeft size={20} className="text-white" />
            </button>
          )}
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          {selectedImageIndex < images.length - 1 && (
            <button
              onClick={() => onSelectImage(selectedImageIndex + 1)}
              className="bg-white/20 backdrop-filter backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white/30 transition-all"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={() => scrollToImage('left')}
              className="bg-white/10 hover:bg-white/20 transition-colors duration-150 rounded-full w-8 h-8 flex items-center justify-center text-white/60 shadow-md"
            >
            <ArrowLeft size={16} />
          </button>
        </div>
        
        <div 
          ref={scrollRef}
          className="flex space-x-2 overflow-x-auto py-2 px-8 scrollbar-hide"
        >
          {images.map((image, index) => (
            <div 
              key={image.id}
              onClick={() => onSelectImage(index)}
              className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all
                ${selectedImageIndex === index 
                  ? 'ring-2 ring-indigo-400 ring-offset-2 ring-offset-[#030303]' 
                  : 'opacity-70 hover:opacity-100'
                }
              `}
              style={{ width: '80px', height: '80px' }}
            >
              <img 
                src={image.imageData} 
                alt={`Iteration ${image.id}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
        
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
            <button
              onClick={() => scrollToImage('right')}
              className="bg-white/10 hover:bg-white/20 transition-colors duration-150 rounded-full w-8 h-8 flex items-center justify-center text-white/60 shadow-md"
            >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-white/60">
        <p>Iteration {selectedImage.id} of {images.length}</p>
      </div>
    </div>
  );
};

export default ResultGallery;