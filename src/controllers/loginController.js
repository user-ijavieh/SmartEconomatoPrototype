/**
 * @fileoverview Controlador de autenticación de usuarios
 * Maneja la validación y envío del formulario de login
 * @module controllers/loginController
 */

import { AuthService } from "../services/authService.js";
import { messageService } from "../services/messageService.js";

// Expresiones regulares para validación de login
const usuarioRegex = /^[a-zA-Z0-9._-]{3,20}$/;
const contraseñaRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':",./<>?]{6,30}$/;

/**
 * Valida el formato del usuario utilizando expresión regular
 * @param {string} usuario - Nombre de usuario a validar
 * @returns {boolean} true si el usuario es válido, false en caso contrario
 */
function validarUsuario(usuario) {
    if (!usuario.trim()) {
        messageService.showError('El usuario es obligatorio');
        return false;
    }
    if (!usuarioRegex.test(usuario.trim())) {
        messageService.showError('El usuario debe tener 3-20 caracteres (letras, números, puntos, guiones y guiones bajos)');
        return false;
    }
    return true;
}

/**
 * Valida el formato de la contraseña utilizando expresión regular
 * @param {string} contraseña - Contraseña a validar
 * @returns {boolean} true si la contraseña es válida, false en caso contrario
 */
function validarContraseña(contraseña) {
    if (!contraseña.trim()) {
        messageService.showError('La contraseña es obligatoria');
        return false;
    }
    if (!contraseñaRegex.test(contraseña)) {
        messageService.showError('La contraseña debe tener 6-30 caracteres (letras, números y caracteres especiales)');
        return false;
    }
    return true;
}

/**
 * Inicializa el formulario de login cuando el DOM está cargado
 * Verifica si el usuario ya está autenticado y configura los event listeners
 * @async
 * @returns {void}
 */
document.addEventListener("DOMContentLoaded", () => {
    
    if (AuthService.isAuthenticated()) {
        window.location.href = 'src/pages/welcomePage.html'
        return
    }

    const formulario = document.getElementById("loginForm")

    /**
     * Event listener para el envío del formulario de login
     * Valida las credenciales y realiza la autenticación
     * @async
     * @param {Event} event - Evento del formulario
     * @returns {Promise<void>}
     */
    formulario.addEventListener("submit", async (event) => {
        event.preventDefault()

        const username = document.getElementById("txtUser").value
        const password = document.getElementById("txtPassword").value

        // Validar campos con expresiones regulares
        if (!validarUsuario(username)) return;
        if (!validarContraseña(password)) return;

        try{
            const user = await AuthService.login(username, password)
            
            if(user){
                messageService.showSuccess('¡Bienvenido!', 1500)
                document.getElementById("loginForm").reset()
                const loginSuccessEvent = new Event('loginSuccess')
                document.dispatchEvent(loginSuccessEvent)
            } else {
                messageService.showError('Usuario o contraseña incorrectos')
            }
        }catch(error){
            console.log(error)
            messageService.showError('Error al iniciar sesión: ' + error.message)
        }

    })

})