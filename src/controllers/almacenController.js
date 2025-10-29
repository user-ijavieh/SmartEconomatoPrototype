//* Modelos
import { Producto } from '../models/productos.js';
import { Proveedor } from '../models/proveedores.js';
import { Categoria } from '../models/categorias.js';
import { tabla,resumen,controles,inputBusqueda,selectCategoria,selectOrden,renderizarTabla} from '../view/uiAlmacen.js';

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
    btnFiltarCategoria: () => {
        const resultadoFiltro = manejarFiltro(productosMostrados,selectCategoria);
        renderizarTabla(resultadoFiltro ? resultadoFiltro : [], tabla, resumen);
    },
    btnOrdenar: () => {
        const resultadoOrdenar = manejarOrden(productosMostrados,selectOrden)
        renderizarTabla(resultadoOrdenar ? resultadoOrdenar : [], tabla, resumen);
    },
    btnStock: () => {
        const resultadoStock = manejarStock(productosMostrados)
        renderizarTabla(resultadoStock ? resultadoStock : [], tabla, resumen);
    },
    btnMostrarTodos: () => {
        const resultadoMostrar = manejarMostrarTodos(selectCategoria,inputBusqueda,productosMostrados);
        renderizarTabla(resultadoMostrar ? resultadoMostrar : [], tabla, resumen);
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