/**
 * @fileoverview Servicio de autenticación
 * Maneja el login, sesiones y autenticación de usuarios
 * @module services/authService
 */

const API_URL = 'http://localhost:3000'
const SESSION_KEY = 'smartEconomato_session'

/**
 * Servicio de autenticación para usuarios
 * @namespace AuthService
 */
export const AuthService = {

    /**
     * Autentica un usuario con sus credenciales
     * @async
     * @param {string} username - Nombre de usuario
     * @param {string} password - Contraseña del usuario
     * @returns {Promise<Object>} Objeto del usuario autenticado
     * @throws {Error} Si las credenciales son incorrectas
     */
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

    /**
     * Guarda los datos del usuario en la sesión (localStorage)
     * @param {Object} user - Objeto del usuario a guardar
     * @param {number} user.id - ID del usuario
     * @param {string} user.username - Nombre de usuario
     * @param {string} user.nombre - Nombre completo del usuario
     * @param {string} user.rol - Rol del usuario
     * @returns {void}
     */
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

    /**
     * Obtiene los datos de sesión del usuario del localStorage
     * @returns {Object|null} Objeto con datos de sesión o null si no existe
     */
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

    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean} true si existe una sesión válida, false en caso contrario
     */
    isAuthenticated() {
        const session = this.getSession()
        return session !== null && session.user !== undefined
    },

    /**
     * Obtiene los datos del usuario actual de la sesión
     * @returns {Object|null} Objeto del usuario o null si no está autenticado
     */
    getCurrentUser() {
        const session = this.getSession()
        return session ? session.user : null
    },

    /**
     * Cierra la sesión del usuario removiendo datos de localStorage
     * @returns {void}
     */
    logout() {
        localStorage.removeItem(SESSION_KEY)
    }
}