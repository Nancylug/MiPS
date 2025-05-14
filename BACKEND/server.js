const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/Usuario'); // Asegúrate de que el modelo de usuario está bien importado

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

 const token = jwt.sign(
  { userId: user._id, email: user.email, rol: user.rol, nombre: user.nombre },
  'secreto123',
  { expiresIn: '1h' }
);

  
  res.json({ message: 'Login exitoso', token, rol: user.rol }); // también se puede enviar explícitamente el rol
  
});

// Rutas de Proveedores y Productos
const proveedorRoutes = require('./routes/proveedores');
const productoRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const usuarioRoutes = require('./routes/usuarios'); // Asegúrate de que el archivo de rutas de usuarios esté bien importado

// Se añaden las rutas a la app
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuarioRoutes); // Asegúrate de que esta línea esté presente

// Ruta para verificar el token
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, 'secreto123');
    res.status(200).json({
      message: 'Token válido',
      user: {
        userId: decoded.userId,
        email: decoded.email,
        rol: decoded.rol
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Token no válido', error: err.message });
  }
});


// Iniciar el servidor
app.listen(3001, () => {
  console.log('Servidor backend corriendo en http://localhost:3001');
});

