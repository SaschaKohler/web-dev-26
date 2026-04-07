import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_active: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:8000/api';

axios.defaults.withCredentials = true;

let accessToken: string | null = null;

const setAccessToken = (token: string | null) => {
  accessToken = token;
};

const getAccessToken = () => accessToken;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshingToken = useRef(false);
  const failedQueue = useRef<Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }>>([]);

  const processQueue = (error: any = null) => {
    failedQueue.current.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else {
        promise.resolve();
      }
    });
    failedQueue.current = [];
  };

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post<{ access: string; user: User }>(
        `${API_BASE_URL}/auth/refresh/`,
        {},
        { withCredentials: true }
      );
      
      const newAccessToken = response.data.access;
      setAccessToken(newAccessToken);
      setUser(response.data.user);
      return newAccessToken;
    } catch (error) {
      setAccessToken(null);
      setUser(null);
      throw error;
    }
  };

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config: any) => {
        const token = getAccessToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error: any) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          const isRefreshEndpoint = originalRequest.url?.includes('/auth/refresh');
          
          if (isRefreshEndpoint) {
            setUser(null);
            setAccessToken(null);
            return Promise.reject(error);
          }

          if (refreshingToken.current) {
            return new Promise((resolve, reject) => {
              failedQueue.current.push({ resolve, reject });
            })
              .then(() => {
                const token = getAccessToken();
                if (originalRequest.headers && token) {
                  originalRequest.headers.Authorization = `Bearer ${token}`;
                }
                return axios(originalRequest);
              })
              .catch((err) => Promise.reject(err));
          }

          originalRequest._retry = true;
          refreshingToken.current = true;

          try {
            const newToken = await refreshAccessToken();
            processQueue();
            
            if (originalRequest.headers && newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axios(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError);
            setUser(null);
            setAccessToken(null);
            return Promise.reject(refreshError);
          } finally {
            refreshingToken.current = false;
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const checkAuth = async () => {
    try {
      const response = await refreshAccessToken();
      if (!response) {
        setUser(null);
      }
    } catch (error: any) {
      setUser(null);
      setAccessToken(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isAdminRoute = window.location.pathname.startsWith('/admin') && 
                         window.location.pathname !== '/admin/login';
    
    if (isAdminRoute) {
      checkAuth();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await axios.post<{ user: User; access: string; message: string }>(
        `${API_BASE_URL}/auth/login/`,
        { username, password },
        { withCredentials: true }
      );
      
      setAccessToken(response.data.access);
      setUser(response.data.user);
    } catch (error: any) {
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      }
      throw new Error('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/auth/logout/`, {}, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
