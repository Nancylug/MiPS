const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // 🔐 Carga variables del archivo .env

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err);
    process.exit(1); // Detiene la app si no se puede conectar
  });

// Modelo simple de ejemplo (puede ir en otra carpeta como models/)
const ItemSchema = new mongoose.Schema({
  name: String,
  description: String,
});

const Item = mongoose.model('Item', ItemSchema);

// Rutas de la API
app.post('/api/items', async (req, res) => {
  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/api/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Rutas externas
const menuRoutes = require('./routes/menus');
app.use('/api/menus', menuRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
