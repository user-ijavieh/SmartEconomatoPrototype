/**
 * @fileoverview Controlador del formulario de creación de productos
 * Maneja la validación y envío de nuevos productos
 * @module controllers/almacenController/formProductoController
 */

//* Funciones de la API
import { loadProducts } from './almacenController.js';
import { renderizarTabla, getTabla, getResumen } from '../../view/uiOrders.js';
import { messageService } from '../../services/messageService.js';

// Expresiones regulares para validación
const nombreRegex = /^[A-Za-zÁ-ú0-9\s\.\.\-]{3,50}$/;
const precioRegex = /^\d+(\.\d{1,2})?$/;

/**
 * Valida el nombre del producto utilizando expresión regular
 * @param {string} nombre - Nombre del producto a validar
 * @returns {boolean} true si el nombre es válido, false en caso contrario
 * @example
 * if (validarNombre('Manzana Roja')) {
 *   console.log('Nombre válido');
 * }
 */
function validarNombre(nombre) {
    if (!nombre.trim()) {
        messageService.showError('El nombre del producto es obligatorio');
        return false;
    }
    if (!nombreRegex.test(nombre.trim())) {
        messageService.showError('El nombre debe tener 3-50 caracteres (letras, números, guiones y puntos)');
        return false;
    }
    return true;
}

/**
 * Valida el precio del producto
 * Verifica que sea un número positivo con máximo 2 decimales
 * @param {string} precio - Precio del producto a validar
 * @returns {boolean} true si el precio es válido, false en caso contrario
 */
function validarPrecio(precio) {
    const precioNum = parseFloat(precio);
    if (!precio.trim() || isNaN(precioNum)) {
        messageService.showError('El precio es obligatorio y debe ser un número');
        return false;
    }
    if (precioNum <= 0) {
        messageService.showError('El precio debe ser mayor a 0');
        return false;
    }
    if (!precioRegex.test(precio.trim())) {
        messageService.showError('El precio debe tener máximo 2 decimales');
        return false;
    }
    return true;
}

/**
 * Valida el stock del producto
 * Verifica que sea un número entero no-negativo
 * @param {string} stock - Cantidad de stock a validar
 * @returns {boolean} true si el stock es válido, false en caso contrario
 */
function validarStock(stock) {
    const stockNum = parseInt(stock);
    if (!stock.trim() || isNaN(stockNum)) {
        messageService.showError('El stock es obligatorio y debe ser un número');
        return false;
    }
    if (stockNum < 0) {
        messageService.showError('El stock no puede ser negativo');
        return false;
    }
    return true;
}

/**
 * Inicializa el formulario de producto con event listeners
 * Configura el evento de cancelación y envío del formulario
 * @param {Function} toggleFormularioProducto - Función para alternar visibilidad del formulario
 * @param {Function} actualizarProductosMostrados - Callback para actualizar lista de productos
 * @returns {void}
 */
export function initFormProducto(toggleFormularioProducto, actualizarProductosMostrados) {
    document.getElementById('btnCancelarProducto').addEventListener('click', () => {
        toggleFormularioProducto();
    });

    document.getElementById('formProducto').addEventListener('submit', async (e) => {
        e.preventDefault();
        await manejarSubmitProducto(toggleFormularioProducto, actualizarProductosMostrados);
    });
}

/**
 * Maneja el envío del formulario de producto
 * Valida todos los campos, crea el producto y lo envía a la API
 * @async
 * @param {Function} toggleFormularioProducto - Función para alternar visibilidad del formulario
 * @param {Function} actualizarProductosMostrados - Callback para actualizar lista de productos
 * @returns {Promise<void>}
 * @throws {Error} Si hay error en la conexión con el servidor
 */
async function manejarSubmitProducto(toggleFormularioProducto, actualizarProductosMostrados) {
    // Obtener valores del formulario
    const nombre = document.getElementById('nombreProducto').value;
    const precio = document.getElementById('precioProducto').value;
    const stock = document.getElementById('stockProducto').value;
    const stockMinimo = document.getElementById('stockMinimoProducto').value;
    const categoria = document.getElementById('categoriaProducto').value;
    const proveedor = document.getElementById('proveedorProducto').value;

    // Validar campos
    if (!validarNombre(nombre)) return;
    if (!validarPrecio(precio)) return;
    if (!validarStock(stock)) return;
    if (!validarStock(stockMinimo)) return;
    
    if (!categoria.trim()) {
        messageService.showError('Debe seleccionar una categoría');
        return;
    }
    
    if (!proveedor.trim()) {
        messageService.showError('Debe seleccionar un proveedor');
        return;
    }

    const productos = await loadProducts();
    const elementoConMaxId = productos.reduce((max, actual) => {
        const maxId = parseInt(max.id, 10);
        const actualId = parseInt(actual.id, 10);
        
        return (maxId > actualId) ? max : actual;
    }, productos[0]);
    
    const nuevoProducto = {
        id: String(parseInt(elementoConMaxId.id, 10) + 1),
        nombre: nombre.trim(),
        precio: parseFloat(precio),
        precioUnitario: parseFloat(precio),
        stock: parseInt(stock),
        stockMinimo: parseInt(stockMinimo),
        categoriaId: parseInt(categoria),
        proveedorId: parseInt(proveedor),
        unidadMedida: 'unidad',
        marca: '',
        codigoBarras: '',
        fechaCaducidad: '',
        alergenos: [],
        descripcion: '',
        imagen: '',
        activo: true
    };

    try {
        const response = await fetch('http://localhost:3000/productos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoProducto)
        });

        if (response.ok) {
            messageService.showSuccess('Producto agregado exitosamente');
            toggleFormularioProducto();
            document.getElementById('formProducto').reset();
            
            // Recargar productos
            const productosActualizados = await loadProducts();
            actualizarProductosMostrados(productosActualizados);
            
            const tabla = getTabla();
            const resumen = getResumen();
            renderizarTabla(productosActualizados, tabla, resumen);
        } else {
            messageService.showError('Error al agregar el producto');
        }
    } catch (error) {
        console.error('Error:', error);
        messageService.showError('Error al conectar con el servidor');
    }
}