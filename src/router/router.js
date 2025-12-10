/**
 * @fileoverview Router de la aplicación
 * Maneja la navegación entre páginas y carga de controladores
 * @module router/router
 */

import { AuthService } from '../services/authService.js'

/**
 * Configuración de rutas de la aplicación
 * @type {Object<string, Object>}
 * @property {string} controller - Ruta del controlador asociado
 * @property {string} html - Archivo HTML de la página
 * @property {boolean} requiresAuth - Si requiere autenticación
 */
const routes = {
    "inventario": { controller: "almacenController/almacenController.js", html: "inventario.html", requiresAuth: true },
    "mainRecipes": { controller: "#", html: "mainRecipes.html", requiresAuth: true },
    "orders": { controller: "ordersController/almacenController.js", html: "orders.html", requiresAuth: true },
    "reception": { controller: "receptionController.js", html: "reception.html", requiresAuth: true },
    "profile": { controller: "#", html: "profile.html", requiresAuth: true },
    "welcomePage": { controller: "#", html: "welcomePage.html", requiresAuth: true }
}

/**
 * Router principal de la aplicación
 * Maneja la carga dinámica de páginas y controladores
 * @namespace ROUTER
 */
export const ROUTER = {
    /**
     * Navega a la página especificada
     * Carga el HTML y ejecuta el controlador asociado si es necesario
     * @async
     * @param {string} page - Nombre de la página/ruta a cargar
     * @returns {Promise<void>}
     * @throws {Error} Si la ruta no está configurada o hay error en la carga
     * @example
     * await ROUTER.route('inventario');
     */
    async route(page) {
        try {
            const content = document.getElementById("content");
            if (!content) throw new Error("Elemento #content no encontrado");

            if (!routes[page]) throw new Error(`Ruta '${page}' no configurada`);

            if (routes[page].requiresAuth && !AuthService.isAuthenticated()) {
                window.location.href = '../../login.html'
                return
            }

            const response = await fetch(`../pages/${routes[page].html}`);
            if (!response.ok) throw new Error("Página no encontrada");

            const html = await response.text();
            const fragment = document.createRange().createContextualFragment(html);

            content.textContent = "";
            content.appendChild(fragment);

            if (routes[page].controller !== "#") {
                try {
                    const module = await import(`../controllers/${routes[page].controller}?t=${Date.now()}`);
                    if (module && module.init) {
                        await module.init();
                    }
                } catch (err) {
                    console.warn(`No se encontró controlador para ${page}:`, err.message);
                }
            }

        } catch (error) {
            console.error("Error en router:", error.message);
            const content = document.getElementById("content");
            if (content) {
                content.innerHTML = `<h2>Error al cargar la página</h2><p>${error.message}</p>`;
            }
        }
    }
}