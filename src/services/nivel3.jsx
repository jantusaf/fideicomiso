import axios from "axios"
const baseUrl = `${import.meta.env.VITE_API_URL}/nivel3/`;


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

const enviarmovimiento= async  (datos) => {
   ///activo
    const {data } = await axios.post(baseUrl+'enviarmovimiento',datos,config)
    alert(data)
   
} 
const enviarmovimiento2= async  (datos) => {
   ///activo
   console.log(datos)
    const {data } = await axios.post(baseUrl+'enviarmovimiento2',datos,config)
    alert(data)
   
}


const agregariccgral= async  (datos) => {
   ///activo
    const {data } = await axios.post(baseUrl+'agregariccgral2',datos,config)
    alert(data)
   
}  
const agregariccgral2= async  (datos) => {
    
     const {data } = await axios.post(baseUrl+'agregariccgral22',datos,config)
     alert(data)
    
 }  
const traerhistorial= async  () => {
   
    const {data } =await axios.get(baseUrl+'historialicc',config)

    return data 
}  

const traerdatosdetarjetas= async  () => {
   
    const {data } =await axios.get(baseUrl+'traerdatosdetarjetas',config)

    return data 
} 
const nuevoicc= async  (datos) => {
    
     const {data } =await axios.post(baseUrl+'consultaricc',datos,config)
    
     return data 
 }  
 const valormetrocuadrado= async  (datos) => {
    
     const {data } =await axios.post(baseUrl+'asignarvalormetroc',datos,config)
    
     return data 
 } 

const borrarhistorial= async  () => {
    
    const data =await axios.get(baseUrl+'borrarhistorial',config)
 
     return data 
 }  

 const asignarclave= async  (datos) => {
    
     const {data } =await axios.post(baseUrl+'asignarclave',datos,config)
        alert(data)
     return data 
 } 
 
 const enviardatosnuevosalario= async  (datos) => {
    
    const {data } =await axios.post(baseUrl+'enviardatosnuevosalario',datos,config)
       
    return data 
} 


 const registronivel3 = async (datos) => {
    
  
 
      const {data} = await axios.post(baseUrl+'signupp', datos,config)
 
         alert(data)
    
 
       
  }
  const traerUsuarios = async () => {
    
  
 
      const {data} = await axios.get(baseUrl+'traerusuarios',config)
      

      return data
 
       
      

       
  }
  const traerhistorialvalor= async  () => {
  
     const {data } =await axios.get(baseUrl+'historialvalormetro',config)
 
     return data 
 }  


  const traermovimientos= async  () => {
  
     const {data } =await axios.get(baseUrl+'traermovimientos',config)
 
     return data 
 }  


 const subirexceldemovimientos = async (archivo) => {

  const { data } = await axios.post(
    baseUrl + 'subirexceldemovimientos',
    archivo,
    {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;

}


 const subirexceldemovimientos2 = async (archivo) => {

  const { data } = await axios.post(
    baseUrl + 'subirexceldemovimientos2',
    archivo,
    {
      ...config,
      headers: {
        ...config.headers,
        "Content-Type": "multipart/form-data"
      }
    }
  );

  return data;

}

 const mofificarmconcepto = async (datos) => {
    
  
 console.log(datos)
      const {data} = await axios.post(baseUrl+'mofificarmconcepto', datos,config)
 
         return(data)
    
 
       
  }



    const traeringresos= async  () => {
  
     const {data } =await axios.get(baseUrl+'traeringresos',config)
 
     return data 
 }  


 


const traerventas2 = (filtros = {}) => {
  return axios.get(baseUrl+"traerventas2", {
    params: filtros,
  });
};


export default {subirexceldemovimientos2, enviarmovimiento2, traerventas2, traeringresos, mofificarmconcepto, traermovimientos, subirexceldemovimientos, enviarmovimiento,enviardatosnuevosalario,traerdatosdetarjetas,traerhistorialvalor,agregariccgral2,agregariccgral,traerUsuarios,asignarclave,traerhistorial,borrarhistorial,nuevoicc,valormetrocuadrado,registronivel3};
