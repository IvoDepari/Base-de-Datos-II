const Libro = require('../models/libro.model');

// Agregar un nuevo libro
const agregarLibro = async (req, res) => {
  try {
    const { titulo, autor, isbn, genero, anioPublicacion, copias } = req.body;
    
    // Verificar si ya existe un libro con el mismo ISBN
    const libroExistente = await Libro.findOne({ isbn });
    if (libroExistente) {
      return res.status(400).json({
        mensaje: 'Ya existe un libro con este ISBN',
        libro: libroExistente
      });
    }

    const nuevoLibro = new Libro({
      titulo,
      autor,
      isbn,
      genero,
      anioPublicacion,
      copias: parseInt(copias, 10),
      disponibles: parseInt(copias, 10)
    });

    await nuevoLibro.save();
    
    res.status(201).json({
      mensaje: 'Libro agregado exitosamente',
      libro: nuevoLibro
    });
  } catch (error) {
    console.error('Error al agregar libro:', error);
    res.status(500).json({
      mensaje: 'Error al agregar el libro',
      error: error.message
    });
  }
};

// Buscar libros por título, autor o género
const buscarLibros = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        mensaje: 'Se requiere un término de búsqueda',
        sugerencia: 'Use ?query=su_busqueda en la URL'
      });
    }

    const regex = new RegExp(query, 'i'); // Búsqueda insensible a mayúsculas/minúsculas
    
    const libros = await Libro.find({
      $or: [
        { titulo: { $regex: regex } },
        { autor: { $regex: regex } },
        { genero: { $regex: regex } }
      ]
    }).sort({ titulo: 1 });

    if (libros.length === 0) {
      return res.status(404).json({
        mensaje: 'No se encontraron libros que coincidan con la búsqueda',
        busqueda: query
      });
    }

    res.json({
      total: libros.length,
      libros
    });
  } catch (error) {
    console.error('Error al buscar libros:', error);
    res.status(500).json({
      mensaje: 'Error al buscar libros',
      error: error.message
    });
  }
};

// Obtener libro por ID
const obtenerLibroPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const libro = await Libro.findById(id);
    
    if (!libro) {
      return res.status(404).json({
        mensaje: 'Libro no encontrado'
      });
    }
    
    res.json(libro);
  } catch (error) {
    console.error('Error al obtener libro por ID:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el libro',
      error: error.message
    });
  }
};

// Obtener todos los libros (con paginación)
const obtenerTodosLosLibros = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const [libros, total] = await Promise.all([
      Libro.find({})
        .sort({ titulo: 1 })
        .skip(skip)
        .limit(limit),
      Libro.countDocuments()
    ]);
    
    res.json({
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit),
      libros
    });
  } catch (error) {
    console.error('Error al obtener todos los libros:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los libros',
      error: error.message
    });
  }
};

// Actualizar un libro
const actualizarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    const { copias, ...datosActualizados } = req.body;
    
    // Si se actualizan las copias, actualizar también las disponibles
    if (copias !== undefined) {
      const libroActual = await Libro.findById(id);
      if (!libroActual) {
        return res.status(404).json({ mensaje: 'Libro no encontrado' });
      }
      
      const diferencia = copias - libroActual.copias;
      datosActualizados.disponibles = libroActual.disponibles + diferencia;
      datosActualizados.copias = copias;
      
      if (datosActualizados.disponibles < 0) {
        return res.status(400).json({
          mensaje: 'No se pueden reducir las copias por debajo del número de copias prestadas',
          copiasDisponibles: libroActual.disponibles,
          copiasPrestadas: libroActual.copias - libroActual.disponibles
        });
      }
    }
    
    const libroActualizado = await Libro.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    );
    
    if (!libroActualizado) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    
    res.json({
      mensaje: 'Libro actualizado exitosamente',
      libro: libroActualizado
    });
  } catch (error) {
    console.error('Error al actualizar el libro:', error);
    res.status(500).json({
      mensaje: 'Error al actualizar el libro',
      error: error.message
    });
  }
};

// Eliminar un libro
const eliminarLibro = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si el libro tiene préstamos activos
    const Prestamo = require('./prestamo.model');
    const prestamosActivos = await Prestamo.find({ 
      libroId: id, 
      devuelto: false 
    });
    
    if (prestamosActivos.length > 0) {
      return res.status(400).json({
        mensaje: 'No se puede eliminar el libro porque tiene préstamos activos',
        prestamosActivos: prestamosActivos.length
      });
    }
    
    const libroEliminado = await Libro.findByIdAndDelete(id);
    
    if (!libroEliminado) {
      return res.status(404).json({ mensaje: 'Libro no encontrado' });
    }
    
    // Opcional: Eliminar también los registros de préstamos asociados
    await Prestamo.deleteMany({ libroId: id });
    
    res.json({
      mensaje: 'Libro eliminado exitosamente',
      libro: libroEliminado
    });
  } catch (error) {
    console.error('Error al eliminar el libro:', error);
    res.status(500).json({
      mensaje: 'Error al eliminar el libro',
      error: error.message
    });
  }
};

// Obtener los libros más populares
const obtenerLibrosPopulares = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    
    const librosPopulares = await Libro.find({})
      .sort({ vecesPrestado: -1, titulo: 1 })
      .limit(limit);
    
    res.json({
      total: librosPopulares.length,
      libros: librosPopulares
    });
  } catch (error) {
    console.error('Error al obtener los libros más populares:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los libros más populares',
      error: error.message
    });
  }
};

// Verificar disponibilidad de un libro
const verificarDisponibilidad = async (req, res) => {
  try {
    const { isbn } = req.params;
    
    const libro = await Libro.findOne({ isbn });
    
    if (!libro) {
      return res.status(404).json({
        mensaje: 'Libro no encontrado',
        isbn,
        disponible: false
      });
    }
    
    res.json({
      titulo: libro.titulo,
      autor: libro.autor,
      isbn: libro.isbn,
      copiasTotales: libro.copias,
      copiasDisponibles: libro.disponibles,
      disponible: libro.disponibles > 0,
      vecesPrestado: libro.vecesPrestado
    });
  } catch (error) {
    console.error('Error al verificar disponibilidad:', error);
    res.status(500).json({
      mensaje: 'Error al verificar la disponibilidad del libro',
      error: error.message
    });
  }
};

module.exports = {
  agregarLibro,
  buscarLibros,
  obtenerLibroPorId,
  obtenerTodosLosLibros,
  actualizarLibro,
  eliminarLibro,
  obtenerLibrosPopulares,
  verificarDisponibilidad
};
