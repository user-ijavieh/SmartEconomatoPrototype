import { AuthService } from "../services/authService.js";
import { messageService } from "../services/messageService.js";

document.addEventListener("DOMContentLoaded", () => {
    
    if (AuthService.isAuthenticated()) {
        window.location.href = 'src/pages/welcomePage.html'
        return
    }

    const formulario = document.getElementById("loginForm")

    formulario.addEventListener("submit", async (event) => {
        event.preventDefault()

        const username = document.getElementById("txtUser").value
        const password = document.getElementById("txtPassword").value

        if(!username.trim() || !password.trim()){
            messageService.showError('Por favor, ingresa usuario y contraseña')
            return
        }

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