import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, TrendingDown, Calendar, Target, Award } from 'lucide-react';
import { getBMIDetails, calculateWeightLossTarget } from '../utils/healthCalculations';
import VerticalBranding from '../components/VerticalBranding';

export default function BMIResultsScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { bmi, weight, weightUnit, height, heightUnit } = location.state || {};

  if (!bmi) {
    navigate('/home');
    return null;
  }

  const bmiDetails = getBMIDetails(bmi);
  const weightLossTarget = calculateWeightLossTarget(weight, weightUnit, height, heightUnit, bmi);

  const getColorClass = (color: string) => {
    const colors: any = {
      blue: 'from-blue-500 to-cyan-500',
      green: 'from-green-500 to-emerald-500',
      yellow: 'from-yellow-500 to-orange-400',
      orange: 'from-orange-500 to-red-400',
      red: 'from-red-500 to-pink-500',
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  const getBgColorClass = (color: string) => {
    const colors: any = {
      blue: 'from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      green: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      yellow: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      orange: 'from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      red: 'from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
    };
    return colors[color] || 'from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 relative">
      <VerticalBranding />
      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={() => navigate('/home')}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white text-center mb-8">
            Your BMI Analysis
          </h1>

          <div className={`bg-gradient-to-br ${getBgColorClass(bmiDetails.color)} rounded-2xl p-8 mb-6`}>
            <div className="text-center mb-6">
              <div className={`inline-block bg-gradient-to-r ${getColorClass(bmiDetails.color)} text-white px-8 py-4 rounded-2xl mb-4`}>
                <p className="text-6xl font-bold">{bmi}</p>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{bmiDetails.category}</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300">BMI Range: {bmiDetails.range}</p>
            </div>

            <div className="grid grid-cols-5 gap-2 mb-4">
              <div className={`h-3 rounded-full ${bmi < 18.5 ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`h-3 rounded-full ${bmi >= 18.5 && bmi < 25 ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`h-3 rounded-full ${bmi >= 25 && bmi < 30 ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`h-3 rounded-full ${bmi >= 30 && bmi < 35 ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
              <div className={`h-3 rounded-full ${bmi >= 35 ? 'bg-red-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
            </div>

            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Underweight</span>
              <span>Optimum</span>
              <span>Overweight</span>
              <span>Obese</span>
            </div>
          </div>

          {weightLossTarget && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Weight Loss Goal</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center">
                    <TrendingDown className="w-8 h-8 text-red-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Weight to Lose</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                      {weightLossTarget.weightToLose}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{weightLossTarget.unit}</p>
                  </div>

                  <div className="bg-white dark:bg-gray-700 rounded-xl p-4 text-center">
                    <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Target Weight</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">
                      {weightLossTarget.targetWeight}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{weightLossTarget.unit}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Timeline</h3>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 text-center">
                  <p className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {weightLossTarget.weeks}
                  </p>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">weeks</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ({Math.floor(weightLossTarget.weeks / 4)} months)
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Safe weight loss: 0.5-1 kg (1-2 lbs) per week
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Recommendations</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span>Follow your personalized meal plan ({weight < weightLossTarget.targetWeight ? 'calorie deficit' : 'balanced nutrition'})</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span>Exercise 3-5 times per week (30-60 minutes)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span>Stay consistent and track your progress weekly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">✓</span>
                    <span>Use our AI workout planner for personalized routines</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {!weightLossTarget && bmi >= 18.5 && bmi < 25 && (
            <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-2xl p-6 text-center">
              <Award className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Perfect Range!</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Your BMI is in the optimum range. Focus on maintaining your current weight with a balanced diet and regular exercise.
              </p>
            </div>
          )}

          {!weightLossTarget && bmi < 18.5 && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Recommendations for Weight Gain</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Increase calorie intake with nutrient-dense foods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Focus on strength training exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">✓</span>
                  <span>Eat more frequent, balanced meals</span>
                </li>
              </ul>
            </div>
          )}

          <button
            onClick={() => navigate('/mood')}
            className="w-full mt-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
          >
            Continue to Mood Check
          </button>
        </div>
      </div>
    </div>
  );
}
