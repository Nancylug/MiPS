const express = require('express');
const router = express.Router();

const Categoria = require('../models/Categoria');


// Obtener categorías
router.get('/', async (req, res) => {

  try {

    const categorias = await Categoria.find();

    res.json(categorias);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// Crear categoría
router.post('/', async (req, res) => {

  try {

    const nuevaCategoria = new Categoria({
      nombre: req.body.nombre
    });

    await nuevaCategoria.save();

    res.status(201).json(nuevaCategoria);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;