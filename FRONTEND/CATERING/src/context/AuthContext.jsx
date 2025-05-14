import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      // Verificar si el token es válido
      axios
        .post('http://localhost:3001/api/verify-token', { token })
        .then((response) => {
          // Si el token es válido, actualizar el estado
          setIsAuthenticated(true);
        })
        .catch((error) => {
          // Si el token no es válido, actualizar el estado
          setIsAuthenticated(false);
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};


