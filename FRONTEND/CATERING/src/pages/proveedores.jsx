import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/proveedores');
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
        const res = await axios.put(`http://localhost:3001/api/proveedores/${editandoId}`, datosSinId);
        setProveedores(proveedores.map(p => p._id === editandoId ? res.data : p));
        setEditandoId(null);
      } else {
        const res = await axios.post('http://localhost:3001/api/proveedores', nuevo);
        setProveedores([...proveedores, res.data]);
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
        await axios.delete(`http://localhost:3001/api/proveedores/${id}`);
        setProveedores(proveedores.filter(p => p._id !== id));
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
      // Logo (x, y, width, height)
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);

      // Título y fecha
      doc.setFontSize(16);
      doc.text('Listado de Proveedores', 50, 20);

      const fecha = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado el: ${fecha}`, 50, 28);

      // Tabla
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
    <div>
      <h2>Proveedores</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          {['nombre', 'rubro', 'telefono', 'email', 'direccion', 'observaciones'].map((campo) => (
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

      <div className="mb-3">
        <button className="btn btn-primary" onClick={generarPDF}>
          Descargar PDF
        </button>
      </div>

      <h4>Listado</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nombre</th>
            <th>Rubro</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Observaciones</th>
            <th>Acciones</th>
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
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditar(prov)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleEliminar(prov._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Proveedores;
