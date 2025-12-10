/**
 * @fileoverview Interfaz de usuario de recepción
 * Proporciona funciones para gestionar la UI del módulo de recepción
 * @module view/uiReception
 */

/**
 * Objeto con referencias a elementos del DOM
 * @type {Object}
 */
// Referencias al DOM
export const elementos = {
    btnAgregarItem: null,
    btnGuardarRecepcion: null,
    estadoVacio: null,
    listaItems: null,
    formSection: null,
    formNuevoItem: null,
    btnCancelar: null,

    // Campos del formulario
    nombreProducto: null,
    proveedorProducto: null,
    categoriaProducto: null,
    cantidadProducto: null,
    precioProducto: null,
    codigoBarras: null,
    notasProducto: null,
    autocompleteDropdown: null
};

/**
 * Obtiene referencias a todos los elementos DOM necesarios
 * @returns {void}
 */
export function obtenerReferenciasDOM() {
    elementos.btnAgregarItem = document.getElementById('btnAgregarItem');
    elementos.btnGuardarRecepcion = document.getElementById('btnGuardarRecepcion');
    elementos.estadoVacio = document.getElementById('estadoVacio');
    elementos.listaItems = document.getElementById('listaItems');
    elementos.formSection = document.getElementById('formSection');
    elementos.formNuevoItem = document.getElementById('formNuevoItem');
    elementos.btnCancelar = document.getElementById('btnCancelar');
    
    // Campos del formulario
    elementos.nombreProducto = document.getElementById('nombreProducto');
    elementos.proveedorProducto = document.getElementById('proveedorProducto');
    elementos.categoriaProducto = document.getElementById('categoriaProducto');
    elementos.cantidadProducto = document.getElementById('cantidadProducto');
    elementos.precioProducto = document.getElementById('precioProducto');
    elementos.codigoBarras = document.getElementById('codigoBarras');
    elementos.notasProducto = document.getElementById('notasProducto');
    elementos.autocompleteDropdown = document.getElementById('autocompleteDropdown');
}

/**
 * Llena el select de proveedores con opciones
 * @param {Array<Proveedor>} proveedores - Array de proveedores
 * @returns {void}
 */
export function llenarSelectProveedores(proveedores) {
    while (elementos.proveedorProducto.firstChild) {
        elementos.proveedorProducto.removeChild(elementos.proveedorProducto.firstChild);
    }
    
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = '-- SELECCIONE --';
    elementos.proveedorProducto.appendChild(optionDefault);
    
    proveedores.forEach(proveedor => {
        const option = document.createElement('option');
        option.value = proveedor.id;
        option.textContent = proveedor.nombre;
        elementos.proveedorProducto.appendChild(option);
    });
}

/**
 * Llena el select de categorías con opciones
 * @param {Array<Categoria>} categorias - Array de categorías
 * @returns {void}
 */
export function llenarSelectCategorias(categorias) {
    while (elementos.categoriaProducto.firstChild) {
        elementos.categoriaProducto.removeChild(elementos.categoriaProducto.firstChild);
    }
    
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = '-- SELECCIONE --';
    elementos.categoriaProducto.appendChild(optionDefault);
    
    categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombre;
        elementos.categoriaProducto.appendChild(option);
    });
}

/**
 * Abre el formulario de nuevo item
 * @returns {void}
 */
export function abrirFormulario() {
    elementos.formSection.style.display = 'block';
    elementos.nombreProducto.focus();
}

/**
 * Cierra el formulario y lo limpia
 * @returns {void}
 */
export function cerrarFormulario() {
    elementos.formSection.style.display = 'none';
    elementos.formNuevoItem.reset();
}

/**
 * Muestra el dropdown de autocompletado de productos
 * @param {Array<Object>} productos - Array de productos para mostrar
 * @param {Function} onSelectCallback - Función callback cuando se selecciona un producto
 * @returns {void}
 */
export function mostrarDropdown(productos, onSelectCallback) {
    if (!Array.isArray(productos)) {
        productos = [];
    }
    
    if (productos.length === 0) {
        while (elementos.autocompleteDropdown.firstChild) {
            elementos.autocompleteDropdown.removeChild(elementos.autocompleteDropdown.firstChild);
        }
        
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'autocomplete-empty';
        emptyDiv.textContent = 'No se encontraron productos';
        elementos.autocompleteDropdown.appendChild(emptyDiv);
        elementos.autocompleteDropdown.classList.add('show');
        return;
    }
    
    const productosLimitados = productos.slice(0, 10);
    while (elementos.autocompleteDropdown.firstChild) {
        elementos.autocompleteDropdown.removeChild(elementos.autocompleteDropdown.firstChild);
    }
    
    productosLimitados.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'autocomplete-item';
        item.dataset.id = producto.id;
        
        const itemName = document.createElement('div');
        itemName.className = 'autocomplete-item-name';
        itemName.textContent = producto.nombre;
        
        const itemInfo = document.createElement('div');
        itemInfo.className = 'autocomplete-item-info';
        itemInfo.textContent = `${producto.categoria} - ${producto.precio.toFixed(2)}€`;
        
        item.appendChild(itemName);
        item.appendChild(itemInfo);
        
        item.addEventListener('click', () => onSelectCallback(item.dataset.id));
        
        elementos.autocompleteDropdown.appendChild(item);
    });
    
    elementos.autocompleteDropdown.classList.add('show');
}

