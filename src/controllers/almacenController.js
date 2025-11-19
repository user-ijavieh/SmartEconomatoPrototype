//* Modelos
import { Producto } from '../models/productos.js';
import { Proveedor } from '../models/proveedores.js';
import { Categoria } from '../models/categorias.js';
import { tabla,resumen,controles,inputBusqueda,selectCategoria,headerPrecio,headerId,headerStock,renderizarTabla,cargarCategoriasDesdeAPI} from '../view/uiAlmacen.js';

//* Funciones de la API
import { getProducts , getSuppliers , getCategories } from '../services/apiService.js'

//* Mas cosas

import { manejarBusqueda,manejarFiltro,manejarOrden,manejarStock,manejarMostrarTodos } from '../utils/funciones.js';


//* Definición de todas las acciones en cada evento

const acciones = {
    btnBuscar: () => {
        const resultadoBusqueda = manejarBusqueda(productosMostrados, inputBusqueda);
        renderizarTabla(resultadoBusqueda ? resultadoBusqueda : [], tabla, resumen);
    },
    btnFiltrarCategoria: () => {
        const resultadoFiltro = manejarFiltro(productosMostrados,selectCategoria);
        renderizarTabla(resultadoFiltro ? resultadoFiltro : [], tabla, resumen);
    },
    /*btnOrdenar: () => {
        const resultadoOrdenar = manejarOrden(productosMostrados,selectOrden)
        renderizarTabla(resultadoOrdenar ? resultadoOrdenar : [], tabla, resumen);
    },*/
    btnStock: () => {
        const resultadoStock = manejarStock(productosMostrados)
        renderizarTabla(resultadoStock ? resultadoStock : [], tabla, resumen);
    },
    btnMostrarTodos: () => {
        const resultadoMostrar = manejarMostrarTodos(selectCategoria,inputBusqueda,productosMostrados);
        renderizarTabla(resultadoMostrar ? resultadoMostrar : [], tabla, resumen);
    },
    btnAgregarProducto: () => {
        toggleFormularioProducto();
    }
}

//* Controlador de eventos

controles.addEventListener('click', (e) => {
    const accion = acciones[e.target.id];
    if (accion) accion();
});

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
let productosMostrados = await loadProducts()

// Inicialización de la tabla
renderizarTabla(productosMostrados, tabla, resumen);

// Cargar categorías en el selector desde la API
await cargarCategoriasDesdeAPI();



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

// Evento de ordenamiento por ID
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

// Evento de ordenamiento por Stock
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

// Función para mostrar/ocultar formulario de nuevo producto
function toggleFormularioProducto() {
    const formulario = document.getElementById('formularioNuevoProducto');
    if (formulario.style.display === 'none' || formulario.style.display === '') {
        formulario.style.display = 'block';
        cargarSelectoresFormulario();
    } else {
        formulario.style.display = 'none';
        document.getElementById('formProducto').reset();
    }
}

// Listener para el botón de cancelar (fuera del div controles)
document.getElementById('btnCancelarProducto').addEventListener('click', () => {
    toggleFormularioProducto();
});

// Función para cargar categorías y proveedores en el formulario
async function cargarSelectoresFormulario() {
    const categorias = await loadCategories();
    const proveedores = await loadSuppliers();

    const selectCategoria = document.getElementById('categoriaProducto');
    const selectProveedor = document.getElementById('proveedorProducto');

    // Limpiar y cargar categorías
    selectCategoria.innerHTML = '<option value="">-- Seleccione --</option>';
    categorias.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.nombre;
        selectCategoria.appendChild(option);
    });

    // Limpiar y cargar proveedores
    selectProveedor.innerHTML = '<option value="">-- Seleccione --</option>';
    proveedores.forEach(prov => {
        const option = document.createElement('option');
        option.value = prov.id;
        option.textContent = prov.nombre;
        selectProveedor.appendChild(option);
    });
}

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
