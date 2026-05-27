import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/relevamiento/`;
//const baseUrl = 'http://localhost:4000/relevamiento/'



const buscar = async (barrio) => {
  

    const data = await axios.post(baseUrl + 'datos', barrio)

 
    return data.data

}


const cargar = async (carga) => {


    const data = await axios.post(baseUrl + 'cargar', carga)


    return data.data

}
const zonas = async () => {


    const {data} = await axios.get(baseUrl + 'zonas')
console.log(data)

    return data.data

}
const nuevazona = async (zona) => {


    const data = await axios.post(baseUrl + 'nuevazona', zona)


    return data.data

}
const borrar = async (zona) => {


    const data = await axios.post(baseUrl + 'borrardatoszona', zona)


    return data.data

}



export default { buscar, cargar,zonas,borrar,nuevazona }