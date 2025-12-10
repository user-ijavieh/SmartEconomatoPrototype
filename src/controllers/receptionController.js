/**
 * @fileoverview Controlador de recepción de productos
 * Maneja la recepción de nuevos productos en el almacén
 * @module controllers/receptionController
 */

import { getProducts, getSuppliers, createProduct, getCategories } from '../services/apiService.js';
import { messageService } from '../services/messageService.js';
import * as uiReception from '../view/uiReception.js';

// Estado de la aplicación
let todosLosProductos = [];
let todosLosProveedores = [];
let todasLasCategorias = [];
let itemsRecepcion = [];
let productoSeleccionado = null;

/**
 * Inicializa el controlador de recepción
 * Carga datos y configura event listeners
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si hay error al cargar el módulo
 */
export async function init() {
    try {
        uiReception.obtenerReferenciasDOM();
        
        await cargarDatos();

        configurarEventListeners();
        
    } catch (error) {
        messageService.showError('Error al cargar el módulo de recepción');
    }
}

/**
 * Carga todos los datos necesarios (productos, proveedores, categorías)
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Si falla la carga de datos
 */
async function cargarDatos() {
    try {
        const [productos, proveedores, categorias] = await Promise.all([
            getProducts(),
            getSuppliers(),
            getCategories()
        ]);
        
        todosLosProductos = productos.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precio || 0,
            stock: p.stock || 0,
            categoriaId: p.categoriaId,
            proveedorId: p.proveedorId,
            categoria: p.categoria?.nombre || 'Sin categoría',
            _original: p
        }));
        
        todosLosProveedores = proveedores;
        todasLasCategorias = categorias;
        
        uiReception.llenarSelectProveedores(todosLosProveedores);
        uiReception.llenarSelectCategorias(todasLasCategorias);
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        throw error;
    }
}

/**
 * Configura todos los event listeners de la página
 * @returns {void}
 */
function configurarEventListeners() {
    uiReception.elementos.btnAgregarItem.addEventListener('click', abrirFormulario);
    uiReception.elementos.btnGuardarRecepcion.addEventListener('click', guardarRecepcion);
    uiReception.elementos.btnCancelar.addEventListener('click', cerrarFormulario);
    uiReception.elementos.formNuevoItem.addEventListener('submit', agregarItem);
    
    if (uiReception.elementos.nombreProducto) {
        uiReception.elementos.nombreProducto.addEventListener('input', (e) => {
            console.log('⌨️ Input event disparado, valor:', e.target.value);
            filtrarProductos();
        });
        
        uiReception.elementos.nombreProducto.addEventListener('focus', () => {
            if (uiReception.elementos.nombreProducto.value.trim().length >= 2) {
                filtrarProductos();
            }
        });
    }
    
    document.addEventListener('click', (e) => {
        if (!uiReception.elementos.nombreProducto.contains(e.target) && 
            !uiReception.elementos.autocompleteDropdown.contains(e.target)) {
            uiReception.ocultarDropdown();
        }
    });
    
    uiReception.elementos.cantidadProducto.addEventListener('input', calcularTotal);
    uiReception.elementos.precioProducto.addEventListener('input', calcularTotal);
}

/**
 * Abre el formulario para agregar un nuevo item
 * @returns {void}
 */
function abrirFormulario() {
    uiReception.abrirFormulario();
    productoSeleccionado = null;
}

/**
 * Cierra el formulario y limpia los campos
 * @returns {void}
 */
function cerrarFormulario() {
    uiReception.cerrarFormulario();
    uiReception.ocultarDropdown();
    productoSeleccionado = null;
}

/**
 * Filtra productos según el término de búsqueda
 * @returns {void}
 */
function filtrarProductos() {
    if (!uiReception.elementos.nombreProducto) {
        return;
    }
    
    const query = uiReception.elementos.nombreProducto.value.trim().toLowerCase();
    
    productoSeleccionado = null; 
    
    if (query.length < 2) {
        uiReception.ocultarDropdown();
        return;
    }
    
    const productosFiltrados = todosLosProductos.filter(p =>
        p.nombre.toLowerCase().includes(query)
    );
     
    uiReception.mostrarDropdown(productosFiltrados, seleccionarProducto);
}

/**
 * Selecciona un producto del dropdown de autocompletado
 * @param {number|string} productoId - ID del producto a seleccionar
 * @returns {void}
 */
function seleccionarProducto(productoId) {
    const producto = todosLosProductos.find(p => p.id === productoId);
    
    if (producto) {
        productoSeleccionado = producto;
        uiReception.autocompletarProducto(producto);
    }
}

/**
 * Calcula el total del item (cantidad x precio)
 * @returns {void}
 */
