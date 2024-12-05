import { Navigate, Outlet } from 'react-router-dom';
import React from 'react';

export function AuthWrapper() {
  const isAuthenticated = () => {
    const accessToken = sessionStorage.getItem('accessToken');
    return !!accessToken;
  };

  return isAuthenticated() ? <Outlet /> : <Navigate replace to="/signin" />;
}
