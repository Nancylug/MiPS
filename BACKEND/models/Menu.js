const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({

  nombre: {
    type: String,
    required: true
  },

  descripcion: String,

  rendimientoPersonas: {
    type: Number,
    required: true
  },

  ingredientes: [
    {
      producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
      },

      cantidad: {
        type: Number,
        required: true
      }
    }
  ]
});

module.exports = mongoose.model('Menu', menuSchema);