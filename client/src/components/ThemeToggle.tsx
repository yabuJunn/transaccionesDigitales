import { useTheme } from '../context/ThemeContext';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="px-4 py-2 rounded-lg font-medium transition-all bg-neutral-surface border border-neutral-border hover:bg-neutral-surface-alt"
      aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
    >
      {theme === 'light' ? (
        <span className="flex items-center gap-2">
          <span>🌙</span>
          <span className="hidden sm:inline">Dark</span>
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <span>☀️</span>
          <span className="hidden sm:inline">Light</span>
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;

