import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function DarkModeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('Dark mode toggle clicked. Current state:', isDark);
    toggleTheme();
  };

  return (
    <button
      onClick={handleClick}
      className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700 hover:scale-110"
      aria-label="Toggle dark mode"
      type="button"
    >
      {isDark ? (
        <Sun className="w-6 h-6 text-yellow-500" />
      ) : (
        <Moon className="w-6 h-6 text-gray-700" />
      )}
    </button>
  );
}
