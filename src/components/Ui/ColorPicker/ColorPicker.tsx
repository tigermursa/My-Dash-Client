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
    <div className="fixed bottom-4 right-4  p-4  ">
      <h3 className="text-sm font-semibold mb-2 dark:text-white">
        Choose Theme Color
      </h3>
      <div className="flex gap-2">
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => changeColor(color as string)}
            className={`w-8 h-8 rounded-full border-2`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
