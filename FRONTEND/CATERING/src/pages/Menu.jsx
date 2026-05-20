// import React, { useEffect, useState } from 'react';
// import axios from '../config/axiosInstance';

// const Menus = () => {

//   const [menus, setMenus] = useState([]);
//   const [productos, setProductos] = useState([]);

//   const [nuevo, setNuevo] = useState({
//     nombre: '',
//     descripcion: '',
//     rendimientoPersonas: '',
//     margenGanancia: 100,
//     ingredientes: []
//   });

//   const [editandoId, setEditandoId] = useState(null);

//   const rol = localStorage.getItem('rol');

//   const soloLectura = rol === 'visitante';

//   useEffect(() => {

//     obtenerMenus();

//     obtenerProductos();

//   }, []);

//   // =========================================
//   // OBTENER MENUS
//   // =========================================

//   const obtenerMenus = async () => {

//     try {

//       const res = await axios.get('/menus');

//       setMenus(res.data);

//     } catch (error) {

//       console.error(
//         'Error al obtener menús:',
//         error
//       );
//     }
//   };

//   // =========================================
//   // OBTENER PRODUCTOS
//   // =========================================

//   const obtenerProductos = async () => {

//     try {

//       const res = await axios.get('/productos');

//       setProductos(res.data);

//     } catch (error) {

//       console.error(
//         'Error al obtener productos:',
//         error
//       );
//     }
//   };

//   // =========================================
//   // HANDLE INPUTS
//   // =========================================

//   const handleChange = (e) => {

//     setNuevo({

//       ...nuevo,

//       [e.target.name]: e.target.value

//     });
//   };

//   // =========================================
//   // AGREGAR INGREDIENTE
//   // =========================================

//   const agregarIngrediente = () => {

//     setNuevo({

//       ...nuevo,

//       ingredientes: [

//         ...nuevo.ingredientes,

//         {
//           producto: '',
//           cantidad: ''
//         }
//       ]
//     });
//   };

//   // =========================================
//   // CAMBIAR INGREDIENTE
//   // =========================================

//   const handleIngredienteChange = (
//     index,
//     campo,
//     valor
//   ) => {

//     const nuevosIngredientes =
//       [...nuevo.ingredientes];

//     nuevosIngredientes[index][campo] =
//       valor;

//     setNuevo({

//       ...nuevo,

//       ingredientes: nuevosIngredientes

//     });
//   };

//   // =========================================
//   // ELIMINAR INGREDIENTE
//   // =========================================

//   const eliminarIngrediente = (index) => {

//     const nuevosIngredientes =
//       nuevo.ingredientes.filter(
//         (_, i) => i !== index
//       );

//     setNuevo({

//       ...nuevo,

//       ingredientes: nuevosIngredientes

//     });
//   };

//   // =========================================
//   // CALCULAR COSTO TOTAL
//   // =========================================

//   const calcularCostoTotal = () => {

//     let total = 0;

//     nuevo.ingredientes.forEach((ing) => {

//       const producto =
//         productos.find(
//           (p) => p._id === ing.producto
//         );

//       if (producto) {

//         total +=
//           producto.precioConIVA *
//           Number(ing.cantidad);

//       }
//     });

//     return total;
//   };

//   // =========================================
//   // CALCULAR PRECIO VENTA
//   // =========================================

//   const calcularPrecioVenta = () => {

//     const costo = calcularCostoTotal();

//     const margen =
//       Number(nuevo.margenGanancia) || 0;

//     return (
//       costo *
//       (1 + margen / 100)
//     );
//   };

//   // =========================================
//   // GUARDAR MENU
//   // =========================================

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (soloLectura) return;

//     try {

//       const datos = {

//         ...nuevo,

//         rendimientoPersonas:
//           Number(
//             nuevo.rendimientoPersonas
//           ),

//         margenGanancia:
//           Number(
//             nuevo.margenGanancia
//           ),

//         ingredientes:
//           nuevo.ingredientes.map(
//             (ing) => ({

//               producto:
//                 ing.producto,

//               cantidad:
//                 Number(
//                   ing.cantidad
//                 )
//             })
//           )
//       };

//       if (editandoId) {

//         await axios.put(
//           `/menus/${editandoId}`,
//           datos
//         );

//       } else {

//         await axios.post(
//           '/menus',
//           datos
//         );
//       }

//       obtenerMenus();

//       resetFormulario();

//     } catch (error) {

//       console.error(
//         'Error al guardar menú:',
//         error
//       );
//     }
//   };

