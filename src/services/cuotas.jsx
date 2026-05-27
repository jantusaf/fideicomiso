import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/cuotas/`;




const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {
    const userContext = JSON.parse(loggedUserJSON)


    config = {
        headers: {
            Authorization: `Bearer ${userContext.token}`
        }
    }


} else {
    config = {
        headers: {
            Authorization: `Bearer `
        }
    }
}



const vercuotas4 = async (id) => {

    const { data } = await axios.get(baseUrl + 'vercuotas4/' + id, config)
    if(data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }

    return data
}

const vercuotas2 = async (id) => {

    const { data } = await axios.get(baseUrl + 'vercuotas2/' + id, config)
    if(data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }

    return data
}

const vercuotas = async (id) => {

    console.log(baseUrl)
    const { data } = await axios.get(baseUrl + 'lote2/' + id, config)
    if(data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }

    return data
}

const traercuotasic3 = async (cuil_cuit) => {

    console.log(baseUrl)
    const { data } = await axios.get(baseUrl + 'traercuotasic3/' + cuil_cuit, config)
    if(data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }

    return data
}
const traercuota = async (id) => {

    console.log(id)
    const { data } = await axios.get(baseUrl + 'traercuota/' + id, config)
   

    return data
}




const iefgralleg = async () => {

    const data = await axios.get(baseUrl + 'iefgralleg/', config)
    if(data === 'error login'){  
        alert('Debe loguearse nuevamente')
         window.localStorage.removeItem('loggedNoteAppUser')
      
         return 'error login' 
     
     } 
    

console.log(data.data)
    return data.data
}


const verief = async (id) => {
    console.log(id)
    const data = await axios.get(baseUrl + 'ief/' + id, config)
    if(data.data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }
    console.log(data.data)



    return data.data
}

////ief legales
const verief2 = async (id) => {
    console.log(id)
    const data = await axios.get(baseUrl + 'ief2/' + id, config)
    if(data.data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }
    console.log(data.data)



    return data.data
}

const cuotasDeUnLote = async (id) => {

    console.log(id)
    const data = await axios.get(baseUrl + 'cuotasdeunlote/' + id, config)
    console.log(data)

    return data
}
const borrarcuota = async (id) => {

    console.log(id)
    const rta = await axios.get(baseUrl + 'delete/' + id, config)
    console.log(rta)

    return rta.data
}


const borrarpago = async (id) => {

    console.log(id)
    const { data } = await axios.post(baseUrl + 'borrarpago/', id, config)
 


    return data
}

const borrarcuotas = async (id) => {

    console.log(id)
    const rta = await axios.get(baseUrl + 'borrartodas/' + id, config)
    alert(rta.data)

    //return rta.data 
}

const agregarCuotas = async (estadoCuotas) => {

    console.log(estadoCuotas)
    const { data } = await axios.post(baseUrl + 'addaut2/', estadoCuotas, config)


    return data
}

const agregarCuotasleg = async (estadoCuotas) => {

    console.log(estadoCuotas)
    const { data } = await axios.post(baseUrl + 'agregarcuotasleg/', estadoCuotas, config)


    return data
}
const modificarmontotal = async (estadoCuotas) => {

    console.log(estadoCuotas)
    const { data } = await axios.post(baseUrl + 'modificarmontotal/', estadoCuotas, config)

    return data
}

const actualizarcuota = async (cuotaact) => {
    console.log(cuotaact)

    const { data } = await axios.post(baseUrl + 'actualizarcuota/', cuotaact, config)


    return data
}


const asignarICC = async (nuevoicc) => {
    console.log(nuevoicc)

    const { data } = await axios.post(baseUrl + 'agregaricc/', nuevoicc, config)


    return data
}



const traercuotasdisponibles = async (id) => {
    console.log('data')
    console.log(id)
    const { data } = await axios.get(baseUrl + 'traercuotasfinales/' + id, config)

    console.log(data)

    return data
}

const traercuotasdisponiblesporlote = async (id) => {
    console.log('data')
    console.log(id)
    const { data } = await axios.get(baseUrl + 'traercuotasdisponiblesporlote/' + id, config)

    console.log(data)

    return data
}
const listavarios = async (cuil_cuit) => {
   
    const { data } = await axios.get(baseUrl + 'listavarios/' + cuil_cuit, config)
    console.log(data)

    return data
}


const agregarCuotasVarios = async (estadoCuotas) => {

    console.log(estadoCuotas)
    const { data } = await axios.post(baseUrl + 'addautvarias/', estadoCuotas, config)


    // return data
}



const traercuotaselcliente = async (id) => {
   console.log(id)
    const { data } = await axios.get(baseUrl + 'traercuotaselcliente/' + id, config)
    console.log(data)

    return data
}


const asignarloteacuotas = async (datos) => {

    console.log(datos)
    const { data } = await axios.post(baseUrl + 'asignarloteacuotas/', datos, config)


    return data
}


const cancelarlote = async (datos) => {

    console.log(datos)
    const { data } = await axios.post(baseUrl + 'cancelarlote/', datos, config)


    return data
}


const compensar = async (datos) => {

    console.log(datos)
    const { data } = await axios.post(baseUrl + 'compensar/', datos, config)


    return data
}
const compensaric3 = async (datos) => {

    console.log(datos)
    const { data } = await axios.post(baseUrl + 'compensaric3/', datos, config)


    return data
}
export default {compensaric3, compensar, cancelarlote,traercuotasic3,vercuotas4,iefgralleg, traercuotasdisponiblesporlote,asignarloteacuotas,vercuotas2,modificarmontotal,borrarpago,agregarCuotasleg, traercuotaselcliente, agregarCuotasVarios,actualizarcuota,traercuota, listavarios, asignarICC, traercuotasdisponibles, vercuotas, agregarCuotas, cuotasDeUnLote, borrarcuota, verief,verief2, borrarcuotas };
