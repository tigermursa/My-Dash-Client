import { useState, useEffect } from "react";
import { getPrimaryColor } from "../utils/faviocn";

export function usePrimaryColor() {
  const [primaryColor, setPrimaryColor] = useState(getPrimaryColor());

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newColor = getPrimaryColor();
      setPrimaryColor((prevColor) => {
        // Only update if the color has actually changed
        return prevColor !== newColor ? newColor : prevColor;
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style"],
    });

    return () => observer.disconnect();
  }, []);

  return primaryColor;
}
