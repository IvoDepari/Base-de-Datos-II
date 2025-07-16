from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from database.conn_database import prestamos, libros
from models.prestamo import Prestamo

prestamos_bp = Blueprint('prestamos_bp', __name__)

@prestamos_bp.route('/api/prestamos', methods=['GET'])
def listar_prestamos():
    pipeline = [
        {"$lookup": {
            "from": "libros",
            "localField": "libroId",
            "foreignField": "_id",
            "as": "libro"
        }}
    ]
    prestamos_lista = list(prestamos.aggregate(pipeline))
    for p in prestamos_lista:
        p['_id'] = str(p['_id'])
        p['libroId'] = str(p['libroId'])
        if 'libro' in p and p['libro']:
            p['isbn'] = p['libro'][0].get('isbn', '')
            p['titulo_libro'] = p['libro'][0].get('titulo', '')
        else:
            p['isbn'] = ''
            p['titulo_libro'] = ''
        if 'fechaPrestamo' in p:
            p['fechaPrestamo'] = p['fechaPrestamo'].isoformat() if hasattr(p['fechaPrestamo'], 'isoformat') else p['fechaPrestamo']
        if 'fechaDevolucion' in p and p['fechaDevolucion']:
            p['fechaDevolucion'] = p['fechaDevolucion'].isoformat() if hasattr(p['fechaDevolucion'], 'isoformat') else p['fechaDevolucion']
        p.pop('libro', None)
    return jsonify(prestamos_lista)

@prestamos_bp.route('/api/prestamos', methods=['POST'])
def prestar_libro():
    data = request.json
    isbn = data.get('isbn')
    usuario = data.get('usuario')
    libro = libros.find_one({'isbn': isbn})
    if not libro:
        return jsonify({'error': 'Libro no encontrado'}), 404
    if libro['disponibles'] < 1:
        return jsonify({'error': 'No hay copias disponibles'}), 400
    prestamo = Prestamo(libroId=libro['_id'], usuario=usuario)
    prestamos.insert_one(prestamo.to_dict())
    libros.update_one({'_id': libro['_id']}, {'$inc': {'disponibles': -1}})
    return jsonify({'mensaje': 'Préstamo registrado'}), 201

@prestamos_bp.route('/api/devoluciones', methods=['POST'])
def devolver_libro():
    data = request.json
    prestamo_id = data.get('prestamoId')
    prestamo = prestamos.find_one({'_id': ObjectId(prestamo_id)})
    if not prestamo or prestamo['devuelto']:
        return jsonify({'error': 'Préstamo no válido'}), 404
    prestamos.update_one({'_id': ObjectId(prestamo_id)}, {'$set': {'devuelto': True, 'fechaDevolucion': datetime.now()}})
    libros.update_one({'_id': prestamo['libroId']}, {'$inc': {'disponibles': 1}})
    return jsonify({'mensaje': 'Libro devuelto'}), 200

@prestamos_bp.route('/api/prestamos/<prestamo_id>', methods=['DELETE'])
def eliminar_prestamo(prestamo_id):
    from bson import ObjectId
    prestamo = prestamos.find_one({'_id': ObjectId(prestamo_id)})
    if not prestamo:
        return jsonify({'error': 'Préstamo no encontrado'}), 404
    # Si el préstamo no fue devuelto, devolver el libro a stock
    if not prestamo.get('devuelto', False):
        libros.update_one({'_id': prestamo['libroId']}, {'$inc': {'disponibles': 1}})
    prestamos.delete_one({'_id': ObjectId(prestamo_id)})
    return jsonify({'mensaje': 'Préstamo eliminado'}), 200

@prestamos_bp.route('/api/reportes/populares', methods=['GET'])
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
        {'$project': {'titulo': '$libro.titulo', 'autor': '$libro.autor', 'total': 1, '_id': 0}}
    ]
    populares = list(prestamos.aggregate(pipeline))
    # Serializar ObjectId si quedara alguno
    for p in populares:
        if 'libroId' in p and isinstance(p['libroId'], ObjectId):
            p['libroId'] = str(p['libroId'])
    return jsonify(populares)
