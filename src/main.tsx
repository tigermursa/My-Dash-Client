import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/routes.tsx";
import { ThemeProvider } from "./contexts/ThemeContext.tsx";
import TanstackProvider from "./providers/TanstackProvider.tsx";
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TanstackProvider>
      <ThemeProvider>
        <ToastContainer
          position="top-center"
          autoClose={2500}
          transition={Slide}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <RouterProvider router={router} />
      </ThemeProvider>
    </TanstackProvider>
  </StrictMode>
);
