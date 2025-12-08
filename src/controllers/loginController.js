import { AuthService } from "../services/authService.js";
import { uiLogin } from "../view/uiLogin.js";

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
            uiLogin.showMessage('Por favor, ingresa usuario y contraseña', 'error')
            return
        }

        try{
            const user = await AuthService.login(username, password)
            
            if(user){
                uiLogin.clearForm()
                const loginSuccessEvent = new Event('loginSuccess')
                document.dispatchEvent(loginSuccessEvent)
            } else {
                uiLogin.showMessage('Usuario o contraseña incorrectos', 'error')
            }
        }catch(error){
            console.log(error)
            uiLogin.showMessage('Error al iniciar sesión: ' + error.message, 'error')
        }

    })

})