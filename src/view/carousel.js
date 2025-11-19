// Carrusel de fondo automático
class BackgroundCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.autoPlayInterval = 3000; // Cambiar cada 6 segundos
        if (this.slides.length > 0) {
            this.startAutoPlay();
        }
    }

    startAutoPlay() {
        setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }

    nextSlide() {
        // Remover clase active del slide actual
        this.slides[this.currentSlide].classList.remove('active');

        // Pasar al siguiente slide
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;

        // Añadir clase active al nuevo slide
        this.slides[this.currentSlide].classList.add('active');
    }
}

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BackgroundCarousel());
} else {
    new BackgroundCarousel();
}
