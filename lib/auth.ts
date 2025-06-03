"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("useAuth useEffect running");
    const token = localStorage.getItem('token');
    console.log("useAuth useEffect - token from localStorage:", token);
    setIsAuthenticated(!!token);
    setIsLoading(false);

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token') {
        console.log("Token changed in localStorage:", e.newValue);
        setIsAuthenticated(!!e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const logout = () => {
    console.log("Logging out - removing token");
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    router.push('/login');
  };

  return { isAuthenticated, isLoading, logout };
}

export function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    console.log("getAuthToken called. Token:", token);
    return token;
  }
  return null;
}

export function setAuthToken(token: string) {
  console.log("setAuthToken called with token:", token);
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      newValue: token,
      oldValue: localStorage.getItem('token'),
      storageArea: localStorage
    }));
  }
}

export function removeAuthToken() {
  console.log("removeAuthToken called");
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    // Dispatch a storage event to notify other tabs/windows
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'token',
      oldValue: localStorage.getItem('token'),
      storageArea: localStorage
    }));
  }
} 