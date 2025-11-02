import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateMealPlan } from '../utils/mealPlanAPI';
import { ChefHat, ArrowLeft, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import VerticalBranding from '../components/VerticalBranding';

export default function MealPlannerScreen() {
  const navigate = useNavigate();
  const {
    userProfile,
    currentMood,
    availableIngredients,
    setAvailableIngredients,
    preferredCuisine,
    setPreferredCuisine,
    setCurrentMeal,
    addMealToHistory,
    addBadge,
  } = useAppContext();

  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [missingIngredients, setMissingIngredients] = useState<string[]>([]);

  const cuisineOptions = [
    'Any',
    'American',
    'Chinese',
    'Indian',
    'Italian',
    'Japanese',
    'Mediterranean',
    'Mexican',
    'Thai',
  ];

  const handleGenerate = async () => {
    if (!availableIngredients.trim()) {
      alert('Please enter available ingredients');
      return;
    }

    setIsGenerating(true);
    setError('');
    setMissingIngredients([]);

    const result = await generateMealPlan(
      availableIngredients,
      userProfile,
      currentMood,
      preferredCuisine
    );

    setIsGenerating(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.missingIngredients && result.missingIngredients.length > 0) {
      setMissingIngredients(result.missingIngredients);
      return;
    }

    if (result.meal) {
      setCurrentMeal(result.meal);
      addMealToHistory(result.meal);

      addBadge({
        name: 'Healthy Meal Logged',
        description: 'You generated a healthy meal plan!',
        xpPoints: 10,
      });

      navigate('/recipe');
    }
  };

  const maxCaloriesPerMeal = userProfile.dailyCalorieLimit
    ? Math.floor(userProfile.dailyCalorieLimit / 3)
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50 p-6 relative">
      <VerticalBranding />
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/mood')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-2">
            <ChefHat className="w-10 h-10 text-orange-500" />
            <h1 className="text-4xl font-bold text-gray-800">Smart Meal Planner</h1>
          </div>
          <p className="text-gray-600 mb-6">
            Enter ingredients you have, and FitPulse will recommend an easy and healthy meal that
            fits your goals and mood.
          </p>

          {maxCaloriesPerMeal && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl">
              <p className="text-sm text-gray-600">
                Your mood: <span className="font-bold">{currentMood}</span>
              </p>
              <p className="text-sm text-gray-600">
                Max calories per meal:{' '}
                <span className="font-bold">{maxCaloriesPerMeal} kcal</span>
              </p>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Cuisine Type
              </label>
              <div className="grid grid-cols-3 gap-2">
                {cuisineOptions.map((cuisine) => (
                  <button
                    key={cuisine}
                    onClick={() => setPreferredCuisine(cuisine)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      preferredCuisine === cuisine
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300'
                    }`}
                  >
                    {cuisine}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Ingredients
              </label>
              <textarea
                value={availableIngredients}
                onChange={(e) => setAvailableIngredients(e.target.value)}
                placeholder="e.g., chicken, rice, tomatoes, spinach, garlic..."
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-orange-400 focus:outline-none"
              />
            </div>

            {missingIngredients.length > 0 && (
              <div className="p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <p className="font-semibold text-yellow-800">Additional ingredients needed:</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {missingIngredients.join(', ')}
                    </p>
                    <p className="text-xs text-yellow-600 mt-2">
                      Add these ingredients to create a complete meal, or try different ingredients.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !availableIngredients.trim()}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                isGenerating || !availableIngredients.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:from-orange-600 hover:to-yellow-600 shadow-lg'
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Your Perfect Meal...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5" />
                  Generate Meal Plan
                </>
              )}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-gray-100">
            <button
              onClick={() => navigate('/summary')}
              className="w-full py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
            >
              Skip to Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
