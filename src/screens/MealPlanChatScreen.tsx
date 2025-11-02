import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { sendToMealPlanChat } from '../utils/mealPlanAPI';
import { ArrowLeft, Send, ChefHat } from 'lucide-react';

export default function MealPlanChatScreen() {
  const navigate = useNavigate();
  const { userProfile, mealPlanMessages, addMealPlanMessage } = useAppContext();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mealPlanMessages.length === 0) {
      addMealPlanMessage(
        'ai',
        'Hello! I\'m your meal planning assistant. Ask me anything about nutrition, meal prep, or dietary advice!'
      );
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mealPlanMessages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    addMealPlanMessage('user', input);
    setInput('');
    setIsTyping(true);

    const response = await sendToMealPlanChat(input, userProfile);
    addMealPlanMessage('ai', response);
    setIsTyping(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6">
      <div className="max-w-4xl mx-auto h-[90vh] flex flex-col">
        <button
          onClick={() => navigate('/summary')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Summary</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl flex-1 flex flex-col">
          <div className="p-6 border-b">
            <div className="flex items-center gap-3">
              <ChefHat className="w-8 h-8 text-orange-500" />
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Meal Planning Assistant</h2>
                <p className="text-sm text-gray-600">Get personalized nutrition advice</p>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {mealPlanMessages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white rounded-br-sm'
                      : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-4 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about meal plans, nutrition..."
                className="flex-1 px-4 py-3 rounded-full border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className={`px-6 py-3 rounded-full font-semibold transition-all ${
                  input.trim() && !isTyping
                    ? 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
