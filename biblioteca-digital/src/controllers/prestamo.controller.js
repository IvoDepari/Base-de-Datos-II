const Prestamo = require('../models/prestamo.model');
const Libro = require('../models/libro.model');

// Registrar un nuevo préstamo
const prestarLibro = async (req, res) => {
  const session = await Libro.startSession();
  session.startTransaction();
  
  try {
    const { isbn, usuario } = req.body;
    
    // 1. Buscar el libro por ISBN
    const libro = await Libro.findOne({ isbn }).session(session);
    
    if (!libro) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        mensaje: 'Libro no encontrado',
        isbn
      });
    }
    
    // 2. Verificar disponibilidad
    if (libro.disponibles <= 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        mensaje: 'No hay copias disponibles de este libro',
        titulo: libro.titulo,
        disponibles: libro.disponibles,
        copiasTotales: libro.copias
      });
    }
    
    // 3. Crear el préstamo
    const nuevoPrestamo = new Prestamo({
      libroId: libro._id,
      usuario,
      fechaPrestamo: new Date()
    });
    
    // 4. Actualizar el contador de disponibles
    libro.disponibles -= 1;
    libro.vecesPrestado += 1;
    
    // 5. Guardar los cambios en una transacción
    await Promise.all([
      nuevoPrestamo.save({ session }),
      libro.save({ session })
    ]);
    
    await session.commitTransaction();
    session.endSession();
    
    res.status(201).json({
      mensaje: 'Préstamo registrado exitosamente',
      prestamo: nuevoPrestamo,
      libro: {
        titulo: libro.titulo,
        isbn: libro.isbn,
        copiasDisponibles: libro.disponibles
      }
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error al registrar el préstamo:', error);
    res.status(500).json({
      mensaje: 'Error al registrar el préstamo',
      error: error.message
    });
  }
};

// Devolver un libro prestado
const devolverLibro = async (req, res) => {
  const session = await Prestamo.startSession();
  session.startTransaction();
  
  try {
    const { prestamoId } = req.params;
    
    // 1. Buscar el préstamo
    const prestamo = await Prestamo.findById(prestamoId).session(session);
    
    if (!prestamo) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        mensaje: 'Préstamo no encontrado',
        prestamoId
      });
    }
    
    if (prestamo.devuelto) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        mensaje: 'Este libro ya fue devuelto anteriormente',
        fechaDevolucion: prestamo.fechaDevolucion
      });
    }
    
    // 2. Actualizar el préstamo
    prestamo.devuelto = true;
    prestamo.fechaDevolucion = new Date();
    
    // 3. Actualizar el contador de disponibles en el libro
    const libro = await Libro.findById(prestamo.libroId).session(session);
    if (!libro) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        mensaje: 'Libro asociado al préstamo no encontrado',
        libroId: prestamo.libroId
      });
    }
    
    libro.disponibles += 1;
    
    // 4. Guardar los cambios
    await Promise.all([
      prestamo.save({ session }),
      libro.save({ session })
    ]);
    
    await session.commitTransaction();
    session.endSession();
    
    res.json({
      mensaje: 'Libro devuelto exitosamente',
      prestamo: {
        _id: prestamo._id,
        libro: {
          titulo: libro.titulo,
          isbn: libro.isbn
        },
        usuario: prestamo.usuario,
        fechaPrestamo: prestamo.fechaPrestamo,
        fechaDevolucion: prestamo.fechaDevolucion
      },
      libro: {
        titulo: libro.titulo,
        isbn: libro.isbn,
        copiasDisponibles: libro.disponibles,
        copiasTotales: libro.copias
      }
    });
    
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    
    console.error('Error al devolver el libro:', error);
    res.status(500).json({
      mensaje: 'Error al procesar la devolución',
      error: error.message
    });
  }
};

