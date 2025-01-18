import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { signoutUser } from "../../../../lib/authApi";

export default function LogoutButton() {
  const navigate = useNavigate();

  // Use TanStack mutation for signout
  const mutation = useMutation({
    mutationFn: signoutUser,
    onSuccess: () => {
      // Clear localStorage and cookies
      localStorage.removeItem("userIdMydash");
      Cookies.remove("access_token");

      // Redirect to login page
      navigate("/sign-in");
    },
    onError: () => {
      console.error("Error signing out");
    },
  });

  return (
    <div className="relative group">
      <button
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending}
        className="rounded hover:scale-110 transition disabled:opacity-50"
      >
        {mutation.isPending ? (
          "Logging out..."
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={26}
            height={26}
            viewBox="0 0 24 24"
          >
            <path
              fill="#ea2129"
              fillRule="evenodd"
              d="M3.25 12a8.75 8.75 0 1 1 17.5 0a8.75 8.75 0 0 1-17.5 0M12 6.25a.75.75 0 0 1 .75.75v5a.75.75 0 0 1-1.5 0V7a.75.75 0 0 1 .75-.75m-2 1.832c0-.183-.19-.302-.348-.212a4.75 4.75 0 1 0 4.696 0c-.159-.09-.348.03-.348.212v1.234c0 .077.036.15.095.199a3.25 3.25 0 1 1-4.19 0A.26.26 0 0 0 10 9.316z"
              clipRule="evenodd"
            ></path>
          </svg>
        )}
      </button>

      {/* Tooltip */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition bg-gray-800 text-white text-xs rounded px-2 py-1 whitespace-nowrap">
        Logout
      </span>
    </div>
  );
}
