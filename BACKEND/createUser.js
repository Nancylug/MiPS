// backend/createUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect('mongodb+srv://Urtubey2025:CateringUrtubey@cluster0.s2wpd.mongodb.net/BDCateringUrtubey');
;

const crearUsuario = async () => {
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = new User({ email: 'admin@catering.com', password: hashedPassword });
  await user.save();
  console.log('Usuario creado');
  mongoose.disconnect();
};

crearUsuario();
