// const express = require('express');
// const router = express.Router();
// const menuController = require('../controllers/menuController');

// router.get('/', menuController.obtenerMenus);
// router.post('/', menuController.crearMenu);
// // podrías agregar editar y eliminar

// module.exports = router;

const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Menu = require('../models/Menu');

const Producto = require('../models/Producto');


// =========================================
// GET TODOS LOS MENUS
// =========================================

router.get('/', async (req, res) => {

  try {

    const menus = await Menu.find()

      .populate('ingredientes.producto');

    res.json(menus);

  } catch (error) {

    console.error(
      'Error al obtener menús:',
      error
    );

    res.status(500).json({
      error: 'Error al obtener menús'
    });
  }
});


// =========================================
// CREAR MENU
// =========================================

router.post('/', async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      rendimientoPersonas,
      ingredientes,
      margenGanancia
    } = req.body;

    // =========================
    // VALIDACIONES
    // =========================

    if (
      !nombre ||
      !rendimientoPersonas ||
      !ingredientes ||
      ingredientes.length === 0
    ) {

      return res.status(400).json({
        error:
          'Nombre, rendimiento e ingredientes son obligatorios'
      });
    }

    // =========================
    // CALCULAR COSTO
    // =========================

    let costoTotal = 0;

    for (const ing of ingredientes) {

      if (
        !mongoose.Types.ObjectId.isValid(
          ing.producto
        )
      ) {

        return res.status(400).json({
          error:
            'Producto inválido'
        });
      }

      const producto =
        await Producto.findById(
          ing.producto
        );

      if (!producto) {

        return res.status(400).json({
          error:
            'Producto no encontrado'
        });
      }

      costoTotal +=
        Number(producto.precioConIVA) *
        Number(ing.cantidad);
    }

    // =========================
    // PRECIO VENTA
    // =========================

    const margen =
      Number(margenGanancia) || 0;

    const precioVenta =
      costoTotal *
      (1 + margen / 100);

    // =========================
    // CREAR MENU
    // =========================

    const nuevoMenu = new Menu({

      nombre,

      descripcion,

      rendimientoPersonas,

      ingredientes,

      margenGanancia: margen,

      costoTotal:
        Number(
          costoTotal.toFixed(2)
        ),

      precioVenta:
        Number(
          precioVenta.toFixed(2)
        )
    });

    await nuevoMenu.save();

    // =========================
    // POPULATE
    // =========================

    const menuPopulado =
      await Menu.findById(
        nuevoMenu._id
      ).populate(
        'ingredientes.producto'
      );

    res.status(201).json(
      menuPopulado
    );

  } catch (error) {

    console.error(
      'Error al guardar menú:',
      error
    );

    res.status(500).json({
      error:
        'Error al guardar menú'
    });
  }
});


// =========================================
// ACTUALIZAR MENU
// =========================================

router.put('/:id', async (req, res) => {

  try {

    const {
      nombre,
      descripcion,
      rendimientoPersonas,
      ingredientes,
      margenGanancia
    } = req.body;

    // =========================
    // VALIDAR ID MENU
    // =========================

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({
        error:
          'ID de menú inválido'
      });
    }

    // =========================
    // CALCULAR COSTOS
    // =========================

    let costoTotal = 0;

    for (const ing of ingredientes) {

      if (
        !mongoose.Types.ObjectId.isValid(
          ing.producto
        )
      ) {

        return res.status(400).json({
          error:
            'Producto inválido'
        });
      }

      const producto =
        await Producto.findById(
          ing.producto
        );

      if (!producto) {

        return res.status(400).json({
          error:
            'Producto no encontrado'
        });
      }

      costoTotal +=
        Number(producto.precioConIVA) *
        Number(ing.cantidad);
    }

    // =========================
    // PRECIO VENTA
    // =========================

    const margen =
      Number(margenGanancia) || 0;

    const precioVenta =
      costoTotal *
      (1 + margen / 100);

    // =========================
    // ACTUALIZAR
    // =========================

    const menuActualizado =
      await Menu.findByIdAndUpdate(

        req.params.id,

        {

          nombre,

          descripcion,

          rendimientoPersonas,

          ingredientes,

          margenGanancia: margen,

          costoTotal:
            Number(
              costoTotal.toFixed(2)
            ),

          precioVenta:
            Number(
              precioVenta.toFixed(2)
            )
        },

        {
          new: true
        }

      ).populate(
        'ingredientes.producto'
      );

    res.json(menuActualizado);

  } catch (error) {

    console.error(
      'Error al actualizar menú:',
      error
    );

    res.status(500).json({
      error:
        'Error al actualizar menú'
    });
  }
});


// =========================================
// ELIMINAR MENU
// =========================================

router.delete('/:id', async (req, res) => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({
        error:
          'ID de menú inválido'
      });
    }

    await Menu.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Menú eliminado correctamente'
    });

  } catch (error) {

    console.error(
      'Error al eliminar menú:',
      error
    );

    res.status(500).json({
      error:
        'Error al eliminar menú'
    });
  }
});

module.exports = router;