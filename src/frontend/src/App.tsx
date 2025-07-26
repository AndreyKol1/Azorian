import { useState } from 'react';
import { InputComponent } from './components/input';
import { Chat } from './components/chat';
import { Header } from './components/header'

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
  image?: string; 
}

const App = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');

  interface APIResponse {
    message: string;
  }

  const BACKEND_URL = 'http://localhost:8000'

  // API functions
  const sendTextMessage = async (message: string): Promise<string> => {
    try {
      const response = await fetch(`${BACKEND_URL}/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending text message:', error);
      throw new Error('Failed to send message');
    }
  };

  const sendImageMessage = async (imageFile: File, message: string): Promise<string> => {
    try {
      // Create FormData to send file + message
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('message', message);

      const response = await fetch(`${BACKEND_URL}/media`, {
        method: 'POST',
        body: formData, // Don't set Content-Type header - browser will set it automatically
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: APIResponse = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error sending image message:', error);
      throw new Error('Failed to send image message');
    }
  };

  const handleSendMessage = async (content: string): Promise<void> => {
    setShowWelcome(false);

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendTextMessage(content);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble responding right now. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendImageMessage = async (imageFile: File, message: string): Promise<void> => {
    setShowWelcome(false);

    const imageUrl = URL.createObjectURL(imageFile);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      isUser: true,
      timestamp: new Date(),
      image: imageUrl 
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const aiResponse = await sendImageMessage(imageFile, message);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I apologize, but I'm having trouble processing your image. Please try again later.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      URL.revokeObjectURL(imageUrl);
    }
  };

  const handleInputFocus = (): void => {
    setShowWelcome(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/3 via-transparent to-cyan-400/3 pointer-events-none"></div>
      <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-cyan-400/5 rounded-full blur-3xl pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <Header />
        <Chat 
          messages={messages} 
          isLoading={isLoading} 
          showWelcome={showWelcome}
          onInputFocus={handleInputFocus}
        />
        <InputComponent
          onSendMessage={handleSendMessage}
          onSendImageMessage={handleSendImageMessage}
          disabled={isLoading}
          showWelcome={showWelcome}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>
    </div>
  );
};

export default App;
