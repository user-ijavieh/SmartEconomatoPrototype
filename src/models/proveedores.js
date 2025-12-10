/**
 * @fileoverview Modelo de Proveedor
 * Define la estructura de un objeto Proveedor en el sistema
 * @module models/proveedores
 */

/**
 * Clase que representa un proveedor en el sistema
 * @class Proveedor
 * @param {number|string} id - Identificador único del proveedor
 * @param {string} nombre - Nombre del proveedor
 * @param {string} contacto - Persona de contacto del proveedor
 * @param {string} telefono - Número de teléfono del proveedor
 * @param {string} email - Correo electrónico del proveedor
 * @param {string} direccion - Dirección del proveedor
 */
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