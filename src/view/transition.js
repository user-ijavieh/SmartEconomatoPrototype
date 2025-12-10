/**
 * @fileoverview Transiciones y animaciones de página
 * Maneja las transiciones de pantalla con loader y precargas de recursos
 * @module view/transition
 */

/**
 * Gestiona las transiciones entre páginas con efecto de cargador
 * @class SimpleTransition
 */
class SimpleTransition {
    /**
     * Constructor de transiciones
     * Configura event listeners y precarga imágenes del carrusel
     */
    constructor() {
        this.loginForm = document.querySelector('.login form');
        this.logoutLinks = document.querySelectorAll('a[href*="login.html"]');
        this.setupEventListeners();
        this.preloadCarouselImages();
    }

    /**
     * Precarga las imágenes del carrusel para evitar tiempos de espera
     * @async
     * @returns {Promise<void>}
     */
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
                        resolve(); 
                    }
                };
                img.onerror = () => {
                    loadedCount++;
                    if (loadedCount === totalImages) {
                        resolve();
                    }
                };
                img.src = imagePath;
            });
        });
    }

    /**
     * Configura los event listeners para transiciones
     * Escucha eventos de login y logout
     * @private
     * @returns {void}
     */
    setupEventListeners() {
        document.addEventListener('loginSuccess', () => {
            const targetUrl = 'src/pages/welcomePage.html';
            this.showLoader(targetUrl);
        });

        if (this.logoutLinks.length > 0) {
            this.logoutLinks.forEach(link => {
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

    /**
     * Muestra el loader de transición antes de navegar
     * @param {string} targetUrl - URL destino de la navegación
     * @returns {void}
     */
    showLoader(targetUrl) {
        const loaderContainer = document.createElement('div');
        loaderContainer.className = 'loader-container active';
        loaderContainer.innerHTML = '<div class="loader"></div>';
        document.body.appendChild(loaderContainer);

        if (targetUrl.includes('welcomePage')) {
            Promise.all([
                new Promise(resolve => setTimeout(resolve, 1500)),
                this.preloadCarouselImages()
            ]).then(() => {
                window.location.href = targetUrl;
            });
        } else {
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


