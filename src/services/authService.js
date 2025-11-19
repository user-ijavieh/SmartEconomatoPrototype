const API_URL = 'http://localhost:3000'

export const AuthService = {

    async login(username,password){

        const response = await fetch(`${API_URL}/usuarios?username=${username}&password=${password}`)
        const data = await response.json()

        // Comprobamos si existe algun error

        if(data.length === 0){
            throw new Error('Usuario o contraseña incorrectos')
        }

        const user = data[0]

        return user


    }
}