import axios from "axios"
const baseUrl = `${import.meta.env.VITE_API_URL}/novedades/`;


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
  
  const crear= async  (datos) => {
 
    const data  = await axios.post(baseURL+'crear',datos,config)
    

    return data.data 
} 
const todas= async  (cuil_cuit) => {
 
    const {data } = await axios.get(baseURL+'todas/',config)
  
    return data 
} 

const todosloschats= async  (cuil_cuit) => {
 
    const {data } = await axios.get(baseURL+'todosloschats/',config)
  
    return data 
} 

const leerchat= async  (cuil_cuit) => {
 
    const {data } = await axios.get(baseURL+'leerchat/'+cuil_cuit,config)
  
    return data 
} 


const leer= async  (id) => {
 
    const {data } = await axios.get(baseURL+'leer/'+id,config)
  
    return data 
} 
export default {todas,crear,leer,todosloschats,leerchat};

