import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { calculateBMI, calculateDailyCalories, getBMIDetails, calculateWeightLossTarget } from '../utils/healthCalculations';
import { Target, Activity, Globe, User, Weight, Ruler, ArrowLeft } from 'lucide-react';
import WelcomeScreen from '../components/WelcomeScreen';
import VerticalBranding from '../components/VerticalBranding';

export default function HomeScreen() {
  const navigate = useNavigate();
  const { updateUserProfile } = useAppContext();
  const { user } = useAuth();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setShowWelcome(true);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }
  }, []);

  const [goals, setGoals] = useState<string[]>([]);
  const [lifestyle, setLifestyle] = useState('');
  const [region, setRegion] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState('');
  const [weight, setWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [height, setHeight] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');

  const goalOptions = ['Lose Weight', 'Gain Weight', 'Maintain Weight', 'Tone Muscles'];
  const lifestyleOptions = ['Sedentary', 'Moderate', 'Active'];

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleNext = () => {
    if (!goals.length || !lifestyle || !region || !age || !sex || !weight || !height) {
      alert('Please fill in all fields');
      return;
    }

    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);
    const ageNum = parseInt(age);

    const bmi = calculateBMI(weightNum, weightUnit, heightNum, heightUnit);
    const dailyCalories = calculateDailyCalories(
      weightNum,
      weightUnit,
      heightNum,
      heightUnit,
      ageNum,
      sex,
      lifestyle.toLowerCase(),
      goals
    );

    updateUserProfile({
      goals,
      lifestyle: lifestyle.toLowerCase(),
      region,
      age: ageNum,
      sex,
      weight: weightNum,
      weightUnit,
      height: heightNum,
      heightUnit,
      bmi,
      dailyCalorieLimit: dailyCalories,
    });

    navigate('/bmi-results', {
      state: { bmi, weight: weightNum, weightUnit, height: heightNum, heightUnit }
    });
  };

  const userName = user?.user_metadata?.name || 'Friend';

  if (showWelcome) {
    return <WelcomeScreen onComplete={() => setShowWelcome(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6 relative">
      <VerticalBranding />

      <div className="max-w-3xl mx-auto relative z-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back</span>
        </button>

        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <img src="/image.png" alt="FitPulse Logo" className="w-20 h-20" />
          </div>
          <h1 className="text-5xl font-black text-gray-800 mb-2">Welcome back {userName}!!</h1>
          <p className="text-lg text-gray-600">Your AI-powered fitness and nutrition guide</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-6 h-6 text-green-500" />
              <h2 className="text-2xl font-bold text-gray-800">Your Fitness Goals</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {goalOptions.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    goals.includes(goal)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-6 h-6 text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-800">Lifestyle</h2>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {lifestyleOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setLifestyle(option)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    lifestyle === option
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <User className="w-6 h-6 text-purple-500" />
              <h2 className="text-2xl font-bold text-gray-800">Personal Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="w-4 h-4 inline mr-1" />
                  Region/Country
                </label>
                <input
                  type="text"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  placeholder="e.g., USA, India, UK"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="Enter age"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sex</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Weight className="w-4 h-4 inline mr-1" />
                  Weight
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="Enter weight"
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  />
                  <select
                    value={weightUnit}
                    onChange={(e) => setWeightUnit(e.target.value)}
                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="lbs">lbs</option>
                  </select>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Ruler className="w-4 h-4 inline mr-1" />
                  Height
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="Enter height"
                    className="flex-1 px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  />
                  <select
                    value={heightUnit}
                    onChange={(e) => setHeightUnit(e.target.value)}
                    className="px-3 py-2 rounded-lg border-2 border-gray-200 focus:border-purple-400 focus:outline-none"
                  >
                    <option value="cm">cm</option>
                    <option value="ft/in">ft</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Calculate & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
