// require('dotenv').config(); // Carga las variables desde .env

// const express = require('express');
// const cors = require('cors');
// const mongoose = require('mongoose');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const User = require('./models/Usuario'); // Modelo de usuario
// //Rutas de menu
// const menuRoutes = require('./routes/menus');

// // Rutas externas
// const proveedorRoutes = require('./routes/proveedores');
// const productoRoutes = require('./routes/productos');
// const clientesRoutes = require('./routes/clientes');
// const usuarioRoutes = require('./routes/usuarios');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Puerto dinámico para que funcione en Render
// const PORT = process.env.PORT || 3001;

// // Conexión a MongoDB usando variable de entorno
// mongoose.connect(process.env.MONGODB_URI
  
// )
//   .then(() => console.log('✅ Conectado a MongoDB'))
//   .catch((err) => {
//     console.error('❌ Error al conectar a MongoDB:', err);
//     process.exit(1);
//   });

// // 🔐 Ruta de Login
// app.post('/api/login', async (req, res) => {
//   // 🆕 Registro de usuario
// app.post('/api/register', async (req, res) => {
//   try {
//     const { nombre, email, password, rol } = req.body;

//     // Verificar si ya existe
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'El usuario ya existe' });
//     }

//     // Encriptar contraseña
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Crear usuario
//     const newUser = new User({
//       nombre,
//       email,
//       password: hashedPassword,
//       rol: rol || 'usuario'
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'Usuario creado correctamente' });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error del servidor' });
//   }
// });
//   const { email, password } = req.body;

//   const user = await User.findOne({ email });
//   if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

//   const isMatch = await bcrypt.compare(password, user.password);
//   if (!isMatch) return res.status(401).json({ message: 'Contraseña incorrecta' });

//   const token = jwt.sign(
//     { userId: user._id, email: user.email, rol: user.rol, nombre: user.nombre },
//     process.env.JWT_SECRET || 'secreto123', // ⚠️ Mejor usar variable segura
//     { expiresIn: '1h' }
//   );

//   res.json({ message: 'Login exitoso', token, rol: user.rol });
// });

// // 🔒 Verificación de token
// app.post('/api/verify-token', (req, res) => {
//   const { token } = req.body;
//   if (!token) return res.status(400).json({ message: 'Token requerido' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto123');
//     res.status(200).json({
//       message: 'Token válido',
//       user: {
//         userId: decoded.userId,
//         email: decoded.email,
//         rol: decoded.rol,
//       },
//     });
//   } catch (err) {
//     res.status(401).json({ message: 'Token no válido', error: err.message });
//   }
// });

// // 📦 Rutas de la API
// app.use('/api/proveedores', proveedorRoutes);
// app.use('/api/productos', productoRoutes);
// app.use('/api/clientes', clientesRoutes);
// app.use('/api/usuarios', usuarioRoutes);
// app.use('/api/menus', menuRoutes);

// // 🚀 Iniciar servidor
// app.listen(PORT, () => {
//   console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
// });

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('./models/Usuario');

// Rutas
const menuRoutes = require('./routes/menus');
const proveedorRoutes = require('./routes/proveedores');
const productoRoutes = require('./routes/productos');
const clientesRoutes = require('./routes/clientes');
const usuarioRoutes = require('./routes/usuarios');
const categoriaRoutes = require('./routes/categorias');
const presupuestoRoutes = require('./routes/presupuestos');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Conexión MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Conectado a MongoDB'))
  .catch((err) => {
    console.error('❌ Error MongoDB:', err);
    process.exit(1);
  });


// ===============================
// 🆕 REGISTER
// ===============================
app.post('/api/register', async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    // Validar campos
    if (!nombre || !email || !password) {
      return res.status(400).json({
        message: 'Todos los campos son obligatorios'
      });
    }

    // Verificar si existe
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: 'El usuario ya existe'
      });
    }

    // Hash contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const newUser = new User({
      nombre,
      email,
      password: hashedPassword,
      rol: rol || 'usuario'
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuario creado correctamente'
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});


// ===============================
// 🔐 LOGIN
// ===============================
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email y contraseña requeridos'
      });
    }

    // Buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: 'Usuario no encontrado'
      });
    }

    // Comparar password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Contraseña incorrecta'
      });
    }

    // Generar token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        rol: user.rol,
        nombre: user.nombre
      },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      rol: user.rol,
      nombre: user.nombre
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error del servidor'
    });
  }
});


// ===============================
// 🔒 VERIFY TOKEN
// ===============================
app.post('/api/verify-token', (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({
      message: 'Token requerido'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    res.status(200).json({
      message: 'Token válido',
      user: {
        userId: decoded.userId,
        email: decoded.email,
        rol: decoded.rol,
        nombre: decoded.nombre
      }
    });

  } catch (err) {
    res.status(401).json({
      message: 'Token no válido',
      error: err.message
    });
  }
});


// ===============================
// 📦 Rutas API
// ===============================
app.use('/api/proveedores', proveedorRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/clientes', clientesRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/presupuestos', presupuestoRoutes);


// ===============================
// 🚀 Servidor
// ===============================
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});