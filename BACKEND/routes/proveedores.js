// routes/proveedores.js
const mongoose = require('mongoose');
const express = require('express');
const Proveedor = require('../models/Proveedor');
const router = express.Router();

// Crear proveedor
router.post('/', async (req, res) => {
  try {
    const proveedor = new Proveedor(req.body);
    await proveedor.save();
    res.status(201).json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los proveedores
router.get('/', async (req, res) => {
  try {
    const proveedores = await Proveedor.find();
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar proveedor
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si el ID es válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const proveedor = await Proveedor.findByIdAndUpdate(id, req.body, { new: true });

    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json(proveedor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar proveedor
router.delete('/:id', async (req, res) => {
  try {
    // Verificar si el ID es válido
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const proveedor = await Proveedor.findByIdAndDelete(id);
    if (!proveedor) {
      return res.status(404).json({ error: 'Proveedor no encontrado' });
    }

    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
