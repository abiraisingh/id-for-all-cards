import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera, RefreshCw, Check, X } from "lucide-react";
import { toast } from "sonner";

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  currentImage?: string;
}

const CameraCapture = ({ onCapture, currentImage }: CameraCaptureProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        }
      });
      
      setStream(mediaStream);
      setIsOpen(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error("Unable to access camera. Please check permissions.");
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsOpen(false);
    setCapturedImage(null);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    setCapturedImage(imageData);
  }, []);

  const confirmCapture = useCallback(() => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      toast.success("Photo captured successfully!");
    }
  }, [capturedImage, onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
  }, []);

  if (!isOpen) {
    return (
      <div className="space-y-2">
        <Button 
          type="button"
          variant="outline" 
          onClick={startCamera}
          className="w-full"
        >
          <Camera className="w-4 h-4 mr-2" />
          {currentImage ? 'Retake Photo' : 'Capture Photo'}
        </Button>
        {currentImage && (
          <div className="mt-2">
            <img 
              src={currentImage} 
              alt="Current photo" 
              className="w-20 h-20 rounded-lg object-cover border"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-background p-6 rounded-lg max-w-2xl w-full mx-4">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">Capture Photo</h3>
          <p className="text-sm text-muted-foreground">Position yourself in the frame and click capture</p>
        </div>

        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-64 object-cover"
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-64 object-cover"
            />
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="flex gap-3 justify-center">
          {!capturedImage ? (
            <>
              <Button onClick={capturePhoto} size="lg">
                <Camera className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button variant="outline" onClick={stopCamera} size="lg">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={confirmCapture} size="lg">
                <Check className="w-4 h-4 mr-2" />
                Use Photo
              </Button>
              <Button variant="outline" onClick={retakePhoto} size="lg">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button variant="outline" onClick={stopCamera} size="lg">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;