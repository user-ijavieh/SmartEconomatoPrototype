class MessageService {
    constructor() {
        this.toastContainer = null;
        this.modalOverlay = null;
        this.initialized = false;
        this.autoInit();
    }

    autoInit() {
        if (this.initialized) return;

        // Enlazar CSS si no existe
        if (!document.getElementById('message-service-styles-vars')) {
            this.linkVariablesStyles();
        }
        if (!document.getElementById('message-service-styles')) {
            this.linkStyles();
        }

        // Inyectar contenedores HTML si no existen
        if (!document.getElementById('toast-container')) {
            this.injectHTML();
        }

        // Referencias a los elementos
        this.toastContainer = document.getElementById('toast-container');
        this.modalOverlay = document.getElementById('modal-overlay');

        this.initialized = true;
    }

    linkVariablesStyles() {
        const link = document.createElement('link');
        link.id = 'message-service-styles-vars';
        link.rel = 'stylesheet';
        link.href = '../../assets/css/variables.css';
        document.head.appendChild(link);
    }

    linkStyles() {
        const link = document.createElement('link');
        link.id = 'message-service-styles';
        link.rel = 'stylesheet';
        link.href = '../../assets/css/messageService.css';
        document.head.appendChild(link);
    }

    injectHTML() {
        // Toast Container
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        document.body.appendChild(toastContainer);

        // Modal Overlay
        const modalOverlay = document.createElement('div');
        modalOverlay.id = 'modal-overlay';
        document.body.appendChild(modalOverlay);
    }

    showToast(message, type, duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'toast-message';
        messageDiv.textContent = message;
        
        toast.appendChild(messageDiv);

        this.toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('hiding');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    showSuccess(message, duration = 3000) {
        this.showToast(message, 'success', duration);
    }

    showError(message, duration = 3000) {
        this.showToast(message, 'error', duration);
    }

    askConfirmation(message, options = {}) {
        return new Promise((resolve) => {
            const {
                title = 'Confirmación',
                confirmText = 'Confirmar',
                cancelText = 'Cancelar'
            } = options;

            // Crear modal box
            const modalBox = document.createElement('div');
            modalBox.className = 'modal-box';
            
            // Header
            const header = document.createElement('div');
            header.className = 'modal-header';
            const headerTitle = document.createElement('h3');
            headerTitle.className = 'modal-title';
            const titleText = document.createElement('span');
            titleText.textContent = title;
            headerTitle.appendChild(titleText);
            header.appendChild(headerTitle);
            
            // Body
            const body = document.createElement('div');
            body.className = 'modal-body';
            body.textContent = message;
            
            // Footer
            const footer = document.createElement('div');
            footer.className = 'modal-footer';
            const btnCancel = document.createElement('button');
            btnCancel.className = 'modal-btn modal-btn-cancel';
            btnCancel.id = 'modal-btn-cancel';
            btnCancel.textContent = cancelText;
            const btnConfirm = document.createElement('button');
            btnConfirm.className = 'modal-btn modal-btn-confirm';
            btnConfirm.id = 'modal-btn-confirm';
            btnConfirm.textContent = confirmText;
            footer.appendChild(btnCancel);
            footer.appendChild(btnConfirm);
            
            // Agregar todo al modal box
            modalBox.appendChild(header);
            modalBox.appendChild(body);
            modalBox.appendChild(footer);
            
            // Limpiar overlay y agregar modal
            while (this.modalOverlay.firstChild) {
                this.modalOverlay.removeChild(this.modalOverlay.firstChild);
            }
            this.modalOverlay.appendChild(modalBox);
            this.modalOverlay.classList.add('active');

            // Función para cerrar modal
            const closeModal = (result) => {
                this.modalOverlay.classList.remove('active');
                resolve(result);
            };

            // Event listeners
            btnConfirm.addEventListener('click', () => closeModal(true));
            btnCancel.addEventListener('click', () => closeModal(false));

            // Cerrar con ESC o click en overlay
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            };

            this.modalOverlay.addEventListener('click', (e) => {
                if (e.target === this.modalOverlay) {
                    closeModal(false);
                    document.removeEventListener('keydown', handleEscape);
                }
            });

            document.addEventListener('keydown', handleEscape);

            // Focus en el botón de confirmar
            btnConfirm.focus();
        });
    }
}

// Exportar una instancia singleton del servicio
export const messageService = new MessageService();
