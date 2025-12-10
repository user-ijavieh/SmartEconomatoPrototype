/**
 * @fileoverview Interfaz de usuario del almacén
 * Proporciona funciones para gestionar categorías y proveedores en formularios
 * @module view/uiAlmacen
 */

import { getCategories, getSuppliers } from "../services/apiService.js";

/**
 * Carga las categorías desde la API en el select del formulario
 * @async
 * @returns {Promise<void>}
 */
export async function cargarCategoriasDesdeAPI() {
  try {
    const categorias = await getCategories();
    const selectCategoria = document.getElementById('categoriaProducto');
    
    if (!selectCategoria) {
      console.warn('El select de categorías del formulario no fue encontrado');
      return;
    }
    
    // Limpiar opciones previas (mantener la opción por defecto)
    selectCategoria.innerHTML = '<option value="">-- Seleccione --</option>';
    
    // Añadir categorías
    categorias.forEach(categoria => {
      const option = document.createElement('option');
      option.value = categoria.id;
      option.textContent = categoria.nombre;
      selectCategoria.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar las categorías:', error);
  }
}

/**
 * Carga los proveedores en el select del formulario de nuevo producto
 */
export async function cargarProveedoresEnFormulario() {
  try {
    const proveedores = await getSuppliers();
    const selectProveedor = document.getElementById('proveedorProducto');
    
    if (!selectProveedor) {
      console.warn('El select de proveedores del formulario no fue encontrado');
      return;
    }
    
    // Limpiar opciones previas (mantener la opción por defecto)
    selectProveedor.innerHTML = '<option value="">-- Seleccione --</option>';
    
    // Añadir proveedores
    proveedores.forEach(proveedor => {
      const option = document.createElement('option');
      option.value = proveedor.id;
      option.textContent = proveedor.nombre;
      selectProveedor.appendChild(option);
    });
  } catch (error) {
    console.error('Error al cargar los proveedores:', error);
  }
}