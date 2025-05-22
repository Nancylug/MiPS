import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: ''
  });
  const [editandoId, setEditandoId] = useState(null);
  const [mensajeExito, setMensajeExito] = useState('');
  const [showModal, setShowModal] = useState(false);

  const rol = localStorage.getItem('rol');
  const soloLectura = rol === 'visitante';

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get('/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const mostrarModal = (mensaje) => {
    setMensajeExito(mensaje);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const res = await axios.put(`/clientes/${editandoId}`, nuevo);
        setClientes(clientes.map(c => c._id === editandoId ? res.data : c));
        mostrarModal('Cliente actualizado con éxito.');
        setEditandoId(null);
      } else {
        const res = await axios.post('/clientes', nuevo);
        setClientes([...clientes, res.data]);
        mostrarModal('Cliente guardado con éxito.');
      }
      setNuevo({ nombre: '', email: '', telefono: '', direccion: '' });
    } catch (err) {
      console.error('Error al guardar cliente:', err);
    }
  };

  const handleEditar = (cliente) => {
    setNuevo(cliente);
    setEditandoId(cliente._id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await axios.delete(`/clientes/${id}`);
        setClientes(clientes.filter(c => c._id !== id));
        mostrarModal('Cliente eliminado con éxito.');
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
      }
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    const img = new Image();
    img.src = '/assets/logo.png';

    img.onload = () => {
      doc.addImage(img, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text('Listado de Clientes', 50, 20);
      doc.setFontSize(10);
      doc.text(`Fecha: ${fecha}`, 50, 28);

      autoTable(doc, {
        startY: 45,
        head: [['Nombre', 'Email', 'Teléfono', 'Dirección']],
        body: clientes.map(cliente => [
          cliente.nombre,
          cliente.email,
          cliente.telefono,
          cliente.direccion
        ])
      });

      doc.save('clientes.pdf');
    };
  };

  return (
    <div className="container my-4">
      <h2 className="text-center text-md-start">Clientes</h2>

      {!soloLectura && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            {['nombre', 'email', 'telefono', 'direccion'].map((campo) => (
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

          <div className="d-flex flex-column flex-md-row gap-2">
            <button type="submit" className="btn btn-success">
              {editandoId ? 'Actualizar' : 'Guardar'}
            </button>
            {editandoId && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setEditandoId(null);
                  setNuevo({ nombre: '', email: '', telefono: '', direccion: '' });
                }}
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mb-3 text-start">
        <button className="btn btn-primary" onClick={generarPDF}>
          Descargar PDF
        </button>
      </div>

      <h4 className="text-center text-md-start">Listado de Clientes</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Dirección</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr key={cliente._id}>
                <td>{cliente.nombre}</td>
                <td>{cliente.email}</td>
                <td>{cliente.telefono}</td>
                <td>{cliente.direccion}</td>
                <td>
                  {!soloLectura && (
                    <div className="d-flex flex-column flex-md-row gap-1">
                      <button className="btn btn-warning btn-sm" onClick={() => handleEditar(cliente)}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(cliente._id)}>
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                <button
                  className="btn btn-success"
                  onClick={() => setShowModal(false)}
                >
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

export default Clientes;
