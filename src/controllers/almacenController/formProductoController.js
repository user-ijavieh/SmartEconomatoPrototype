//* Funciones de la API
import { loadProducts } from './almacenController.js';
import { renderizarTabla, getTabla, getResumen } from '../../view/uiAlmacen.js';
import { messageService } from '../../services/messageService.js';

export function initFormProducto(toggleFormularioProducto, actualizarProductosMostrados) {
    document.getElementById('btnCancelarProducto').addEventListener('click', () => {
        toggleFormularioProducto();
    });

    document.getElementById('formProducto').addEventListener('submit', async (e) => {
        e.preventDefault();
        await manejarSubmitProducto(toggleFormularioProducto, actualizarProductosMostrados);
    });
}

async function manejarSubmitProducto(toggleFormularioProducto, actualizarProductosMostrados) {
    const productos = await loadProducts();
    const elementoConMaxId = productos.reduce((max, actual) => {
        const maxId = parseInt(max.id, 10);
        const actualId = parseInt(actual.id, 10);
        
        return (maxId > actualId) ? max : actual;
    }, productos[0]);
    
    const nuevoProducto = {
        id: String(parseInt(elementoConMaxId.id, 10) + 1),
        nombre: document.getElementById('nombreProducto').value,
        precio: parseFloat(document.getElementById('precioProducto').value),
        precioUnitario: parseFloat(document.getElementById('precioProducto').value),
        stock: parseInt(document.getElementById('stockProducto').value),
        stockMinimo: parseInt(document.getElementById('stockMinimoProducto').value),
        categoriaId: parseInt(document.getElementById('categoriaProducto').value),
        proveedorId: parseInt(document.getElementById('proveedorProducto').value),
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
