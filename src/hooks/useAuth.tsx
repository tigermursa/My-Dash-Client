import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../lib/authApi";

const useAuth = () => {
  // Get userId from localStorage
  const userId = localStorage.getItem("userIdMydash");

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => (userId ? getUserById(userId) : Promise.resolve(null)),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    enabled: !!userId, // Only enable the query if userId exists
  });

  // Extract only the necessary fields
  const user = data?.data
    ? {
        _id: data.data._id,
        username: data.data.username,
        email: data.data.email,
      }
    : null;

  return { user, error, isLoading, refetch };
};

export default useAuth;
