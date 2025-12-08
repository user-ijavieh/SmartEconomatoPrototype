const API_URL = 'http://localhost:3000'
const SESSION_KEY = 'smartEconomato_session'

export const AuthService = {

    async login(username, password){

        const response = await fetch(`${API_URL}/usuarios?username=${username}&password=${password}`)
        const data = await response.json()

        // Comprobamos si existe algun error
        if(data.length === 0){
            throw new Error('Usuario o contraseña incorrectos')
        }
        const user = data[0]
        // Guardar sesión en localStorage
        this.saveSession(user)

        return user
    },

    //* Guarda los datos del usuario
    saveSession(user) {
        const sessionData = {
            user: {
                id: user.id,
                username: user.username,
                nombre: user.nombre,
                rol: user.rol
            },
            timestamp: new Date().getTime()
        }
        localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData))
    },

    //* Obtiene la sesión del localStorage
    getSession() {
        const sessionData = localStorage.getItem(SESSION_KEY)
        if (!sessionData) return null

        try {
            return JSON.parse(sessionData)
        } catch (error) {
            console.error('Error al parsear sesión:', error)
            return null
        }
    },

    //* Verificación de si existe una sesión
    isAuthenticated() {
        const session = this.getSession()
        return session !== null && session.user !== undefined
    },

    //* Obtiene la sesión actual
    getCurrentUser() {
        const session = this.getSession()
        return session ? session.user : null
    },

    //* Cierre de la sesión
    logout() {
        localStorage.removeItem(SESSION_KEY)
    }
}