"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = '__app_auth__';

export interface AuthUser {
  username: string;
  isAuthenticated: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check auth on mount
    const isAuthenticated = localStorage.getItem(`${STORAGE_KEY}_authenticated`) === 'true';
    const storedUser = localStorage.getItem(`${STORAGE_KEY}_user`);
    
    if (isAuthenticated && storedUser) {
      setUser({ username: storedUser, isAuthenticated: true });
    }
    setIsLoading(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(`${STORAGE_KEY}_authenticated`);
    localStorage.removeItem(`${STORAGE_KEY}_user`);
    localStorage.removeItem(`${STORAGE_KEY}_timestamp`);
    setUser(null);
    window.location.href = '/login';
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user?.isAuthenticated),
    isLoading,
    logout,
  };
}
