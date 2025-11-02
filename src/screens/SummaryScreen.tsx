import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { Target, Activity, Smile, ChefHat, Award, Camera, User, Lightbulb, Heart, Sparkles, Dumbbell, ArrowLeft } from 'lucide-react';
import { useState } from 'react';

const motivationalTips = [
  'Stay consistent, progress takes time 💪',
  'Every healthy meal is a win 🎯',
  'Small changes lead to big results 🌟',
  'You\'re stronger than you think 🔥',
  'Believe in yourself and keep going 🚀',
  'Your health is your wealth 💎',
  'One day at a time, one meal at a time ⏰',
];

export default function SummaryScreen() {
  const navigate = useNavigate();
  const { userProfile, currentMood, currentMeal, mealHistory, totalXP, badges } = useAppContext();
  const [tip, setTip] = useState('');

  const getNewTip = () => {
    const randomTip = motivationalTips[Math.floor(Math.random() * motivationalTips.length)];
    setTip(randomTip);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your FitPulse Summary</h1>
          <p className="text-gray-600">Track your progress and stay motivated</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">Your Goals</h2>
            </div>
            <div className="space-y-2">
              {userProfile.goals.map((goal, index) => (
                <div key={index} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg">
                  {goal}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-bold text-gray-800">Lifestyle & Stats</h2>
            </div>
            <div className="space-y-2 text-gray-700">
              <p><span className="font-semibold">Lifestyle:</span> {userProfile.lifestyle}</p>
              <p><span className="font-semibold">BMI:</span> {userProfile.bmi}</p>
              <p><span className="font-semibold">Daily Calories:</span> {userProfile.dailyCalorieLimit} kcal</p>
              <p><span className="font-semibold">Region:</span> {userProfile.region}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Smile className="w-6 h-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-gray-800">Current Mood</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">{currentMood || 'Not set'}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-6 h-6 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-800">Meals Logged</h2>
            </div>
            <p className="text-2xl font-bold text-gray-800">{mealHistory.length}</p>
          </div>
        </div>

        {currentMeal && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-6 h-6 text-green-500" />
              <h2 className="text-xl font-bold text-gray-800">Latest Meal</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4">
              <p className="text-xl font-bold text-gray-800 mb-1">{currentMeal.name}</p>
              <p className="text-gray-600">Calories: {currentMeal.calories} kcal</p>
              <p className="text-gray-600">Perfect for: {currentMeal.mood} mood</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-bold text-gray-800">Motivation</h2>
          </div>
          {tip && (
            <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-lg text-gray-800">{tip}</p>
            </div>
          )}
          <button
            onClick={getNewTip}
            className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg font-semibold hover:from-yellow-500 hover:to-orange-500 transition-all"
          >
            Get New Tip
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-bold text-gray-800">Your Progress</h2>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{totalXP}</p>
              <p className="text-sm text-gray-600">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{badges.length}</p>
              <p className="text-sm text-gray-600">Badges Earned</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/badges')}
            className="w-full py-3 bg-purple-100 text-purple-700 rounded-lg font-semibold hover:bg-purple-200 transition-all"
          >
            View All Badges
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Features</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/heart-rate')}
              className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-red-200"
            >
              <Heart className="w-8 h-8 text-red-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Heart Rate Monitor</span>
            </button>

            <button
              onClick={() => navigate('/workout')}
              className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-blue-200"
            >
              <Dumbbell className="w-8 h-8 text-blue-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Personalised Workout Plan</span>
            </button>

            <button
              onClick={() => navigate('/body-scan')}
              className="flex flex-col items-center gap-2 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg hover:shadow-xl transition-all border-2 border-purple-200"
            >
              <Sparkles className="w-8 h-8 text-purple-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Body Scan AI</span>
            </button>

            <button
              onClick={() => navigate('/meal-plan-chat')}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <ChefHat className="w-8 h-8 text-orange-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Meal Chat</span>
            </button>

            <button
              onClick={() => navigate('/scanner')}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Camera className="w-8 h-8 text-green-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Scan Meal</span>
            </button>

            <button
              onClick={() => navigate('/profile-update')}
              className="flex flex-col items-center gap-2 p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <User className="w-8 h-8 text-purple-500" />
              <span className="font-semibold text-gray-800 text-sm text-center">Update Profile</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
