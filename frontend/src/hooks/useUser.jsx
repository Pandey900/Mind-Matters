import { useCallback } from "react";
import useAuth from "./useAuth";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useUser = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const fetchUser = useCallback(async () => {
    if (!user?.email) {
      return null;
    }
    try {
      const res = await axiosSecure.get(`/user/${user?.email}`);
      return res.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      throw error;
    }
  }, [user?.email, axiosSecure]);

  const {
    data: currentUser,
    isLoading,
    refetch,
    error,
  } = useQuery({
    queryKey: ["user", user?.email],
    queryFn: fetchUser,
    enabled: !!user?.email && !!localStorage.getItem("token"),
    staleTime: 300000, // 5 minutes
    cacheTime: 3600000, // 1 hour
  });

  return { currentUser, isLoading, refetch, error };
};

export default useUser;
