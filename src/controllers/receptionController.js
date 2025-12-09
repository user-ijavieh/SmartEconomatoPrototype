import { getProducts, getSuppliers, createProduct, getCategories } from '../services/apiService.js';
import { messageService } from '../services/messageService.js';
import * as uiReception from '../view/uiReception.js';

// Estado de la aplicación
let todosLosProductos = [];
let todosLosProveedores = [];
let todasLasCategorias = [];
let itemsRecepcion = [];
let productoSeleccionado = null;

export async function init() {
    try {
        uiReception.obtenerReferenciasDOM();
        
        await cargarDatos();

        configurarEventListeners();
        
    } catch (error) {
        messageService.showError('Error al cargar el módulo de recepción');
    }
}

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

function abrirFormulario() {
    uiReception.abrirFormulario();
    productoSeleccionado = null;
}

function cerrarFormulario() {
    uiReception.cerrarFormulario();
    uiReception.ocultarDropdown();
    productoSeleccionado = null;
}

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

function seleccionarProducto(productoId) {
    const producto = todosLosProductos.find(p => p.id === productoId);
    
    if (producto) {
        productoSeleccionado = producto;
        uiReception.autocompletarProducto(producto);
    }
}

function calcularTotal() {
    const cantidad = parseFloat(uiReception.elementos.cantidadProducto.value) || 0;
    const precio = parseFloat(uiReception.elementos.precioProducto.value) || 0;
    const total = cantidad * precio;
}

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

function renderizarItems() {
    uiReception.renderizarItems(itemsRecepcion, todasLasCategorias, eliminarItem);
}

export function eliminarItem(index) {
    if (index < 0 || index >= itemsRecepcion.length) return;
    
    itemsRecepcion.splice(index, 1);
    renderizarItems();
    actualizarEstadoBotones();
    
    messageService.showSuccess('Item eliminado');
}

function actualizarEstadoBotones() {
    const hayItems = itemsRecepcion.length > 0;
    uiReception.actualizarEstadoBotones(hayItems);
}

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
