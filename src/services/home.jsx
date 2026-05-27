import axios from "axios"
const baseUrl = `${import.meta.env.VITE_API_URL}/home/`;


const calcular= async  (datos) => {
    console.log(datos)
     const {data } = await axios.post(baseUrl+'calcularvalor',datos)
     console.log(data)
     return data }



export default {calcular };