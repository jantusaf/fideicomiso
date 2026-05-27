
import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/administracion/`;


//const  baseUrl = 'https://api.santacatalinafideicomiso.com/'
//const  baseUrl = 'http://localhost:4000/administracion/'


const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {
    const userContext = JSON.parse(loggedUserJSON)


     config = {
        headers:{
            Authorization:`Bearer ${userContext.token}`
        }
    }

    
}else{
     config = {
        headers:{
            Authorization:`Bearer `
        }
    }
}


const lista= async  () => {
   
    const {data } = await axios.get(baseUrl+'pendientestodas')
    
    return data 
}   

const borrarusuario= async  (cuil_cuit) => {
   
  const {rta}  = await axios.get(baseUrl+'borrarusuario/'+cuil_cuit,config)
   
    return rta 
} 

const rechazocbu= async  (form) => {

 
  const data  = await axios.post(baseUrl+'rechazarcbu/',form)

 
} 

const extracto= async  () => {
   
    const {data } = await axios.get(baseUrl+'extracto')
    
    return data 
}  
const subirprueba = async (formdata) => {
   
    const { data } = await axios.post(baseUrl + 'subirprueba', formdata,config)
   
  
  }



  const traerPagos = async () => {
    
    const { data } = await axios.get(baseUrl + 'pagos',config)
   
    return data
  
  }
//borrar pago
  const borrarPago = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'borrarpago/'+id,config)
    
    return data
  
  }
  

  const borrarPagoic3 = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'borrarpagoic3/'+id,config)
    
    return data
  
  }

  const borrarcomprobante = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'borrarcomprobante/'+id,config)
    
    return data
  
  }
  
  const borrarcomprobanteic3 = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'borrarcomprobanteic3/'+id,config)
    
    return data
  
  }
  const traerlink360 = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'traerlink360/'+id,config)
   
    return data
  
  }
  const traerlinkcuota = async (id) => {
    
    const { data } = await axios.get(baseUrl + 'traerlinkcuota/'+id,config)
   
    return data
  
  }


  const cambiarestado= async  (datos) => {
   
     const {data } = await axios.post(baseUrl+'cambiarestado/',datos,config)
 
     return data 
 } 
 const consultapep= async  (nombre) => {
   
  const {data } = await axios.post(baseUrl+'consultapep',{nombre:nombre})
  
  return data 
}
export default {borrarcomprobanteic3,borrarPagoic3,consultapep,borrarcomprobante,cambiarestado,borrarPago,traerlink360,traerlinkcuota,lista,rechazocbu,borrarusuario,extracto,subirprueba,traerPagos};
