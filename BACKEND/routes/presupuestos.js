const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Presupuesto = require('../models/Presupuesto');

const Cliente = require('../models/Cliente');

const Menu = require('../models/Menu');


// =========================================
// GET TODOS LOS PRESUPUESTOS
// =========================================

router.get('/', async (req, res) => {

  try {

    const presupuestos =
      await Presupuesto.find()

        .populate('cliente')

        .populate('menus.menu')

        .sort({
          createdAt: -1
        });

    res.json(presupuestos);

  } catch (error) {

    console.error(
      'Error al obtener presupuestos:',
      error
    );

    res.status(500).json({
      error:
        'Error al obtener presupuestos'
    });
  }
});


// =========================================
// GET PRESUPUESTO POR ID
// =========================================

router.get('/:id', async (req, res) => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({
        error:
          'ID inválido'
      });
    }

    const presupuesto =
      await Presupuesto.findById(
        req.params.id
      )

        .populate('cliente')

        .populate('menus.menu');

    if (!presupuesto) {

      return res.status(404).json({
        error:
          'Presupuesto no encontrado'
      });
    }

    res.json(presupuesto);

  } catch (error) {

    console.error(
      'Error al obtener presupuesto:',
      error
    );

    res.status(500).json({
      error:
        'Error al obtener presupuesto'
    });
  }
});


// =========================================
// CREAR PRESUPUESTO
// =========================================

router.post('/', async (req, res) => {

  try {

    const {

      cliente,

      fechaEvento,

      cantidadPersonas,

      menus,

      observaciones

    } = req.body;

    // =========================
    // VALIDACIONES
    // =========================

    if (
      !cliente ||
      !fechaEvento ||
      !cantidadPersonas ||
      !menus ||
      menus.length === 0
    ) {

      return res.status(400).json({
        error:
          'Faltan datos obligatorios'
      });
    }

    // =========================
    // VALIDAR CLIENTE
    // =========================

    if (
      !mongoose.Types.ObjectId.isValid(
        cliente
      )
    ) {

      return res.status(400).json({
        error:
          'Cliente inválido'
      });
    }

    const clienteExiste =
      await Cliente.findById(
        cliente
      );

    if (!clienteExiste) {

      return res.status(400).json({
        error:
          'Cliente no encontrado'
      });
    }

    // =========================
    // CALCULAR TOTALES
    // =========================

    let total = 0;

    const menusCalculados = [];

    for (const item of menus) {

      if (
        !mongoose.Types.ObjectId.isValid(
          item.menu
        )
      ) {

        return res.status(400).json({
          error:
            'Menú inválido'
        });
      }

      const menuDB =
        await Menu.findById(
          item.menu
        );

      if (!menuDB) {

        return res.status(400).json({
          error:
            'Menú no encontrado'
        });
      }

      const precioUnitario =
        Number(
          menuDB.precioVenta
        );

      const cantidad =
        Number(item.cantidad);

      const subtotal =
        precioUnitario *
        cantidad;

      total += subtotal;

      menusCalculados.push({

        menu: item.menu,

        cantidad,

        precioUnitario,

        subtotal:
          Number(
            subtotal.toFixed(2)
          )
      });
    }

    // =========================
    // CREAR PRESUPUESTO
    // =========================

    const nuevoPresupuesto =
      new Presupuesto({

        cliente,

        fechaEvento,

        cantidadPersonas,

        menus: menusCalculados,

        total:
          Number(
            total.toFixed(2)
          ),

        observaciones
      });

    await nuevoPresupuesto.save();

    // =========================
    // POPULATE
    // =========================

    const presupuestoPopulado =
      await Presupuesto.findById(
        nuevoPresupuesto._id
      )

        .populate('cliente')

        .populate('menus.menu');

    res.status(201).json(
      presupuestoPopulado
    );

  } catch (error) {

    console.error(
      'Error al guardar presupuesto:',
      error
    );

    res.status(500).json({
      error:
        'Error al guardar presupuesto'
    });
  }
});


// =========================================
// ACTUALIZAR PRESUPUESTO
// =========================================

router.put('/:id', async (req, res) => {

  try {

    if (
      !mongoose.Types.ObjectId.isValid(
        req.params.id
      )
    ) {

      return res.status(400).json({
        error:
          'ID inválido'
      });
    }

    const {

      cliente,

      fechaEvento,

      cantidadPersonas,

      menus,

      observaciones,

      estado

    } = req.body;

    let total = 0;

    const menusCalculados = [];

    for (const item of menus) {

      const menuDB =
        await Menu.findById(
          item.menu
        );

      if (!menuDB) continue;

      const precioUnitario =
        Number(
          menuDB.precioVenta
        );

      const cantidad =
        Number(item.cantidad);

      const subtotal =
        precioUnitario *
        cantidad;

      total += subtotal;

      menusCalculados.push({

        menu: item.menu,

        cantidad,

        precioUnitario,

        subtotal:
          Number(
            subtotal.toFixed(2)
          )
      });
    }

    const presupuestoActualizado =
      await Presupuesto.findByIdAndUpdate(

        req.params.id,

        {

          cliente,

          fechaEvento,

          cantidadPersonas,

          menus: menusCalculados,

          total:
            Number(
              total.toFixed(2)
            ),

          observaciones,

          estado
        },

        {
          new: true
        }

      )

        .populate('cliente')

        .populate('menus.menu');

    res.json(
      presupuestoActualizado
    );

  } catch (error) {

    console.error(
      'Error al actualizar presupuesto:',
      error
    );

    res.status(500).json({
      error:
        'Error al actualizar presupuesto'
    });
  }
});


// =========================================
// ELIMINAR PRESUPUESTO
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
          'ID inválido'
      });
    }

    await Presupuesto.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        'Presupuesto eliminado correctamente'
    });

  } catch (error) {

    console.error(
      'Error al eliminar presupuesto:',
      error
    );

    res.status(500).json({
      error:
        'Error al eliminar presupuesto'
    });
  }
});

module.exports = router;