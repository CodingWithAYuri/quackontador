import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';
  const location = useLocation();
  
  // Log para ajudar na depuração
  useEffect(() => {
    console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
    console.log('ProtectedRoute - current path:', location.pathname);
  }, [isAuthenticated, location.pathname]);
  
  if (!isAuthenticated) {
    // Redireciona para a página de login, salvando a rota que o usuário tentou acessar
    console.log('Redirecionando para login, salvando rota:', location.pathname);
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  return children;
};

export default ProtectedRoute;
