const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');  // Asegúrate de tener el modelo Usuario
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    console.error('Error al obtener usuarios:', err);
    res.status(500).send('Error al obtener usuarios');
  }
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar que el email no esté registrado
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send('El email ya está registrado');
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear nuevo usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol
    });

    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (err) {
    console.error('Error al guardar usuario:', err);
    res.status(400).send('Error al guardar usuario');
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Verificar si el usuario existe
    const usuarioExistente = await Usuario.findById(req.params.id);
    if (!usuarioExistente) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Si se actualiza la contraseña, encriptarla
    let updatedPassword = password;
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    // Actualizar usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        email,
        password: updatedPassword,
        rol
      },
      { new: true }
    );

    res.json(usuarioActualizado);
  } catch (err) {
    console.error('Error al actualizar usuario:', err);
    res.status(400).send('Error al actualizar usuario');
  }
});

// Eliminar un usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.status(200).send('Usuario eliminado');
  } catch (err) {
    console.error('Error al eliminar usuario:', err);
    res.status(400).send('Error al eliminar usuario');
  }
});

module.exports = router;
