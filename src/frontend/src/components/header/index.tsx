import { Sparkles } from 'lucide-react';

export const Header = () => {
  return (
    <div className="border-b border-gray-800 bg-black backdrop-blur supports-[backdrop-filter]:bg-black/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-cyan-400/5"></div>
      <div className="flex h-16 items-center px-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
              <Sparkles className="w-5 h-5 text-black" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full border-2 border-black animate-pulse"></div>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide">Chat Assistant</h1>
            <p className="text-xs text-gray-400">Powered by AI</p>
          </div>
        </div>
      </div>
    </div>
  );
};
