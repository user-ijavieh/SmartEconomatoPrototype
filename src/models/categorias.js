/**
 * @fileoverview Modelo de Categoría
 * Define la estructura de un objeto Categoría en el sistema
 * @module models/categorias
 */

/**
 * Clase que representa una categoría de productos
 * @class Categoria
 * @param {number|string} id - Identificador único de la categoría
 * @param {string} nombre - Nombre de la categoría
 * @param {string} descripcion - Descripción de la categoría
 */
export class Categoria {
    constructor(id,nombre,descripcion){
        this.id = id
        this.nombre = nombre
        this.descripcion = descripcion
    }
}