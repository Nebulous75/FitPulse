import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Flame, CheckCircle } from 'lucide-react';

export default function ScannerScreen() {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const mockMeals = [
    { name: 'Grilled Chicken Salad', calories: 350, protein: 35, carbs: 20, fat: 12 },
    { name: 'Pasta Carbonara', calories: 520, protein: 18, carbs: 65, fat: 22 },
    { name: 'Veggie Burger', calories: 420, protein: 22, carbs: 48, fat: 16 },
    { name: 'Salmon with Rice', calories: 480, protein: 38, carbs: 42, fat: 18 },
    { name: 'Greek Yogurt Bowl', calories: 280, protein: 20, carbs: 32, fat: 8 },
  ];

  const handleScan = () => {
    setIsScanning(true);
    setScanResult(null);

    setTimeout(() => {
      const randomMeal = mockMeals[Math.floor(Math.random() * mockMeals.length)];
      setScanResult(randomMeal);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate('/summary')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Summary</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Camera className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">AI Calorie Scanner</h1>
            <p className="text-gray-600">Scan your meal to get instant calorie information</p>
          </div>

          <div className="mb-8">
            <div className="relative aspect-video bg-gray-100 rounded-2xl flex items-center justify-center overflow-hidden">
              {isScanning ? (
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Scanning your meal...</p>
                </div>
              ) : scanResult ? (
                <div className="text-center p-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <p className="text-2xl font-bold text-gray-800 mb-2">{scanResult.name}</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 rounded-lg">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <span className="font-bold text-orange-700">{scanResult.calories} kcal</span>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Camera className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Camera preview would appear here</p>
                </div>
              )}
            </div>
          </div>

          {scanResult && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Nutritional Breakdown</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{scanResult.protein}g</p>
                  <p className="text-sm text-gray-600">Protein</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-yellow-600">{scanResult.carbs}g</p>
                  <p className="text-sm text-gray-600">Carbs</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <p className="text-2xl font-bold text-orange-600">{scanResult.fat}g</p>
                  <p className="text-sm text-gray-600">Fat</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleScan}
            disabled={isScanning}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
              isScanning
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600 shadow-lg'
            }`}
          >
            <Camera className="w-5 h-5" />
            {scanResult ? 'Scan Another Meal' : 'Start Scanning'}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            * This is a mock scanner for demonstration purposes
          </p>
        </div>
      </div>
    </div>
  );
}
