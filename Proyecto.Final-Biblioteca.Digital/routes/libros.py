from flask import Blueprint, request, jsonify
from database.conn_database import libros, prestamos
from models.libro import Libro

libros_bp = Blueprint('libros_bp', __name__)

@libros_bp.route('/api/libros', methods=['GET'])
def buscar_libros():
    criterio = request.args.get('busqueda', '')
    filtro = {'$text': {'$search': criterio}} if criterio else {}
    resultados = list(libros.find(filtro, {'_id': 0}))
    return jsonify(resultados)

@libros_bp.route('/api/libros/<isbn>', methods=['DELETE'])
def eliminar_libro(isbn):
    libro = libros.find_one({'isbn': isbn})
    if not libro:
        return jsonify({'error': 'Libro no encontrado'}), 404
    # Eliminar préstamos asociados a este libro
    prestamos.delete_many({'libroId': libro['_id']})
    libros.delete_one({'_id': libro['_id']})
    return jsonify({'mensaje': 'Libro y préstamos asociados eliminados'}), 200

@libros_bp.route('/api/libros', methods=['POST'])
def agregar_libro():
    data = request.json
    libro = Libro.from_dict(data)
    if not libro.validar():
        return jsonify({'error': 'Faltan campos requeridos'}), 400
    if libros.find_one({'isbn': libro.isbn}):
        return jsonify({'error': 'ISBN ya existe'}), 400
    libros.insert_one(libro.to_dict())
    return jsonify({'mensaje': 'Libro agregado'}), 201