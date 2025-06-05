// useAxiosAuth.js
import { useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/useAuthStore';

const useAxiosAuth = () => {
  const { accessToken, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const requestIntercept = api.interceptors.request.use(
      (config) => {
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (
          error?.response?.status === 401 &&
          !prevRequest._retry &&
          !prevRequest.url.includes('/auth/login')
        ) {
          prevRequest._retry = true;
          try {
            const res = await api.get('/auth/refresh');
            setAccessToken(res.data.accessToken);
            prevRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
            return api(prevRequest);
          } catch (err) {
            logout(); // clear state & redirect
            return Promise.reject(err);
          }
        }
        return Promise.reject(error);
      }
    );

    return () => {
      api.interceptors.request.eject(requestIntercept);
      api.interceptors.response.eject(responseIntercept);
    };
  }, [accessToken, setAccessToken, logout]);

  return api;
};

export default useAxiosAuth;
