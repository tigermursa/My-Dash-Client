import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Page1 from "../FixedPages/Page1";
import Page2 from "../FixedPages/Page2";
import Page3 from "../FixedPages/Page3";
import Page4 from "../FixedPages/Page4";
import Page5 from "../FixedPages/Page5";
import Page6 from "../FixedPages/Page6";
import Page7 from "../FixedPages/Page7";
import Page8 from "../FixedPages/Page8";
import Page9 from "../FixedPages/Page9";
import Page10 from "../FixedPages/Page10";
import Page11 from "../FixedPages/Page11";
import Page12 from "../FixedPages/Page12";
import Page13 from "../FixedPages/Page13";
import Page14 from "../FixedPages/Page14";
import Page15 from "../FixedPages/Page15";
import Settings from "../FixedPages/Settings";
import SignIn from "../components/auth/signin";
import SignUp from "../components/auth/signup";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/page-1",
        element: <Page1 />,
      },
      {
        path: "/page-2",
        element: <Page2 />,
      },
      {
        path: "/page-3",
        element: <Page3 />,
      },
      {
        path: "/page-4",
        element: <Page4 />,
      },
      {
        path: "/page-5",
        element: <Page5 />,
      },
      {
        path: "/page-6",
        element: <Page6 />,
      },
      {
        path: "/page-7",
        element: <Page7 />,
      },
      {
        path: "/page-8",
        element: <Page8 />,
      },
      {
        path: "/page-9",
        element: <Page9 />,
      },
      {
        path: "/page-10",
        element: <Page10 />,
      },
      {
        path: "/page-11",
        element: <Page11 />,
      },
      {
        path: "/page-12",
        element: <Page12 />,
      },
      {
        path: "/page-13",
        element: <Page13 />,
      },
      {
        path: "/page-14",
        element: <Page14 />,
      },
      {
        path: "/page-15",
        element: <Page15 />,
      },
      {
        path: "/settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/*",
    element: (
      <h1 className="text-red-800 flex h-screen w-full justify-center items-center font-bold">
        Not Found
      </h1>
    ),
  },
]);

export default router;
