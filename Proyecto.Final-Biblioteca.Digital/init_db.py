from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
db = client['biblioteca']
libros = db['libros']
prestamos = db['prestamos']

# Limpiar colecciones
libros.delete_many({})
prestamos.delete_many({})

# Datos de ejemplo
libros.insert_many([
    {
        "titulo": "Cien años de soledad",
        "autor": "Gabriel García Márquez",
        "isbn": "978-0307389732",
        "genero": "Realismo mágico",
        "anioPublicacion": 1967,
        "copias": 3,
        "disponibles": 3
    },
    {
        "titulo": "El principito",
        "autor": "Antoine de Saint-Exupéry",
        "isbn": "978-0156013987",
        "genero": "Fábula",
        "anioPublicacion": 1943,
        "copias": 2,
        "disponibles": 2
    }
])

print("Base de datos inicializada con libros de ejemplo.")
