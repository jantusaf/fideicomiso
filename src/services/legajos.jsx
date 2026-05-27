import axios from "axios"


const baseUrl = `${import.meta.env.VITE_API_URL}/usuario1/`;



const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

let config = ''
if (loggedUserJSON) {
  const userContext = JSON.parse(loggedUserJSON)


  config = {
    headers: {
      Authorization: `Bearer ${userContext.token}`
      
    }
  }


} else {
  config = {
    headers: {
      Authorization: `Bearer `
    }
  }
}



const subirprueba = async (formdata) => {
  
  const { data } = await axios.post(baseUrl + 'subirlegajoprueba', formdata, config)
  

}
//nivel2
const subirlegajode = async (formData) => {
  const newData = {
    ...config,
    headers: { 'Content-Type': 'multipart/form-data' }
  };


  const {data} = await axios.post(baseUrl + 'subirlegajo', formData)
  //await axios.post(baseUrl + 'subirlegajo', formData, config)
 console.log(data)
  return data


}

const determinarIngreso = async (formData) => {

  

 const {data} = await axios.post(baseUrl + 'determinaringreso', formData, config)
 alert(data)
 return (data)

  //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'


  //  }})
}
const subirlegajo1 = async (formData) => {

  

 const {data} = await axios.post(baseUrl + 'subirlegajo1', formData, config)
 
 return (data)

  //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'


  //  }})
}

const actualizarpago = async (formData) => {

  

  const {data} = await axios.post(baseUrl + 'actualizarpago', formData, config)
  
  return (data)
 
   //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'
 
 
   //  }})
 }
 
 
const actualizarpagoic3 = async (formData) => {

  

  const {data} = await axios.post(baseUrl + 'actualizarpagoic3', formData, config)
  
  return (data)
 
   //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'
 
 
   //  }})
 }
 
 
 const modificarcbu = async (formData) => {

  

  const {data} = await axios.post(baseUrl + 'modificarcbu', formData, config)
  
  return (data)
 
   //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'
 
 
   //  }})
 }
 
 const modificarconstancianormal = async (formData) => {

  

  const {data} = await axios.post(baseUrl + 'modificarconstancianormal', formData, config)
  
  return (data)
 
   //await axios.post(baseUrl +'subirlegajo', formData, { headers: {'Content-Type': 'multipart/form-data'
 
 
   //  }})
 }
const borrar = async (id) => {
  await axios.get(baseUrl + 'borrarunlegajo/' + id)

}

const cantidadbalances = async (cuil_cuit) => {
   
  
 const {data } = await axios.get(baseUrl + 'cantidadbalances/' + cuil_cuit,config)

 return data

}

const cantidaddjiva = async (cuil_cuit) => {
   
  
  const {data } = await axios.get(baseUrl + 'cantidaddjiva/' + cuil_cuit,config)
 
  return data
 
 }


 
 const cantidadiibb = async (cuil_cuit) => {
   
  
  const {data } = await axios.get(baseUrl + 'cantidadiibb/' + cuil_cuit,config)
 
  return data
 
 }
 

 const traerPdfConstanciacbu = async (id) => {
  try {
    const config = {
      responseType: 'blob', // Esto es importante para manejar blobs de archivos
    };
    const { data } = await axios.get(`${baseUrl}traerpdfonstanciacbu/${id}`, config);
    return data;
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    throw error;
  }
};
 const traerPdfConstancia = async (id) => {
  try {
    const config = {
      responseType: 'blob', // Esto es importante para manejar blobs de archivos
    };
    const { data } = await axios.get(`${baseUrl}traerpdfconstancia/${id}`, config);
    return data;
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    throw error;
  }
};

const traerPdfConstanciadepagoinusual = async (id) => {
  try {
    const config = {
      responseType: 'blob', // Esto es importante para manejar blobs de archivos
    };
    const { data } = await axios.get(`${baseUrl}traerPdfConstanciadepagoinusual/${id}`, config);
    return data;
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    throw error;
  }
};
const traerPdfConstanciadepagoinusual2 = async (id) => {
  try {
    const config = {
      responseType: 'blob', // Esto es importante para manejar blobs de archivos
    };
    const { data } = await axios.get(`${baseUrl}traerPdfConstanciadepagoinusual2/${id}`, config);
    return data;
  } catch (error) {
    console.error('Error al obtener el PDF:', error);
    throw error;
  }
};
export default {traerPdfConstanciadepagoinusual2,traerPdfConstanciadepagoinusual,modificarconstancianormal,modificarcbu,actualizarpagoic3,traerPdfConstanciacbu, actualizarpago,traerPdfConstancia,determinarIngreso,cantidadbalances,cantidadiibb,cantidaddjiva,subirprueba, borrar, subirlegajode, subirlegajo1 };
