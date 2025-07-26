import { useState, useRef } from 'react';
import { Plus, Image, Upload, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface ImageUploadDialogProps {
  onImageSelect: (file: File, message: string) => void; // Changed: now expects File instead of string
  disabled: boolean;
}

export const ImageUploadDialog = ({ onImageSelect, disabled }: ImageUploadDialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Added: store the actual File
  const [message, setMessage] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Store the File object
      setSelectedFile(file);
      
      // Create preview URL for display
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setSelectedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (selectedFile && message.trim()) { // Changed: check selectedFile instead of selectedImage
      onImageSelect(selectedFile, message.trim()); // Changed: pass File object instead of base64 string
      setOpen(false);
      setSelectedImage(null);
      setSelectedFile(null); // Added: clear the File
      setMessage('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
    setSelectedFile(null); // Added: clear the File
    setMessage('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          disabled={disabled}
          className="h-8 w-8 border border-gray-600 text-gray-400 rounded-full bg-transparent hover:bg-gray-800 hover:border-gray-500 hover:text-gray-300 shrink-0 transition-all"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Image className="w-5 h-5" />
            Upload Image
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {!selectedImage ? (
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${dragActive
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : 'border-gray-600 hover:border-gray-500'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-400 mb-2">
                Drag and drop an image here, or click to select
              </p>
              <Input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Choose File
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative">
                <img
                  src={selectedImage}
                  alt="Selected"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  size="icon"
                  variant="outline"
                  className="absolute top-2 right-2 h-8 w-8 bg-gray-900/80 border-gray-600 hover:bg-gray-800"
                  onClick={() => {
                    setSelectedImage(null);
                    setSelectedFile(null); // Added: clear the File too
                  }}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>

              <Textarea
                placeholder="Add a message about this image..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-cyan-500"
                rows={3}
              />

              <div className="flex gap-2 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!message.trim()}
                  className="bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 text-black"
                >
                  Send Image
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
