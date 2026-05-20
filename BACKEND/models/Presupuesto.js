const mongoose = require('mongoose');

const menuPresupuestoSchema = new mongoose.Schema({

  menu: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Menu',
    required: true
  },

  cantidad: {
    type: Number,
    required: true,
    min: 1
  },

  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },

  subtotal: {
    type: Number,
    required: true,
    min: 0
  }

});

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
    required: true,
    min: 1
  },

  menus: [menuPresupuestoSchema],

  total: {
    type: Number,
    default: 0
  },

  observaciones: {
    type: String,
    trim: true
  },

  estado: {
    type: String,

    enum: [
      'pendiente',
      'aprobado',
      'rechazado'
    ],

    default: 'pendiente'
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  'Presupuesto',
  presupuestoSchema
);