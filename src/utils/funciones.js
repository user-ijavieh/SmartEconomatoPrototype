//! Funciones de utilidades

export function filtrarPorCategoria(productos, categoria) {
  let resultado = productos.filter(p => p.categoria.nombre === categoria)
  return resultado
}

export function buscarProducto(productos, nombre) {
  let resultado = productos.filter(p => p.nombre.toLowerCase().includes(nombre.toLowerCase()))
  return resultado
}

export function ordenarPorPrecio(productos, orden) {

  let ordenados = [...productos]
  if(orden === "asc"){
    ordenados = ordenados.sort((a, b) => a.precio - b.precio);
  }else{
    ordenados = ordenados.sort((a, b) => b.precio - a.precio);
  }
  
  return ordenados
}

export function comprobarStockMinimo(productos) {
 let resultado = productos.filter(p => p.stock < p.stockMinimo);
 return resultado
}

//! Funciones para el manejo de eventos

export function manejarBusqueda(productosMostrados,inputBusqueda){
  const nombre = inputBusqueda.value.trim();
  if (nombre) {
    return buscarProducto(productosMostrados, nombre);
  }
}

export function manejarFiltro(productosMostrados,selectCategoria){
    const cat = selectCategoria.value;
  if(cat){
    return filtrarPorCategoria(productosMostrados,cat)
  }
}

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