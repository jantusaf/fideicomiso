import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/`

let token = null



// GUARDAR TOKEN
const setToken = (newToken) => {

    token = `Bearer ${newToken}`
}



// OBTENER CONFIG DINAMICO
const getConfig = () => {

    // SI EXISTE TOKEN EN MEMORIA
    if (token) {

        return {
            headers: {
                Authorization: token
            }
        }
    }

    // SI NO EXISTE, BUSCAR EN LOCALSTORAGE
    const loggedUserJSON =
        window.localStorage.getItem(
            'loggedNoteAppUser'
        )

    if (!loggedUserJSON) {

        return {
            headers: {}
        }
    }

    try {

        const userContext =
            JSON.parse(loggedUserJSON)

        return {

            headers: {
                Authorization:
                    `Bearer ${userContext.token}`
            }
        }

    } catch (error) {

        console.log(error)

        window.localStorage.removeItem(
            'loggedNoteAppUser'
        )

        return {
            headers: {}
        }
    }
}



// PRUEBA TOKEN
const usuarios = async () => {

    const request = await axios.get(
        baseUrl + 'prueba',
        getConfig()
    )

    return request.data
}



// REGISTRO
const registro = async (datos) => {

    const { data } = await axios.post(
        baseUrl + 'signupp',
        datos
    )

    return data
}



// TRAER USUARIO
const traerusuario = async (cuil_cuit) => {

    const { data } = await axios.get(
        baseUrl + 'traerusuario/' + cuil_cuit,
        getConfig()
    )

    return data
}



// RECUPERO
const recupero = async (datos) => {

    const { data } = await axios.post(
        baseUrl + 'recupero',
        datos
    )

    return data
}



// RECUPERAR
const recuperar = async (datos) => {

    const { data } = await axios.post(
        baseUrl + 'recuperoo',
        datos
    )

    return data
}



export default {

    recupero,
    recuperar,
    usuarios,
    setToken,
    registro,
    traerusuario

}