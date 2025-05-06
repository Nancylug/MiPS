const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Producto = require('../models/Producto');
const Proveedor = require('../models/Proveedor');

// Obtener todos los productos con proveedor
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().populate('proveedor');
    res.json(productos);
  } catch (err) {
    console.error('Error al obtener productos:', err);
    res.status(500).send('Error al obtener productos');
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const { nombre, categoria, precio, descripcion, cantidad, proveedor } = req.body;

    if (!proveedor) return res.status(400).send('Proveedor es obligatorio');

    const proveedorExistente = await Proveedor.findById(proveedor);
    if (!proveedorExistente) return res.status(400).send('Proveedor no encontrado');

    const nuevoProducto = new Producto({ nombre, categoria, precio, descripcion, cantidad, proveedor });
    await nuevoProducto.save();

    // 👉 Obtener el producto con el proveedor populado antes de enviar
    const productoPopulado = await Producto.findById(nuevoProducto._id).populate('proveedor');

    res.status(201).json(productoPopulado);
  } catch (err) {
    console.error('Error al guardar producto:', err);
    res.status(400).send('Error al guardar producto');
  }
});

// Actualizar un producto
router.put('/:id', async (req, res) => {
  try {
    const { nombre, categoria, precio, descripcion, cantidad, proveedor } = req.body;

    if (proveedor && !mongoose.Types.ObjectId.isValid(proveedor)) {
      return res.status(400).send('ID de proveedor inválido');
    }

    if (proveedor) {
      const proveedorExistente = await Proveedor.findById(proveedor);
      if (!proveedorExistente) {
        return res.status(400).send('Proveedor no encontrado');
      }
    }

    await Producto.findByIdAndUpdate(
      req.params.id,
      { nombre, categoria, precio, descripcion, cantidad, proveedor },
      { new: true }
    );

    // 👉 Obtener el producto actualizado con proveedor populado
    const productoPopulado = await Producto.findById(req.params.id).populate('proveedor');

    res.json(productoPopulado);
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    res.status(400).send('Error al actualizar producto');
  }
});

// Eliminar un producto
router.delete('/:id', async (req, res) => {
  try {
    await Producto.findByIdAndDelete(req.params.id);
    res.status(200).send('Producto eliminado');
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(400).send('Error al eliminar producto');
  }
});

module.exports = router;
