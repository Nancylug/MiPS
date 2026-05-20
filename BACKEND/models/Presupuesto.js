const mongoose = require('mongoose');

const presupuestoSchema = new mongoose.Schema({

  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },

  fechaEvento: {
    type: Date,
    required: true
  },

  cantidadPersonas: {
    type: Number,
    required: true
  },

  menus: [
    {
      menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
      },

      cantidad: Number,

      precioUnitario: Number,

      subtotal: Number
    }
  ],

  total: {
    type: Number,
    default: 0
  },

  estado: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model('Presupuesto', presupuestoSchema);