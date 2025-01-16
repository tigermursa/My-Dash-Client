import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import PageHandler from "../pages/PageHandler";
import navItems from "../data/sidebarData";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // Dynamically create routes based on navItems
      ...navItems.map((item) => ({
        path: item.href,
        element: <PageHandler />, // Component for dynamic pages
      })),
    ],
  },
]);

export default router;
