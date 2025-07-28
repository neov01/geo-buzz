import React, { useState, useRef } from 'react';
import { Camera, Upload, X, ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  onPhotoRemoved?: () => void;
  currentPhoto?: string;
  className?: string;
}

export const PhotoUpload: React.FC<PhotoUploadProps> = ({
  onPhotoUploaded,
  onPhotoRemoved,
  currentPhoto,
  className = ""
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    setUploading(true);
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('place-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('place-images')
        .getPublicUrl(filePath);

      onPhotoUploaded(data.publicUrl);
      setPreview(data.publicUrl);
      
      toast({
        title: "Photo uploadée !",
        description: "Votre photo a été ajoutée avec succès",
      });
    } catch (error: any) {
      console.error('Erreur upload:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'uploader la photo",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Préférer la caméra arrière
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Erreur caméra:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder à la caméra",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    if (video && canvas) {
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `photo-${Date.now()}.jpg`, {
              type: 'image/jpeg'
            });
            uploadFile(file);
            stopCamera();
          }
        }, 'image/jpeg', 0.8);
      }
    }
  };

  const removePhoto = () => {
    setPreview(null);
    onPhotoRemoved?.();
  };

  return (
    <div className={className}>
      {showCamera ? (
        <Card className="p-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg bg-black"
            />
            <canvas ref={canvasRef} className="hidden" />
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
              <Button
                onClick={capturePhoto}
                disabled={uploading}
                className="bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-full w-16 h-16"
              >
                <Camera className="w-6 h-6" />
              </Button>
              <Button
                onClick={stopCamera}
                variant="outline"
                className="bg-white hover:bg-gray-100 text-gray-900 border-2 border-gray-300 rounded-full w-12 h-12"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ) : preview ? (
        <Card className="p-4">
          <div className="relative">
            <img
              src={preview}
              alt="Photo sélectionnée"
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              onClick={removePhoto}
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors">
          <div className="p-8 text-center space-y-4">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground/50" />
            <div>
              <h3 className="font-medium text-muted-foreground mb-2">
                Ajouter une photo
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Prenez une photo ou sélectionnez depuis votre galerie
              </p>
            </div>
            
            <div className="flex gap-3 justify-center">
              <Button
                onClick={startCamera}
                disabled={uploading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Prendre une photo
              </Button>
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Upload className="w-4 h-4" />
                Galerie
              </Button>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </Card>
      )}
      
      {uploading && (
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">Upload en cours...</p>
        </div>
      )}
    </div>
  );
};