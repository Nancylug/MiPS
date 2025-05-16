import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  const rol = localStorage.getItem('rol'); // obtener rol
  const soloLectura = rol === 'visitante'; // solo lectura para visitantes

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/clientes');
      setClientes(res.data);
    } catch (err) {
      console.error('Error al obtener clientes:', err);
    }
  };

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editandoId) {
        const res = await axios.put(`http://localhost:3001/api/clientes/${editandoId}`, nuevo);
        setClientes(clientes.map(c => c._id === editandoId ? res.data : c));
        setEditandoId(null);
      } else {
        const res = await axios.post('http://localhost:3001/api/clientes', nuevo);
        setClientes([...clientes, res.data]);
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
        await axios.delete(`http://localhost:3001/api/clientes/${id}`);
        setClientes(clientes.filter(c => c._id !== id));
      } catch (err) {
        console.error('Error al eliminar cliente:', err);
      }
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const fecha = new Date().toLocaleDateString();

    const img = new Image();
    img.src = '/assets/logo.png'; // debe estar en public/assets/logo.png

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
      <h2>Clientes</h2>

      {!soloLectura && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="row">
            {['nombre', 'email', 'telefono', 'direccion'].map((campo) => (
              <div className="col-md-6 mb-3" key={campo}>
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
                setNuevo({ nombre: '', email: '', telefono: '', direccion: '' });
              }}
            >
              Cancelar
            </button>
          )}
        </form>
      )}

      <div className="mb-3 text-start">
        <button className="btn btn-primary" onClick={generarPDF}>
          Descargar PDF
        </button>
      </div>

      <h4>Listado de Clientes</h4>
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
                  <>
                    <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(cliente)}>
                      Editar
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(cliente._id)}>
                      Eliminar
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Clientes;
