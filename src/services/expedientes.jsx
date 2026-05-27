import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/expedientes/`;

const listaexp = async () => {
console.log('etc')
  const { data } = await axios.get(baseUrl + 'lista')
  return data

}


const expediente = async (id) => {
 
    const { data } = await axios.get(baseUrl +'expediente/'+ id)
   
    return data
  
  }

  const expedientemodif = async (id) => {

    const { data } = await axios.post(baseUrl +'modifexpediente/', id)
    return data
  
  }



export default { listaexp,  expediente,expedientemodif};