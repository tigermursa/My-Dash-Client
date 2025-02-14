// ColorPicker.jsx
import { useEffect } from "react";

const ColorPicker = () => {
  const colors = [
    "#00bfff", // Vibrant blue (sky blue)
    "#00efae", // Dodger blue (a more subdued blue)
    "#ff6347", // Tomato (red-orange)
    "#32cd32", // Lime green
    "#ff1493", // Deep pink
    "#ffdc00", // Bright yellow (yellow-gold)
    "#8a2be2", // Blue violet (adds a nice purple tone)
  ];
  const savedColor = localStorage.getItem("primaryColor") || "#00bfff";

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", savedColor);
    localStorage.setItem("primaryColor", savedColor);
  }, [savedColor]);

  const changeColor = (color: string) => {
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("primaryColor", color);
  };

  return (
    <div className="p-2">
      <h3 className="text-sm font-semibold mb-2 dark:text-white">
        Choose Theme Color
      </h3>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => changeColor(color as string)}
            className={` w-4 h-4 lg:w-8 lg:h-8 rounded-full lg:border-2`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
