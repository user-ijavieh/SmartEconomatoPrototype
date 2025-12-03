//* Modelos
import { Producto } from '../models/productos.js';
import { Proveedor } from '../models/proveedores.js';
import { Categoria } from '../models/categorias.js';
import { renderizarTabla, cargarCategoriasDesdeAPI, getTabla, getResumen, getControles, getInputBusqueda, getSelectCategoria, getHeaderPrecio, getHeaderId, getHeaderStock } from '../view/uiAlmacen.js';

//* Funciones de la API
import { getProducts , getSuppliers , getCategories } from '../services/apiService.js'

//* Mas cosas

import { manejarBusqueda, manejarFiltro, manejarOrden, manejarStock, manejarMostrarTodos } from '../utils/funciones.js';

//* Método para cargar todos los productos

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

//* Método para cargar las categorias

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

//* Método para cargar los proveedores

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

// Función de inicialización
export async function init() {
    try {
        const tabla = getTabla();
        const resumen = getResumen();
        const controles = getControles();
        const inputBusqueda = getInputBusqueda();
        const selectCategoria = getSelectCategoria();
        const headerPrecio = getHeaderPrecio();
        const headerId = getHeaderId();
        const headerStock = getHeaderStock();

        // Cargar productos
        productosMostrados = await loadProducts();

        // Inicialización de la tabla
        renderizarTabla(productosMostrados, tabla, resumen);

        // Cargar categorías en el selector desde la API
        await cargarCategoriasDesdeAPI();

        // Definición de todas las acciones en cada evento
        const acciones = {
            btnBuscar: () => {
                const resultadoBusqueda = manejarBusqueda(productosMostrados, inputBusqueda);
                renderizarTabla(resultadoBusqueda ? resultadoBusqueda : [], tabla, resumen);
            },
            btnFiltrarCategoria: () => {
                const resultadoFiltro = manejarFiltro(productosMostrados, selectCategoria);
                renderizarTabla(resultadoFiltro ? resultadoFiltro : [], tabla, resumen);
            },
            btnStock: () => {
                const resultadoStock = manejarStock(productosMostrados)
                renderizarTabla(resultadoStock ? resultadoStock : [], tabla, resumen);
            },
            btnMostrarTodos: () => {
                const resultadoMostrar = manejarMostrarTodos(selectCategoria, inputBusqueda, productosMostrados);
                renderizarTabla(resultadoMostrar ? resultadoMostrar : [], tabla, resumen);
            },
            btnAgregarProducto: () => {
                toggleFormularioProducto();
            }
        };

        // Controlador de eventos para los botones
        controles.addEventListener('click', (e) => {
            const accion = acciones[e.target.id];
            if (accion) accion();
        });

        // Event listener para ordenamiento por precio
        headerPrecio.addEventListener('click', () => {
            let direccionActual = headerPrecio.getAttribute('data-sort-dir') || 'none';
            let nuevaDireccion = 'asc';

            if (direccionActual === 'asc') {
                nuevaDireccion = 'desc';
            } else if (direccionActual === 'desc') {
                nuevaDireccion = 'asc';
            }

            // Resetear otros indicadores
            headerId.setAttribute('data-sort-dir', 'none');
            headerStock.setAttribute('data-sort-dir', 'none');

            headerPrecio.setAttribute('data-sort-dir', nuevaDireccion);
            productosMostrados.sort((a, b) => {
                const precioA = a.precio;
                const precioB = b.precio;

                if (nuevaDireccion === 'asc') {
                    return precioA - precioB;
                } else {
                    return precioB - precioA;
                }
            });

            renderizarTabla(productosMostrados, tabla, resumen);
        });

        // Event listener para ordenamiento por ID
        headerId.addEventListener('click', () => {
            let direccionActual = headerId.getAttribute('data-sort-dir') || 'none';
            let nuevaDireccion = 'asc';

            if (direccionActual === 'asc') {
                nuevaDireccion = 'desc';
            } else if (direccionActual === 'desc') {
                nuevaDireccion = 'asc';
            }

            // Resetear otros indicadores
            headerPrecio.setAttribute('data-sort-dir', 'none');
            headerStock.setAttribute('data-sort-dir', 'none');

            headerId.setAttribute('data-sort-dir', nuevaDireccion);
            productosMostrados.sort((a, b) => {
                const idA = a.id;
                const idB = b.id;

                if (nuevaDireccion === 'asc') {
                    return idA - idB;
                } else {
                    return idB - idA;
                }
            });

            renderizarTabla(productosMostrados, tabla, resumen);
        });

        // Event listener para ordenamiento por Stock
        headerStock.addEventListener('click', () => {
            let direccionActual = headerStock.getAttribute('data-sort-dir') || 'none';
            let nuevaDireccion = 'asc';

            if (direccionActual === 'asc') {
                nuevaDireccion = 'desc';
            } else if (direccionActual === 'desc') {
                nuevaDireccion = 'asc';
            }

            // Resetear otros indicadores
            headerPrecio.setAttribute('data-sort-dir', 'none');
            headerId.setAttribute('data-sort-dir', 'none');

            headerStock.setAttribute('data-sort-dir', nuevaDireccion);
            productosMostrados.sort((a, b) => {
                const stockA = a.stock;
                const stockB = b.stock;

                if (nuevaDireccion === 'asc') {
                    return stockA - stockB;
                } else {
                    return stockB - stockA;
                }
            });

            renderizarTabla(productosMostrados, tabla, resumen);
        });

        // Listener para el botón de cancelar
        document.getElementById('btnCancelarProducto').addEventListener('click', () => {
            toggleFormularioProducto();
        });

        // Evento para enviar el formulario de nuevo producto
        document.getElementById('formProducto').addEventListener('submit', async (e) => {
            e.preventDefault();
            const productos = await loadProducts()
            const elementoConMaxId = productos.reduce((max, actual) => {
                const maxId = parseInt(max.id, 10);
                const actualId = parseInt(actual.id, 10);
                
                return (maxId > actualId) ? max : actual;
            }, productos[0]);
            alert(elementoConMaxId.nombre)
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
                    alert('Producto agregado exitosamente');
                    toggleFormularioProducto();
                    // Recargar productos
                    productosMostrados = await loadProducts();
                    renderizarTabla(productosMostrados, tabla, resumen);
                } else {
                    alert('Error al agregar el producto');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });

    } catch (error) {
        console.error('Error inicializando almacenController:', error);
    }
}
