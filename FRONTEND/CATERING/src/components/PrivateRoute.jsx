import React, { useContext, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('ultimaRuta', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PrivateRoute;
