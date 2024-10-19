import { useContext, useEffect, useMemo } from "react";
import { AuthContext } from "../utilities/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useAxiosSecure = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const axiosSecure = useMemo(() => {
    const instance = axios.create({
      baseURL: "http://localhost:3000",
    });

    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response &&
          (error.response.status === 401 || error.response.status === 403)
        ) {
          await logout();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [logout, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
