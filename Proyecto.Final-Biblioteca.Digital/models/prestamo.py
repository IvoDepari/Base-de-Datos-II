from datetime import datetime

class Prestamo:
    def __init__(self, libroId, usuario, fechaPrestamo=None, fechaDevolucion=None, devuelto=False):
        self.libroId = libroId
        self.usuario = usuario
        self.fechaPrestamo = fechaPrestamo or datetime.now()
        self.fechaDevolucion = fechaDevolucion
        self.devuelto = devuelto

    @classmethod
    def from_dict(cls, data):
        return cls(
            libroId=data.get('libroId'),
            usuario=data.get('usuario'),
            fechaPrestamo=data.get('fechaPrestamo'),
            fechaDevolucion=data.get('fechaDevolucion'),
            devuelto=data.get('devuelto', False)
        )

    def to_dict(self):
        return {
            'libroId': self.libroId,
            'usuario': self.usuario,
            'fechaPrestamo': self.fechaPrestamo,
            'fechaDevolucion': self.fechaDevolucion,
            'devuelto': self.devuelto
        }
