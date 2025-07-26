import { useRef, useEffect } from 'react';
import { Bot, Loader2 } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { WelcomeScreen } from '../welcome';
import { MessageComponent } from './message';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string; // base64 or URL
}

interface ChatProps {
  messages: Message[];
  isLoading: boolean;
  showWelcome: boolean;
  onInputFocus: () => void;
}

export const Chat  = ({ messages, isLoading, showWelcome, onInputFocus }: ChatProps) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showWelcome) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, showWelcome]);

  if (showWelcome) {
    return (
      <div className="flex-1 px-4">
        <WelcomeScreen onInputFocus={onInputFocus} />
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
      <div className="max-w-4xl mx-auto py-6">
        <div className="space-y-2">
          {messages.map((message) => (
            <MessageComponent key={message.id} message={message} isUser={message.isUser} />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-500/25">
                  <Bot className="w-4 h-4 text-black" />
                </div>
                <div className="bg-gray-900 border border-gray-700 px-4 py-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-sm text-gray-300">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};
