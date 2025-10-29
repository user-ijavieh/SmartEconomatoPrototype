//* Modelo de los objetos Proveedores

export class Proveedor {
    constructor(id,nombre,contacto,telefono,email,direccion){
        this.id = id
        this.nombre = nombre
        this.contacto = contacto
        this.telefono = telefono
        this.email = email
        this.direccion = direccion
    }
}