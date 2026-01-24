import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevo, setNuevo] = useState({ nombre: '', email: '', rol: '', password: '' });
  const [editandoId, setEditandoId] = useState(null);
  const [mensajeModal, setMensajeModal] = useState(''); // <-- Estado para el mensaje del modal

  const rol = localStorage.getItem('rol'); // Obtener el rol del usuario logueado
  const soloLectura = rol === 'visitante'; // Determina si es solo lectura

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const obtenerUsuarios = async () => {
    try {
      const res = await axios.get('/usuarios');
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
      if (editandoId) {
        const { _id, ...datosSinId } = nuevo;
        const res = await axios.put(`/usuarios/${editandoId}`, datosSinId);
        setUsuarios(usuarios.map(u => u._id === editandoId ? res.data : u));
        setEditandoId(null);
        setMensajeModal('Modificación exitosa'); // <-- Mostrar mensaje
      } else {
        const res = await axios.post('/usuarios', nuevo);
        setUsuarios([...usuarios, res.data]);
        setMensajeModal('Alta exitosa'); // <-- Mostrar mensaje
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
        await axios.delete(`/usuarios/${id}`);
        setUsuarios(usuarios.filter(u => u._id !== id));
        setMensajeModal('Baja exitosa'); // <-- Mostrar mensaje
      } catch (err) {
        console.error('Error al eliminar usuario:', err);
      }
    }
  };

  // Función para cerrar el modal
  const cerrarModal = () => {
    setMensajeModal('');
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
                />
              </div>
            ))}

            <div className="col-12 col-md-6">
              <label className="form-label"><strong>Rol</strong></label>
              <select
                className="form-control"
                name="rol"
                value={nuevo.rol}
                onChange={handleChange}
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

      {/* Modal simple */}
      {mensajeModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          tabIndex="-1"
          role="dialog"
          onClick={cerrarModal}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()} // para que no cierre si clickeas dentro del modal
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Mensaje</h5>
                <button type="button" className="btn-close" onClick={cerrarModal}></button>
              </div>
              <div className="modal-body">
                <p>{mensajeModal}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-success" onClick={cerrarModal}>Aceptar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Usuarios;
