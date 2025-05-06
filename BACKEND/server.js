const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://Urtubey2025:CateringUrtubey@cluster0.s2wpd.mongodb.net/BDCateringUrtubey')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error al conectar a MongoDB:', err));

// Rutas de autenticación
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

  const token = jwt.sign({ userId: user._id, email: user.email }, 'secreto123', { expiresIn: '1h' });

  res.json({ message: 'Login exitoso', token });
});

// Rutas de Proveedores y Productos
const proveedorRoutes = require('./routes/proveedores');
const productoRoutes = require('./routes/productos');

// Se añaden las rutas a la app
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);

// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor backend corriendo en http://localhost:3001');
});

//Ruta cliente
const clientesRoutes = require('./routes/clientes');
app.use('/api/clientes', clientesRoutes);
