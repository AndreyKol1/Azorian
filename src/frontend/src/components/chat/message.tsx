import { useState, useEffect } from 'react';
import { Bot, User } from 'lucide-react';
import { Card } from "@/components/ui/card";
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string; 
}

interface MessageProps {
  message: Message;
  isUser: boolean;
}

export const MessageComponent = ({ message, isUser } : MessageProps) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    if (!isUser && message.content) {
      setIsTyping(true);
      setDisplayedText('');
      
      let i = 0;
      const typingInterval = setInterval(() => {
        if (i < message.content.length) {
          setDisplayedText(message.content.slice(0, i + 1));
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, (Math.floor(Math.random() * (10 - 2 + 1)) + 2));

      return () => clearInterval(typingInterval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, isUser]);

  if (isUser) {
    return (
      <div className="flex justify-end mb-6 animate-in slide-in-from-right-2 duration-300">
        <div className="flex items-end space-x-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <Card className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-black px-4 py-3 shadow-lg border-0 relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="relative z-10">
              {message.image && (
                <div className="mb-3">
                  <img 
                    src={message.image} 
                    alt="Uploaded" 
                    className="max-w-full h-auto rounded-lg shadow-md max-h-48 object-cover"
                  />
                </div>
              )}
              <p className="text-sm leading-relaxed font-medium">{displayedText}</p>
            </div>
          </Card>
          <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
            <User className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6 animate-in slide-in-from-left-2 duration-300">
      <div className="flex items-start space-x-3 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg shadow-cyan-500/25">
          <Bot className="w-4 h-4 text-black" />
        </div>
        <div className="bg-gray-900 border border-gray-700 px-4 py-3 rounded-lg shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent"></div>
          <div className="text-sm leading-relaxed text-gray-100 relative z-10">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-cyan-400">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-cyan-400">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-1 text-cyan-400">{children}</h3>,
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-bold text-white">{children}</strong>,
                em: ({ children }) => <em className="italic text-gray-300">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-800 text-cyan-300 px-1 py-0.5 rounded text-xs font-mono">
                    {children}
                  </code>
                ),
                pre: ({ children }) => (
                  <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto my-2 border border-gray-600">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="text-gray-100">{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-cyan-500 pl-4 italic text-gray-300 my-2">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a 
                    href={href} 
                    className="text-cyan-400 hover:text-cyan-300 underline"
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {displayedText}
            </ReactMarkdown>
            {isTyping && <span className="inline-block w-2 h-4 bg-cyan-400 ml-1 animate-pulse"></span>}
          </div>
        </div>
      </div>
    </div>
  );
};
