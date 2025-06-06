import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";

import Page2 from "../FixedPages/Page2";
import Page3 from "../FixedPages/Page3";
import Page4 from "../FixedPages/Page4";
import Page5 from "../FixedPages/Page5";
import Page6 from "../FixedPages/Page6";

import Settings from "../pages/Settings";
import SignIn from "../components/auth/signin";
import SignUp from "../components/auth/signup";
import PrivateRoute from "./PrivateRoute";
import Skills from "../FixedPages/Page7";
import JobTracker from "../FixedPages/Page8";
import BookList from "../FixedPages/Page9";
import Experience from "../FixedPages/Page10";
import Projects from "../FixedPages/Page11";
import Bookmarks from "../FixedPages/Page12";
import Dates from "../FixedPages/Page13";
import Help from "../FixedPages/Page15";
import Page14 from "../FixedPages/Page14";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <PrivateRoute>
        <App />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/page-1",
        element: <Home />,
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
        element: <Skills />,
      },
      {
        path: "/page-8",
        element: <JobTracker />,
      },
      {
        path: "/page-9",
        element: <BookList />,
      },
      {
        path: "/page-10",
        element: <Experience />,
      },
      {
        path: "/page-11",
        element: <Projects />,
      },
      {
        path: "/page-12",
        element: <Bookmarks />,
      },
      {
        path: "/page-13",
        element: <Dates />,
      },
      {
        path: "/page-14",
        element: <Page14 />,
      },
      {
        path: "/page-15",
        element: <Help />,
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
