const mongoose = require('mongoose');

const ProveedorSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  rubro: { type: String, required: true },
  telefono: { type: String, required: true },
  email: { type: String, required: true },
  direccion: { type: String, required: true },
  observaciones: { type: String }
});

const Proveedor = mongoose.model('Proveedor', ProveedorSchema);
module.exports = Proveedor;


