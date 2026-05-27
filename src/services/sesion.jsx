

import servicioUsuario from "./usuarios"
const baseUrl = `${import.meta.env.VITE_API_URL}/`;
const sesion = () => {
  const user = null
        const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
        
        if (loggedUserJSON) {
          const user = JSON.parse(loggedUserJSON)
 
          servicioUsuario.setToken(user.token)  
          return (user)
        }
        return (user)
        
   
}
export default sesion;