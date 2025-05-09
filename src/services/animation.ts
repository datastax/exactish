import GIF from 'gif.js';
import { IterationImage } from '../types';

export const createGif = async (images: IterationImage[]): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const gifWidth = 512;
    const gifHeight = 512;

    const gif = new GIF({
      workers: 2,
      quality: 10,
      width: gifWidth,
      height: gifHeight,
      workerScript: '/gif.worker.js' // Ensure correct path to worker script
    });

    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolveLoad) => { // Renamed resolve to avoid conflict
        const img = new Image();
        img.onload = () => resolveLoad(img);
        img.onerror = (err) => reject(err); // Add error handling for image loading
        img.src = src;
      });
    };

    const processImages = async () => {
      // Create a canvas to draw images on, matching GIF dimensions
      const canvas = document.createElement('canvas');
      canvas.width = gifWidth; // Use the defined width
      canvas.height = gifHeight; // Use the defined height
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      for (const image of images) {
        try {
          const img = await loadImage(image.imageData);
          // Clear the canvas for each new frame
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          // Draw the image onto the canvas, scaling it to fit
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          // Add the canvas to the GIF frame
          // Using { copy: true } is recommended for canvas frames
          gif.addFrame(canvas, { delay: 1000, copy: true });
        } catch (error) {
          // Propagate image loading errors
          return reject(error);
        }
      }

      gif.on('finished', (blob: Blob) => {
        resolve(blob);
      });

      gif.render();
    };

    processImages().catch(reject); // Ensure promise rejections are handled
  });
};

export const createVideo = async (images: IterationImage[]): Promise<Blob> => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  canvas.width = 512;
  canvas.height = 512;

  const loadedImages = await Promise.all(
    images.map(img => new Promise<HTMLImageElement>((resolve) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.src = img.imageData;
    }))
  );

  const stream = canvas.captureStream(30);
  const mediaRecorder = new MediaRecorder(stream, {
    mimeType: 'video/webm',
    videoBitsPerSecond: 5000000
  });

  const chunks: Blob[] = [];
  return new Promise((resolve) => {
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));

    mediaRecorder.start();

    let currentFrame = 0;
    const animate = () => {
      if (currentFrame >= loadedImages.length) {
        mediaRecorder.stop();
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(loadedImages[currentFrame], 0, 0, canvas.width, canvas.height);
      currentFrame++;

      setTimeout(animate, 1000);
    };

    animate();
  });
};