//   // =========================================
//   // EDITAR
//   // =========================================

//   const handleEditar = (menu) => {

//     setNuevo({

//       nombre:
//         menu.nombre || '',

//       descripcion:
//         menu.descripcion || '',

//       rendimientoPersonas:
//         menu.rendimientoPersonas || '',

//       margenGanancia:
//         menu.margenGanancia || 100,

//       ingredientes:
//         menu.ingredientes.map(
//           (ing) => ({

//             producto:
//               ing.producto?._id || '',

//             cantidad:
//               ing.cantidad || ''

//           })
//         )
//     });

//     setEditandoId(menu._id);
//   };

//   // =========================================
//   // ELIMINAR
//   // =========================================

//   const handleEliminar = async (id) => {

//     if (soloLectura) return;

//     const confirmar =
//       window.confirm(
//         '¿Eliminar menú?'
//       );

//     if (!confirmar) return;

//     try {

//       await axios.delete(
//         `/menus/${id}`
//       );

//       obtenerMenus();

//     } catch (error) {

//       console.error(
//         'Error al eliminar menú:',
//         error
//       );
//     }
//   };

//   // =========================================
//   // RESET
//   // =========================================

//   const resetFormulario = () => {

//     setNuevo({

//       nombre: '',

//       descripcion: '',

//       rendimientoPersonas: '',

//       margenGanancia: 100,

//       ingredientes: []

//     });

//     setEditandoId(null);
//   };

//   // =========================================
//   // RENDER
//   // =========================================

//   return (

//     <div className="container my-4">

//       <h2 className="mb-4">
//         Menús
//       </h2>

//       {!soloLectura && (

//         <form
//           onSubmit={handleSubmit}
//           className="row g-3"
//         >

//           {/* NOMBRE */}

//           <div className="col-md-6">

//             <label className="form-label">
//               Nombre
//             </label>

//             <input
//               type="text"
//               className="form-control"
//               name="nombre"
//               value={nuevo.nombre}
//               onChange={handleChange}
//               required
//             />

//           </div>

//           {/* RENDIMIENTO */}

//           <div className="col-md-3">

//             <label className="form-label">
//               Rinde para
//             </label>

//             <input
//               type="number"
//               className="form-control"
//               name="rendimientoPersonas"
//               value={
//                 nuevo.rendimientoPersonas
//               }
//               onChange={handleChange}
//               required
//             />

//           </div>

//           {/* MARGEN */}

//           <div className="col-md-3">

//             <label className="form-label">
//               Margen %
//             </label>

//             <input
//               type="number"
//               className="form-control"
//               name="margenGanancia"
//               value={
//                 nuevo.margenGanancia
//               }
//               onChange={handleChange}
//             />

//           </div>

//           {/* DESCRIPCION */}

//           <div className="col-md-12">

//             <label className="form-label">
//               Descripción
//             </label>

//             <textarea
//               className="form-control"
//               name="descripcion"
//               value={nuevo.descripcion}
//               onChange={handleChange}
//             />

//           </div>

//           {/* INGREDIENTES */}

//           <div className="col-12">

//             <h4 className="mt-4">
//               Ingredientes
//             </h4>

//             {nuevo.ingredientes.map(
//               (ing, index) => {

//                 const producto =
//                   productos.find(
//                     (p) =>
//                       p._id ===
//                       ing.producto
//                   );

//                 const subtotal =
//                   producto
//                     ? (
//                         producto.precioConIVA *
//                         Number(
//                           ing.cantidad
//                         )
//                       ).toFixed(2)
//                     : 0;

//                 return (

//                   <div
//                     className="row mb-2"
//                     key={index}
//                   >

//                     {/* PRODUCTO */}

//                     <div className="col-md-4">

//                       <select
//                         className="form-select"
//                         value={ing.producto}
//                         onChange={(e) =>
//                           handleIngredienteChange(
//                             index,
//                             'producto',
//                             e.target.value
//                           )
//                         }
//                         required
//                       >

//                         <option value="">
//                           Seleccione producto
//                         </option>

//                         {productos.map(
//                           (prod) => (

//                             <option
//                               key={prod._id}
//                               value={prod._id}
//                             >

//                               {prod.nombre}
//                               {' '}
//                               (
//                               {prod.unidad}
//                               )

//                             </option>
//                           )
//                         )}

//                       </select>

//                     </div>

//                     {/* CANTIDAD */}

//                     <div className="col-md-2">

