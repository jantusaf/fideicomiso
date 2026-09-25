import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../Assets/marcas.png";
import  useUser from '../hooks/useUser'
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerNav from "./DrawerNav";
import serviciousuarios from "../services/usuarios"
import { useAuth } from "../auth/AuthContext"

const Navbar = (props) => {
  const usuario  = useUser().userContext
  const { logout } = useAuth()

  
  const [user, setUser] = useState(null)
  const [cargado, setCargado] = useState(false)

  const [value, setValue] = useState();
  const theme = useTheme();

  const isMatch = useMediaQuery(theme.breakpoints.down("md"));
 const islogo = {
  height: "38px",
  width: "auto",
  marginRight: "16px",
};

  const navigate = useNavigate();


  useEffect(() => {
    traer()
}, [])
const traer = async () => {

  const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')

  if (!loggedUserJSON) {
    setCargado(true)
    return
  }

  let sesion = null
  try {
    sesion = JSON.parse(loggedUserJSON)
  } catch {
    setCargado(true)
    return
  }

  if (!sesion || !sesion.cuil_cuit) {
    setCargado(true)
    return
  }

  const notis = await serviciousuarios.traerusuario(sesion.cuil_cuit)

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
     logout() // limpia sesión (localStorage + estado) y redirige a /login
   }

  const inicio = () => {
    navigate("/usuario2/clientes")
    

  }
  // Barra superior: color sólido (sin degradé) y altura fija de 64px, que es lo que
  // reservan los <Toolbar /> espaciadores del resto del sistema (antes la barra medía
  // ~80px y tapaba el borde superior del contenido).
  const sxBotonBarra = {
    color: "rgba(255,255,255,0.78)",
    textTransform: "none",
    fontWeight: 600,
    fontSize: 14,
    borderRadius: 1.5,
    px: 1.75,
    "&:hover": { color: "#fff", backgroundColor: "rgba(255,255,255,0.08)" },
  };

  const sxBotonBarraContorno = {
    ...sxBotonBarra,
    color: "#fff",
    border: "1px solid rgba(255,255,255,0.3)",
    "&:hover": { borderColor: "#fff", backgroundColor: "rgba(255,255,255,0.08)" },
  };

  return (
    <React.Fragment>
      <AppBar
        elevation={0}
        sx={{
          backgroundColor: "#0f2230",
          backgroundImage: "none",
          // línea inferior como sombra interna: no suma alto (la barra mide exactamente 64px)
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, md: 3 } }}>
          <img style={islogo} src={logo} alt="Santa Catalina Fideicomiso" />
          {isMatch ? (
            <>
              <DrawerNav />
            </>
          ) : (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.75 }}>
              {usuario && (
                <Button onClick={inicio} sx={sxBotonBarra}>
                  Inicio
                </Button>
              )}

              {cargado && user != undefined && (
                <Button onClick={inicio} sx={sxBotonBarra}>
                  {`Hola ${user.nombre}!`}
                </Button>
              )}

              {usuario && (
                <Button onClick={hanleLogout} variant="outlined" sx={sxBotonBarraContorno}>
                  Cerrar sesión
                </Button>
              )}

              {!usuario && (
                <>
                  <Button sx={sxBotonBarra}>Registrarse</Button>
                  <Button onClick={handleClick} variant="outlined" sx={sxBotonBarraContorno}>
                    Ingresar
                  </Button>
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default Navbar;