function calcularTotal() {
    const cantidad = parseFloat(uiReception.elementos.cantidadProducto.value) || 0;
    const precio = parseFloat(uiReception.elementos.precioProducto.value) || 0;
    const total = cantidad * precio;
}

/**
 * Maneja el envío del formulario para agregar un item
 * @param {Event} e - Evento del formulario
 * @returns {void}
 */
function agregarItem(e) {
    e.preventDefault();
    
    const nombreProducto = uiReception.elementos.nombreProducto.value.trim();
    const proveedorId = uiReception.elementos.proveedorProducto.value;
    const categoriaId = uiReception.elementos.categoriaProducto.value;
    const cantidad = parseInt(uiReception.elementos.cantidadProducto.value);
    const precio = parseFloat(uiReception.elementos.precioProducto.value);
    const notas = uiReception.elementos.notasProducto.value.trim();
    
    if (!nombreProducto || !proveedorId || !categoriaId || cantidad <= 0 || precio < 0) {
        messageService.showError('Por favor completa todos los campos obligatorios');
        return;
    }

    const proveedor = todosLosProveedores.find(p => p.id === proveedorId);
    
    if (!proveedor) {
        messageService.showError('Proveedor no válido');
        return;
    }
    
    const categoria = todasLasCategorias.find(c => c.id === categoriaId);
    
    if (!categoria) {
        messageService.showError('Categoría no válida');
        return;
    }
    
    const producto = productoSeleccionado || todosLosProductos.find(p => 
        p.nombre.toLowerCase() === nombreProducto.toLowerCase()
    );
    
    if (!producto) {
        confirmarProductoNuevo(nombreProducto, cantidad, precio, proveedor, categoriaId, notas);
        return;
    }
    
    agregarItemConfirmado(producto, nombreProducto, cantidad, precio, proveedor, proveedorId, categoriaId, notas, true);
}

/**
 * Calcula el próximo ID de producto
 * @returns {number} Siguiente ID disponible
 */
function calcularProximoIdProducto() {
    if (todosLosProductos.length === 0) {
        return 1;
    }
    
    const maxId = Math.max(...todosLosProductos.map(p => {
        const id = typeof p.id === 'string' ? parseInt(p.id) : p.id;
        return isNaN(id) ? 0 : id;
    }));
    
    return maxId + 1;
}

/**
 * Pide confirmación para crear un producto nuevo
 * @async
 * @param {string} nombreProducto - Nombre del nuevo producto
 * @param {number} cantidad - Cantidad a recibir
 * @param {number} precio - Precio unitario
 * @param {Object} proveedor - Objeto del proveedor
 * @param {number} categoriaId - ID de la categoría
 * @param {string} notas - Notas adicionales
 * @returns {Promise<void>}
 */
async function confirmarProductoNuevo(nombreProducto, cantidad, precio, proveedor, categoriaId, notas) {
    const confirmado = await messageService.askConfirmation(
        `El producto "${nombreProducto}" no existe en el sistema.\n\n¿Deseas crear un nuevo producto con estos datos?\n\nCantidad: ${cantidad}\nPrecio: €${precio.toFixed(2)}\nProveedor: ${proveedor.nombre}`,
        {
            title: 'Producto Nuevo',
            confirmText: 'Sí, crear producto',
            cancelText: 'Cancelar'
        }
    );
    
    if (confirmado) {
        agregarItemConfirmado(null, nombreProducto, cantidad, precio, proveedor, proveedor.id, categoriaId, notas, false);
    }
}

/**
 * Agrega el item confirmado a la lista de recepción
 * @param {Object|null} producto - Objeto producto existente o null
 * @param {string} nombreProducto - Nombre del producto
 * @param {number} cantidad - Cantidad recibida
 * @param {number} precio - Precio unitario
 * @param {Object} proveedor - Objeto del proveedor
 * @param {number} proveedorId - ID del proveedor
 * @param {number} categoriaId - ID de la categoría
 * @param {string} notas - Notas adicionales
 * @param {boolean} productoExistente - Si el producto ya existe en el sistema
 * @returns {void}
 */
function agregarItemConfirmado(producto, nombreProducto, cantidad, precio, proveedor, proveedorId, categoriaId, notas, productoExistente) {

    const nuevoItem = {
        id: Date.now(),
        productoId: producto ? producto.id : null,
        nombreProducto: nombreProducto,
        cantidad: cantidad,
        precio: precio,
        total: cantidad * precio,
        proveedor: proveedor,
        proveedorId: proveedorId,
        categoriaId: categoriaId,
        categoria: producto ? producto.categoria : 'Sin categoría',
        notas: notas,
        productoExistente: productoExistente
    };

    itemsRecepcion.push(nuevoItem);
    
    renderizarItems();
    actualizarEstadoBotones();
    
    cerrarFormulario();
    messageService.showSuccess('Item agregado correctamente');
}

