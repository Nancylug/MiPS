import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [nuevo, setNuevo] = useState({
    nombre: '',
    categoria: '',
    precio: '',
    descripcion: '',
    cantidad: '',
    proveedor: ''
  });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/productos');
      setProductos(res.data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

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
        const res = await axios.put(`http://localhost:3001/api/productos/${editandoId}`, datosSinId);
        const actualizado = await axios.get('http://localhost:3001/api/productos'); // para traer populate
        setProductos(actualizado.data);
        setEditandoId(null);
      } else {
        const res = await axios.post('http://localhost:3001/api/productos', nuevo);
        const actualizado = await axios.get('http://localhost:3001/api/productos');
        setProductos(actualizado.data);
      }

      setNuevo({
        nombre: '',
        categoria: '',
        precio: '',
        descripcion: '',
        cantidad: '',
        proveedor: ''
      });
    } catch (err) {
      console.error('Error al guardar producto:', err);
    }
  };

  const handleEditar = (prod) => {
    setNuevo({
      ...prod,
      proveedor: prod.proveedor?._id || ''
    });
    setEditandoId(prod._id);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await axios.delete(`http://localhost:3001/api/productos/${id}`);
        setProductos(productos.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error al eliminar producto:', err);
      }
    }
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Productos</h2>

      <form onSubmit={handleSubmit} className="row g-3">
        {['nombre', 'categoria', 'precio', 'descripcion', 'cantidad'].map((campo) => (
          <div className="col-md-6" key={campo}>
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

        <div className="col-md-6">
          <label className="form-label">Proveedor</label>
          <select
            className="form-select"
            name="proveedor"
            value={nuevo.proveedor}
            onChange={handleChange}
          >
            <option value="">Seleccione un proveedor</option>
            {proveedores.map((prov) => (
              <option key={prov._id} value={prov._id}>
                {prov.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="col-12">
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
                  categoria: '',
                  precio: '',
                  descripcion: '',
                  cantidad: '',
                  proveedor: ''
                });
              }}
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      <h4 className="mt-5">Listado de productos</h4>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle w-100">
          <thead className="table-dark">
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Proveedor</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((prod) => (
              <tr key={prod._id}>
                <td style={{ wordWrap: 'break-word', maxWidth: '150px' }}>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>{prod.precio}</td>
                <td style={{ wordWrap: 'break-word', maxWidth: '200px' }}>{prod.descripcion}</td>
                <td>{prod.cantidad}</td>
                <td>{prod.proveedor?.nombre || 'Sin proveedor'}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditar(prod)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleEliminar(prod._id)}
                  >
                    Eliminar
                  </button>
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


