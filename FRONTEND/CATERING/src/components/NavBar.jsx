// import React, { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../context/AuthContext';

// const Navbar = () => {
//   const { isAuthenticated } = useContext(AuthContext);

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
//       <Link className="navbar-brand" to="/">Catering</Link>

//       {isAuthenticated && (
//         <>
//           <ul className="navbar-nav me-auto mb-2 mb-lg-0">
//             <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
//             <li className="nav-item"><Link className="nav-link" to="/administracion">Administración</Link></li>
//           </ul>
//         </>
//       )}
//     </nav>
//   );
// };

// export default Navbar;

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate(); // En v6 se usa useNavigate

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login'); // Redirige al login
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Catering</Link>

      {isAuthenticated ? (
        <>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/administracion">Administración</Link></li>
          </ul>

          <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
        </>
      ) : (
        <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
          <li className="nav-item"><Link className="nav-link" to="/">Iniciar sesión</Link></li>

        </ul>
      )}
    </nav>
  );
};

export default Navbar;



