import axios from "axios"
const baseUrl = `${import.meta.env.VITE_API_URL}/pagos/`;


const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
/////loggedUserJSON Recupera lasesion el tokeny lo envia mediante la constante config. el back lo filtra 
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



const buscar= async  (form) => {
   

 const {data} = await axios.post(baseUrl+'mensualesinusuales',form,config)
 

  return data
}

const cantidad= async  () => {
 

const cantidad = await axios.get(baseUrl+'cantidadinusuales',config)


 return cantidad
}   





export default { buscar, cantidad};
