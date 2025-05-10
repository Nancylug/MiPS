const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number }, // lo puedes calcular o ingresar manualmente
  foto: { type: String }, // URL o nombre de archivo
  ingredientes: [
    {
      producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto', required: true },
      cantidad: { type: Number, required: true } // en unidad del producto
    }
  ]
});

module.exports = mongoose.model('Menu', menuSchema);
