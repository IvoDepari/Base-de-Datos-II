const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Importar modelos
const Libro = require('./src/models/libro.model');
const Prestamo = require('./src/models/prestamo.model');

// Datos de ejemplo para libros
const librosEjemplo = [
  {
    titulo: 'Cien años de soledad',
    autor: 'Gabriel García Márquez',
    isbn: '978-0307474728',
    genero: 'Realismo mágico',
    anioPublicacion: 1967,
    copias: 5,
    disponibles: 5,
    vecesPrestado: 0
  },
  {
    titulo: 'Don Quijote de la Mancha',
    autor: 'Miguel de Cervantes',
    isbn: '978-8467036939',
    genero: 'Novela',
    anioPublicacion: 1605,
    copias: 3,
    disponibles: 3,
    vecesPrestado: 0
  },
  {
    titulo: '1984',
    autor: 'George Orwell',
    isbn: '978-0451524935',
    genero: 'Ciencia ficción',
    anioPublicacion: 1949,
    copias: 4,
    disponibles: 4,
    vecesPrestado: 0
  },
  {
    titulo: 'Orgullo y prejuicio',
    autor: 'Jane Austen',
    isbn: '978-0141439518',
    genero: 'Romance',
    anioPublicacion: 1813,
    copias: 4,
    disponibles: 4,
    vecesPrestado: 0
  },
  {
    titulo: 'El Principito',
    autor: 'Antoine de Saint-Exupéry',
    isbn: '978-0156012195',
    genero: 'Fábula',
    anioPublicacion: 1943,
    copias: 6,
    disponibles: 6,
    vecesPrestado: 0
  },
  {
    titulo: 'Crimen y castigo',
    autor: 'Fiódor Dostoievski',
    isbn: '978-8420697116',
    genero: 'Novela psicológica',
    anioPublicacion: 1866,
    copias: 3,
    disponibles: 3,
    vecesPrestado: 0
  },
  {
    titulo: 'El señor de los anillos',
    autor: 'J.R.R. Tolkien',
    isbn: '978-0544003415',
    genero: 'Fantasía',
    anioPublicacion: 1954,
    copias: 5,
    disponibles: 5,
    vecesPrestado: 0
  },
  {
    titulo: 'Rayuela',
    autor: 'Julio Cortázar',
    isbn: '978-0307474711',
    genero: 'Novela experimental',
    anioPublicacion: 1963,
    copias: 2,
    disponibles: 2,
    vecesPrestado: 0
  },
  {
    titulo: 'La sombra del viento',
    autor: 'Carlos Ruiz Zafón',
    isbn: '978-0307473059',
    genero: 'Misterio',
    anioPublicacion: 2001,
    copias: 4,
    disponibles: 4,
    vecesPrestado: 0
  },
  {
    titulo: 'Ficciones',
    autor: 'Jorge Luis Borges',
    isbn: '978-0307950923',
    genero: 'Cuentos',
    anioPublicacion: 1944,
    copias: 3,
    disponibles: 3,
    vecesPrestado: 0
  }
];

// Función para conectar a la base de datos
const conectarDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/biblioteca-digital', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conexión a MongoDB establecida correctamente');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};

// Función para poblar la base de datos
const poblarDB = async () => {
  try {
    // Conectar a la base de datos
    await conectarDB();
    
    // Limpiar colecciones existentes
    console.log('Eliminando datos existentes...');
    await Promise.all([
      Libro.deleteMany({}),
      Prestamo.deleteMany({})
    ]);
    
    // Insertar libros
    console.log('Insertando libros de ejemplo...');
    const librosInsertados = await Libro.insertMany(librosEjemplo);
    console.log(`${librosInsertados.length} libros insertados correctamente.`);
    
    // Crear algunos préstamos de ejemplo
    console.log('Creando préstamos de ejemplo...');
    
    // Obtener IDs de los libros insertados
    const libro1 = await Libro.findOne({ isbn: '978-0307474728' }); // Cien años de soledad
    const libro2 = await Libro.findOne({ isbn: '978-0451524935' }); // 1984
    const libro3 = await Libro.findOne({ isbn: '978-8420697116' }); // Crimen y castigo
    
    // Crear préstamos
    const prestamosEjemplo = [
      {
        libroId: libro1._id,
        usuario: 'María González',
        fechaPrestamo: new Date('2025-06-15'),
        fechaDevolucion: new Date('2025-06-30'),
        devuelto: true
      },
      {
        libroId: libro1._id,
        usuario: 'Carlos López',
        fechaPrestamo: new Date('2025-07-01'),
        devuelto: false
      },
      {
        libroId: libro2._id,
        usuario: 'Ana Martínez',
        fechaPrestamo: new Date('2025-06-20'),
        fechaDevolucion: new Date('2025-07-05'),
        devuelto: true
      },
      {
        libroId: libro3._id,
        usuario: 'Pedro Sánchez',
        fechaPrestamo: new Date('2025-07-08'),
        devuelto: false
      },
      {
        libroId: libro2._id,
        usuario: 'Laura Fernández',
        fechaPrestamo: new Date('2025-07-01'),
        fechaDevolucion: new Date('2025-07-08'),
        devuelto: true
      }
    ];
    
    // Insertar préstamos
    const prestamosInsertados = await Prestamo.insertMany(prestamosEjemplo);
    console.log(`${prestamosInsertados.length} préstamos creados correctamente.`);
    
    // Obtener estadísticas finales
    const totalLibros = await Libro.countDocuments();
    const totalPrestamos = await Prestamo.countDocuments();
    const prestamosActivos = await Prestamo.countDocuments({ devuelto: false });
    
    console.log('\n--- Estadísticas ---');
    console.log(`Total de libros: ${totalLibros}`);
    console.log(`Total de préstamos: ${totalPrestamos}`);
    console.log(`Préstamos activos: ${prestamosActivos}`);
    
    // Listar los 5 libros más populares
    const librosPopulares = await Libro.find()
      .sort({ vecesPrestado: -1, titulo: 1 })
      .limit(5);
    
    console.log('\n--- Libros más populares ---');
    librosPopulares.forEach((libro, index) => {
      console.log(`${index + 1}. ${libro.titulo} - ${libro.vecesPrestado} préstamos`);
    });
    
    // Cerrar la conexión
    await mongoose.connection.close();
    process.exit(0);
    
  } catch (error) {
    console.error('Error al poblar la base de datos:', error);
    process.exit(1);
  }
};

// Ejecutar el script
poblarDB();
