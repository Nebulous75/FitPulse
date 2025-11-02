import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Flame, Youtube, ChefHat, Replace } from 'lucide-react';
import { useState } from 'react';
import VerticalBranding from '../components/VerticalBranding';

export default function RecipeScreen() {
  const navigate = useNavigate();
  const { currentMeal } = useAppContext();
  const [showSubstitutes, setShowSubstitutes] = useState(false);

  if (!currentMeal) {
    navigate('/meal-planner');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6 relative">
      <VerticalBranding />
      <div className="max-w-4xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/meal-planner')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Meal Planner</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">{currentMeal.name}</h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Flame className="w-5 h-5" />
                  <span className="font-semibold">{currentMeal.calories} kcal</span>
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                  {currentMeal.cuisine}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {currentMeal.mood}
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-green-500" />
              Ingredients
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {currentMeal.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium text-gray-800">{ingredient.name}</span>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{ingredient.amount}</p>
                    <p className="text-xs text-orange-600">{ingredient.calories} kcal</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowSubstitutes(!showSubstitutes)}
              className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Replace className="w-4 h-4" />
              <span className="text-sm">Show Ingredient Substitutes</span>
            </button>

            {showSubstitutes && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Common Substitutes:</p>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Chicken → Turkey, Tofu, Chickpeas</li>
                  <li>• Rice → Quinoa, Cauliflower Rice, Couscous</li>
                  <li>• Milk → Almond Milk, Oat Milk, Soy Milk</li>
                  <li>• Butter → Olive Oil, Coconut Oil, Avocado</li>
                </ul>
              </div>
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Instructions</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {currentMeal.recipe}
              </p>
            </div>
          </div>

          {currentMeal.videoUrl && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Youtube className="w-6 h-6 text-red-500" />
                Video Tutorial
              </h2>
              <a
                href={currentMeal.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all inline-flex"
              >
                <Youtube className="w-5 h-5" />
                Watch on YouTube
              </a>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => navigate('/meal-planner')}
              className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Generate Another Meal
            </button>
            <button
              onClick={() => navigate('/summary')}
              className="flex-1 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
            >
              View Summary
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
