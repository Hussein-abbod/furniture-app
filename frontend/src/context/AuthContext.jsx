import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null); // cached profile data

  // Check cookie session on mount
  useEffect(() => {
    getMe()
      .then(({ data }) => {
        if (data.isAuthenticated) {
          setUser({ username: data.username, email: data.email });
          setRole(data.role); // 'admin' or 'user'
        }
      })
      .catch(() => {
         // Not authenticated
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const loginFn = useCallback(async (username, password) => {
    const { data } = await apiLogin(username, password);
    setUser({ username: data.username, email: data.email });
    setRole(data.role);
    setProfile(null); // clear cached profile on new login
    return data;
  }, []);

  const googleLogin = useCallback(async (token) => {
    const { loginWithGoogle } = await import('../utils/api');
    const { data } = await loginWithGoogle(token);
    setUser({ username: data.username, email: data.email });
    setRole(data.role);
    setProfile(null); // clear cached profile on new login
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (e) {
      console.error(e);
    }
    setUser(null);
    setRole(null);
    setProfile(null); // clear cached profile on logout
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      role,
      isAuthenticated: !!user,
      isAdmin: role === 'admin',
      isUser: role === 'user',
      login: loginFn,
      googleLogin,
      logout,
      setUser,
      loading,
      profile,
      setProfile,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
