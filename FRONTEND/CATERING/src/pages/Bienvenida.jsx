
// import React, { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';
// import { Navigate } from 'react-router-dom';

// const Bienvenida = () => {
//   const { isAuthenticated, usuario } = useContext(AuthContext);

//   if (!isAuthenticated) {
//     return <Navigate to="/" />;
//   }

//   return (
//     <div className="text-center mt-5">
//       <h1 className="display-4">¡Bienvenido/a al sistema de Catering!</h1>
//       {usuario && (
//         <p className="lead mt-3">
//           Usuario: <strong>{usuario.email}</strong>
//         </p>
//       )}
//     </div>
//   );
// };

// export default Bienvenida;

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Bienvenida = () => {
  const { isAuthenticated, usuario } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="text-center mt-5">
      <h1 className="display-4">¡Bienvenido/a al sistema de Catering!</h1>
      <br></br>
      <h2>Desde este sitio podrás gestionar usuarios, clientes, productos, proveedores y presupuestos</h2>
      {/* {usuario && (
        <p className="lead mt-3">
          Usuario: <strong>{usuario.nombre || usuario.email}</strong>
        </p>
      )} */}
    </div>
  );
};

export default Bienvenida;
