import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, Award, Trophy, Star } from 'lucide-react';

export default function BadgesScreen() {
  const navigate = useNavigate();
  const { badges, totalXP } = useAppContext();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-purple-50 p-6">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/summary')}
          className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Summary</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Achievements</h1>
            <p className="text-gray-600">Keep earning XP and unlock more badges!</p>
          </div>

          <div className="grid grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl">
              <Star className="w-12 h-12 text-yellow-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-yellow-800">{totalXP}</p>
              <p className="text-sm text-yellow-700">Total XP</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl">
              <Award className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-800">{badges.length}</p>
              <p className="text-sm text-purple-700">Badges Earned</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl">
              <Trophy className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-800">{Math.floor(totalXP / 50)}</p>
              <p className="text-sm text-green-700">Level</p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Badges</h2>
            {badges.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No badges yet. Complete actions to earn badges!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {badges.map((badge, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border-2 border-purple-200"
                  >
                    <Award className="w-10 h-10 text-purple-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{badge.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{badge.description}</p>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-yellow-600">
                          +{badge.xpPoints} XP
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
