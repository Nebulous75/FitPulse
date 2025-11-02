import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { calculateBMI, calculateDailyCalories } from '../utils/healthCalculations';
import { ArrowLeft, User, Edit3, RefreshCw, Target, Activity, Globe, Weight, Ruler } from 'lucide-react';

export default function ProfileUpdateScreen() {
  const navigate = useNavigate();
  const { userProfile, updateUserProfile } = useAppContext();
  const [mode, setMode] = useState<'choice' | 'edit' | 'redo'>('choice');

  const [goals, setGoals] = useState<string[]>(userProfile.goals);
  const [lifestyle, setLifestyle] = useState(userProfile.lifestyle);
  const [region, setRegion] = useState(userProfile.region);
  const [age, setAge] = useState(userProfile.age?.toString() || '');
  const [sex, setSex] = useState(userProfile.sex);
  const [weight, setWeight] = useState(userProfile.weight?.toString() || '');
  const [weightUnit, setWeightUnit] = useState(userProfile.weightUnit);
  const [height, setHeight] = useState(userProfile.height?.toString() || '');
  const [heightUnit, setHeightUnit] = useState(userProfile.heightUnit);

  const goalOptions = ['Lose Weight', 'Gain Weight', 'Maintain Weight', 'Tone Muscles'];
  const lifestyleOptions = ['Sedentary', 'Moderate', 'Active'];

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSave = () => {
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

    navigate('/summary');
  };

  if (mode === 'choice') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-3xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-white rounded-3xl shadow-xl p-8">
            <div className="text-center mb-8">
              <User className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Update Your Profile</h1>
              <p className="text-gray-600">Choose how you'd like to update your information</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button
                onClick={() => setMode('edit')}
                className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 hover:border-green-400 transition-all shadow-lg hover:shadow-xl group"
              >
                <Edit3 className="w-12 h-12 text-green-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Edit Profile</h3>
                <p className="text-sm text-gray-600">
                  Update specific information or adjust your fitness goals
                </p>
              </button>

              <button
                onClick={() => {
                  setMode('redo');
                  setGoals([]);
                  setLifestyle('');
                  setRegion('');
                  setAge('');
                  setSex('');
                  setWeight('');
                  setHeight('');
                }}
                className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200 hover:border-blue-400 transition-all shadow-lg hover:shadow-xl group"
              >
                <RefreshCw className="w-12 h-12 text-blue-500 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Start Fresh</h3>
                <p className="text-sm text-gray-600">
                  Redo your entire profile setup from scratch
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => setMode('choice')}
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              {mode === 'edit' ? 'Edit Your Profile' : 'Start Fresh'}
            </h1>
            <p className="text-gray-600">
              {mode === 'edit' ? 'Update your fitness information' : 'Create your profile from scratch'}
            </p>
          </div>

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
            onClick={handleSave}
            className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-xl font-semibold text-lg hover:from-green-600 hover:to-blue-600 transition-all shadow-lg"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
