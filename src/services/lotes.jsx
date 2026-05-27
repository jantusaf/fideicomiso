import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/lotes/`;



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


const lista= async  () => {
   
    const {data } = await axios.get(baseUrl+'listadetodos',config)
    
    return data 
}  

const listausur= async  () => {
   
    const {data } = await axios.get(baseUrl+'listausur',config)
    
    return data 
}  

const lista2= async  () => {
   
    const {data } = await axios.get(baseUrl+'lista2',config)
    if(data === 'error login'){  
        alert('Debe loguearse nuevamente')
         window.localStorage.removeItem('loggedNoteAppUser')
      
         return 'error login' 
     
     } 
    return data 
}

const traerlotesleg= async  () => {
   
    const {data } = await axios.get(baseUrl+'traerlotesleg',config)
    
    return data 
}


const prueba= async  (s) => {
    await axios.post(baseUrl+'prueba',s)
  console.log(s)
    
   
}  



const listalotes= async  () => {
   
    const {data } = await axios.get(baseUrl+'listadelotes',config)
    
    return data 
}  

const desasignarlote= async  (id) => {
   
    const {data } = await axios.get(baseUrl+'desasignarlote'+id,config)
    
    return data 
}  



const lotesCliente= async  (cuil_cuit) => {
  
    let {data}  = await axios.get(baseUrl+'lotescliente/'+cuil_cuit,config)

    const lotes=(data[0])

   
   
    return data
}  

const lotesClienteUsuario1= async  (cuil_cuit) => {
    //   hacer la separacion
   
   
       let {data}  = await axios.get(baseUrl+'lotescliente/'+cuil_cuit,config)
   
       const lotes=(data[0])
   
      
      
       return data
   } 

const lotesCliente2= async  (cuil_cuit) => {
      
       let {data}  = await axios.get(baseUrl+'lotescliente2/'+cuil_cuit,config)
      

       const lotes=(data[0])
       
      
      
       return data
   }  

   
   const traermanzanas= async  () => {

     let {data}  = await axios.get(baseUrl+'traermanzanas/',config)
    
    
    
     return data
 }  

  const poligonosguardados= async  () => {

     let {data}  = await axios.get(baseUrl+'poligonosguardados/',config)
    
    
    
     return data
 }  
   const calcular= async  (datos) => {
   
    const {data } = await axios.post(baseUrl+'calcularvalor',datos,config)
    
    return data 
}  

const determinarmapa1= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'determinarmapa1',datos,config)
     
     return data 
 }  


 


 const determinarmapatodos= async  (datos) => {
    console.log(datos)
    const {data } = await axios.post(baseUrl+'determinarmapatodos',datos,config)
    
    return data 
}  




 const determinarmapa2= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'determinarmapa2',datos,config)
     
     return data 
 } 
 
const modificarlote= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'modificarlote',datos,config)
     
     return data 
 } 
const nuevolote= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'nuevolote',datos,config)
     
     return data 
 }  

 const determinarposecion= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'determinarposecion',datos,config)
     
     return data 
 }  
 
 const nuevamanzana= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'nuevamanzana',datos,config)
     
     return data 
 }  
 
 
 const traersegunmapa1= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'traersegunmapa1',{mapa1:datos},config)
     
     return data 
 }  
 const traersegunmapa2= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'traersegunmapa2',{mapa2:datos},config)
     
     return data 
 }  

 
 const guardarpoligono= async  (datos) => {
    console.log(datos)
     const {data } = await axios.post(baseUrl+'guardarpoligonoo',datos,config)
     
     return data 
 }  


export default {poligonosguardados,guardarpoligono,traersegunmapa1,traersegunmapa2,determinarposecion,determinarmapatodos,determinarmapa1,listausur,determinarmapa2,lista,lista2,nuevamanzana,modificarlote, traermanzanas,desasignarlote,traerlotesleg,nuevolote,lotesCliente,lotesCliente2,listalotes,prueba, lotesClienteUsuario1, calcular};
