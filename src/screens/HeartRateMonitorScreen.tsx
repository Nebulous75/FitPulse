import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Watch, Smartphone } from 'lucide-react';
import VerticalBranding from '../components/VerticalBranding';

export default function HeartRateMonitorScreen() {
  const navigate = useNavigate();
  const [showDeviceOptions, setShowDeviceOptions] = useState(true);

  const handleDeviceConnect = (device: 'fitbit' | 'applewatch') => {
    alert(`Connect your ${device === 'fitbit' ? 'Fitbit' : 'Apple Watch'} through your device settings or the companion app. This feature is currently in development.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 p-6 relative">
      <VerticalBranding />
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-red-500 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Heart Rate Monitor</h1>
            <p className="text-gray-600">Connect your device to track your heart rate</p>
          </div>

          {showDeviceOptions ? (
            <div className="space-y-6">
              <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Connect Your Device</h2>
                <p className="text-gray-600 text-sm">
                  Link your fitness tracker to get accurate heart rate readings and personalized workout recommendations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => handleDeviceConnect('fitbit')}
                  className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl border-2 border-cyan-200 hover:border-cyan-400 transition-all shadow-lg hover:shadow-xl group"
                >
                  <Watch className="w-12 h-12 text-cyan-500 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Fitbit</h3>
                  <p className="text-sm text-gray-600">
                    Connect your Fitbit device to sync heart rate data
                  </p>
                </button>

                <button
                  onClick={() => handleDeviceConnect('applewatch')}
                  className="p-6 bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl border-2 border-gray-300 hover:border-gray-400 transition-all shadow-lg hover:shadow-xl group"
                >
                  <Smartphone className="w-12 h-12 text-gray-700 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Apple Watch</h3>
                  <p className="text-sm text-gray-600">
                    Connect your Apple Watch to sync heart rate data
                  </p>
                </button>
              </div>

              <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200">
                <h3 className="font-bold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-yellow-500">ℹ</span>
                  Setup Instructions
                </h3>
                <ol className="text-sm text-gray-700 space-y-2 list-decimal list-inside">
                  <li>Ensure your device is paired with your phone via Bluetooth</li>
                  <li>Open the companion app (Fitbit or Health app)</li>
                  <li>Grant necessary permissions for heart rate data access</li>
                  <li>Return here to sync your data</li>
                </ol>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500 mb-4">
                  Don't have a fitness tracker?
                </p>
                <button
                  onClick={() => navigate('/workout')}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  Continue Without Device
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-600">Connecting to your device...</p>
            </div>
          )}
        </div>

        <div className="mt-6 p-4 bg-white rounded-2xl shadow-md">
          <h3 className="font-bold text-gray-800 mb-2">Why Track Heart Rate?</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Get workouts tailored to your current fitness level</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Monitor your cardiovascular health over time</span>
            </li>
            <li className="flex items-start gap-2">
              <Heart className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <span>Optimize workout intensity for better results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
