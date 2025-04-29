Replica Set: Un Replica Set en MongoDB es un grupo de instancias de MongoDB que mantienen los mismos datos, proporcionando redundancia y alta disponibilidad. Ventajas:

    Tolerancia a fallos: Si un nodo primario falla, otro nodo puede tomar su lugar automáticamente.
    Disponibilidad: Los datos están accesibles incluso si un nodo está caído.
    Balanceo de carga: Las operaciones de lectura pueden distribuirse entre los nodos secundarios.
    Mantenimiento sin downtime: Se pueden realizar mantenimientos en nodos sin afectar la disponibilidad.

Sharding: El sharding es una técnica de particionamiento horizontal que distribuye los datos a través de múltiples servidores. Beneficios para bases de datos de alto volumen:

    Escalabilidad horizontal: Permite manejar grandes volúmenes de datos distribuyéndolos en varios servidores.
    Mayor rendimiento: Las operaciones se distribuyen entre los shards, reduciendo la carga en cada servidor individual.
    Capacidad de almacenamiento: Supera los límites de almacenamiento de un solo servidor.
    Flexibilidad: Se pueden añadir más shards según crece la necesidad.
