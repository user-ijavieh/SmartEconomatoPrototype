const routes = {
    "inventario": { controller: "almacenController.js", html: "inventario.html" },
    "mainRecipes": { controller: "#", html: "mainRecipes.html" },
    "orders": { controller: "#", html: "orders.html" },
    "reception": { controller: "#", html: "reception.html" },
    "profile": { controller: "#", html: "profile.html" },
    "welcomePage": { controller: "#", html: "welcomePage.html" }
}

export const ROUTER = {
    async route(page) {
        try {
            const content = document.getElementById("content");
            if (!content) throw new Error("Elemento #content no encontrado");

            if (!routes[page]) throw new Error(`Ruta '${page}' no configurada`);

            // Cargar HTML
            const response = await fetch(`../pages/${routes[page].html}`);
            if (!response.ok) throw new Error("Página no encontrada");

            const html = await response.text();
            const fragment = document.createRange().createContextualFragment(html);

            content.textContent = "";
            content.appendChild(fragment);

            // Cargar controller si existe
            if (routes[page].controller !== "#") {
                try {
                    // Agregar query string para evitar caché del módulo
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