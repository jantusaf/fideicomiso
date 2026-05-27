import * as React from 'react';
import { useNavigate } from "react-router-dom";
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import NfcIcon from '@mui/icons-material/Nfc';
import { useState, useEffect } from "react";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import servicioPagos from '../../services/pagos';
import Navbar from '../Navbar';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PaidIcon from '@mui/icons-material/Paid';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import TravelExploreIcon from '@mui/icons-material/TravelExplore';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import { useLocation } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';


const initialWidth = 240; // Ancho inicial del menú
export default function MenuIzq2({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notificaciones, setNotificaciones] = useState();
  const [notificacioneslegajos, setNotificacioneslegajos] = useState();
  const [notificacionescbus, setNotificacionescbus] = useState();
  const [user, setUser] = useState();
  const [drawerWidth, setDrawerWidth] = useState(initialWidth);
  const [resizing, setResizing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(true);
  ///////////////
  ///Funciones para ajustar el ancho 
  const handleMouseDown = () => {
    setResizing(true);
  };

  const handleMouseMove = (e) => {
    if (resizing) {
      const newWidth = Math.max(200, Math.min(e.clientX, 500)); // Limita entre 200 y 500px
      setDrawerWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setResizing(false);
  };
  useEffect(() => {
    if (resizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizing]);
  ///////////
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    const useer = JSON.parse(loggedUserJSON)
    setUser(useer)

    cantidadnoti()
  }, [])
  const cantidadnoti = async () => {

    const notis = await servicioPagos.cantidadpendientes()

    setNotificaciones(notis[0])
    setNotificacioneslegajos(notis[1])
    setNotificacionescbus(notis[2])

  }

  const handleClick = (path) => {

    navigate(path);
  };


  const hanleLogout = () => {
    /* console.log('click')
     setUser(null)
     servicioUsuario.setToken(user.token) */
    window.localStorage.removeItem('loggedNoteAppUser')
    window.location.reload(true);
  }
  const menuItems = [
    {
      text: 'Clientes Parque',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/clientes'
    },
    {
      text: 'Clientes IC3',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/clientesic3'
    },
    {
      text: 'Lotes',
      icon: <NfcIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/lotes',
    },

    {
      text: 'Extracto',
      icon: <DescriptionIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/extracto'
    },
    {
      text: 'Reporte de Pagos',
      icon: <AssessmentIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/pagos'
    },

    {
      text: 'Pagos inusuales',
      icon: <WarningAmberIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/inusuales'
    },
     {
      text: 'Deudores',
      icon: <WarningAmberIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/deudores'
    },
   /*  {
      text: 'Aprobación de CBU',
      icon: <div><Badge badgeContent={notificacionescbus} color="error">
        <AccountBalanceIcon style={{ color: "#1a303e" }} />
      </Badge></div>,
      path: '/usuario2/aprobacioncbu'
    }, 

    {
      text: 'Aprobaciones de pagos',
      icon: <FactCheckIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/aprobacionesdepagos'
    },*/
    {
      text: 'Mapas',
      icon: <div><Badge color="error">
        <TravelExploreIcon style={{ color: "#1a303e" }} />
      </Badge></div>,
      path: '/usuario2/mapas'
    },
    {
      text: 'Mapas 2',
      icon: <div><Badge color="error">
        <TravelExploreIcon style={{ color: "#1a303e" }} />
      </Badge></div>,
      path: '/mapasegundaparte'
    },
  ];

  const menuItems2 = [
    /*  { 
       text: 'Ver Clientes', 
       icon: <GroupIcon color="primary" />, 
       path: '/nivel3/clientes' 
     }, */
    {
      text: 'Clientes',
      icon: <NfcIcon color="primary" />,
      path: '/nivel3/clientes',
    },
    {
      text: 'Lotes',
      icon: <NfcIcon color="primary" />,
      path: '/nivel3/lotes',
    },
    {
      text: 'Aprobación de Pagos',
      icon: <PriceCheckIcon color="primary" />,
      path: '/nivel3/aprobacionesdepagos'
    },
    {
      text: 'Pagos Inusuales',
      icon: <AccountBalanceIcon color="primary" />,
      path: '/nivel3/pagosinusuales'
    },

    {
      text: 'Agregar ICC',
      icon: <QueryStatsIcon color="primary" />,
      path: '/nivel3/icc'
    },
    {
      text: 'Valor Metro Cuadrado ',
      icon: <PlagiarismIcon color="primary" />,
      path: '/nivel3/declaraciones'
    },
    {
      text: 'Agregar usuario',
      icon: <GroupAddIcon color="primary" />,
      path: '/nivel3/agregarusuario'
    },
    {
      text: 'Pagos Inusuales Mensuales',
      icon: <MoneyOffIcon color="primary" />,
      path: '/nivel3/pagosmensualesinusuales'
    },
    {
      text: 'Todos los pagos',
      icon: <MoneyOffIcon color="primary" />,
      path: '/nivel3/pagos'
    },
    {
      text: 'Agenda de novedades',
      icon: <div><Badge color="error">
        <AccountBalanceIcon color="primary" />
      </Badge></div>,
      path: '/nivel3/novedades'
    },


  ];


  /*const toggleMenu = () => {
      setMenuVisible(!menuVisible);
  };
  return(
    <>
    <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        {menuVisible && (
            <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
            variant="permanent"
            anchor="left"
            >
                <Navbar />
                <Toolbar />
              
                <List>
                <Button variant="contained" onClick={toggleMenu} sx={{ mb: 2, backgroundColor: '#114c5f', '&:hover': { backgroundColor: '#0d3a49' } }}>
                {menuVisible ? 'Ocultar Menú' : 'Mostrar Menú'}
            </Button>
        {user ? <>
        {user.nivel === 2 ? <> 
          {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              handleClick(item.path)
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        </>: <>
        {menuItems2.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            onClick={() => {
              handleClick(item.path)
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
        
        </>}
        </> :  <></>}
      </List>
                
            </Drawer>
        )}

        <Box
            component="main"
            sx={{
                flexGrow: 1,
                bgcolor: 'background.default',
                p: 3,
               // marginLeft: menuVisible ? `${drawerWidth}px` : '0',
                transition: 'margin 0.3s ease-in-out',
            }}
        >
            <Navbar />
            <Toolbar />
         
            {children}
        </Box>
    </Box>
</>
);*/
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <Box sx={{ background: '#fffff', display: 'flex' }}>
        <CssBaseline />

        {/* Drawer lateral */}
        {menuVisible && (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,

                bgcolor: '#fffff',
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Navbar />
            <Toolbar />
            <Divider />
            <List
              sx={{
               
                background: "transparent",
              }}
            >

              {/* Botón solo dentro del Drawer cuando el menú está visible */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton
                  onClick={toggleMenu}
                  sx={{
                    color: '#1a303e',
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#0d3a49',
                    },
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>


              {user ? (
                user.nivel === 2 ? (
                  menuItems.map((item) => (
                    <ListItem
                      button
                      key={item.text}
                      onClick={() => handleClick(item.path)}
                      sx={{
                        my: 0.4,
                        px: 1.25,
                        py: 1.05,
          
                        transition: "all .18s ease",
                        border: "1px solid transparent",

                        // 👉 ITEM ACTIVO
                        backgroundColor:
                          location.pathname === item.path
                            ? "rgba(42, 170, 209, 0.18)"
                            : "transparent",

                        borderColor:
                          location.pathname === item.path
                            ? "rgba(7, 153, 182, 0.85)"
                            : "transparent",

                        boxShadow:
                          location.pathname === item.path
                            ? "0 12px 26px rgba(7, 115, 182, 0.15)"
                            : "none",

                        "&:hover": {
                          backgroundColor:
                            location.pathname === item.path
                              ? "rgba(27, 153, 206, 0.22)"
                              : "rgba(34, 157, 222, 0.04)",
                          borderColor: "rgba(11, 84, 136, 0.3)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 42,
                          "& svg": {
                            fontSize: 22,
                            color:
                              location.pathname === item.path
                                ? "#0d3a49"
                                : "#1a303e",
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>


                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                            fontWeight: location.pathname === item.path ? 800 : 700,
                            fontSize: 14.2,
                            color:
                              location.pathname === item.path
                                ? "#0d3a49"
                                : "#0f2230",
                            letterSpacing: 0.15,
                          },
                        }}
                      />

                    </ListItem>

                  ))
                ) : (
                  menuItems2.map((item) => (
                    <ListItem
                      button
                      key={item.text}
                      onClick={() => handleClick(item.path)}
                      sx={{
                        my: 0.4,
                        px: 1.25,
                        py: 1.05,
                        borderRadius: 2.2,
                        transition: "all .18s ease",
                        border: "1px solid transparent",

                        // 👉 ITEM ACTIVO
                        backgroundColor:
                          location.pathname === item.path
                            ? "rgba(20,141,141,0.18)"
                            : "transparent",

                        borderColor:
                          location.pathname === item.path
                            ? "rgba(20,141,141,0.45)"
                            : "transparent",

                        boxShadow:
                          location.pathname === item.path
                            ? "0 12px 26px rgba(20,141,141,0.35)"
                            : "none",

                        "&:hover": {
                          backgroundColor:
                            location.pathname === item.path
                              ? "rgba(20,141,141,0.22)"
                              : "rgba(20,141,141,0.10)",
                          borderColor: "rgba(20,141,141,0.30)",
                          transform: "translateY(-1px)",
                        },
                      }}
                    >

                      <ListItemIcon
                        sx={{
                          minWidth: 42,
                          "& svg": {
                            fontSize: 22,
                            color:
                              location.pathname === item.path
                                ? "#0d3a49"
                                : "#1a303e",
                          },
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>


                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          sx: {
                            fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
                            fontWeight: location.pathname === item.path ? 800 : 700,
                            fontSize: 14.2,
                            color:
                              location.pathname === item.path
                                ? "#0d3a49"
                                : "#0f2230",
                            letterSpacing: 0.15,
                          },
                        }}
                      />

                    </ListItem>

                  ))
                )
              ) : null}
            </List>
           
          </Drawer>
        )}

        {/* Contenido principal */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            transition: 'margin 0.3s ease-in-out',
          }}
        >
          <Navbar />
          <Toolbar />
    



          {/* Mostrar botón SOLO cuando el menú está oculto */}
          {!menuVisible && (
            <Button
              variant="contained"
              onClick={toggleMenu}
              sx={{
                mb: 2,
                backgroundColor: '#1a303e',
                '&:hover': { backgroundColor: '#0d3a49' },
              }}
            >
              Mostrar Menú
            </Button>
          )}

          {children}
        </Box>
      </Box>
    </>
  );


}