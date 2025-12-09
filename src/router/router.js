import { AuthService } from '../services/authService.js'

const routes = {
    "inventario": { controller: "almacenController/almacenController.js", html: "inventario.html", requiresAuth: true },
    "mainRecipes": { controller: "#", html: "mainRecipes.html", requiresAuth: true },
    "orders": { controller: "#", html: "orders.html", requiresAuth: true },
    "reception": { controller: "receptionController.js", html: "reception.html", requiresAuth: true },
    "profile": { controller: "#", html: "profile.html", requiresAuth: true },
    "welcomePage": { controller: "#", html: "welcomePage.html", requiresAuth: true }
}

export const ROUTER = {
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