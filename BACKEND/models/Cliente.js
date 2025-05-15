const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String },
  telefono: { type: String },
  direccion: { type: String },
});

module.exports = mongoose.model('Cliente', clienteSchema);
