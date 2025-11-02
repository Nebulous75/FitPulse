import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signUp(email, password, name);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      sessionStorage.removeItem('hasSeenWelcome');
      navigate('/home');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-cyan-50 to-teal-100 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-teal-50/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <img src="/image.png" alt="FitPulse Logo" className="w-32 h-32" />
          </div>

          <h1 className="text-4xl font-bold text-center text-gray-700 mb-8">
            Create New<br />Account
          </h1>

          <form onSubmit={handleSignUp} className="space-y-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              className="w-full px-6 py-4 rounded-full bg-teal-200/50 border-none text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-6 py-4 rounded-full bg-teal-200/50 border-none text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                minLength={6}
                className="w-full px-6 py-4 pr-12 rounded-full bg-teal-200/50 border-none text-gray-700 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800 focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-full font-bold text-white transition-all ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-teal-700 hover:bg-teal-800 shadow-lg'
              }`}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600 text-sm mb-2">Already have an account?</p>
            <button
              onClick={() => navigate('/login')}
              className="text-teal-700 font-semibold hover:text-teal-800"
            >
              Log In
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-500 text-xs">Contact us at raiyaantopas@gmail.com</p>
            <p className="text-gray-400 text-xs mt-1">Developed by Raiyaan, Wasi, Maryam.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
