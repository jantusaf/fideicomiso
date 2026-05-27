import axios from "axios"

import { useNavigate } from "react-router-dom";
const baseURL = `${import.meta.env.VITE_API_URL}/links/`;

//const  baseURL = 'http://localhost:4000/links/'

const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {

    try {
        const userContext = JSON.parse(loggedUserJSON)
        config = {
           headers:{
               Authorization:`Bearer ${userContext.token}`
           }
       }
    } catch (error) {
          window.localStorage.removeItem('loggedNoteAppUser')
     
    }
   

    
}else{
     config = {
        headers:{
            Authorization:`Bearer `
        }
    }
}
  
  const datoslegajo= async  (datos) => {
 
    const data  = await axios.post(baseURL+'estadisticaslegajos',datos,config)
    if(data.data === 'error login'){
        window.localStorage.removeItem('loggedNoteAppUser')
    }

    return data.data 
} 
const modificarCliente= async  (datos) => {
   
    const data  = await axios.post(baseURL+'modificarcli',datos,config)
    if(data.data === 'error login'){
       //  alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
      
        window.location.reload();
    }

    return data.data 
} 


const crear= async  (datos) => {
 
    const {data } = await axios.post(baseURL+'add2',datos,config)
    
    return(data)  
}  

////crear cliente desde legales

const crear2= async  (datos) => {
   
     const {data } = await axios.post(baseURL+'add3',datos,config)
     
     alert(data)  
 }  





const determinarEmpresa= async  (datos) => {
  
     const {data } = await axios.post(baseURL+'determinarempresa',datos,config)
     if(data === 'error login'){  
        // alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        window.location.reload();
    }
     alert(data)  
 }  

 
 
 const listaic3= async  () => {
  
    const {data } = await axios.get(baseURL+'listaic3',config)
  //const {data } = await axios.get('https://api.santacatalinafideicomiso.com/prueba',config)

   // const {data } = await axios.get('http://localhost:4000/prueba',config)
   if(data === 'error login'){  
    // alert('Debe loguearse nuevamente')
    window.localStorage.removeItem('loggedNoteAppUser')
 
    window.location.reload();
}
    
    return data 
}   
const lista2= async  () => {


    const {data } = await axios.get(baseURL+'lista2',config)
  //const {data } = await axios.get('https://api.santacatalinafideicomiso.com/prueba',config)

  
  if(data === 'error login'){  
    // alert('Debe loguearse nuevamente')
    window.localStorage.removeItem('loggedNoteAppUser')
 
    return 'error login' 

} 
    
    return data 
}  
const lista= async  () => {
  
    const {data } = await axios.get(baseURL+'infocantidad',config)
  //const {data } = await axios.get('https://api.santacatalinafideicomiso.com/prueba',config)

   // const {data } = await axios.get('http://localhost:4000/prueba',config)
   if(data === 'error login'){  
    // alert('Debe loguearse nuevamente')
    window.localStorage.removeItem('loggedNoteAppUser')
 
    window.location.reload();
}
    
    return data 
}   


const ventaLoteleg = async  (datos) => {
   
    const {data}  = await axios.post(baseURL+'ventaLoteleg',datos,config)
    

    return data
   
} 



 const ventaLote = async  (datos) => {
   
    const {data}  = await axios.post(baseURL+'ventalotee',datos,config)
    
    return data
   
} 
const cliente= async  (cuil_cuit) => {

    const {data } = await axios.get(baseURL+'detalle/'+cuil_cuit,config)
    
    return data 
} 

const determinarIngreso= async  (datos) => {
  
  const {data } = await axios.post(baseURL+'agregaringreso2/',datos,config)

    return data 
}

const modificarclientelegales= async  (datos) => {
  
    const {data } = await axios.post(baseURL+'modificarclientelegales/',datos,config)
  

      return data 
  }


const traerLejagos= async  (cuil_cuit) => {
  
    const {data } = await axios.get(baseURL+'legajos/'+cuil_cuit,config)
    
    return data 
}

 const deudores= async  (cuil_cuit) => {
  
    const {data } = await axios.get(baseURL+'deudores/',config)
    
    return data 
}
  const habilitar= async  (etc) => {
   
      const {data } = await axios.post(baseURL+'habilitar/',etc,config)
     
      return data 
  }
  const deshabilitar= async  (etc) => {
    
      const {data } = await axios.post(baseURL+'deshabilitar/',etc,config)
     
      return data 
  }

  const modificarCuil= async  (etc) => {
 
     const {data } = await axios.post(baseURL+'modificarcuil/',etc,config)
    
     return data 
 }

  
  const listacbupendientes= async  () => {
    
     const {data } = await axios.get(baseURL+'cbuspendientes/',config)
    
     return data 
 }

 const borrarcbu= async  (id) => {
    
    const {data } = await axios.get(baseURL+'borrarcbu/'+id,config)
   alert(data)
    return data 
}


const clientehabilitadoic3= async  (cuil_cuit) => {

    const {data } = await axios.get(baseURL+'clientehabilitadoic3/'+cuil_cuit,config)
  
    if(data === 'error login'){  
       alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        return 'error login' 
    
    } 
    return data 
} 

 const clientehabilitado= async  (cuil_cuit) => {

    const {data } = await axios.get(baseURL+'clientehabilitado/'+cuil_cuit,config)
  
    if(data === 'error login'){  
       alert('Debe loguearse nuevamente')
        window.localStorage.removeItem('loggedNoteAppUser')
     
        return 'error login' 
    
    } 
    return data 
} 

const infocantidad= async  (cuil_cuit) => {
 
    const {data } = await axios.get(baseURL+'infocantidad/',config)

    if(data === 'error token'){
        //  alert('Debe loguearse nuevamente')
         window.localStorage.removeItem('loggedNoteAppUser')
       
         window.location.reload();
      
     }
  
    return data 
} 
const enviarmailprueba= async  (etc) => {

    const {data } = await axios.post(baseURL+'enviarmailprueba/',etc,config)
  
    return data 
} 

const agregarbeneficiarios= async  (etc) => {

    const {data } = await axios.post(baseURL+'agregarbeneficiarios/',etc,config)
  
    return data 
} 
export default {deudores, agregarbeneficiarios,clientehabilitadoic3,listaic3,borrarcbu,ventaLoteleg,crear2,modificarclientelegales,lista2,modificarCuil,determinarEmpresa,enviarmailprueba,lista,infocantidad,datoslegajo, clientehabilitado,listacbupendientes,cliente,modificarCliente,deshabilitar, determinarIngreso,ventaLote,traerLejagos,crear,habilitar};


