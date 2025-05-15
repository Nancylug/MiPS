
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const Usuarios = () => {
//   const [usuarios, setUsuarios] = useState([]);
//   const [nuevo, setNuevo] = useState({ nombre: '', email: '', rol: '', password: '' });
//   const [editandoId, setEditandoId] = useState(null);

//   const rol = localStorage.getItem('rol'); // Obtener el rol del usuario logueado
//   const soloLectura = rol === 'visitante'; // Determina si es solo lectura

//   useEffect(() => {
//     obtenerUsuarios();
//   }, []);

//   const obtenerUsuarios = async () => {
//     try {
//       const res = await axios.get('http://localhost:3001/api/usuarios');
//       setUsuarios(res.data);
//     } catch (err) {
//       console.error('Error al obtener usuarios:', err);
//     }
//   };

//   const handleChange = (e) => {
//     setNuevo({ ...nuevo, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editandoId) {
//         const { _id, ...datosSinId } = nuevo;
//         const res = await axios.put(`http://localhost:3001/api/usuarios/${editandoId}`, datosSinId);
//         setUsuarios(usuarios.map(u => u._id === editandoId ? res.data : u));
//         setEditandoId(null);
//       } else {
//         const res = await axios.post('http://localhost:3001/api/usuarios', nuevo);
//         setUsuarios([...usuarios, res.data]);
//       }
//       setNuevo({ nombre: '', email: '', rol: '', password: '' });
//     } catch (err) {
//       console.error('Error al guardar usuario:', err);
//     }
//   };

//   const handleEditar = (usuario) => {
//     setNuevo(usuario);
//     setEditandoId(usuario._id);
//   };

//   const handleEliminar = async (id) => {
//     if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
//       try {
//         await axios.delete(`http://localhost:3001/api/usuarios/${id}`);
//         setUsuarios(usuarios.filter(u => u._id !== id));
//       } catch (err) {
//         console.error('Error al eliminar usuario:', err);
//       }
//     }
//   };

//   return (
//     <div className="container-fluid p-3">
//       <h2 className="mb-4">Usuarios</h2>

//       {!soloLectura && (
//         <form onSubmit={handleSubmit} className="mb-4">
//           <div className="row g-3">
//             {['nombre', 'email', 'password'].map((campo) => (
//               <div className="col-12 col-md-6" key={campo}>
//                 <label className="form-label">{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
//                 <input
//                   type={campo === 'password' ? 'password' : 'text'}
//                   className="form-control"
//                   name={campo}
//                   value={nuevo[campo]}
//                   onChange={handleChange}
//                 />
//               </div>
//             ))}

//             <div className="col-12 col-md-6">
//               <label className="form-label">Rol</label>
//               <select
//                 className="form-control"
//                 name="rol"
//                 value={nuevo.rol}
//                 onChange={handleChange}
//               >
//                 <option value="">Seleccionar rol</option>
//                 <option value="administrador">Administrador</option>
//                 <option value="visitante">Visitante</option>
//               </select>
//             </div>
//           </div>

//           <div className="mt-3">
//             <button type="submit" className="btn btn-success me-2">
//               {editandoId ? 'Actualizar' : 'Guardar'}
//             </button>
//             {editandoId && (
//               <button
//                 type="button"
//                 className="btn btn-secondary"
//                 onClick={() => {
//                   setEditandoId(null);
//                   setNuevo({ nombre: '', email: '', rol: '', password: '' });
//                 }}
//               >
//                 Cancelar
//               </button>
//             )}
//           </div>
//         </form>
//       )}

//       <h4 className="mt-4">Listado de usuarios</h4>

//       <div className="table-responsive">
//         <table className="table table-striped table-bordered align-middle w-100">
//           <thead className="table-dark">
//             <tr>
//               <th>Nombre</th>
//               <th>Email</th>
//               <th>Rol</th>
//               <th>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {usuarios.map((u) => (
//               <tr key={u._id}>
//                 <td>{u.nombre}</td>
//                 <td>{u.email}</td>
//                 <td>{u.rol}</td>
//                 <td>
//                   {!soloLectura && (
//                     <>
//                       <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(u)}>Editar</button>
//                       <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(u._id)}>Eliminar</button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Usuarios;
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Cambio aquí para Vite

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', rol: '', password: '' });
  const [editandoId, setEditandoId] = useState(null);

  const rol = localStorage.getItem('rol'); // Obtener el rol del usuario logueado
  const soloLectura = rol === 'visitante'; // Determina si es solo lectura

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/usuarios`); // Añadí /api
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
    }
  };

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datos = { ...nuevo };
      if (editandoId) {
        const { _id, ...datosSinId } = datos;
        const res = await axios.put(`${API_URL}/api/usuarios/${editandoId}`, datosSinId);
        setUsuarios(usuarios.map(u => u._id === editandoId ? res.data : u));
        setEditandoId(null);
      } else {
        const res = await axios.post(`${API_URL}/api/usuarios`, datos);
        setUsuarios([...usuarios, res.data]);
      }
      setNuevo({ nombre: '', email: '', rol: '', password: '' });
    } catch (err) {
      console.error('Error al guardar usuario:', err);
    }
  };

  const handleEditar = (usuario) => {
    setNuevo(usuario);
    setEditandoId(usuario._id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await axios.delete(`${API_URL}/api/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u._id !== id));
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  return (
    <div className="container-fluid p-3">
      <h2 className="mb-4">Usuarios</h2>

      {!soloLectura && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row g-3">
            {['nombre', 'email', 'password'].map((campo) => (
              <div className="col-12 col-md-6" key={campo}>
                <label className="form-label">{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                <input
                  type={campo === 'password' ? 'password' : 'text'}
                  className="form-control"
                  name={campo}
                  value={nuevo[campo]}
                  onChange={handleChange}
                  required
                />
              </div>
            ))}

            <div className="col-12 col-md-6">
              <label className="form-label">Rol</label>
              <select
                className="form-control"
                name="rol"
                value={nuevo.rol}
                onChange={handleChange}
                required
              >
                <option value="">Seleccionar rol</option>
                <option value="administrador">Administrador</option>
                <option value="visitante">Visitante</option>
              </select>
            </div>
          </div>

          <div className="mt-3">
            <button type="submit" className="btn btn-success me-2">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditandoId(null);
                  setNuevo({ nombre: '', email: '', rol: '', password: '' });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      <h4 className="mt-4">Listado de usuarios</h4>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u._id}>
                <td>{u.nombre}</td>
                <td>{u.email}</td>
                <td>{u.rol}</td>
                <td>
                  {!soloLectura && (
                    <>
                      <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(u)}>Editar</button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(u._id)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;

