const express = require('express');
const router = express.Router();
const Cliente = require('../models/Cliente');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear cliente
router.post('/', async (req, res) => {
  try {
    const nuevoCliente = new Cliente(req.body);
    await nuevoCliente.save();
    res.status(201).json(nuevoCliente);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Actualizar cliente
router.put('/:id', async (req, res) => {
  try {
    const clienteActualizado = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(clienteActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ message: 'Cliente eliminado' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