// Obtener todos los préstamos (con filtros opcionales)
const obtenerPrestamos = async (req, res) => {
  try {
    const { devuelto, usuario, libroId, fechaInicio, fechaFin } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Construir el filtro
    const filtro = {};
    
    if (devuelto !== undefined) {
      filtro.devuelto = devuelto === 'true';
    }
    
    if (usuario) {
      filtro.usuario = { $regex: usuario, $options: 'i' };
    }
    
    if (libroId) {
      filtro.libroId = libroId;
    }
    
    if (fechaInicio || fechaFin) {
      filtro.fechaPrestamo = {};
      if (fechaInicio) {
        filtro.fechaPrestamo.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        // Añadir un día completo para incluir la fecha de fin
        const fechaFinObj = new Date(fechaFin);
        fechaFinObj.setDate(fechaFinObj.getDate() + 1);
        filtro.fechaPrestamo.$lt = fechaFinObj;
      }
    }
    
    // Obtener préstamos con paginación
    const [prestamos, total] = await Promise.all([
      Prestamo.find(filtro)
        .populate('libroId', 'titulo isbn autor')
        .sort({ fechaPrestamo: -1 })
        .skip(skip)
        .limit(limit),
      Prestamo.countDocuments(filtro)
    ]);
    
    res.json({
      total,
      pagina: page,
      totalPaginas: Math.ceil(total / limit),
      prestamos: prestamos.map(p => ({
        _id: p._id,
        libro: {
          _id: p.libroId._id,
          titulo: p.libroId.titulo,
          isbn: p.libroId.isbn,
          autor: p.libroId.autor
        },
        usuario: p.usuario,
        fechaPrestamo: p.fechaPrestamo,
        fechaDevolucion: p.fechaDevolucion,
        devuelto: p.devuelto,
        diasPrestado: p.devuelto ? 
          Math.ceil((p.fechaDevolucion - p.fechaPrestamo) / (1000 * 60 * 60 * 24)) :
          Math.ceil((new Date() - p.fechaPrestamo) / (1000 * 60 * 60 * 24))
      }))
    });
    
  } catch (error) {
    console.error('Error al obtener los préstamos:', error);
    res.status(500).json({
      mensaje: 'Error al obtener los préstamos',
      error: error.message
    });
  }
};

// Obtener un préstamo por ID
const obtenerPrestamoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const prestamo = await Prestamo.findById(id)
      .populate('libroId', 'titulo isbn autor');
    
    if (!prestamo) {
      return res.status(404).json({
        mensaje: 'Préstamo no encontrado',
        id
      });
    }
    
    res.json({
      _id: prestamo._id,
      libro: {
        _id: prestamo.libroId._id,
        titulo: prestamo.libroId.titulo,
        isbn: prestamo.libroId.isbn,
        autor: prestamo.libroId.autor
      },
      usuario: prestamo.usuario,
      fechaPrestamo: prestamo.fechaPrestamo,
      fechaDevolucion: prestamo.fechaDevolucion,
      devuelto: prestamo.devuelto,
      diasPrestado: prestamo.devuelto ? 
        Math.ceil((prestamo.fechaDevolucion - prestamo.fechaPrestamo) / (1000 * 60 * 60 * 24)) :
        Math.ceil((new Date() - prestamo.fechaPrestamo) / (1000 * 60 * 60 * 24))
    });
    
  } catch (error) {
    console.error('Error al obtener el préstamo:', error);
    res.status(500).json({
      mensaje: 'Error al obtener el préstamo',
      error: error.message
    });
  }
};

// Generar reporte de préstamos por período
const generarReportePrestamos = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({
        mensaje: 'Se requieren las fechas de inicio y fin para generar el reporte',
        ejemplo: '/reporte-prestamos?fechaInicio=2023-01-01&fechaFin=2023-12-31'
      });
    }
    
    const fechaInicioObj = new Date(fechaInicio);
    const fechaFinObj = new Date(fechaFin);
    
    // Ajustar la fecha de fin para incluir todo el día
    fechaFinObj.setDate(fechaFinObj.getDate() + 1);
    
    // Obtener los 5 libros más prestados en el período
    const librosMasPrestados = await Prestamo.aggregate([
      {
        $match: {
          fechaPrestamo: { $gte: fechaInicioObj, $lt: fechaFinObj }
        }
      },
      {
        $group: {
          _id: '$libroId',
          totalPrestamos: { $sum: 1 }
        }
      },
      { $sort: { totalPrestamos: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'libros',
          localField: '_id',
          foreignField: '_id',
          as: 'libro'
        }
      },
      { $unwind: '$libro' },
      {
        $project: {
          _id: 0,
          titulo: '$libro.titulo',
          totalPrestamos: 1
        }
      }
    ]);
    
    res.json({
      periodo: {
        fechaInicio: fechaInicioObj,
        fechaFin: new Date(fechaFinObj.getTime() - 24 * 60 * 60 * 1000) // Restar un día para mostrar la fecha correcta
      },
      totalLibros: librosMasPrestados.length,
      librosMasPrestados
    });
    
  } catch (error) {
    console.error('Error al generar el reporte de préstamos:', error);
    res.status(500).json({
      mensaje: 'Error al generar el reporte de préstamos',
      error: error.message
    });
  }
};

module.exports = {
  prestarLibro,
  devolverLibro,
  obtenerPrestamos,
  obtenerPrestamoPorId,
  generarReportePrestamos
};
