import { useQuery } from "@tanstack/react-query";
import { getUserById, IUser } from "../lib/authApi";

const useAuth = (userId: string) => {
  const { data, error, isLoading, refetch } = useQuery<IUser>({
    queryKey: ["user", userId], // Unique query key per user
    queryFn: () => getUserById(userId), // Fetch user by ID
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    enabled: !!userId, // Only fetch if userId exists
  });

  return { user: data, error, isLoading, refetch };
};

export default useAuth;
