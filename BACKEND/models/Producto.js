const mongoose = require('mongoose');

const ProductoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true },
  precio: { type: Number, required: true },
  descripcion: { type: String, required: true },
  cantidad: { type: Number, required: true },
  proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: true } // Esto asegura que el proveedor sea una referencia a otro documento
});

const Producto = mongoose.model('Producto', ProductoSchema);
module.exports = Producto;
