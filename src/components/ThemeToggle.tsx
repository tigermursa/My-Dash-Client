import { Icon } from "@iconify/react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full  bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-200"
      aria-label="Toggle theme"
      title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
    >
      {theme === "light" ? (
        <Icon
          icon="mdi:moon-waning-crescent"
          className="w-5 h-5 lg:w-8 lg:h-8"
        />
      ) : (
        <Icon
          icon="mdi:white-balance-sunny"
          className="w-5 h-5 lg:w-8 lg:h-8"
        />
      )}
    </button>
  );
}
