import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Smile, Frown, Zap, Coffee, ArrowLeft } from 'lucide-react';
import VerticalBranding from '../components/VerticalBranding';

export default function MoodScreen() {
  const navigate = useNavigate();
  const { currentMood, setCurrentMood, userProfile } = useAppContext();

  const moods = [
    { name: 'Happy', icon: Smile, color: 'yellow', gradient: 'from-yellow-400 to-yellow-500' },
    { name: 'Tired', icon: Coffee, color: 'gray', gradient: 'from-gray-400 to-gray-500' },
    { name: 'Stressed', icon: Frown, color: 'red', gradient: 'from-red-400 to-red-500' },
    { name: 'Energetic', icon: Zap, color: 'green', gradient: 'from-green-400 to-green-500' },
  ];

  const handleMoodSelect = (mood: string) => {
    setCurrentMood(mood);
  };

  const handleNext = () => {
    if (!currentMood) {
      alert('Please select your mood');
      return;
    }
    navigate('/meal-planner');
  };

  const { bmi, dailyCalorieLimit } = userProfile;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 p-6 relative">
      <VerticalBranding />
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 text-center">
            How are you feeling today?
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Your mood helps us suggest the perfect meal for you
          </p>

          {bmi && dailyCalorieLimit && (
            <div className="grid grid-cols-2 gap-4 mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <div className="text-center">
                <p className="text-sm text-gray-600">Your BMI</p>
                <p className="text-2xl font-bold text-gray-800">{bmi}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Daily Calories</p>
                <p className="text-2xl font-bold text-gray-800">{dailyCalorieLimit} kcal</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-6 mb-8">
            {moods.map((mood) => {
              const Icon = mood.icon;
              return (
                <button
                  key={mood.name}
                  onClick={() => handleMoodSelect(mood.name)}
                  className={`p-8 rounded-2xl border-4 transition-all transform hover:scale-105 ${
                    currentMood === mood.name
                      ? `border-${mood.color}-500 bg-${mood.color}-50`
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`w-16 h-16 mx-auto mb-3 text-${mood.color}-500`} />
                  <p className="text-xl font-semibold text-gray-800">{mood.name}</p>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={!currentMood}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              currentMood
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next: Plan Your Meal
          </button>
        </div>
      </div>
    </div>
  );
}
