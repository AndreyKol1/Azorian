import { Sparkles } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface WelcomeScreenProps {
  onInputFocus: () => void;
}

export const WelcomeScreen = ({ onInputFocus } : WelcomeScreenProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 text-center animate-in fade-in duration-700">
      <div className="relative">
        <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-2xl flex items-center justify-center animate-pulse shadow-2xl shadow-cyan-500/20">
          <Sparkles className="w-12 h-12 text-black" />
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-cyan-400 rounded-full border-4 border-gray-900 animate-bounce delay-300 shadow-lg"></div>
      </div>
      
      <div className="space-y-3">
        <h2 className="text-3xl font-bold text-white">Welcome to Chat Assistant</h2>
        <p className="text-gray-400 max-w-md text-lg">
          Start a conversation and experience the power of AI assistance
        </p>
      </div>

      <div className="w-full max-w-2xl px-4">
        <div className="relative bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl hover:border-gray-600 transition-all duration-300 focus-within:border-cyan-500 focus-within:shadow-cyan-500/20 focus-within:shadow-lg">
          <Textarea
            onClick={onInputFocus}
            onFocus={onInputFocus}
            placeholder="Ask me anything..."
            className="min-h-[56px] max-h-32 resize-none border-0 text-white bg-transparent focus:outline-none px-6 py-4 text-lg placeholder:text-gray-500 placeholder:text-center"
            rows={1}
          />
        </div>
        <p className="text-xs text-gray-500 text-center mt-3">
          Click here to start your conversation
        </p>
      </div>
    </div>
  );
};
