import { AuthService } from '../services/authService.js';
import { messageService } from '../services/messageService.js';


if (!AuthService.isAuthenticated()) {
    window.location.href = '../../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.getElementById('btnCerrarSesion');

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
