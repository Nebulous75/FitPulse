import { Home, Dumbbell, X } from 'lucide-react';

interface WorkoutTypeSelectorProps {
  isOpen: boolean;
  onSelect: (type: 'home' | 'gym') => void;
  onClose: () => void;
}

export default function WorkoutTypeSelector({ isOpen, onSelect, onClose }: WorkoutTypeSelectorProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-scale-in">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 text-center">
            Choose Workout Type
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Select where you'd like to work out
          </p>

          <div className="space-y-4">
            <button
              onClick={() => onSelect('home')}
              className="w-full p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 transition-all shadow-lg hover:shadow-xl group"
            >
              <Home className="w-12 h-12 text-blue-500 dark:text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Home Workout</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                No equipment needed. Work out anywhere, anytime with bodyweight exercises.
              </p>
            </button>

            <button
              onClick={() => onSelect('gym')}
              className="w-full p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all shadow-lg hover:shadow-xl group"
            >
              <Dumbbell className="w-12 h-12 text-purple-500 dark:text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Gym Workout</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Access to equipment. Optimized routines with machines, weights, and more.
              </p>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
