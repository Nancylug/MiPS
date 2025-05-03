import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Catering</Link>

      {isAuthenticated && (
        <>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/administracion">Administración</Link></li>
          </ul>
        </>
      )}
    </nav>
  );
};

export default Navbar;


