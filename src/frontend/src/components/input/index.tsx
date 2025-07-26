import React, { useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUploadDialog } from './image';

interface InputComponentProps {
  onSendMessage: (message: string) => void;
  onSendImageMessage: (file: File, message: string) => void; 
  disabled: boolean;
  showWelcome: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
}

export const InputComponent = ({ 
  onSendMessage, 
  onSendImageMessage,
  disabled, 
  showWelcome, 
  inputValue, 
  setInputValue 
}: InputComponentProps ) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  };

  const handleNewChat = () => {
    if (window.confirm('Start a new chat? This will clear the current conversation.')) {
      window.location.reload();
    }
  };

  if (showWelcome) {
    return null;
  }

  return (
    <div className="border-t border-gray-800 bg-gray-950 backdrop-blur supports-[backdrop-filter]:bg-gray-950/90 relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
      <div className="max-w-4xl mx-auto p-4">
        <div className="relative">
          <div className="relative bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:border-gray-600 transition-all duration-300 focus-within:border-cyan-500 focus-within:shadow-cyan-500/20 focus-within:shadow-lg">
            <Textarea
              ref={textareaRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className="min-h-[48px] max-h-32 resize-none border-0 text-white bg-transparent focus:outline-none pl-12 pr-24 py-3 placeholder:text-gray-500"
              rows={1}
              disabled={disabled}
            />
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <ImageUploadDialog 
                onImageSelect={onSendImageMessage}
                disabled={disabled}
              />
            </div>
            <Button
              onClick={(e) => handleSubmit(e)}
              size="icon"
              disabled={!inputValue.trim() || disabled}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-8 w-8 border-0 text-black bg-gradient-to-br from-cyan-400 to-cyan-600 hover:from-cyan-500 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:text-gray-400 disabled:opacity-50 shrink-0 transition-all shadow-lg shadow-cyan-500/25"
            >
              {disabled ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <p className="text-xs text-gray-500 text-center mt-2">
          Press Enter to send, Shift+Enter for new line • Click + to add images
        </p>
      </div>
    </div>
  );
};
