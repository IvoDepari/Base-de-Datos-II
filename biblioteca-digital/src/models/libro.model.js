const mongoose = require('mongoose');

const libroSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: [true, 'El título es obligatorio'],
    trim: true
  },
  autor: {
    type: String,
    required: [true, 'El autor es obligatorio'],
    trim: true
  },
  isbn: {
    type: String,
    required: [true, 'El ISBN es obligatorio'],
    unique: true,
    trim: true
  },
  genero: {
    type: String,
    required: [true, 'El género es obligatorio'],
    trim: true
  },
  anioPublicacion: {
    type: Number,
    required: [true, 'El año de publicación es obligatorio'],
    min: [1000, 'El año debe ser mayor a 1000'],
    max: [new Date().getFullYear(), 'El año no puede ser futuro']
  },
  copias: {
    type: Number,
    required: [true, 'El número de copias es obligatorio'],
    min: [0, 'El número de copias no puede ser negativo']
  },
  disponibles: {
    type: Number,
    required: [true, 'El número de copias disponibles es obligatorio'],
    min: [0, 'El número de copias disponibles no puede ser negativo'],
    validate: {
      validator: function(value) {
        return value <= this.copias;
      },
      message: 'Las copias disponibles no pueden ser mayores al total de copias'
    }
  },
  vecesPrestado: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para validar que las copias disponibles no sean mayores que el total de copias
libroSchema.pre('save', function(next) {
  if (this.isModified('copias') && this.disponibles > this.copias) {
    this.disponibles = this.copias;
  }
  next();
});

const Libro = mongoose.model('Libro', libroSchema);

module.exports = Libro;
