# SmartEconomato Prototype

**SmartEconomato** es una aplicación web de gestión de inventario desarrollada como una **SPA (Single Page Application)** utilizando JavaScript Vanilla moderno. Este proyecto simula el ecosistema digital para la administración de un economato, permitiendo el control de stock, gestión de proveedores y la recepción masiva de mercancía de manera eficiente.

## 🛠 Tecnologías Utilizadas

* **Frontend:** HTML5, CSS3, JavaScript.
* **Librerías:** [Grid.js](https://gridjs.io/).
* **Backend (Simulado):** JSON Server para simulación de API REST.
* **Herramientas:** Git, Visual Studio Code.

## 📦 Instalación y Uso

1.  **Clonar repositorio:**
    ```bash
    git clone [https://github.com/user-ijavieh/SmartEconomatoPrototype.git](https://github.com/user-ijavieh/SmartEconomatoPrototype.git)
    ```

2.  **Iniciar base de datos simulada:**
    Ejecuta el siguiente comando en la terminal:
    ```bash
    json-server --watch assets/data/db.json
    ```

3.  **Ejecutar aplicación:**
    Abre el archivo `index.html` en tu navegador o utiliza una extensión como **Live Server**.

## 🧐 Funciones para darle un vistazo

* `messageService`: Es un servicio centralizado para la creación de *toasts* (notificaciones) y modales útiles en toda la aplicación.
* `router/router.js`: El enrutador que carga el contenido dinámicamente dentro del `main.html`.
* `view/transition.js`: Documento que gestiona la transición animada entre el login y el *welcomePage*. (El CSS de la animación fue adaptado de una librería externa).
* `reception.html`: Módulo que autocompleta los productos y maneja la entrada masiva de mercancía.
* **Almacén**:
    * La versión con **Grid.js** se encuentra en la sección de **Inventario**.
    * El almacén anterior (legacy) se mantiene en `orders.html`.
* **Test**: Se añadió una página en `test/demo-message-service.html` (generada con IA) para probar aisladamente las funcionalidades del servicio de mensajería.

## 🚀 Funciones a mejorar (ToDo)

- [ ] Implementar un mejor control en todos los formularios (formato y tipos de datos).
- [ ] Mejorar el manejo de los formularios, centralizando la lógica en un servicio dedicado.
- [ ] Crear una "librería" propia para la tabla o encapsularla en un servicio personalizado.

## 📂 Árbol de archivos

```text
│   .gitattributes
│   login.html
│   README.md
│   
├───.vscode
│       launch.json
│       settings.json
│       
├───assets -> Recursos estáticos
│   ├───css
│   │       inventario.css
│   │       login.css
│   │       main.css
│   │       messageService.css
│   │       orders.css
│   │       reception.css
│   │       transitions.css
│   │       variables.css
│   │       welcomePage.css
│   │
│   ├───data
│   │       db.json
│   │
│   ├───fonts
│   │       Deserta.otf
│   │
│   └───img
│       │   Candelaria.svg
│       │   history.svg
│       │   house.svg
│       │   inventory.svg
│       │   loginBackground.jpg
│       │   logoCandelariaST.png
│       │   logoCandelariaST.svg
│       │   logoGobCan.png
│       │   logout.svg
│       │   recipe.svg
│       │   truck.svg
│       │
│       ├───carousel
│       │       carousel1.jpg
│       │       carousel2.jpg
│       │       carousel3.jpg
│       │
│       └───icons
│               arrow.svg
│               double-arrow.svg
│               home.svg
│               inventory.svg
│               order.svg
│               profile.svg
│               reception.svg
│               recipes.svg
│
├───src
│   ├───controllers -> Lógica que conecta la UI con los datos
│   │   │   loginController.js
│   │   │   receptionController.js
│   │   │   welcomePageController.js
│   │   │
│   │   ├───almacenController
│   │   │       almacenController.js
│   │   │       formProductoController.js
│   │   │
│   │   ├───mainController
│   │   │       mainController.js
│   │   │       sidebarController.js
│   │   │
│   │   └───ordersController
│   │           almacenController.js
│   │           formProductoController.js
│   │
│   ├───models -> Definición de objetos de negocio
│   │       categorias.js
│   │       productos.js
│   │       proveedores.js
│   │
│   ├───pages
│   │       inventario.html
│   │       main.html
│   │       mainRecipes.html
│   │       orders.html
│   │       profile.html
│   │       reception.html
│   │       welcomePage.html
│   │
│   ├───router
│   │       router.js
│   │
│   ├───services -> Capa de comunicación con la API y servicios transversales
│   │       apiService.js
│   │       authService.js
│   │       messageService.js
│   │
│   ├───utils
│   │       funciones.js
│   │
│   └───view -> Manipulación del DOM y componentes visuales.
│           carousel.js
│           transition.js
│           uiAlmacen.js
│           uiMain.js
│           uiOrders.js
│           uiReception.js
│
└───test
        demo-message-service.html
        demo.html
        pruebas.js

## 🔗 Enlace del repositorio

[SmartEconomatoPrototype en GitHub](https://github.com/user-ijavieh/SmartEconomatoPrototype.git)