/**
 * Oculta el dropdown de autocompletado
 * @returns {void}
 */
export function ocultarDropdown() {
    elementos.autocompleteDropdown.classList.remove('show');
}

/**
 * Autocompleta los campos del formulario con datos de un producto
 * @param {Object} producto - Objeto producto con datos
 * @returns {void}
 */
export function autocompletarProducto(producto) {
    elementos.nombreProducto.value = producto.nombre;
    elementos.precioProducto.value = producto.precio.toFixed(2);

    if (producto.proveedorId) {
        elementos.proveedorProducto.value = producto.proveedorId;
    }

    if (producto.categoriaId) {
        elementos.categoriaProducto.value = producto.categoriaId;
    }
    
    ocultarDropdown();
    elementos.cantidadProducto.focus();
}

/**
 * Renderiza los items de recepción en la lista
 * @param {Array<Object>} items - Array de items recibidos
 * @param {Array<Categoria>} categorias - Array de categorías para referencia
 * @param {Function} onEliminarCallback - Función callback cuando se elimina un item
 * @returns {void}
 */
export function renderizarItems(items, categorias, onEliminarCallback) {
    if (items.length === 0) {
        elementos.estadoVacio.style.display = 'block';
        elementos.listaItems.style.display = 'none';
        return;
    }
    
    elementos.estadoVacio.style.display = 'none';
    elementos.listaItems.style.display = 'block';

    while (elementos.listaItems.firstChild) {
        elementos.listaItems.removeChild(elementos.listaItems.firstChild);
    }

    items.forEach((item, index) => {
        const itemCard = document.createElement('div');
        itemCard.className = 'item-card';
        
        // Info
        const itemInfo = document.createElement('div');
        itemInfo.className = 'item-info';
        
        const itemName = document.createElement('div');
        itemName.className = 'item-name';
        itemName.textContent = item.nombreProducto;
        
        const itemCategory = document.createElement('div');
        itemCategory.className = 'item-category';

        const categoriaNombre = item.categoriaId 
            ? (categorias.find(c => c.id === item.categoriaId)?.nombre || 'Sin categoría') 
            : 'Sin categoría';
        itemCategory.textContent = categoriaNombre;
        
        itemInfo.appendChild(itemName);
        itemInfo.appendChild(itemCategory);

        const itemDataCantidad = document.createElement('div');
        itemDataCantidad.className = 'item-data';
        
        const labelCantidad = document.createElement('div');
        labelCantidad.className = 'item-label';
        labelCantidad.textContent = 'CANTIDAD';
        
        const valueCantidad = document.createElement('div');
        valueCantidad.className = 'item-value';
        valueCantidad.textContent = item.cantidad;
        
        itemDataCantidad.appendChild(labelCantidad);
        itemDataCantidad.appendChild(valueCantidad);
        
        const itemDataProveedor = document.createElement('div');
        itemDataProveedor.className = 'item-data';
        
        const labelProveedor = document.createElement('div');
        labelProveedor.className = 'item-label';
        labelProveedor.textContent = 'PROVEEDOR';
        
        const valueProveedor = document.createElement('div');
        valueProveedor.className = 'provider-name';
        valueProveedor.textContent = item.proveedor.nombre;
        
        itemDataProveedor.appendChild(labelProveedor);
        itemDataProveedor.appendChild(valueProveedor);
        
        const itemDataTotal = document.createElement('div');
        itemDataTotal.className = 'item-data';
        
        const labelTotal = document.createElement('div');
        labelTotal.className = 'item-label';
        labelTotal.textContent = 'TOTAL';
        
        const valueTotal = document.createElement('div');
        valueTotal.className = 'item-value item-total';
        valueTotal.textContent = `${item.total.toFixed(2)} €`;
        
        itemDataTotal.appendChild(labelTotal);
        itemDataTotal.appendChild(valueTotal);
        
        const btnEliminar = document.createElement('button');
        btnEliminar.type = 'button';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.textContent = 'ELIMINAR';
        btnEliminar.addEventListener('click', () => onEliminarCallback(index));
        
        itemCard.appendChild(itemInfo);
        itemCard.appendChild(itemDataCantidad);
        itemCard.appendChild(itemDataProveedor);
        itemCard.appendChild(itemDataTotal);
        itemCard.appendChild(btnEliminar);
        
        elementos.listaItems.appendChild(itemCard);
    });
}

export function actualizarEstadoBotones(hayItems) {
    elementos.btnGuardarRecepcion.disabled = !hayItems;
}

export function actualizarBotonGuardar(texto, disabled = false) {
    elementos.btnGuardarRecepcion.textContent = texto;
    elementos.btnGuardarRecepcion.disabled = disabled;
}
