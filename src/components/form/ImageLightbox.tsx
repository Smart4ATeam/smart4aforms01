import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ZoomIn } from 'lucide-react';

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageLightbox: React.FC<ImageLightboxProps> = ({ src, alt, className }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className={`form-example-image group cursor-pointer ${className || ''}`}>
          <div className="relative">
            <img src={src} alt={alt} />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="max-w-3xl p-2 bg-background/95 backdrop-blur-md">
        <img src={src} alt={alt} className="w-full h-auto rounded-md" />
      </DialogContent>
    </Dialog>
  );
};

export default ImageLightbox;