/**
 * Renderiza los items de recepción en la interfaz
 * @returns {void}
 */
function renderizarItems() {
    uiReception.renderizarItems(itemsRecepcion, todasLasCategorias, eliminarItem);
}

/**
 * Elimina un item de la lista de recepción por índice
 * @param {number} index - Índice del item a eliminar
 * @returns {void}
 */
export function eliminarItem(index) {
    if (index < 0 || index >= itemsRecepcion.length) return;
    
    itemsRecepcion.splice(index, 1);
    renderizarItems();
    actualizarEstadoBotones();
    
    messageService.showSuccess('Item eliminado');
}

/**
 * Actualiza el estado de los botones según si hay items
 * @returns {void}
 */
function actualizarEstadoBotones() {
    const hayItems = itemsRecepcion.length > 0;
    uiReception.actualizarEstadoBotones(hayItems);
}

/**
 * Guarda la recepción completada
 * Crea los productos nuevos en la API si es necesario
 * @async
 * @returns {Promise<void>}
 */
async function guardarRecepcion() {
    if (itemsRecepcion.length === 0) {
        messageService.showError('No hay items para guardar');
        return;
    }
    
    const totalItems = itemsRecepcion.length;
    const totalUnidades = itemsRecepcion.reduce((sum, item) => sum + item.cantidad, 0);
    const totalImporte = itemsRecepcion.reduce((sum, item) => sum + item.total, 0);
    
    const confirmado = await messageService.askConfirmation(
        `¿Confirmas la recepción de ${totalItems} producto(s) con ${totalUnidades} unidades por un total de ${totalImporte.toFixed(2)}€?`,
        {
            title: 'Guardar Recepción',
            confirmText: 'Sí, guardar',
            cancelText: 'Cancelar'
        }
    );
    
    if (!confirmado) return;
    
    uiReception.actualizarBotonGuardar('GUARDANDO...', true);
    
    try {
        const promesas = [];
        const productosNuevos = itemsRecepcion.filter(item => !item.productoExistente);
        const productosExistentes = itemsRecepcion.filter(item => item.productoExistente);
        
        for (const item of productosNuevos) {
            const nuevoId = calcularProximoIdProducto();
            const nuevoProducto = {
                id: nuevoId.toString(),
                nombre: item.nombreProducto,
                precio: item.precio,
                precioUnitario: "kg",
                stock: item.cantidad,
                stockMinimo: 10,
                categoriaId: item.categoriaId || 1, 
                proveedorId: item.proveedorId,
                unidadMedida: "kg",
                marca: "",
                codigoBarras: "",
                fechaCaducidad: "",
                alergenos: [],
                descripcion: item.notas || "",
                imagen: "",
                activo: true
            };
            
            todosLosProductos.push({
                id: nuevoId,
                nombre: nuevoProducto.nombre,
                precio: nuevoProducto.precio,
                stock: nuevoProducto.stock,
                categoriaId: nuevoProducto.categoriaId,
                proveedorId: nuevoProducto.proveedorId,
                categoria: 'Sin categoría',
                _original: nuevoProducto
            });
            
            const promesa = createProduct(nuevoProducto);
            promesas.push(promesa);
        }
        
        for (const item of productosExistentes) {
            const producto = todosLosProductos.find(p => p.id === item.productoId);
            if (!producto) continue;
            
            const nuevoStock = producto.stock + item.cantidad;
            const productoActualizado = {
                ...producto._original,
                stock: nuevoStock,
                precio: item.precio 
            };
            
            const promesa = fetch(`http://localhost:3000/productos/${item.productoId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productoActualizado)
            });
            
            promesas.push(promesa);
        }
        
        if (promesas.length > 0) {
            const resultados = await Promise.all(promesas);
            
            const algunaFallo = resultados.some(res => {
                if (res instanceof Response) {
                    return !res.ok;
                }
                return false;
            });
            
            if (algunaFallo) {
                throw new Error('Algunas operaciones fallaron');
            }
        }
        
        const mensajeExito = productosNuevos.length > 0
            ? `Recepción guardada: ${totalItems} producto(s) (${productosNuevos.length} nuevos), ${totalUnidades} unidades`
            : `Recepción guardada: ${totalItems} producto(s), ${totalUnidades} unidades`;
        
        messageService.showSuccess(mensajeExito, 5000);
        
        itemsRecepcion = [];
        renderizarItems();
        actualizarEstadoBotones();
        
        await cargarDatos();
        
    } catch (error) {
        console.error('Error al guardar recepción:', error);
        messageService.showError('Error al guardar la recepción');
    } finally {
        uiReception.actualizarBotonGuardar('GUARDAR RECEPCION');
        actualizarEstadoBotones();
    }
}

window.receptionController = {
    eliminarItem
}
