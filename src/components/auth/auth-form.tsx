import React, { useState } from "react";
import { FaChrome, FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { signinUser, signupUser } from "../../lib/authApi";
import { responseType } from "../../types/AuthTypes";
import { toast } from "react-toastify";

interface AuthFormProps {
  type: "sign-in" | "sign-up";
}

export default function AuthForm({ type }: AuthFormProps) {
  // Pre-fill credentials for tester on sign-in
  const [email, setEmail] = useState(
    type === "sign-in" ? "testuser@example.com" : ""
  );
  const [password, setPassword] = useState(
    type === "sign-in" ? "Password123@" : ""
  );
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let response: responseType | null = null;

      if (type === "sign-up") {
        const user = await signupUser({ username: name, email, password });
        response = {
          ...user,
          message: "Signup successful",
        };
        toast.success("Welcome to MyDash!");
      } else {
        const user = await signinUser({ email, password });
        response = {
          ...user,
          message: "Signin successful",
        };
        toast.success("Welcome back to MyDash!");
      }

      if (response && response._id) {
        localStorage.setItem("userIdMydash", response._id);
      }

      navigate("/");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error);
      let errorMessage = "Error calling the auth API";

      if (error.response && error.response.data) {
        if (typeof error.response.data === "string") {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (Array.isArray(error.response.data)) {
          errorMessage = error.response.data.join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Working on integrating ${provider} login`);
  };

  return (
    <div className="w-full max-w-md bg-gray-800/20 shadow-md rounded-lg">
      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-center items-center gap-1">
            <img
              src="/my-dash-logo.png"
              alt="User"
              className="w-8 h-8 rounded-full object-cover"
            />
            <h2 className="text-2xl font-bold text-center text-white">
              {type === "sign-in"
                ? "Sign in to your account"
                : "Create an account"}
            </h2>
          </div>
          <p className="text-center text-gray-400">
            {type === "sign-in"
              ? "Enter your email below to sign in to your account"
              : "Enter your information below to create your account"}
          </p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {type === "sign-up" && (
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-200"
              >
                Nick Name
              </label>
              <input
                id="name"
                name="name"
                maxLength={10}
                type="text"
                placeholder="Mursalin"
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary_one focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-200"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="mursalin@example.com"
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary_one focus:border-transparent"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-200"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary_one focus:border-transparent pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary_one hover:bg-red-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-primary_one focus:ring-offset-2 focus:ring-offset-gray-800"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : type === "sign-in"
              ? "Sign in"
              : "Sign up"}
          </button>
        </form>
        <div className="relative hidden">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative justify-center text-xs uppercase hidden">
            <span className="bg-gray-800 px-2 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <div className="hidden">
          <button
            onClick={() => handleSocialLogin("Google")}
            className="flex items-center justify-center w-full px-4 py-2 border border-gray-600 rounded-md text-gray-200 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <FaChrome className="mr-2 h-4 w-4" /> Google
          </button>
        </div>
      </div>
      <div className="px-6 py-4 rounded-b-lg flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-gray-400">
          {type === "sign-in"
            ? "Don't have an account? "
            : "Already have an account? "}
          <Link
            to={type === "sign-in" ? "/sign-up" : "/sign-in"}
            className="text-primary_one hover:underline"
          >
            {type === "sign-in" ? "Sign up" : "Sign in"}
          </Link>
        </div>
        {type === "sign-in" && (
          <Link
            to="/forgot-password"
            className="text-sm text-primary_one hover:underline hidden"
          >
            Forgot password?
          </Link>
        )}
      </div>
    </div>
  );
}
