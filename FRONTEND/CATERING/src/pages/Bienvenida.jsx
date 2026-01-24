import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

import { Link } from 'react-router-dom';

const Bienvenida = () => {
  const { isAuthenticated, usuario } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="text-center mt-5">
      <h1 className="display-5">¡Bienvenido/a al sistema de Catering!</h1>
      <br></br>
      <strong><h2 className="dashboard-title ">Desde este sitio podrás gestionar usuarios, clientes, productos, proveedores y presupuestos</h2></strong>
      {
      
      <div className="container mt-5">
  <div className="row text-center g-4">

    <div className="col-6 col-md-4">
      <Link to="/usuarios" className="text-decoration-none text-dark">
        <img
          src="/assets/Usuarios.png" width={150}
          alt="Usuarios"
          className="img-fluid mb-2 rounded-4"
          style={{ maxHeight: '120px' }}
        />
        <h5 className="dashboard-title  ">USUARIOS</h5>
      </Link>
    </div>

    <div className="col-6 col-md-4">
      <Link to="/clientes" className="text-decoration-none text-dark">
        <img
          src="assets/clientes.png" width={150}
          alt="Clientes"
          className="img-fluid mb-2 rounded-4"
          style={{ maxHeight: '120px' }}
        />
        <h5 className="dashboard-title">CLIENTES</h5>
      </Link>
    </div>

    <div className="col-6 col-md-4">
      <Link to="/productos" className="text-decoration-none text-dark">
        <img
          src="/assets/Productos.png" width={150}
          alt="Productos"
          className="img-fluid mb-2 rounded-4"
          style={{ maxHeight: '120px' }}
        />
        <h5 className="dashboard-title">PRODUCTOS</h5>
      </Link>
    </div>

    <div className="col-6 col-md-4">
      <Link to="/proveedores" className="text-decoration-none text-dark">
        <img
          src="/assets/Proveedores.png" width={150}
          alt="Proveedores"
          className="img-fluid mb-2 rounded-4"
          style={{ maxHeight: '120px' }}
        />
       <h5 className="dashboard-title">PROVEEDORES</h5>
      </Link>
    </div>

    <div className="col-6 col-md-4">
      <Link to="/presupuestos" className="text-decoration-none text-dark">
        <img
          src="/assets/Menu.png" width={150}
          alt="Presupuestos"
          className="img-fluid mb-2 rounded-4"
          style={{ maxHeight: '120px' }}
        />
       <h5 className="dashboard-title">PRESUPUESTOS</h5>
      </Link>
    </div>

  </div>
</div>/* {usuario && (
        <p className="lead mt-3">
          Usuario: <strong>{usuario.nombre || usuario.email}</strong>
        </p>
      )} */}
    </div>
  );
};

export default Bienvenida;
