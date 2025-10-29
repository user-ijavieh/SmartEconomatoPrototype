const API_BASE_URL = 'http://localhost:3000';
const TABLES = {
    proveedores: 'proveedores',
    categorias: 'categorias',
    productos: 'productos'
}

export const getProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.productos}`);
    return await response.json();
};

export const getCategories = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.categorias}`)
    return await response.json();
}

export const getSuppliers = async () => {
    const response = await fetch(`${API_BASE_URL}/${TABLES.proveedores}`)
    return await response.json();
}