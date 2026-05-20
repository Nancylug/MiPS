// const mongoose = require('mongoose');

// const menuSchema = new mongoose.Schema({

//   nombre: {
//     type: String,
//     required: true
//   },

//   descripcion: String,

//   rendimientoPersonas: {
//     type: Number,
//     required: true
//   },

//   ingredientes: [
//     {
//       producto: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Producto',
//         required: true
//       },

//       cantidad: {
//         type: Number,
//         required: true
//       }
//     }
//   ]
// });

// module.exports = mongoose.model('Menu', menuSchema);

const mongoose = require('mongoose');

const ingredienteSchema = new mongoose.Schema({

  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },

  cantidad: {
    type: Number,
    required: true,
    min: 0
  }

});


const menuSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true,
    trim: true
  },

  descripcion: {
    type: String,
    trim: true
  },

  // ✅ Para cuántas personas rinde
  rendimientoPersonas: {
    type: Number,
    required: true,
    min: 1
  },

  // ✅ Ingredientes
  ingredientes: [ingredienteSchema],


  // ✅ Margen de ganancia %
  margenGanancia: {
    type: Number,
    default: 100
  },


  // ✅ Costos calculados
  costoTotal: {
    type: Number,
    default: 0
  },

  precioVenta: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});


// ==========================================
// CALCULAR COSTOS AUTOMATICAMENTE
// ==========================================
menuSchema.methods.calcularCostos = async function () {

  await this.populate('ingredientes.producto');

  let costo = 0;

  this.ingredientes.forEach((item) => {

    const precioProducto =
      item.producto.precioConIVA || 0;

    costo += precioProducto * item.cantidad;

  });

  this.costoTotal = Number(costo.toFixed(2));

  this.precioVenta = Number(
    (
      costo *
      (1 + this.margenGanancia / 100)
    ).toFixed(2)
  );
};

module.exports = mongoose.model('Menu', menuSchema);