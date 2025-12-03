import { getCategories } from "../services/apiService.js";

// Funciones para obtener elementos del DOM dinámicamente
export const getTabla = () => document.querySelector('#tablaProductos tbody');
export const getResumen = () => document.querySelector('#resumen');
export const getInputBusqueda = () => document.querySelector('#busqueda');
export const getControles = () => document.querySelector('.controles');
export const getSelectCategoria = () => document.querySelector('#categoriaSelect');
export const getHeaderPrecio = () => document.getElementById('headerPrecio');
export const getHeaderId = () => document.getElementById('headerId');
export const getHeaderStock = () => document.getElementById('headerStock');

export async function renderizarTabla(datos, tabla, resumen) {
  tabla.innerHTML = '';
  if (datos.length === 0) {
    tabla.innerHTML = '<tr><td colspan="8" style="text-align:center;">No se encontraron productos</td></tr>';
    resumen.textContent = '';
    return;
  }

  datos.forEach(p => {
    const fila = document.createElement('tr');
    if (p.stock < p.stockMinimo) fila.classList.add('alerta');
    const categoriaNombre = p.categoria?.nombre ?? 'Sin categoría';
    const proveedorNombre = p.proveedor?.nombre ?? '';
    const proveedorDireccion = p.proveedor?.direccion ?? '';

    fila.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nombre}</td>
      <td>${categoriaNombre}</td>
      <td>${p.precio.toFixed(2)}</td>
      <td>${p.stock}</td>
      <td>${p.stockMinimo}</td>
      <td>${proveedorNombre}</td>
      <td>${proveedorDireccion}</td>
    `;
    tabla.appendChild(fila);
  });

  const totalProductos = datos.length;
  generateCategory(await getCategories())
  const valorTotal = datos.reduce((acc, p) => acc + p.precio * p.stock, 0).toFixed(2);
  resumen.textContent = `Productos mostrados: ${totalProductos} | Valor total del stock: ${valorTotal} €`;
}

export function generateCategory(categorias){
  const selectCategoria = document.getElementById("categoriaSelect")

  if (!selectCategoria) {
    console.warn('El select de categorías no fue encontrado en el DOM');
    return;
  }

  // Limpiar opciones previas
  selectCategoria.innerHTML = ""

  // Opción por defecto
  const optionDefault = document.createElement('option')
  optionDefault.value = ""
  optionDefault.textContent = "-- Categoría --"
  selectCategoria.appendChild(optionDefault)

  // Añadir categorías
  categorias.forEach( categoria => {
    try {
      const option = document.createElement('option')
      option.value = categoria.nombre
      option.textContent = categoria.nombre
      selectCategoria.appendChild(option)
    } catch (error) {
      console.error('Error al añadir categoría:', error, categoria);
    }
  })
}

// Función para cargar categorías desde la API al iniciar la página
export async function cargarCategoriasDesdeAPI() {
  try {
    console.log('Cargando categorías desde la API...');
    const categorias = await getCategories();
    console.log('Categorías cargadas:', categorias);
    generateCategory(categorias);
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
  }
}