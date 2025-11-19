// Manejo simple del loader durante la transición
class SimpleTransition {
    constructor() {
        this.loginForm = document.querySelector('.login form');
        this.logoutLinks = document.querySelectorAll('a[href*="login.html"]');
        this.setupEventListeners();
        this.preloadCarouselImages();
    }

    // Precargar imágenes del carrusel
    preloadCarouselImages() {
        const carouselImages = [
            '../../assets/img/carousel/carousel1.jpg',
            '../../assets/img/carousel/carousel2.jpg',
            '../../assets/img/carousel/carousel3.jpg'
        ];

        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = carouselImages.length;

            carouselImages.forEach(imagePath => {
                const img = new Image();
                img.onload = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve(); // Todas las imágenes cargadas
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve(); // Aunque haya error, continuar
                    }
                };
                img.src = imagePath;
            });
        });
    }

    setupEventListeners() {
        // Evento personalizado de login exitoso
        document.addEventListener('loginSuccess', () => {
            const targetUrl = 'src/pages/welcomePage.html';
            this.showLoader(targetUrl);
        });

        // Eventos de cerrar sesión (solo para links fuera del sidebar)
        if (this.logoutLinks.length > 0) {
            this.logoutLinks.forEach(link => {
                // Excluir el botón de logout del sidebar (será manejado por sidebarToggle.js)
                if (!link.classList.contains('sidebar-item')) {
                    link.addEventListener('click', (e) => {
                        e.preventDefault();
                        const targetUrl = link.getAttribute('href');
                        this.showLoader(targetUrl);
                    });
                }
            });
        }
    }

    showLoader(targetUrl) {
        // Crear contenedor del loader
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container active';
        loaderContainer.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loaderContainer);

        // Si va a welcomePage, esperar a que carguen las imágenes
        if (targetUrl.includes('welcomePage')) {
            // Esperar mínimo 1.5s para ver la animación + tiempo de carga
            Promise.all([
                new Promise(resolve => setTimeout(resolve, 1500)), // Mínimo 1.5s de animación
                this.preloadCarouselImages() // Esperar a que carguen las imágenes
            ]).then(() => {
                // Ambas condiciones cumplidas, redirigir
                window.location.href = targetUrl;
            });
        } else {
            // Si no es welcomePage, usar timeout mínimo de 1.75s
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 1750);
        }
    }
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SimpleTransition());
} else {
    new SimpleTransition();
}


