import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';

const Menus = () => {

  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    rendimientoPersonas: '',
    ingredientes: []
  });

  const [editandoId, setEditandoId] = useState(null);

  const rol = localStorage.getItem('rol');
  const soloLectura = rol === 'visitante';

  useEffect(() => {
    obtenerMenus();
    obtenerProductos();
  }, []);

  // =========================
  // OBTENER MENUS
  // =========================

  const obtenerMenus = async () => {
    try {
      const res = await axios.get('/menus');
      setMenus(res.data);
    } catch (error) {
      console.error('Error al obtener menús:', error);
    }
  };

  // =========================
  // OBTENER PRODUCTOS
  // =========================

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  // =========================
  // HANDLE INPUTS NORMALES
  // =========================

  const handleChange = (e) => {
    setNuevo({
      ...nuevo,
      [e.target.name]: e.target.value
    });
  };

  // =========================
  // AGREGAR INGREDIENTE
  // =========================

  const agregarIngrediente = () => {

    setNuevo({
      ...nuevo,
      ingredientes: [
        ...nuevo.ingredientes,
        {
          producto: '',
          cantidad: ''
        }
      ]
    });
  };

  // =========================
  // CAMBIAR INGREDIENTE
  // =========================

  const handleIngredienteChange = (
    index,
    campo,
    valor
  ) => {

    const nuevosIngredientes =
      [...nuevo.ingredientes];

    nuevosIngredientes[index][campo] = valor;

    setNuevo({
      ...nuevo,
      ingredientes: nuevosIngredientes
    });
  };

  // =========================
  // ELIMINAR INGREDIENTE
  // =========================

  const eliminarIngrediente = (index) => {

    const nuevosIngredientes =
      nuevo.ingredientes.filter(
        (_, i) => i !== index
      );

    setNuevo({
      ...nuevo,
      ingredientes: nuevosIngredientes
    });
  };

  // =========================
  // GUARDAR MENU
  // =========================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (soloLectura) return;

    try {

      const datos = {
        ...nuevo,
        rendimientoPersonas: Number(
          nuevo.rendimientoPersonas
        ),
        ingredientes: nuevo.ingredientes.map((ing) => ({
          producto: ing.producto,
          cantidad: Number(ing.cantidad)
        }))
      };

      if (editandoId) {

        await axios.put(
          `/menus/${editandoId}`,
          datos
        );

      } else {

        await axios.post(
          '/menus',
          datos
        );
      }

      obtenerMenus();

      resetFormulario();

    } catch (error) {

      console.error(
        'Error al guardar menú:',
        error
      );
    }
  };

  // =========================
  // EDITAR MENU
  // =========================

  const handleEditar = (menu) => {

    setNuevo({
      nombre: menu.nombre || '',
      descripcion: menu.descripcion || '',
      rendimientoPersonas:
        menu.rendimientoPersonas || '',

      ingredientes:
        menu.ingredientes.map((ing) => ({
          producto: ing.producto?._id || '',
          cantidad: ing.cantidad || ''
        }))
    });

    setEditandoId(menu._id);
  };

  // =========================
  // ELIMINAR MENU
  // =========================

  const handleEliminar = async (id) => {

    if (soloLectura) return;

    const confirmar = window.confirm(
      '¿Eliminar menú?'
    );

    if (!confirmar) return;

    try {

      await axios.delete(`/menus/${id}`);

      obtenerMenus();

    } catch (error) {

      console.error(
        'Error al eliminar menú:',
        error
      );
    }
  };

  // =========================
  // RESET
  // =========================

  const resetFormulario = () => {

    setNuevo({
      nombre: '',
      descripcion: '',
      rendimientoPersonas: '',
      ingredientes: []
    });

    setEditandoId(null);
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="container my-4">

      <h2 className="mb-4">
        Menús
      </h2>

      {!soloLectura && (

        <form
          onSubmit={handleSubmit}
          className="row g-3"
        >

          {/* NOMBRE */}

          <div className="col-md-6">

            <label className="form-label">
              Nombre
            </label>

            <input
              type="text"
              className="form-control"
              name="nombre"
              value={nuevo.nombre}
              onChange={handleChange}
              required
            />

          </div>

          {/* RENDIMIENTO */}

          <div className="col-md-6">

            <label className="form-label">
              Rinde para
            </label>

            <input
              type="number"
              className="form-control"
              name="rendimientoPersonas"
              value={nuevo.rendimientoPersonas}
              onChange={handleChange}
              required
            />

          </div>

          {/* DESCRIPCION */}

          <div className="col-md-12">

            <label className="form-label">
              Descripción
            </label>

            <textarea
              className="form-control"
              name="descripcion"
              value={nuevo.descripcion}
              onChange={handleChange}
            />

          </div>

          {/* INGREDIENTES */}

          <div className="col-12">

            <h4 className="mt-4">
              Ingredientes
            </h4>

            {nuevo.ingredientes.map(
              (ing, index) => (

                <div
                  className="row mb-2"
                  key={index}
                >

                  {/* PRODUCTO */}

                  <div className="col-md-6">

                    <select
                      className="form-select"
                      value={ing.producto}
                      onChange={(e) =>
                        handleIngredienteChange(
                          index,
                          'producto',
                          e.target.value
                        )
                      }
                      required
                    >

                      <option value="">
                        Seleccione producto
                      </option>

                      {productos.map((prod) => (

                        <option
                          key={prod._id}
                          value={prod._id}
                        >
                          {prod.nombre}
                          {' '}
                          ({prod.unidad})
                        </option>

                      ))}

                    </select>

                  </div>

                  {/* CANTIDAD */}

                  <div className="col-md-4">

                    <input
                      type="number"
                      className="form-control"
                      placeholder="Cantidad"
                      value={ing.cantidad}
                      onChange={(e) =>
                        handleIngredienteChange(
                          index,
                          'cantidad',
                          e.target.value
                        )
                      }
                      required
                    />

                  </div>

                  {/* ELIMINAR */}

                  <div className="col-md-2">

                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() =>
                        eliminarIngrediente(index)
                      }
                    >
                      X
                    </button>

                  </div>

                </div>
              )
            )}

            {/* AGREGAR */}

            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={agregarIngrediente}
            >
              + Agregar ingrediente
            </button>

          </div>

          {/* BOTONES */}

          <div className="col-12">

            <button
              type="submit"
              className="btn btn-success"
            >
              {editandoId
                ? 'Actualizar'
                : 'Guardar'}
            </button>

            {editandoId && (

              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={resetFormulario}
              >
                Cancelar
              </button>

            )}

          </div>

        </form>
      )}

      {/* TABLA */}

      <h4 className="mt-5">
        Listado de menús
      </h4>

      <div className="table-responsive">

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>

              <th>Nombre</th>
              <th>Descripción</th>
              <th>Rinde</th>
              <th>Ingredientes</th>

              {!soloLectura &&
                <th>Acciones</th>
              }

            </tr>

          </thead>

          <tbody>

            {menus.map((menu) => (

              <tr key={menu._id}>

                <td>{menu.nombre}</td>

                <td>
                  {menu.descripcion}
                </td>

                <td>
                  {menu.rendimientoPersonas}
                  {' '}personas
                </td>

                <td>

                  <ul>

                    {menu.ingredientes.map(
                      (ing, index) => (

                        <li key={index}>

                          {ing.producto?.nombre}
                          {' - '}
                          {ing.cantidad}
                          {' '}
                          {ing.producto?.unidad}

                        </li>
                      )
                    )}

                  </ul>

                </td>

                {!soloLectura && (

                  <td>

                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() =>
                        handleEditar(menu)
                      }
                    >
                      Editar
                    </button>

                    <button
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() =>
                        handleEliminar(menu._id)
                      }
                    >
                      Eliminar
                    </button>

                  </td>

                )}

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Menus;

