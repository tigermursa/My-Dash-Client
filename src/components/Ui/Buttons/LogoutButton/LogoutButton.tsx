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
    <button
      onClick={() => mutation.mutate()}
      disabled={mutation.isPending}
      className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-gray-400"
    >
      {mutation.isPending ? "Logging out..." : "Logout"}
    </button>
  );
}
