/**
 * @fileoverview Modelo de Producto
 * Define la estructura de un objeto Producto en el sistema
 * @module models/productos
 */

/**
 * Clase que representa un producto en el sistema
 * @class Producto
 * @param {number|string} id - Identificador único del producto
 * @param {string} nombre - Nombre del producto
 * @param {number} precio - Precio de venta del producto
 * @param {number} precioUnitario - Precio unitario del producto
 * @param {number} stock - Cantidad actual en stock
 * @param {number} stockMinimo - Cantidad mínima requerida en stock
 * @param {Categoria} categoria - Objeto de categoría asociada
 * @param {Proveedor} proveedor - Objeto de proveedor asociado
 * @param {string} unidadMedida - Unidad de medida (ej: 'kg', 'unidad', 'litro')
 * @param {string} marca - Marca del producto
 * @param {string} codigoBarras - Código de barras del producto
 * @param {string} fechaCaducidad - Fecha de caducidad del producto
 * @param {Array<string>} alergenos - Lista de alérgenos presentes
 * @param {string} descripcion - Descripción del producto
 * @param {string} imagen - URL o ruta de la imagen del producto
 * @param {boolean} activo - Estado del producto (activo/inactivo)
 */
export class Producto {

constructor(
    id,
    nombre,
    precio,
    precioUnitario,
    stock,
    stockMinimo,
    categoria,
    proveedor,
    unidadMedida,
    marca,
    codigoBarras,
    fechaCaducidad,
    alergenos,
    descripcion,
    imagen,
    activo
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.precioUnitario = precioUnitario;
    this.stock = stock;
    this.stockMinimo = stockMinimo;
    this.categoria = categoria;
    this.proveedor = proveedor;
    this.unidadMedida = unidadMedida;
    this.marca = marca;
    this.codigoBarras = codigoBarras;
    this.fechaCaducidad = fechaCaducidad;
    this.alergenos = alergenos;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.activo = activo;
  }


}

