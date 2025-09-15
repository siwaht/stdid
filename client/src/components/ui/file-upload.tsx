import { useCallback, useRef, useState } from 'react';
import { Button } from './button';
import { useToast } from '@/hooks/use-toast';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  children: React.ReactNode;
  className?: string;
}

export function FileUpload({ 
  onFileSelect, 
  accept = "image/*", 
  maxSize = 10 * 1024 * 1024, // 10MB
  children,
  className = ""
}: FileUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const validateFile = useCallback((file: File) => {
    if (maxSize && file.size > maxSize) {
      toast({
        title: "File too large",
        description: `File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`,
        variant: "destructive"
      });
      return false;
    }

    if (accept && !file.type.match(accept.replace(/\*/g, '.*'))) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file",
        variant: "destructive"
      });
      return false;
    }

    return true;
  }, [accept, maxSize, toast]);

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      onFileSelect(file);
      toast({
        title: "File uploaded",
        description: "Photo uploaded successfully!",
      });
    }
  }, [onFileSelect, validateFile, toast]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  return (
    <div
      className={`
        drag-drop-area p-8 text-center cursor-pointer
        ${isDragOver ? 'drag-over' : ''}
        ${className}
      `}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      data-testid="file-upload-area"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute opacity-0 pointer-events-none"
        data-testid="file-input"
      />
      {children}
    </div>
  );
}
