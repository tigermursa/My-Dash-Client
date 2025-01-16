import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import TanstackProvider from "./providers/TanstackProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </TanstackProvider>
  </StrictMode>
);
