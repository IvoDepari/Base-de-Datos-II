class Libro:
    def __init__(self, titulo, autor, isbn, genero, anioPublicacion, copias, disponibles=None):
        self.titulo = titulo
        self.autor = autor
        self.isbn = isbn
        self.genero = genero
        self.anioPublicacion = anioPublicacion
        self.copias = copias
        self.disponibles = disponibles if disponibles is not None else copias

    @classmethod
    def from_dict(cls, data):
        return cls(
            titulo=data.get('titulo'),
            autor=data.get('autor'),
            isbn=data.get('isbn'),
            genero=data.get('genero'),
            anioPublicacion=int(data.get('anioPublicacion')),
            copias=int(data.get('copias')),
            disponibles=int(data.get('disponibles', data.get('copias', 0)))
        )

    def to_dict(self):
        return {
            'titulo': self.titulo,
            'autor': self.autor,
            'isbn': self.isbn,
            'genero': self.genero,
            'anioPublicacion': self.anioPublicacion,
            'copias': self.copias,
            'disponibles': self.disponibles
        }

    def validar(self):
        campos = [self.titulo, self.autor, self.isbn, self.genero, self.anioPublicacion, self.copias]
        return all(campos)
