const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');

// ✅ Obtener todos los productos con proveedor
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('proveedor');
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error al obtener productos');
  }
});

// ✅ Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      unidad,
      precioSinIVA,
      categoria,
      proveedor,
      stock,
      fecha
    } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !unidad || !precioSinIVA || !proveedor) {
      return res.status(400).send('Nombre, unidad, precioSinIVA y proveedor son obligatorios');
    }

    if (!mongoose.Types.ObjectId.isValid(proveedor)) {
      return res.status(400).send('ID de proveedor inválido');
    }

    // Verificar que el proveedor exista
    const proveedorExistente = await Proveedor.findById(proveedor);
    if (!proveedorExistente) {
      return res.status(400).send('Proveedor no encontrado');
    }

    // Calcular precioConIVA
    const precioConIVA = (precioSinIVA * 1.21).toFixed(2);

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      unidad,
      precioSinIVA,
      precioConIVA,
      categoria,
      proveedor,
      stock: stock ?? 0,
      fecha: fecha ? new Date(fecha) : undefined
    });

    await nuevoProducto.save();
    const productoPopulado = await Producto.findById(nuevoProducto._id).populate('proveedor');
    res.status(201).json(productoPopulado);
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(400).send('Error al guardar producto');
  }
});

// ✅ Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      unidad,
      precioSinIVA,
      categoria,
      proveedor,
      stock,
      fecha
    } = req.body;

    if (!nombre || !unidad || !precioSinIVA || !proveedor) {
      return res.status(400).send('Nombre, unidad, precioSinIVA y proveedor son obligatorios');
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('ID de producto inválido');
    }

    if (!mongoose.Types.ObjectId.isValid(proveedor)) {
      return res.status(400).send('ID de proveedor inválido');
    }

    const proveedorExistente = await Proveedor.findById(proveedor);
    if (!proveedorExistente) {
      return res.status(400).send('Proveedor no encontrado');
    }

    const precioConIVA = (precioSinIVA * 1.21).toFixed(2);

    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        unidad,
        precioSinIVA,
        precioConIVA,
        categoria,
        proveedor,
        stock: stock ?? 0,
        fecha: fecha ? new Date(fecha) : undefined
      },
      { new: true }
    ).populate('proveedor');

    res.json(productoActualizado);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(400).send('Error al actualizar producto');
  }
});

// ✅ Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('ID de producto inválido');
    }

    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).send('Producto eliminado');
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(400).send('Error al eliminar producto');
  }
});

module.exports = router;
