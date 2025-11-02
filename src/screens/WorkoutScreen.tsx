import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { generateWorkoutPlan } from '../utils/workoutAPI';
import { ArrowLeft, Dumbbell, Music, Heart, Zap, Calendar, TrendingDown, Clock, Lightbulb } from 'lucide-react';
import WorkoutTypeSelector from '../components/WorkoutTypeSelector';
import VerticalBranding from '../components/VerticalBranding';

export default function WorkoutScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentMood, userProfile } = useAppContext();
  const [workout, setWorkout] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(true);
  const [workoutType, setWorkoutType] = useState<'home' | 'gym' | null>(null);

  const heartRate = location.state?.heartRate || null;

  useEffect(() => {
    if (workoutType) {
      generateWorkout();
    }
  }, [workoutType]);

  const handleWorkoutTypeSelect = (type: 'home' | 'gym') => {
    setWorkoutType(type);
    setShowTypeSelector(false);
  };

  const generateWorkout = async () => {
    if (!workoutType) {
      setShowTypeSelector(true);
      return;
    }

    setLoading(true);

    try {
      const plan = await generateWorkoutPlan({
        workoutType,
        currentMood,
        userProfile,
        heartRate: heartRate || undefined,
      });

      setWorkout(plan);
    } catch (error) {
      console.error('Error generating workout:', error);
      alert('Failed to generate workout plan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (showTypeSelector) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 relative">
          <VerticalBranding />
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 text-center">
              <Dumbbell className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Personalised Workout Plan</h1>
              <p className="text-gray-600 dark:text-gray-300">Choose your workout environment to get started</p>
            </div>
          </div>
        </div>
        <WorkoutTypeSelector
          isOpen={showTypeSelector}
          onSelect={handleWorkoutTypeSelect}
          onClose={() => navigate(-1)}
        />
      </>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Dumbbell className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-600 dark:text-gray-300">Creating your personalized workout plan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 relative">
      <VerticalBranding />
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Dumbbell className="w-16 h-16 text-blue-500 dark:text-blue-400 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">Your Workout Plan</h1>
            <p className="text-gray-600 dark:text-gray-300">
              {workoutType === 'home' ? 'Home Workout' : 'Gym Workout'} - Tailored to your goals
            </p>
          </div>

          {heartRate && (
            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Heart className="w-8 h-8 text-red-500" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Current Heart Rate</p>
                  <p className="text-2xl font-bold text-gray-800 dark:text-white">{heartRate} BPM</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 dark:text-gray-300">Intensity</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400 capitalize">{workout?.intensity}</p>
              </div>
            </div>
          )}

          {workout && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  {workout.type}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{workout.description}</p>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                    <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Duration</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{workout.duration} min</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg text-center">
                    <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Frequency</p>
                    <p className="text-sm font-bold text-purple-600 dark:text-purple-400">{workout.weeklyFrequency}</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
                    <Zap className="w-6 h-6 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Calories</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{workout.caloriesBurned}</p>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-3">Exercise Routine:</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 dark:bg-gray-700">
                        <th className="text-left p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Exercise</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Sets</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Reps/Time</th>
                        <th className="text-center p-3 text-sm font-semibold text-gray-700 dark:text-gray-300">Rest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workout.exercises.map((exercise: any, index: number) => (
                        <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
                          <td className="p-3 text-gray-800 dark:text-gray-200">{exercise.name}</td>
                          <td className="p-3 text-center text-gray-700 dark:text-gray-300">{exercise.sets}</td>
                          <td className="p-3 text-center text-gray-700 dark:text-gray-300">{exercise.reps}</td>
                          <td className="p-3 text-center text-gray-700 dark:text-gray-300">{exercise.rest}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {workout.music && workout.music.length > 0 && (
                <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Music className="w-6 h-6 text-purple-500" />
                    Recommended Music
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {workout.music.map((genre: string, index: number) => (
                      <div
                        key={index}
                        className="p-3 bg-white dark:bg-gray-700 rounded-lg text-center text-sm font-medium text-gray-700 dark:text-gray-200"
                      >
                        {genre}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {workout.tips && workout.tips.length > 0 && (
                <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-2xl">
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {workout.tips.map((tip: string, index: number) => (
                      <li key={index} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-yellow-500 font-bold">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setWorkoutType(null);
                    setShowTypeSelector(true);
                  }}
                  className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                >
                  Generate New Plan
                </button>
                <button
                  onClick={() => navigate('/summary')}
                  className="flex-1 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-lg"
                >
                  Save & Continue
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
