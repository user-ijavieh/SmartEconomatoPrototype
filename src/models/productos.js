//* Modelo de los objetos Producto

export class Producto {

constructor(
    id,
    nombre,
    precio,
    precioUnitario,
    stock,
    stockMinimo,
    categoria,
    proveedor,
    unidadMedida,
    marca,
    codigoBarras,
    fechaCaducidad,
    alergenos,
    descripcion,
    imagen,
    activo
  ) {
    this.id = id;
    this.nombre = nombre;
    this.precio = precio;
    this.precioUnitario = precioUnitario;
    this.stock = stock;
    this.stockMinimo = stockMinimo;
    this.categoria = categoria;
    this.proveedor = proveedor;
    this.unidadMedida = unidadMedida;
    this.marca = marca;
    this.codigoBarras = codigoBarras;
    this.fechaCaducidad = fechaCaducidad;
    this.alergenos = alergenos;
    this.descripcion = descripcion;
    this.imagen = imagen;
    this.activo = activo;
  }


}

