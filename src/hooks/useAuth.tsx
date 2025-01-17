import { useQuery } from "@tanstack/react-query";
import { getUserById } from "../lib/authApi";

const useAuth = () => {
  const userId = "678aae7c61767a9a409156a0";
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => getUserById(userId),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: "always",
    refetchOnReconnect: true,
    enabled: !!userId,
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
