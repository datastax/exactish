import React, { useRef } from 'react';
import { Download, ArrowLeft, ArrowRight, Image as ImageIcon, Film, Gift as Gif } from 'lucide-react';
import { IterationImage } from '../types';
import { createGif, createVideo } from '../services/animation';

interface ResultGalleryProps {
  images: IterationImage[];
  selectedImageIndex: number;
  onSelectImage: (index: number) => void;
}

const ResultGallery: React.FC<ResultGalleryProps> = ({
  images,
  selectedImageIndex,
  onSelectImage
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleDownload = (imageData: string) => {
    const link = document.createElement('a');
    link.href = imageData;
    link.download = `iteration-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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

  const handleDownloadVideo = async () => {
    try {
      const blob = await createVideo(images);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iterations-${Date.now()}.webm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error creating video:', error);
    }
  };

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
      <div className="w-full h-60 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-center text-gray-500">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm">No iterations yet</p>
        </div>
      </div>
    );
  }

  const selectedImage = images[selectedImageIndex];

  return (
    <div className="w-full space-y-4">
      <div className="relative">
        <div className="w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center min-h-[300px]">
          <img 
            src={selectedImage.imageData} 
            alt={`Iteration ${selectedImage.id}`}
            className="max-w-full max-h-[400px] object-contain"
          />
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={() => handleDownload(selectedImage.imageData)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
              title="Download current image"
            >
              <Download size={20} className="text-gray-700" />
            </button>
            
            {images.length > 1 && (
              <>
                <button
                  onClick={handleDownloadGif}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
                  title="Download as GIF"
                >
                  <Gif size={20} className="text-gray-700" />
                </button>
                
                <button
                  onClick={handleDownloadVideo}
                  className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
                  title="Download as Video"
                >
                  <Film size={20} className="text-gray-700" />
                </button>
              </>
            )}
          </div>
        </div>
        
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 flex space-x-2">
          {selectedImageIndex > 0 && (
            <button
              onClick={() => onSelectImage(selectedImageIndex - 1)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
            >
              <ArrowLeft size={20} className="text-gray-700" />
            </button>
          )}
        </div>
        
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          {selectedImageIndex < images.length - 1 && (
            <button
              onClick={() => onSelectImage(selectedImageIndex + 1)}
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
          <button
            onClick={() => scrollToImage('left')}
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={16} className="text-gray-700" />
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
              className={`flex-shrink-0 cursor-pointer rounded-md overflow-hidden transition-all
                ${selectedImageIndex === index 
                  ? 'ring-2 ring-purple-500 ring-offset-2' 
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
            className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all"
          >
            <ArrowRight size={16} className="text-gray-700" />
          </button>
        </div>
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>Iteration {selectedImage.id} of {images.length}</p>
      </div>
    </div>
  );
};

export default ResultGallery;