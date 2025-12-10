/**
 * @fileoverview Funciones de utilidad
 * Conjunto de funciones auxiliares para filtrado, búsqueda y ordenamiento
 * @module utils/funciones
 */

/**
 * Filtra productos por categoría
 * @param {Array<Producto>} productos - Array de productos a filtrar
 * @param {string} categoria - Nombre de la categoría a filtrar
 * @returns {Array<Producto>} Productos filtrados por categoría
 * @example
 * const productosFrutas = filtrarPorCategoria(productos, 'Frutas');
 */
export function filtrarPorCategoria(productos, categoria) {
  let resultado = productos.filter(p => p.categoria.nombre === categoria)
  return resultado
}

/**
 * Busca productos por nombre
 * Búsqueda case-insensitive
 * @param {Array<Producto>} productos - Array de productos a buscar
 * @param {string} nombre - Término de búsqueda
 * @returns {Array<Producto>} Productos que coinciden con la búsqueda
 */
export function buscarProducto(productos, nombre) {
  let resultado = productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()))
  return resultado
}

/**
 * Ordena productos por precio
 * @param {Array<Producto>} productos - Array de productos a ordenar
 * @param {string} orden - Orden: 'asc' (ascendente) o 'desc' (descendente)
 * @returns {Array<Producto>} Productos ordenados por precio
 */
export function ordenarPorPrecio(productos, orden) {

  let ordenados = [...productos]
  if(orden === "asc"){
    ordenados = ordenados.sort((a, b) => a.precio - b.precio);
  }else{
    ordenados = ordenados.sort((a, b) => b.precio - a.precio);
  }
  
  return ordenados
}

/**
 * Obtiene productos con stock por debajo del mínimo
 * @param {Array<Producto>} productos - Array de productos a verificar
 * @returns {Array<Producto>} Productos con stock bajo
 */
export function comprobarStockMinimo(productos) {
 let resultado = productos.filter(p => p.stock < p.stockMinimo);
 return resultado
}

/**
 * Maneja la búsqueda de productos desde un input
 * @param {Array<Producto>} productosMostrados - Array de productos disponibles
 * @param {HTMLElement} inputBusqueda - Elemento input de búsqueda
 * @returns {Array<Producto>|undefined} Productos encontrados o undefined si el input está vacío
 */
export function manejarBusqueda(productosMostrados,inputBusqueda){
  const nombre = inputBusqueda.value.trim();
  if (nombre) {
    return buscarProducto(productosMostrados, nombre);
  }
}

/**
 * Maneja el filtrado de productos por categoría
 * @param {Array<Producto>} productosMostrados - Array de productos disponibles
 * @param {HTMLElement} selectCategoria - Elemento select de categoría
 * @returns {Array<Producto>|undefined} Productos filtrados o undefined si no hay selección
 */
export function manejarFiltro(productosMostrados,selectCategoria){
    const cat = selectCategoria.value;
  if(cat){
    return filtrarPorCategoria(productosMostrados,cat)
  }
}

/**
 * Maneja el ordenamiento de productos
 * @param {Array<Producto>} productosMostrados - Array de productos a ordenar
 * @param {HTMLElement} selectOrden - Elemento select de ordenamiento
 * @returns {Array<Producto>|undefined} Productos ordenados o undefined si no hay selección
 */
export function manejarOrden(productosMostrados,selectOrden){
  const orden = selectOrden.value;
  if(orden){
    return ordenarPorPrecio(productosMostrados,orden)
  }
}

export function manejarStock(productosMostrados){
  return comprobarStockMinimo(productosMostrados)
}

export function manejarMostrarTodos(selectCategoria,inputBusqueda,productosMostrados){
  productosMostrados = [...productosMostrados];
  inputBusqueda.value = '';
  selectCategoria.value = '';
  return productosMostrados;
}