import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../Assets/marcas.png";
import useUser from "../../hooks/useUser";
import {
  AppBar,
  Button,
  Box,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import DrawerNav from "../DrawerNav";

const Navbar = () => {
  const usuario = useUser().userContext;

  const [user, setUser] = useState(null);
  const theme = useTheme();
  const isMatch = useMediaQuery(theme.breakpoints.down("md"));

  const navigate = useNavigate();

  const islogo = {
    height: "38px",
    width: "auto",
    marginRight: "16px",
  };

  const handleClick = () => {
    navigate("/login");
  };

  const irAyuda = () => {
    navigate("/usuario/menu");
  };

  const hanleLogout = () => {
    window.localStorage.removeItem("loggedNoteAppUser");
    navigate("/login");
  };

  const inicio = () => {
    navigate("../Paginas/Nivel3/Principal");
  };

  // Barra superior: color sólido (sin degradé) y altura fija de 64px, mismo
  // criterio que la barra de Nivel 2.
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
          boxShadow: "inset 0 -1px 0 rgba(255,255,255,0.08)",
        }}
      >
        <Toolbar sx={{ minHeight: "64px !important", px: { xs: 2, md: 3 } }}>
          <Box component="img" src={logo} alt="Santa Catalina Fideicomiso" sx={islogo} onClick={inicio} style={{ cursor: "pointer" }} />

          {isMatch ? (
            <Box sx={{ ml: "auto" }}>
              <DrawerNav />
            </Box>
          ) : (
            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 0.75 }}>
              {usuario && (
                <Button onClick={inicio} sx={sxBotonBarra}>
                  Inicio
                </Button>
              )}

              <Button onClick={irAyuda} sx={sxBotonBarra}>
                Ayuda
              </Button>

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
