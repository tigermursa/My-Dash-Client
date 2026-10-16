import React, { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth"; // Make sure the correct path is used
import Loader from "../components/Ui/Loader/Loader";

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader />; // Optional: Show a loading indicator while checking auth
  }

  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
