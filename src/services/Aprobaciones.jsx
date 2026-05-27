
import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/`;

//const  baseUrl = 'http://localhost:4000/aprobaciones/'


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
   
    const {data } = await axios.get(baseUrl+'pendientestodas',config)
 
    return data 
}   

const cantidad= async  () => {
   
  const {data } = await axios.get(baseUrl+'pendientestodas')
  
  return data 
} 

const aprobacion= async  (id) => {
   
  const {data } = await axios.get(baseUrl+'aprobar/'+id,config)
    
  return data
}   

const rechazo= async  (form) => {

  
  const data  = await axios.post(baseUrl+'rechazarr/',form,config)
  return data
 
} 

const rechazocbu= async  (form) => {

  const data  = await axios.post(baseUrl+'rechazarcbu/',form,config)
  return data
 
} 
const aprobacioncbu= async  (id) => {
 
 const {data } = await axios.get(baseUrl+'aprobarcbu/'+id,config)
 return data

}  

export default {lista,aprobacioncbu, aprobacion,rechazo,rechazocbu,cantidad};
