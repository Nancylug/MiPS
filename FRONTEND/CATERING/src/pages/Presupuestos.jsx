import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';

const Presupuestos = () => {

  const [presupuestos, setPresupuestos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [menus, setMenus] = useState([]);

  const [nuevo, setNuevo] = useState({
    cliente: '',
    fechaEvento: '',
    cantidadPersonas: '',
    observaciones: '',
    menus: []
  });

  const [editandoId, setEditandoId] = useState(null);

  const rol = localStorage.getItem('rol');

  const soloLectura = rol === 'visitante';

  useEffect(() => {

    obtenerPresupuestos();
    obtenerClientes();
    obtenerMenus();

  }, []);

  // =====================================
  // OBTENER PRESUPUESTOS
  // =====================================

  const obtenerPresupuestos = async () => {

    try {

      const res = await axios.get('/presupuestos');

      setPresupuestos(res.data);

    } catch (error) {

      console.error(
        'Error al obtener presupuestos:',
        error
      );
    }
  };

  // =====================================
  // OBTENER CLIENTES
  // =====================================

  const obtenerClientes = async () => {

    try {

      const res = await axios.get('/clientes');

      setClientes(res.data);

    } catch (error) {

      console.error(
        'Error al obtener clientes:',
        error
      );
    }
  };

  // =====================================
  // OBTENER MENUS
  // =====================================

  const obtenerMenus = async () => {

    try {

      const res = await axios.get('/menus');

      setMenus(res.data);

    } catch (error) {

      console.error(
        'Error al obtener menús:',
        error
      );
    }
  };

  // =====================================
  // HANDLE INPUTS
  // =====================================

  const handleChange = (e) => {

    setNuevo({

      ...nuevo,

      [e.target.name]: e.target.value

    });
  };

  // =====================================
  // AGREGAR MENU
  // =====================================

  const agregarMenu = () => {

    setNuevo({

      ...nuevo,

      menus: [

        ...nuevo.menus,

        {
          menu: '',
          cantidad: 1
        }
      ]
    });
  };

  // =====================================
  // CAMBIAR MENU
  // =====================================

  const handleMenuChange = (
    index,
    campo,
    valor
  ) => {

    const nuevosMenus =
      [...nuevo.menus];

    nuevosMenus[index][campo] =
      valor;

    setNuevo({

      ...nuevo,

      menus: nuevosMenus

    });
  };

  // =====================================
  // ELIMINAR MENU
  // =====================================

  const eliminarMenu = (index) => {

    const nuevosMenus =
      nuevo.menus.filter(
        (_, i) => i !== index
      );

    setNuevo({

      ...nuevo,

      menus: nuevosMenus

    });
  };

  // =====================================
  // CALCULAR TOTAL
  // =====================================

  const calcularTotal = () => {

    let total = 0;

    nuevo.menus.forEach((item) => {

      const menu =
        menus.find(
          (m) => m._id === item.menu
        );

      if (menu) {

        total +=
          menu.precioVenta *
          Number(item.cantidad);

      }
    });

    return total;
  };

  // =====================================
  // GUARDAR
  // =====================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (soloLectura) return;

    try {

      const datos = {

        ...nuevo,

        cantidadPersonas:
          Number(
            nuevo.cantidadPersonas
          ),

        menus:
          nuevo.menus.map(
            (m) => ({

              menu: m.menu,

              cantidad:
                Number(m.cantidad)

            })
          )
      };

      if (editandoId) {

        await axios.put(
          `/presupuestos/${editandoId}`,
          datos
        );

      } else {

        await axios.post(
          '/presupuestos',
          datos
        );
      }

      obtenerPresupuestos();

      resetFormulario();

    } catch (error) {

      console.error(
        'Error al guardar presupuesto:',
        error
      );
    }
  };

  // =====================================
  // EDITAR
  // =====================================

  const handleEditar = (presupuesto) => {

    setNuevo({

      cliente:
        presupuesto.cliente?._id || '',

      fechaEvento:
        presupuesto.fechaEvento
          ?.split('T')[0] || '',

      cantidadPersonas:
        presupuesto.cantidadPersonas || '',

      observaciones:
        presupuesto.observaciones || '',

      menus:
        presupuesto.menus.map(
          (m) => ({

            menu:
              m.menu?._id || '',

            cantidad:
              m.cantidad || 1

          })
        )
    });

    setEditandoId(
      presupuesto._id
    );
  };

  // =====================================
  // ELIMINAR
  // =====================================

  const handleEliminar = async (id) => {

    if (soloLectura) return;

    const confirmar =
      window.confirm(
        '¿Eliminar presupuesto?'
      );

    if (!confirmar) return;

    try {

      await axios.delete(
        `/presupuestos/${id}`
      );

      obtenerPresupuestos();

    } catch (error) {

      console.error(
        'Error al eliminar presupuesto:',
        error
      );
    }
  };

  // =====================================
  // RESET
  // =====================================

  const resetFormulario = () => {

    setNuevo({

      cliente: '',
      fechaEvento: '',
      cantidadPersonas: '',
      observaciones: '',
      menus: []

    });

    setEditandoId(null);
  };

  // =====================================
  // RENDER
  // =====================================

  return (

    <div className="container my-4">

      <h2 className="mb-4">
        Presupuestos
      </h2>

      {!soloLectura && (

        <form
          onSubmit={handleSubmit}
          className="row g-3"
        >

          {/* CLIENTE */}

          <div className="col-md-6">

            <label className="form-label">
              Cliente
            </label>

            <select
              className="form-select"
              name="cliente"
              value={nuevo.cliente}
              onChange={handleChange}
              required
            >

              <option value="">
                Seleccione cliente
              </option>

              {clientes.map((cliente) => (

                <option
                  key={cliente._id}
                  value={cliente._id}
                >

                  {cliente.nombre}

                </option>

              ))}

            </select>

          </div>

          {/* FECHA */}

          <div className="col-md-3">

            <label className="form-label">
              Fecha evento
            </label>

            <input
              type="date"
              className="form-control"
              name="fechaEvento"
              value={nuevo.fechaEvento}
              onChange={handleChange}
              required
            />

          </div>

          {/* PERSONAS */}

          <div className="col-md-3">

            <label className="form-label">
              Cantidad personas
            </label>

            <input
              type="number"
              className="form-control"
              name="cantidadPersonas"
              value={nuevo.cantidadPersonas}
              onChange={handleChange}
              required
            />

          </div>

          {/* OBSERVACIONES */}

          <div className="col-md-12">

            <label className="form-label">
              Observaciones
            </label>

            <textarea
              className="form-control"
              name="observaciones"
              value={nuevo.observaciones}
              onChange={handleChange}
            />

          </div>

          {/* MENUS */}

          <div className="col-12">

            <h4 className="mt-4">
              Menús
            </h4>

            {nuevo.menus.map(
              (item, index) => {

                const menu =
                  menus.find(
                    (m) =>
                      m._id === item.menu
                  );

                const subtotal =
                  menu
                    ? (
                        menu.precioVenta *
                        Number(item.cantidad)
                      ).toFixed(2)
                    : 0;

                return (

                  <div
                    className="row mb-2"
                    key={index}
                  >

                    {/* MENU */}

                    <div className="col-md-5">

                      <select
                        className="form-select"
                        value={item.menu}
                        onChange={(e) =>
                          handleMenuChange(
                            index,
                            'menu',
                            e.target.value
                          )
                        }
                        required
                      >

                        <option value="">
                          Seleccione menú
                        </option>

                        {menus.map((menu) => (

                          <option
                            key={menu._id}
                            value={menu._id}
                          >

                            {menu.nombre}

                          </option>

                        ))}

                      </select>

                    </div>

                    {/* CANTIDAD */}

                    <div className="col-md-2">

                      <input
                        type="number"
                        className="form-control"
                        placeholder="Cantidad"
                        value={item.cantidad}
                        onChange={(e) =>
                          handleMenuChange(
                            index,
                            'cantidad',
                            e.target.value
                          )
                        }
                        required
                      />

                    </div>

                    {/* PRECIO */}

                    <div className="col-md-2">

                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={
                          menu
                            ? `$${menu.precioVenta}`
                            : ''
                        }
                      />

                    </div>

                    {/* SUBTOTAL */}

                    <div className="col-md-2">

                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={`$${subtotal}`}
                      />

                    </div>

                    {/* ELIMINAR */}

                    <div className="col-md-1">

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          eliminarMenu(index)
                        }
                      >
                        X
                      </button>

                    </div>

                  </div>
                );
              }
            )}

            <button
              type="button"
              className="btn btn-secondary mt-2"
              onClick={agregarMenu}
            >
              + Agregar menú
            </button>

          </div>

          {/* TOTAL */}

          <div className="col-12 mt-4">

            <div className="card p-3">

              <h5>
                Total Presupuesto
              </h5>

              <h3>
                $
                {calcularTotal()
                  .toFixed(2)}
              </h3>

            </div>

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
        Listado de presupuestos
      </h4>

      <div className="table-responsive">

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>

              <th>Cliente</th>

              <th>Fecha</th>

              <th>Personas</th>

              <th>Total</th>

              <th>Estado</th>

              {!soloLectura &&
                <th>Acciones</th>
              }

            </tr>

          </thead>

          <tbody>

            {presupuestos.map(
              (presupuesto) => (

                <tr
                  key={presupuesto._id}
                >

                  <td>
                    {
                      presupuesto
                        .cliente?.nombre
                    }
                  </td>

                  <td>
                    {
                      new Date(
                        presupuesto.fechaEvento
                      )
                      .toLocaleDateString()
                    }
                  </td>

                  <td>
                    {
                      presupuesto.cantidadPersonas
                    }
                  </td>

                  <td>
                    $
                    {
                      presupuesto.total
                    }
                  </td>

                  <td>
                    {
                      presupuesto.estado
                    }
                  </td>

                  {!soloLectura && (

                    <td>

                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() =>
                          handleEditar(
                            presupuesto
                          )
                        }
                      >
                        Editar
                      </button>

                      <button
                        className="btn btn-danger btn-sm ms-2"
                        onClick={() =>
                          handleEliminar(
                            presupuesto._id
                          )
                        }
                      >
                        Eliminar
                      </button>

                    </td>

                  )}

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default Presupuestos;