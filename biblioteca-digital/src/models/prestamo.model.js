const mongoose = require('mongoose');

const prestamoSchema = new mongoose.Schema({
  libroId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Libro',
    required: [true, 'El ID del libro es obligatorio']
  },
  usuario: {
    type: String,
    required: [true, 'El nombre del usuario es obligatorio'],
    trim: true
  },
  fechaPrestamo: {
    type: Date,
    default: Date.now,
    required: true
  },
  fechaDevolucion: {
    type: Date,
    required: [
      function() { return this.devuelto === true; },
      'La fecha de devolución es obligatoria cuando el libro se marca como devuelto'
    ]
  },
  devuelto: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  versionKey: false
});

// Middleware para actualizar el contador de préstamos y disponibilidad del libro
prestamoSchema.pre('save', async function(next) {
  try {
    if (this.isNew) { // Solo para nuevos préstamos
      const Libro = mongoose.model('Libro');
      await Libro.findByIdAndUpdate(
        this.libroId,
        { 
          $inc: { 
            disponibles: -1,
            vecesPrestado: 1
          } 
        },
        { new: true, runValidators: true }
      );
    } else if (this.isModified('devuelto') && this.devuelto) {
      // Si se está marcando como devuelto
      this.fechaDevolucion = this.fechaDevolucion || new Date();
      
      const Libro = mongoose.model('Libro');
      await Libro.findByIdAndUpdate(
        this.libroId,
        { $inc: { disponibles: 1 } },
        { new: true, runValidators: true }
      );
    }
    next();
  } catch (error) {
    next(error);
  }
});

const Prestamo = mongoose.model('Prestamo', prestamoSchema);

module.exports = Prestamo;
