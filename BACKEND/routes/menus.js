const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');

router.get('/', menuController.obtenerMenus);
router.post('/', menuController.crearMenu);
// podrías agregar editar y eliminar

module.exports = router;
