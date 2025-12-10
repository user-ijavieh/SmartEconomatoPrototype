/**
 * @fileoverview Carrusel de fondo automático
 * Implementa un carrusel de imágenes en la página de login
 * @module view/carousel
 */

/**
 * Carrusel de fondo automático con cambio cíclico
 * @class BackgroundCarousel
 */
class BackgroundCarousel {
    /**
     * Constructor del carrusel
     * Inicializa referencias a los slides y comienza el autoplay
     */
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.autoPlayInterval = 3000;
        if (this.slides.length > 0) {
            this.startAutoPlay();
        }
    }

    /**
     * Inicia el autoplay del carrusel
     * Cambia de slide cada 3 segundos
     * @private
     * @returns {void}
     */
    startAutoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }

    /**
     * Cambia al siguiente slide del carrusel
     * Usa módulo para crear efecto de ciclo continuo
     * @returns {void}
     */
    nextSlide() {
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
}

/**
 * Inicializa el carrusel cuando el DOM está listo
 * Si el documento ya está cargado, lo ejecuta inmediatamente
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BackgroundCarousel());
} else {
    new BackgroundCarousel();
}
