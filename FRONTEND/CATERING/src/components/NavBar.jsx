
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, usuario } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/bienvenida">Catering</Link>

      {isAuthenticated ? (
        <>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className="nav-link" to="/usuarios">Usuarios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/proveedores">Proveedores</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/clientes">Clientes</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/productos">Productos</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/administracion">Menú</Link></li>
          </ul>

          <div className="d-flex align-items-center gap-2">
            <span className="navbar-text text-white">
              
           Bienvenido {usuario?.nombre}
            </span>

            <button className="btn btn-danger btn-sm" onClick={handleLogout}>Cerrar sesión</button>
          </div>
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




