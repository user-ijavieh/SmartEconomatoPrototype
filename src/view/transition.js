class SimpleTransition {
    constructor() {
        this.loginForm = document.querySelector('.login form');
        this.logoutLinks = document.querySelectorAll('a[href*="login.html"]');
        this.setupEventListeners();
        this.preloadCarouselImages();
    }

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