//                       <input
//                         type="number"
//                         className="form-control"
//                         placeholder="Cantidad"
//                         value={ing.cantidad}
//                         onChange={(e) =>
//                           handleIngredienteChange(
//                             index,
//                             'cantidad',
//                             e.target.value
//                           )
//                         }
//                         required
//                       />

//                     </div>

//                     {/* PRECIO */}

//                     <div className="col-md-3">

//                       <input
//                         type="text"
//                         className="form-control"
//                         disabled
//                         value={
//                           producto
//                             ? `$${producto.precioConIVA}`
//                             : ''
//                         }
//                       />

//                     </div>

//                     {/* SUBTOTAL */}

//                     <div className="col-md-2">

//                       <input
//                         type="text"
//                         className="form-control"
//                         disabled
//                         value={`$${subtotal}`}
//                       />

//                     </div>

//                     {/* ELIMINAR */}

//                     <div className="col-md-1">

//                       <button
//                         type="button"
//                         className="btn btn-danger"
//                         onClick={() =>
//                           eliminarIngrediente(
//                             index
//                           )
//                         }
//                       >
//                         X
//                       </button>

//                     </div>

//                   </div>
//                 );
//               }
//             )}

//             <button
//               type="button"
//               className="btn btn-secondary mt-2"
//               onClick={agregarIngrediente}
//             >
//               + Agregar ingrediente
//             </button>

//           </div>

//           {/* COSTOS */}

//           <div className="col-12 mt-4">

//             <div className="card p-3">

//               <h5>
//                 Costos
//               </h5>

//               <p>
//                 <strong>
//                   Costo Total:
//                 </strong>
//                 {' '}
//                 $
//                 {calcularCostoTotal()
//                   .toFixed(2)}
//               </p>

//               <p>
//                 <strong>
//                   Precio Venta:
//                 </strong>
//                 {' '}
//                 $
//                 {calcularPrecioVenta()
//                   .toFixed(2)}
//               </p>

//             </div>

//           </div>

//           {/* BOTONES */}

//           <div className="col-12">

//             <button
//               type="submit"
//               className="btn btn-success"
//             >

//               {editandoId
//                 ? 'Actualizar'
//                 : 'Guardar'}

//             </button>

//             {editandoId && (

//               <button
//                 type="button"
//                 className="btn btn-secondary ms-2"
//                 onClick={resetFormulario}
//               >
//                 Cancelar
//               </button>

//             )}

//           </div>

//         </form>
//       )}

//       {/* TABLA */}

//       <h4 className="mt-5">
//         Listado de menús
//       </h4>

//       <div className="table-responsive">

//         <table className="table table-bordered">

//           <thead className="table-dark">

//             <tr>

//               <th>Nombre</th>

//               <th>Rinde</th>

//               <th>Costo</th>

//               <th>Venta</th>

//               <th>Ingredientes</th>

//               {!soloLectura &&
//                 <th>Acciones</th>
//               }

//             </tr>

//           </thead>

//           <tbody>

//             {menus.map((menu) => (

//               <tr key={menu._id}>

//                 <td>
//                   {menu.nombre}
//                 </td>

//                 <td>
//                   {menu.rendimientoPersonas}
//                   {' '}
//                   personas
//                 </td>

//                 <td>
//                   $
//                   {menu.costoTotal?.toFixed(2)}
//                 </td>

//                 <td>
//                   $
//                   {menu.precioVenta?.toFixed(2)}
//                 </td>

//                 <td>

//                   <ul>

//                     {menu.ingredientes.map(
//                       (ing, index) => (

//                         <li key={index}>

//                           {ing.producto?.nombre}
//                           {' - '}
//                           {ing.cantidad}
//                           {' '}
//                           {ing.producto?.unidad}

//                         </li>
//                       )
//                     )}

//                   </ul>

//                 </td>

//                 {!soloLectura && (

//                   <td>

//                     <button
//                       className="btn btn-warning btn-sm"
//                       onClick={() =>
//                         handleEditar(menu)
//                       }
//                     >
//                       Editar
//                     </button>

//                     <button
//                       className="btn btn-danger btn-sm ms-2"
//                       onClick={() =>
//                         handleEliminar(
//                           menu._id
//                         )
//                       }
//                     >
//                       Eliminar
//                     </button>

//                   </td>

//                 )}

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </div>
//   );
// };

// export default Menus;

