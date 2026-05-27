import axios from "axios"

const baseUrl =
    `${import.meta.env.VITE_API_URL}/notificaciones/`



// CONFIG DINAMICO
const getConfig = () => {

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



// LEER
const leer = async (id) => {

    const { data } = await axios.get(
        baseUrl + 'leer/' + id,
        getConfig()
    )

    if (data === 'error login') {

        window.localStorage.removeItem(
            'loggedNoteAppUser'
        )

        window.location.reload()
    }

    return data
}



// CANTIDAD PENDIENTES
const cantidadpendientes = async (
    cuil_cuit
) => {

    const { data } = await axios.get(
        baseUrl + 'cantidad/' + cuil_cuit,
        getConfig()
    )

    if (data === 'error login') {

        window.localStorage.removeItem(
            'loggedNoteAppUser'
        )

        window.location.reload()
    }

    return data
}



export default {

    leer,
    cantidadpendientes

}