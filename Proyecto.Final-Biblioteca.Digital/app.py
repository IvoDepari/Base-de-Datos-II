from flask import Flask, request, jsonify, render_template
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from routes.libros import libros_bp
from routes.prestamos import prestamos_bp

load_dotenv()

app = Flask(__name__)

# MongoDB connection
client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['biblioteca']
libros = db['libros']
prestamos = db['prestamos']

# Crear índices
libros.create_index([('isbn', 1)], unique=True)
libros.create_index([('titulo', 'text'), ('autor', 'text'), ('genero', 'text')])

# Registrar blueprints
app.register_blueprint(libros_bp)
app.register_blueprint(prestamos_bp)

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/libros')
def vista_libros():
    return render_template('libros.html')

@app.route('/prestamos')
def vista_prestamos():
    return render_template('prestamos.html')

@app.route('/populares')
def vista_populares():
    return render_template('populares.html')

# --- Endpoints Biblioteca Digital ---

# 1. Agregar libro
@app.route('/libros', methods=['POST'])
def agregar_libro():
    data = request.json
    required = ['titulo', 'autor', 'isbn', 'genero', 'anioPublicacion', 'copias']
    if not all(k in data for k in required):
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    libro = {
        'titulo': data['titulo'],
        'autor': data['autor'],
        'isbn': data['isbn'],
        'genero': data['genero'],
        'anioPublicacion': data['anioPublicacion'],
        'copias': data['copias'],
        'disponibles': data['copias']
    }
    try:
        libros.insert_one(libro)
        return jsonify({'mensaje': 'Libro agregado'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

# 2. Buscar libros (por título, autor o género)
@app.route('/libros', methods=['GET'])
def buscar_libros():
    criterio = request.args.get('busqueda', '')
    filtro = {'$text': {'$search': criterio}} if criterio else {}
    resultados = list(libros.find(filtro, {'_id': 0}))
    return jsonify(resultados)

# 3. Prestar libro
@app.route('/prestamos', methods=['POST'])
def prestar_libro():
    data = request.json
    isbn = data.get('isbn')
    usuario = data.get('usuario')
    libro = libros.find_one({'isbn': isbn})
    if not libro:
        return jsonify({'error': 'Libro no encontrado'}), 404
    if libro['disponibles'] < 1:
        return jsonify({'error': 'No hay copias disponibles'}), 400
    # Registrar préstamo
    prestamo = {
        'libroId': libro['_id'],
        'usuario': usuario,
        'fechaPrestamo': datetime.now(),
        'fechaDevolucion': None,
        'devuelto': False
    }
    prestamos.insert_one(prestamo)
    libros.update_one({'_id': libro['_id']}, {'$inc': {'disponibles': -1}})
    return jsonify({'mensaje': 'Préstamo registrado'}), 201

# 4. Devolver libro
@app.route('/devoluciones', methods=['POST'])
def devolver_libro():
    data = request.json
    prestamo_id = data.get('prestamoId')
    from bson import ObjectId
    prestamo = prestamos.find_one({'_id': ObjectId(prestamo_id)})
    if not prestamo or prestamo['devuelto']:
        return jsonify({'error': 'Préstamo no válido'}), 404
    prestamos.update_one({'_id': ObjectId(prestamo_id)}, {'$set': {'devuelto': True, 'fechaDevolucion': datetime.now()}})
    libros.update_one({'_id': prestamo['libroId']}, {'$inc': {'disponibles': 1}})
    return jsonify({'mensaje': 'Libro devuelto'}), 200

# 5. Reporte de libros más prestados
@app.route('/reportes/populares', methods=['GET'])
def reporte_populares():
    pipeline = [
        {'$group': {'_id': '$libroId', 'total': {'$sum': 1}}},
        {'$sort': {'total': -1}},
        {'$limit': 5},
        {'$lookup': {
            'from': 'libros',
            'localField': '_id',
            'foreignField': '_id',
            'as': 'libro'
        }},
        {'$unwind': '$libro'},
        {'$project': {'titulo': '$libro.titulo', 'autor': '$libro.autor', 'total': 1}}
    ]
    populares = list(prestamos.aggregate(pipeline))
    return jsonify(populares)

# --- Fin endpoints ---

if __name__ == '__main__':
    app.run(debug=True)
