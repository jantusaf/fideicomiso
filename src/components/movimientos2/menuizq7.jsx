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
useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    console.log(loggedUserJSON)
    const useer = JSON.parse(loggedUserJSON)
    setUser(useer)

    
  }, [])
  

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
/*     {
      text: 'Carga de Movimientos',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/mov2/carga'
    }, */
    {
      text: 'Resumen1',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/mov2/resumen1'
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
   
  ];

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
                  menuItems.map((item) => (
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