import { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { sendToMentalHealthAI } from '../utils/mentalHealthAPI';
import { MessageCircle, X, Maximize2, Minimize2, Send, Heart } from 'lucide-react';

export default function FloatingMentalHealthChat() {
  const { currentMood, mentalHealthMessages, addMentalHealthMessage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mentalHealthMessages.length === 0 && isOpen) {
      const moodText = currentMood || 'neutral';
      addMentalHealthMessage(
        'ai',
        `Hey there! 👋 I'm your wellness buddy. How can I support you today?`
      );
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mentalHealthMessages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    addMentalHealthMessage('user', input);
    setInput('');
    setIsTyping(true);

    const response = await sendToMentalHealthAI(input, currentMood || 'neutral');
    addMentalHealthMessage('ai', response);
    setIsTyping(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-2xl hover:shadow-pink-300 hover:scale-110 transition-all flex items-center justify-center z-50"
        aria-label="Open mental health chat"
      >
        <MessageCircle className="w-8 h-8" />
      </button>
    );
  }

  return (
    <div
      className={`fixed ${
        isMaximized
          ? 'inset-4'
          : 'bottom-6 right-6 w-96 h-[600px]'
      } bg-white rounded-2xl shadow-2xl flex flex-col z-50 transition-all`}
    >
      <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-t-2xl">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5" />
          <h3 className="font-semibold">Wellness Support</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMaximized ? 'Minimize' : 'Maximize'}
          >
            {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {mentalHealthMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl ${
                message.sender === 'user'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-br-sm'
                  : 'bg-gray-100 text-gray-800 rounded-bl-sm'
              }`}
            >
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Share what's on your mind..."
            className="flex-1 px-4 py-2 rounded-full border-2 border-gray-200 focus:border-pink-400 focus:outline-none text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={`p-2 rounded-full transition-all ${
              input.trim() && !isTyping
                ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
