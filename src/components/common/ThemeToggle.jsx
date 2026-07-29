import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme.jsx';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  const handleClick = () => {
    console.log('🔘 Theme button clicked!');
    console.log('Current theme:', theme);
    toggleTheme();
    console.log('After toggle:', theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={handleClick}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-gray-700" />
      )}
    </button>
  );
};

export default ThemeToggle;
