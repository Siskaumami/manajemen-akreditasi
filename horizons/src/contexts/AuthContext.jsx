import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const safeJsonParse = (value, fallback) => {
  try {
    if (!value) return fallback;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = safeJsonParse(localStorage.getItem('user'), null);
    if (storedUser) setUser(storedUser);
    setLoading(false);
  }, []);

  const login = (email, password) => {
    const users = safeJsonParse(localStorage.getItem('users'), []);
    const foundUser = users.find((u) => u.email === email && u.password === password);

    if (!foundUser) return { success: false, error: 'Email atau password salah' };

    const userWithoutPassword = { ...foundUser };
    delete userWithoutPassword.password;

    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    return { success: true, user: userWithoutPassword };
  };

  const register = (userData) => {
    const users = safeJsonParse(localStorage.getItem('users'), []);

    const role = userData.role === 'admin' || userData.role === 'user' ? userData.role : 'user';

    if (users.find((u) => u.email === userData.email)) {
      return { success: false, error: 'Email sudah terdaftar' };
    }

    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));

    return { success: true, user: userWithoutPassword };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    return { success: true };
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
