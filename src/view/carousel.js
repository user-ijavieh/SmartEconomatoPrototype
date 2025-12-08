class BackgroundCarousel {
    constructor() {
        this.slides = document.querySelectorAll('.carousel-slide');
        this.currentSlide = 0;
        this.autoPlayInterval = 3000;
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
        this.slides[this.currentSlide].classList.remove('active');
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.slides[this.currentSlide].classList.add('active');
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new BackgroundCarousel());
} else {
    new BackgroundCarousel();
}
