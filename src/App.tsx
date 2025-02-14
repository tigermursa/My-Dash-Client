import { Outlet } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import { updateFavicon } from "./utils/faviocn";
import { useEffect } from "react";
import { usePrimaryColor } from "./hooks/usePrimaryColor";

export default function App() {
  const themeColor = usePrimaryColor();

  useEffect(() => {
    updateFavicon(themeColor);
  }, [themeColor]);

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
