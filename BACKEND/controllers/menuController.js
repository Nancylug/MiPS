const Menu = require('../models/Menu');

exports.crearMenu = async (req, res) => {
  try {
    const nuevoMenu = new Menu(req.body);
    await nuevoMenu.save();
    res.status(201).json(nuevoMenu);
  } catch (err) {
    res.status(500).json({ error: 'Error al crear menú' });
  }
};

exports.obtenerMenus = async (req, res) => {
  try {
    const menus = await Menu.find().populate('ingredientes.producto');
    res.json(menus);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener menús' });
  }
};
