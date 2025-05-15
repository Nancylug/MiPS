// import { createContext, useState, useEffect } from 'react';
// import axios from 'axios';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem('token');

//     if (token) {
//       // Verificar si el token es válido
//       axios
//         .post('http://localhost:3001/api/verify-token', { token })
//         .then((response) => {
//           // Si el token es válido, actualizar el estado
//           setIsAuthenticated(true);
//         })
//         .catch((error) => {
//           // Si el token no es válido, actualizar el estado
//           setIsAuthenticated(false);
//         });
//     }
//   }, []);

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const verificarToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsAuthenticated(false);
        setUsuario(null);
        return;
      }

      try {
        await axios.post('http://localhost:3001/api/verify-token', { token });
        setIsAuthenticated(true);
        const decoded = jwtDecode(token);
        setUsuario(decoded);
      } catch (error) {
        console.error('Token inválido o expirado');
        setIsAuthenticated(false);
        setUsuario(null);
      }
    };

    verificarToken();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, usuario }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };


