/**
 * @fileoverview Servicio de API
 * Proporciona funciones para comunicarse con el servidor backend
 * @module services/apiService
 */

const API_BASE_URL = 'http://localhost:3000';
const TABLES = {
    proveedores: 'proveedores',
    categorias: 'categorias',
    productos: 'productos'
}

/**
 * Obtiene todos los productos de la API
 * @async
 * @returns {Promise<Array>} Array de productos del servidor
 * @throws {Error} Si falla la solicitud HTTP
 */
export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.productos}`);
    return await response.json();
};

/**
 * Obtiene todas las categorías de la API
 * @async
 * @returns {Promise<Array>} Array de categorías del servidor
 * @throws {Error} Si falla la solicitud HTTP
 */
export const getCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.categorias}`)
    return await response.json();
}

/**
 * Obtiene todos los proveedores de la API
 * @async
 * @returns {Promise<Array>} Array de proveedores del servidor
 * @throws {Error} Si falla la solicitud HTTP
 */
export const getSuppliers = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.proveedores}`)
    return await response.json();
}

/**
 * Actualiza un producto existente en la API
 * @async
 * @param {number|string} id - ID del producto a actualizar
 * @param {Object} productData - Objeto con los datos del producto
 * @returns {Promise<Object>} Producto actualizado retornado por el servidor
 * @throws {Error} Si falla la solicitud HTTP o la respuesta no es OK
 */
export const updateProduct = async (id, productData) => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.productos}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        throw new Error(`Error al actualizar producto: ${response.statusText}`);
    }
    
    return await response.json();
}

/**
 * Crea un nuevo producto en la API
 * @async
 * @param {Object} productData - Objeto con los datos del nuevo producto
 * @returns {Promise<Object>} Producto creado retornado por el servidor
 * @throws {Error} Si falla la solicitud HTTP o la respuesta no es OK
 */
export const createProduct = async (productData) => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.productos}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
        throw new Error(`Error al crear producto: ${response.statusText}`);
    }
    
    return await response.json();
}