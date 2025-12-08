import { AuthService } from '../services/authService.js';


if (!AuthService.isAuthenticated()) {
    window.location.href = '../../login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const btnLogout = document.querySelector('.btn-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                AuthService.logout();
                window.location.href = '../../login.html';
            }
        });
    }
});
