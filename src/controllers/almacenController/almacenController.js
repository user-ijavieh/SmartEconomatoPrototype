/**
 * @fileoverview Controlador del almacén
 * Maneja la carga, visualización y filtrado de productos
 * @module controllers/almacenController/almacenController
 */

//* Modelos
import { Producto } from '../../models/productos.js';
import { Proveedor } from '../../models/proveedores.js';
import { Categoria } from '../../models/categorias.js';
import { cargarCategoriasDesdeAPI, cargarProveedoresEnFormulario, renderizarTabla, getTabla, getResumen } from '../../view/uiAlmacen.js';

//* Funciones de la API
import { getProducts , getSuppliers , getCategories } from '../../services/apiService.js'

//* Controlador del formulario
import { initFormProducto } from './formProductoController.js';

/**
 * Carga todos los productos desde la API y los modela
 * @async
 * @returns {Promise<Array<Producto>>} Array de productos modelados
 * @throws {Error} Si hay error al conectar con la API
 */
export const loadProducts = async () => {
    const productosCrudos = await getProducts()
    const categorias = await loadCategories()
    const proveedores = await loadSuppliers()

    const productosModelados = productosCrudos.map(data =>{
        let categoria = categorias.find(p => p.id == data.categoriaId)
        let proveedor = proveedores.find(p => p.id == data.proveedorId)
        return new Producto(
            data.id,
            data.nombre,
            data.precio,
            data.precioUnitario,
            data.stock,
            data.stockMinimo,
            categoria,
            proveedor,
            data.unidadMedida,
            data.marca,
            data.codigoBarras,
            data.fechaCaducidad,
            data.alergenos,
            data.descripcion,
            data.imagen,
            data.activo
        )
    })
    console.log(productosModelados)
    return productosModelados
}

/**
 * Carga todas las categorías desde la API y las modela
 * @async
 * @returns {Promise<Array<Categoria>>} Array de categorías modeladas
 * @throws {Error} Si hay error al conectar con la API
 */
export const loadCategories = async () => {
    const categoriasCrudas = await getCategories()

    const categoriasModeladas = categoriasCrudas.map(data => {
        return new Categoria(
            data.id,
            data.nombre,
            data.descripcion
        )

    })

    return categoriasModeladas
}

/**
 * Carga todos los proveedores desde la API y los modela
 * @async
 * @returns {Promise<Array<Proveedor>>} Array de proveedores modelados
 * @throws {Error} Si hay error al conectar con la API
 */
export const loadSuppliers = async () => {
    const proveedoresCrudos = await getSuppliers()

    const proveedoresModelados = proveedoresCrudos.map(data => {
        return new Proveedor(
            data.id,
            data.nombre,
            data.contacto,
            data.telefono,
            data.email,
            data.direccion
        )

    })

    return proveedoresModelados
}

// Variable que almacena los productos mostrados
let productosMostrados = [];

/**
 * Alterna la visibilidad del formulario de nuevo producto
 * Limpia el formulario cuando se oculta
 * @returns {void}
 */
function toggleFormularioProducto() {
    const formulario = document.getElementById('formularioNuevoProducto');
    if (formulario) {
        const isVisible = formulario.style.display !== 'none';
        formulario.style.display = isVisible ? 'none' : 'block';
        
        // Limpiar el formulario cuando se oculta
        if (isVisible) {
            document.getElementById('formProducto').reset();
        }
    }
}

/**
 * Inicializa el controlador del almacén
 * Carga productos, categorías, proveedores y configura event listeners
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si hay error durante la inicialización
 */
// Función de inicialización
export async function init() {
    try {
        // Cargar productos
        productosMostrados = await loadProducts();

        // Cargar categorías y proveedores
        await cargarCategoriasDesdeAPI();
        await cargarProveedoresEnFormulario();

        // Renderizar tabla
        const tabla = getTabla();
        const resumen = getResumen();
        await renderizarTabla(productosMostrados, tabla, resumen);

        // Referencias a elementos
        const controles = document.querySelector('.controles');
        const inputBusqueda = document.getElementById('busqueda');
        const selectCategoria = document.getElementById('categoriaSelect');
        
        if (!controles) {
            console.error('No se encontró el elemento .controles');
            return;
        }

        // Eventos de botones
        controles.addEventListener('click', (e) => {
            const btnId = e.target.id;

            if (btnId === 'btnBuscar') {
                const termino = inputBusqueda.value.toLowerCase().trim();
                const filtrados = termino 
                    ? productosMostrados.filter(p =>
                        p.nombre.toLowerCase().includes(termino) ||
                        p.categoria?.nombre.toLowerCase().includes(termino) ||
                        p.proveedor?.nombre.toLowerCase().includes(termino)
                    )
                    : productosMostrados;
                renderizarTabla(filtrados, tabla, resumen);
            }

            if (btnId === 'btnFiltrarCategoria') {
                const cat = selectCategoria.value;
                const filtrados = cat 
                    ? productosMostrados.filter(p => p.categoria?.nombre === cat)
                    : productosMostrados;
                renderizarTabla(filtrados, tabla, resumen);
            }

            if (btnId === 'btnStock') {
                const stockBajo = productosMostrados.filter(p => p.stock <= p.stockMinimo);
                renderizarTabla(stockBajo, tabla, resumen);
            }

            if (btnId === 'btnMostrarTodos') {
                inputBusqueda.value = '';
                selectCategoria.value = '';
                renderizarTabla(productosMostrados, tabla, resumen);
            }

            if (btnId === 'btnAgregarProducto') {
                toggleFormularioProducto();
            }
        });

        // Inicializar formulario de productos
        initFormProducto(
            toggleFormularioProducto,
            async () => {
                productosMostrados = await loadProducts();
                await renderizarTabla(productosMostrados, tabla, resumen);
            }
        );

    } catch (error) {
        console.error('Error inicializando almacenController:', error);
    }
}
