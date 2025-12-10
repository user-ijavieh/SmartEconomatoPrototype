/**
 * @fileoverview Controlador de la página de bienvenida
 * Maneja el cierre de sesión y eventos de la página principal
 * @module controllers/welcomePageController
 */

import { AuthService } from '../services/authService.js';
import { messageService } from '../services/messageService.js';

/**
 * Verifica autenticación al cargar la página
 * Si no está autenticado, redirige al login
 */
if (!AuthService.isAuthenticated()) {
    window.location.href = '../../login.html';
}

/**
 * Inicializa event listeners cuando el DOM está cargado
 */
document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('btnCerrarSesion');

    /**
     * Event listener para cerrar sesión
     * Pide confirmación antes de cerrar
     * @async
     * @param {Event} e - Evento del clic
     */
    if (btnLogout) {
        btnLogout.addEventListener('click', async (e) => {
            e.preventDefault();
            
            const confirmed = await messageService.askConfirmation(
                '¿Estás seguro de que deseas cerrar sesión?',
                {
                    title: 'Cerrar Sesión',
                    confirmText: 'Sí, cerrar sesión',
                    cancelText: 'Cancelar'
                }
            )
            if (confirmed) {
                AuthService.logout();
                window.location.href = '../../login.html';
            }
        });
    }
});
