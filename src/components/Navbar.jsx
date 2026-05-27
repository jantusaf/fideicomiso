import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/marcas.png";
import  useUser from '../hooks/useUser'
import {
  AppBar,
  Button,
  Tab,
  Tabs,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerNav from "./DrawerNav";
import serviciousuarios from "../services/usuarios"

const Navbar = (props) => {
  const usuario  = useUser().userContext

  
  const [user, setUser] = useState(null)
  const [cargado, setCargado] = useState(false)

  const [value, setValue] = useState();
  const theme = useTheme();

  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
 const islogo = {
  width: "100px",
  marginRight: "16px",
  filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.5))"
};

  const navigate = useNavigate();


  useEffect(() => {
    traer()
}, [])
const traer = async () => {

  const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

    const user = JSON.parse(loggedUserJSON)
   
  const notis = await serviciousuarios.traerusuario(user.cuil_cuit)
 
  setUser(notis[0])
  setCargado(true)


  /* if (notificaciones>0) {
    document.title= 'Santa Catalina ('+notificaciones+')'
 
  }   */
}

  const handleClick = () => {
    navigate("/login");
  };
  const hanleLogout = () => {
 
     setUser(null)
     //servicioUsuario.setToken(user.token) 
         navigate('/login')
     
   

     window.localStorage.removeItem('loggedNoteAppUser')
   

   } 

  const inicio = () => {
    navigate("/usuario2/clientes")
    

  }
  //1a303e COLOR AZUL OSCURO DEL NAV
  return (
    <React.Fragment>
      <AppBar    sx={{
   background:
  "linear-gradient(90deg, #051821 0%, #051821 30%, #0b2a3a 45%, #01567c 65%, #148D8D 100%)",

    boxShadow: "0 3px 10px rgba(0,0,0,0.35)",
  }}> 
        <Toolbar>

          
            <img style={islogo} src={logo} alt="logo" />
          {isMatch ? (
            <>
              <DrawerNav />
            </>
          ) : (
            <>
              <Tabs
                sx={{ marginLeft: "auto" }}
                indicatorColor="Secondary"
                textColor="inherit"
                value={value}
                onChange={(e, value) => setValue(value)}
              >
                  {usuario &&  <Button onClick={inicio} sx={{ marginLeft: "10px" }} variant="Outlined">
                  <Tab label="inicio" />
              </Button>  }
            
                {cargado ? <div> <Button onClick={inicio} sx={{ marginLeft: "10px" }} variant="Outlined">
                  {user != undefined ? <> <Tab label= {`hola ${user.nombre}!`}/></>: <><Tab /></>}
                  
              </Button> </div>:<div></div>}
              
              </Tabs>
              {usuario ?  <div> <Button onClick={hanleLogout} sx={{ marginLeft: "10px" }} variant="Outlined">
                Cerrar Sesión
              </Button> </div>:<div></div>}


              {!usuario && <div>    <Button sx={{ marginLeft: "10px" }} variant="Outlined">
                Registrarse
              </Button>
              <Button onClick={handleClick} sx={{ marginLeft: "auto" }} variant="Outlined">
                Ingresar
              </Button></div>}
             

            </>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