import React, { useEffect, useState } from 'react';
import axios from '../config/axiosInstance';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Menus = () => {

  const [menus, setMenus] = useState([]);
  const [productos, setProductos] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: '',
    descripcion: '',
    rendimientoPersonas: '',
    margenGanancia: 100,
    ingredientes: []
  });

  const [editandoId, setEditandoId] = useState(null);

  const rol = localStorage.getItem('rol');

  const soloLectura = rol === 'visitante';

  useEffect(() => {

    obtenerMenus();

    obtenerProductos();

  }, []);

  // =========================================
  // OBTENER MENUS
  // =========================================

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

  // =========================================
  // OBTENER PRODUCTOS
  // =========================================

  const obtenerProductos = async () => {

    try {

      const res = await axios.get('/productos');

      setProductos(res.data);

    } catch (error) {

      console.error(
        'Error al obtener productos:',
        error
      );
    }
  };

  // =========================================
  // HANDLE INPUTS
  // =========================================

  const handleChange = (e) => {

    setNuevo({

      ...nuevo,

      [e.target.name]: e.target.value

    });
  };

  // =========================================
  // AGREGAR INGREDIENTE
  // =========================================

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

  // =========================================
  // CAMBIAR INGREDIENTE
  // =========================================

  const handleIngredienteChange = (
    index,
    campo,
    valor
  ) => {

    const nuevosIngredientes =
      [...nuevo.ingredientes];

    nuevosIngredientes[index][campo] =
      valor;

    setNuevo({

      ...nuevo,

      ingredientes: nuevosIngredientes

    });
  };

  // =========================================
  // ELIMINAR INGREDIENTE
  // =========================================

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

  // =========================================
  // CALCULAR COSTO TOTAL
  // =========================================

  const calcularCostoTotal = () => {

    let total = 0;

    nuevo.ingredientes.forEach((ing) => {

      const producto =
        productos.find(
          (p) => p._id === ing.producto
        );

      if (producto) {

        total +=
          producto.precioConIVA *
          Number(ing.cantidad);

      }
    });

    return total;
  };

  // =========================================
  // CALCULAR PRECIO VENTA
  // =========================================

  const calcularPrecioVenta = () => {

    const costo = calcularCostoTotal();

    const margen =
      Number(nuevo.margenGanancia) || 0;

    return (
      costo *
      (1 + margen / 100)
    );
  };

  // =========================================
  // GENERAR PDF
  // =========================================

  const generarPDF = () => {

    const doc = new jsPDF();

    const logo = new Image();

    logo.src = '/assets/logo.png';

    logo.onload = () => {

      // =========================================
      // LOGO
      // =========================================

      doc.addImage(
        logo,
        'PNG',
        10,
        10,
        30,
        30
      );

      // =========================================
      // TITULO
      // =========================================

      doc.setFontSize(18);

      doc.text(
        'Listado de Menús',
        50,
        20
      );

      // =========================================
      // FECHA
      // =========================================

      doc.setFontSize(10);

      doc.text(
        `Generado el: ${new Date().toLocaleString()}`,
        50,
        28
      );

      // =========================================
      // TABLA
      // =========================================

      autoTable(doc, {

        startY: 50,

        head: [[
          'Nombre',
          'Rinde',
          'Costo',
          'Venta',
          'Ingredientes'
        ]],

        body: menus.map((menu) => [

          menu.nombre,

          `${menu.rendimientoPersonas} personas`,

          `$${menu.costoTotal?.toFixed(2) || 0}`,

          `$${menu.precioVenta?.toFixed(2) || 0}`,

          menu.ingredientes
            .map(
              (ing) =>
                `${ing.producto?.nombre} - ${ing.cantidad} ${ing.producto?.unidad}`
            )
            .join('\n')

        ]),

        styles: {
          fontSize: 8
        }

      });

      // =========================================
      // GUARDAR PDF
      // =========================================

      doc.save('menus.pdf');
    };
  };

  // =========================================
  // GUARDAR MENU
  // =========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    if (soloLectura) return;

    try {

      const datos = {

        ...nuevo,

        rendimientoPersonas:
          Number(
            nuevo.rendimientoPersonas
          ),

        margenGanancia:
          Number(
            nuevo.margenGanancia
          ),

        ingredientes:
          nuevo.ingredientes.map(
            (ing) => ({

              producto:
                ing.producto,

              cantidad:
                Number(
                  ing.cantidad
                )
            })
          )
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

  // =========================================
  // EDITAR
  // =========================================

  const handleEditar = (menu) => {

    setNuevo({

      nombre:
        menu.nombre || '',

      descripcion:
        menu.descripcion || '',

      rendimientoPersonas:
        menu.rendimientoPersonas || '',

      margenGanancia:
        menu.margenGanancia || 100,

      ingredientes:
        menu.ingredientes.map(
          (ing) => ({

            producto:
              ing.producto?._id || '',

            cantidad:
              ing.cantidad || ''

          })
        )
    });

    setEditandoId(menu._id);
  };

  // =========================================
  // ELIMINAR
  // =========================================

  const handleEliminar = async (id) => {

    if (soloLectura) return;

    const confirmar =
      window.confirm(
        '¿Eliminar menú?'
      );

    if (!confirmar) return;

    try {

      await axios.delete(
        `/menus/${id}`
      );

      obtenerMenus();

    } catch (error) {

      console.error(
        'Error al eliminar menú:',
        error
      );
    }
  };

  // =========================================
  // RESET
  // =========================================

  const resetFormulario = () => {

    setNuevo({

      nombre: '',

      descripcion: '',

      rendimientoPersonas: '',

      margenGanancia: 100,

      ingredientes: []

    });

    setEditandoId(null);
  };

  // =========================================
  // RENDER
  // =========================================

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

          <div className="col-md-3">

            <label className="form-label">
              Rinde para
            </label>

            <input
              type="number"
              className="form-control"
              name="rendimientoPersonas"
              value={
                nuevo.rendimientoPersonas
              }
              onChange={handleChange}
              required
            />

          </div>

          <div className="col-md-3">

            <label className="form-label">
              Margen %
            </label>

            <input
              type="number"
              className="form-control"
              name="margenGanancia"
              value={
                nuevo.margenGanancia
              }
              onChange={handleChange}
            />

          </div>

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

          <div className="col-12">

            <h4 className="mt-4">
              Ingredientes
            </h4>

            {nuevo.ingredientes.map(
              (ing, index) => {

                const producto =
                  productos.find(
                    (p) =>
                      p._id ===
                      ing.producto
                  );

                const subtotal =
                  producto
                    ? (
                        producto.precioConIVA *
                        Number(
                          ing.cantidad
                        )
                      ).toFixed(2)
                    : 0;

                return (

                  <div
                    className="row mb-2"
                    key={index}
                  >

                    <div className="col-md-4">

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

                        {productos.map(
                          (prod) => (

                            <option
                              key={prod._id}
                              value={prod._id}
                            >

                              {prod.nombre}
                              {' '}
                              (
                              {prod.unidad}
                              )

                            </option>
                          )
                        )}

                      </select>

                    </div>

                    <div className="col-md-2">

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

                    <div className="col-md-3">

                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={
                          producto
                            ? `$${producto.precioConIVA}`
                            : ''
                        }
                      />

                    </div>

                    <div className="col-md-2">

                      <input
                        type="text"
                        className="form-control"
                        disabled
                        value={`$${subtotal}`}
                      />

                    </div>

                    <div className="col-md-1">

                      <button
                        type="button"
                        className="btn btn-danger"
                        onClick={() =>
                          eliminarIngrediente(
                            index
                          )
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
              onClick={agregarIngrediente}
            >
              + Agregar ingrediente
            </button>

          </div>

          <div className="col-12 mt-4">

            <div className="card p-3">

              <h5>
                Costos
              </h5>

              <p>
                <strong>
                  Costo Total:
                </strong>
                {' '}
                $
                {calcularCostoTotal()
                  .toFixed(2)}
              </p>

              <p>
                <strong>
                  Precio Venta:
                </strong>
                {' '}
                $
                {calcularPrecioVenta()
                  .toFixed(2)}
              </p>

            </div>

          </div>

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

      {/* BOTON PDF */}

      <button
        className="btn btn-primary mt-4"
        onClick={generarPDF}
      >
        Descargar PDF
      </button>

      {/* TABLA */}

      <h4 className="mt-5">
        Listado de menús
      </h4>

      <div className="table-responsive">

        <table className="table table-bordered">

          <thead className="table-dark">

            <tr>

              <th>Nombre</th>

              <th>Rinde</th>

              <th>Costo</th>

              <th>Venta</th>

              <th>Ingredientes</th>

              {!soloLectura &&
                <th>Acciones</th>
              }

            </tr>

          </thead>

          <tbody>

            {menus.map((menu) => (

              <tr key={menu._id}>

                <td>
                  {menu.nombre}
                </td>

                <td>
                  {menu.rendimientoPersonas}
                  {' '}
                  personas
                </td>

                <td>
                  $
                  {menu.costoTotal?.toFixed(2)}
                </td>

                <td>
                  $
                  {menu.precioVenta?.toFixed(2)}
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
                        handleEliminar(
                          menu._id
                        )
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