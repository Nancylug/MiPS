import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    rubro: '',
    telefono: '',
    email: '',
    direccion: '',
    observaciones: ''
  });

  const [editandoId, setEditandoId] = useState(null);
  const rol = localStorage.getItem('rol');
  const soloLectura = rol === 'visitante';

  // Estado para mensaje de éxito
  const [mensajeExito, setMensajeExito] = useState('');
  const [showModal, setShowModal] = useState(false);

  const mostrarModal = (mensaje) => {
    setMensajeExito(mensaje);
    setShowModal(true);
  };

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get('/proveedores');
      setProveedores(res.data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
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
        const res = await axios.put(`/proveedores/${editandoId}`, datosSinId);
        setProveedores(proveedores.map(p => p._id === editandoId ? res.data : p));
        setEditandoId(null);
        mostrarModal('Proveedor actualizado con éxito.');
      } else {
        const res = await axios.post('/proveedores', nuevo);
        setProveedores([...proveedores, res.data]);
        mostrarModal('Proveedor guardado con éxito.');
      }
      setNuevo({
        nombre: '',
        rubro: '',
        telefono: '',
        email: '',
        direccion: '',
        observaciones: ''
      });
    } catch (err) {
      console.error('Error al guardar proveedor:', err);
    }
  };

  const handleEditar = (prov) => {
    setNuevo(prov);
    setEditandoId(prov._id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proveedor?')) {
      try {
        await axios.delete(`/proveedores/${id}`);
        setProveedores(proveedores.filter(p => p._id !== id));
        mostrarModal('Proveedor eliminado con éxito.');
      } catch (err) {
        console.error('Error al eliminar proveedor:', err);
      }
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = '/assets/logo.png';

    logo.onload = () => {
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text('Listado de Proveedores', 50, 20);

      const fecha = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado el: ${fecha}`, 50, 28);

      autoTable(doc, {
        startY: 50,
        head: [['Nombre', 'Rubro', 'Teléfono', 'Email', 'Dirección', 'Observaciones']],
        body: proveedores.map(p => [
          p.nombre,
          p.rubro,
          p.telefono,
          p.email,
          p.direccion,
          p.observaciones
        ]),
        styles: { fontSize: 9 }
      });

      doc.save('proveedores.pdf');
    };
  };

  return (
    <div className="container">
      <h2>Proveedores</h2>

      {!soloLectura && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            {['nombre', 'rubro', 'telefono', 'email', 'direccion', 'observaciones'].map((campo) => (
              <div className="col-12 col-md-6 mb-3" key={campo}>
                <label className="form-label">
                  {campo.charAt(0).toUpperCase() + campo.slice(1)}
                </label>
                <input
                  type="text"
                  className="form-control"
                  name={campo}
                  value={nuevo[campo]}
                  onChange={handleChange}
                />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-success">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={() => {
                setEditandoId(null);
                setNuevo({
                  nombre: '',
                  rubro: '',
                  telefono: '',
                  email: '',
                  direccion: '',
                  observaciones: ''
                });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className="mb-3">
        <button className="btn btn-primary" onClick={generarPDF}>
          Descargar PDF
        </button>
      </div>

      <h4>Listado</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Rubro</th>
              <th>Teléfono</th>
              <th>Email</th>
              <th>Dirección</th>
              <th>Observaciones</th>
              {!soloLectura && <th>Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {proveedores.map((prov) => (
              <tr key={prov._id}>
                <td>{prov.nombre}</td>
                <td>{prov.rubro}</td>
                <td>{prov.telefono}</td>
                <td>{prov.email}</td>
                <td>{prov.direccion}</td>
                <td>{prov.observaciones}</td>
                {!soloLectura && (
                  <td>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(prov)}>Editar</button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prov._id)}>Eliminar</button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Éxito */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Éxito</h5>
              </div>
              <div className="modal-body">
                <p>{mensajeExito}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-success" onClick={() => setShowModal(false)}>
                  Aceptar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proveedores;
