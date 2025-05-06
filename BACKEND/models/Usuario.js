const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, required: true, default: 'usuario' } // Podrías tener roles como 'admin', 'usuario', etc.
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

module.exports = Usuario;
