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