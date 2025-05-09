export interface IterationImage {
  id: number;
  imageData: string; // base64 encoded image
  timestamp: number;
}

export interface AppState {
  originalImage: File | null;
  originalImagePreview: string | null;
  iterations: number;
  currentIteration: number;
  isProcessing: boolean;
  iterationImages: IterationImage[];
  error: string | null;
}