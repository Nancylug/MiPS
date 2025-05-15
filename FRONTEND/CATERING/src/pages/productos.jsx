import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = import.meta.env.VITE_API_URL; 

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    unidad: '',
    precioSinIVA: '',
    precioConIVA: '',
    categoria: '',
    proveedor: '',
    stock: '',
    fecha: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/productos`);
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/proveedores`);
      setProveedores(res.data);
    } catch (err) {
      console.error('Error al obtener proveedores:', err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'precioSinIVA') {
      const precioSinIVA = parseFloat(e.target.value);
      setNuevo({
        ...nuevo,
        precioSinIVA,
        precioConIVA: precioSinIVA ? (precioSinIVA * 1.21).toFixed(2) : ''
      });
    } else {
      setNuevo({ ...nuevo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const datos = {
        ...nuevo,
        precioSinIVA: parseFloat(nuevo.precioSinIVA),
        precioConIVA: parseFloat(nuevo.precioConIVA),
        stock: parseInt(nuevo.stock),
        fecha: nuevo.fecha || new Date().toISOString()
      };

      if (!datos.proveedor) {
        alert('Debe seleccionar un proveedor');
        return;
      }

      if (editandoId) {
        await axios.put(`${API_URL}/api/productos/${editandoId}`, datos);
      } else {
        await axios.post(`${API_URL}/api/productos`, datos);
      }

      await obtenerProductos();
      resetFormulario();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      alert('Error al guardar producto. Verifique los datos.');
    }
  };

  const handleEditar = (prod) => {
    setNuevo({
      nombre: prod.nombre || '',
      descripcion: prod.descripcion || '',
      unidad: prod.unidad || '',
      precioSinIVA: prod.precioSinIVA || '',
      precioConIVA: prod.precioConIVA || '',
      categoria: prod.categoria || '',
      proveedor: prod.proveedor?._id || '',
      stock: prod.stock || '',
      fecha: prod.fecha ? prod.fecha.split('T')[0] : ''
    });
    setEditandoId(prod._id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`${API_URL}/api/productos/${id}`);
        setProductos(productos.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error al eliminar producto:', err);
      }
    }
  };

  const resetFormulario = () => {
    setNuevo({
      nombre: '',
      descripcion: '',
      unidad: '',
      precioSinIVA: '',
      precioConIVA: '',
      categoria: '',
      proveedor: '',
      stock: '',
      fecha: ''
    });
    setEditandoId(null);
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const logo = new Image();
    logo.src = '/assets/logo.png';

    logo.onload = () => {
      doc.addImage(logo, 'PNG', 10, 10, 30, 30);
      doc.setFontSize(16);
      doc.text('Listado de Productos', 50, 20);

      const fecha = new Date().toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generado el: ${fecha}`, 50, 28);

      autoTable(doc, {
        startY: 50,
        head: [
          ['Nombre', 'Categoría', 'Precio Sin IVA', 'Precio Con IVA', 'Unidad', 'Descripción', 'Proveedor', 'Stock', 'Fecha']
        ],
        body: productos.map(p => [
          p.nombre,
          p.categoria,
          p.precioSinIVA,
          p.precioConIVA,
          p.unidad,
          p.descripcion,
          p.proveedor?.nombre,
          p.stock,
          new Date(p.fecha).toLocaleDateString()
        ]),
        styles: { fontSize: 9 }
      });

      doc.save('productos.pdf');
    };
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Productos</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Nombre</label>
          <input type="text" className="form-control" name="nombre" value={nuevo.nombre} onChange={handleChange} required />
        </div>

        <div className="col-md-6">
          <label className="form-label">Categoría</label>
          <input type="text" className="form-control" name="categoria" value={nuevo.categoria} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Precio Sin IVA</label>
          <input type="number" className="form-control" name="precioSinIVA" value={nuevo.precioSinIVA} onChange={handleChange} required min="0" step="0.01" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Precio Con IVA</label>
          <input type="number" className="form-control" name="precioConIVA" value={nuevo.precioConIVA} disabled />
        </div>

        <div className="col-md-6">
          <label className="form-label">Unidad</label>
          <select className="form-select" name="unidad" value={nuevo.unidad} onChange={handleChange} required>
            <option value="">Seleccione una unidad</option>
            <option value="kg">kg</option>
            <option value="unidad">unidad</option>
            <option value="litro">litro</option>
            <option value="paquete">paquete</option>
            <option value="molde">molde</option>
            <option value="bolson">bolson</option>
            <option value="jaula">jaula</option>
            <option value="bandeja">bandeja</option>
            <option value="bolsax400">bolsax400</option>
            <option value="caja">caja</option>
            <option value="bidonx5">bidonx5</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Descripción</label>
          <input type="text" className="form-control" name="descripcion" value={nuevo.descripcion} onChange={handleChange} />
        </div>

        <div className="col-md-6">
          <label className="form-label">Proveedor</label>
          <select className="form-select" name="proveedor" value={nuevo.proveedor} onChange={handleChange} required>
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov._id} value={prov._id}>{prov.nombre}</option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Stock</label>
          <input type="number" className="form-control" name="stock" value={nuevo.stock} onChange={handleChange} required min="0" />
        </div>

        <div className="col-md-6">
          <label className="form-label">Fecha</label>
          <input type="date" className="form-control" name="fecha" value={nuevo.fecha} onChange={handleChange} required />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-success">
            {editandoId ? 'Actualizar' : 'Guardar'}
          </button>
          {editandoId && (
            <button type="button" className="btn btn-secondary ms-2" onClick={resetFormulario}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <button className="btn btn-primary mt-4" onClick={generarPDF}>
        Descargar PDF
      </button>

      <h4 className="mt-5">Listado de productos</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio Sin IVA</th>
              <th>Precio Con IVA</th>
              <th>Unidad</th>
              <th>Descripción</th>
              <th>Proveedor</th>
              <th>Stock</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto._id}>
                <td>{producto.nombre}</td>
                <td>{producto.categoria}</td>
                <td>{producto.precioSinIVA}</td>
                <td>{producto.precioConIVA}</td>
                <td>{producto.unidad}</td>
                <td>{producto.descripcion}</td>
                <td>{producto.proveedor?.nombre}</td>
                <td>{producto.stock}</td>
                <td>{new Date(producto.fecha).toLocaleDateString()}</td>
                <td>
                  <button className="btn btn-warning btn-sm" onClick={() => handleEditar(producto)}>Editar</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => handleEliminar(producto._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Productos;



