import { useEffect, useState } from "react";

type Theme = {
  name: string;
  className: string;
  color: string;
};

const themes: Theme[] = [
  { name: "Green", className: "default", color: "#49e7a5" },
  { name: "Blue", className: "theme-blue", color: "#60a5fa" },
  { name: "Purple", className: "theme-purple", color: "#a78bfa" },
  { name: "Red", className: "theme-red", color: "#f87171" },
];

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(themes[0]);

  useEffect(() => {
    const html = document.documentElement;

    // Remove all theme classes
    themes.forEach((theme) => html.classList.remove(theme.className));

    // Add current theme class if not default
    if (currentTheme.className !== "default") {
      html.classList.add(currentTheme.className);
    }
  }, [currentTheme]);

  return (
    <div className="flex gap-3 p-4 bg-primarydarkbg rounded-lg">
      {themes.map((theme) => (
        <button
          key={theme.className}
          onClick={() => setCurrentTheme(theme)}
          className={`h-10 w-10 rounded-full transition-all duration-300 shadow-lg hover:scale-110`}
          style={{ backgroundColor: theme.color }}
          aria-label={`Switch to ${theme.name} theme`}
        >
          {currentTheme.className === theme.className && (
            <span className="text-white text-xl">✓</span>
          )}
        </button>
      ))}
    </div>
  );
};

export default ThemeSwitcher;
