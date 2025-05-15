const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    trim: true
  },
  unidad: {
    type: String,
    enum: ['kg', 'unidad', 'litro', 'paquete','molde', 'bolson','jaula','bandeja','bolsax400','caja','bidonx5'],
    required: true
  },
  precioSinIVA: {
    type: Number,
    required: true,
    min: 0
  },
  precioConIVA: {
    type: Number,
    required: true,
    min: 0
  },
  categoria: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  proveedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proveedor',
    required: true // Asegúrate de que siempre haya un proveedor asociado
  },
  fecha: {
    type: Date,  // Campo para la fecha de creación
    default: Date.now  // Se asigna la fecha de creación automáticamente
  }
}, {
  timestamps: true // Esto agrega los campos createdAt y updatedAt automáticamente
});

// Middleware para asegurar que el precio con IVA se calcule correctamente
productoSchema.pre('save', function(next) {
  if (this.precioSinIVA) {
    this.precioConIVA = (this.precioSinIVA * 1.21).toFixed(2);  // Suponiendo un IVA del 21%
  }
  next();
});

module.exports = mongoose.model('Producto', productoSchema);


