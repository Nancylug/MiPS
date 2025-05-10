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
    const { nombre, descripcion, unidad, precioSinIVA, categoria, proveedor, stock } = req.body;

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

    // Calcular precioConIVA si no se pasa
    const precioConIVA = (precioSinIVA * 1.21).toFixed(2); // Suponiendo IVA del 21%

    const nuevoProducto = new Producto({
      nombre,
      descripcion,
      unidad,
      precioSinIVA,
      precioConIVA,  // Se guarda el precio con IVA calculado
      categoria,
      proveedor,
      stock: stock ?? 0  // Si no se pasa stock, se asigna 0 por defecto
    });

    // Guardar el nuevo producto
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
    const { nombre, descripcion, unidad, precioSinIVA, categoria, proveedor, stock } = req.body;

    // Validación de campos obligatorios
    if (!nombre || !unidad || !precioSinIVA || !proveedor) {
      return res.status(400).send('Nombre, unidad, precioSinIVA y proveedor son obligatorios');
    }

    // Validar ID de producto
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).send('ID de producto inválido');
    }

    // Validar ID de proveedor
    if (!mongoose.Types.ObjectId.isValid(proveedor)) {
      return res.status(400).send('ID de proveedor inválido');
    }

    const proveedorExistente = await Proveedor.findById(proveedor);
    if (!proveedorExistente) {
      return res.status(400).send('Proveedor no encontrado');
    }

    // Calcular precioConIVA si no se pasa
    const precioConIVA = (precioSinIVA * 1.21).toFixed(2); // Suponiendo IVA del 21%

    // Actualizar el producto
    const productoActualizado = await Producto.findByIdAndUpdate(
      req.params.id,
      {
        nombre,
        descripcion,
        unidad,
        precioSinIVA,
        precioConIVA,  // Actualizar el precio con IVA
        categoria,
        proveedor,
        stock: stock ?? 0  // Si no se pasa stock, se asigna 0 por defecto
      },
      { new: true }
    ).populate('proveedor');  // Populamos el proveedor actualizado

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

    // Eliminar el producto
    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).send('Producto eliminado');
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(400).send('Error al eliminar producto');
  }
});

module.exports = router;
