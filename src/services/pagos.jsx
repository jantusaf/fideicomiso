import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/`



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



// HELPERS
const authGet = async (url) => {

    const { data } = await axios.get(
        baseUrl + url,
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



const authPost = async (url, body) => {

    const { data } = await axios.post(
        baseUrl + url,
        body,
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



// PAGOS
const pagarnivel2 = async (pago) =>
    authPost('pagos/pagonivel2', pago)

const derivarpagoic3 = async (pago) =>
    authPost('pagos/derivarpagoic3', pago)

const pagarnivel4lote = async (pago) =>
    authPost('pagos/pagarnivel4lote', pago)

const pagarnivel4 = async (pago) =>
    authPost('pagos/pagarnivel4', pago)

const pagar = async (pago) =>
    authPost('usuario1/realizarr', pago)

const rechazararpago = async (form) =>
    authPost('pagos/rechazarr', form)

const aprobarpago = async (form) =>
    authPost('pagos/aprobarr/', form)

const detallesPagocli = async (id) =>
    authPost('pagos/detallesPagocli', id)

const detallesPago = async (id) =>
    authPost('pagos/detallespagos', id)

const detallesPagoic3 = async (id) =>
    authPost('pagos/detallesPagoic3', id)

const VerExtracto = async (id) =>
    authPost('pagos/extractoid', id)

const rechazararpagoniv3 = async (form) =>
    authPost('pagos/rechazararpagoniv3', form)

const registrarInteres = async (form) =>
    authPost('pagos/registrarInteres', form)



// GETS
const aprobaciones = async () =>
    authGet('pagos/pendientess')

const listaExtractos = async () =>
    authGet('pagos/todoslosextractos')

const pagosinusuales = async () =>
    authGet('pagos/listainusual')

const pagosinusuales2 = async () =>
    authGet('pagos/pagosinusuales2')

const cantidadpendientesadmin = async () =>
    authGet('pagos/cantidadpendientesadmin')

const cantidadpendientes = async () =>
    authGet('pagos/cantidadpendientes')

const verCoincidencias = async (id) =>
    authGet('pagos/vercoincidencias/' + id)

const traerpagodecuota = async (id) =>
    authGet('pagos/traerpagodecuota/' + id)

const traerpagosdeuncliente = async (id) =>
    authGet('pagos/traerpagosdeuncliente/' + id)

const traerpago = async (id) =>
    authGet('pagos/traerpago/' + id)



// TODOS LOS PAGOS
const todoslospagos = async (datos) => {

    const { data } = await axios.get(
        baseUrl + "pagos/todoslospagos",
        {
            ...getConfig(),
            params: datos,
        }
    )

    return data
}



// PDF
const traerPdfConstanciadepago = async (id) => {

    try {

        const { data } = await axios.get(
            `${baseUrl}traerPdfConstanciadepago/${id}`,
            {
                ...getConfig(),
                responseType: 'blob',
            }
        )

        return data

    } catch (error) {

        console.error(
            'Error al obtener el PDF:',
            error
        )

        throw error
    }
}



const traerPdfConstanciadepagoic3 = async (id) => {

    try {

        const { data } = await axios.get(
            `${baseUrl}traerPdfConstanciadepagoic3/${id}`,
            {
                ...getConfig(),
                responseType: 'blob',
            }
        )

        return data

    } catch (error) {

        console.error(
            'Error al obtener el PDF:',
            error
        )

        throw error
    }
}



export default {

    derivarpagoic3,
    pagosinusuales2,
    registrarInteres,
    traerpagosdeuncliente,
    traerPdfConstanciadepagoic3,
    detallesPagoic3,
    detallesPagocli,
    traerPdfConstanciadepago,
    cantidadpendientesadmin,
    todoslospagos,
    traerpago,
    pagarnivel4lote,
    pagarnivel4,
    traerpagodecuota,
    rechazararpagoniv3,
    verCoincidencias,
    listaExtractos,
    VerExtracto,
    pagar,
    pagosinusuales,
    aprobaciones,
    aprobarpago,
    rechazararpago,
    pagarnivel2,
    cantidadpendientes,
    detallesPago

}