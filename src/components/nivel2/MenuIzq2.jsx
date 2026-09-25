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
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import AssessmentIcon from '@mui/icons-material/Assessment';


const initialWidth = 224; // Ancho del menú (igual que el de nivel 6)
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
      text: 'Clientes PIT',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/clientes'
    },
    {
      text: 'Clientes IC3',
      icon: <GroupIcon style={{ color: "#1a303e" }} />,
      path: '/usuario2/clientesic3'
    },
    // {
    //   text: 'Lotes',
    //   icon: <NfcIcon style={{ color: "#1a303e" }} />,
    //   path: '/usuario2/lotes',
    // },

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
      text: 'Mapas IC3 - PIT',
      icon: <div><Badge color="error">
        <TravelExploreIcon style={{ color: "#1a303e" }} />
      </Badge></div>,
      path: '/usuario2/mapas'
    },
    {
      text: 'Mapa SC',
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
  // ===== Presentación del menú (compacto, sin degradés; mismo criterio que el resto de la vista) =====
  const COLOR_TEXT = "#1a303e";
  const COLOR_BORDER = "#e2e6e9";

  const renderItem = (item) => {
    const activo = location.pathname === item.path;
    return (
      <ListItemButton
        key={item.text}
        onClick={() => handleClick(item.path)}
        selected={activo}
        disableRipple
        sx={{
          position: "relative",
          mx: 1.25,
          my: 0.25,
          px: 1.25,
          py: 0.75,
          minHeight: 42,
          gap: 1.25,
          borderRadius: 1.5,
          color: COLOR_TEXT,
          "&:hover": { backgroundColor: "#f6f8f9" },
          "&.Mui-selected": {
            backgroundColor: "rgba(13, 58, 73, 0.07)",
            "&:hover": { backgroundColor: "rgba(13, 58, 73, 0.10)" },
          },
          // barra de acento del ítem activo, pegada al borde del menú
          "&.Mui-selected::before": {
            content: '""',
            position: "absolute",
            left: -10,
            top: 8,
            bottom: 8,
            width: 3,
            borderRadius: "0 3px 3px 0",
            backgroundColor: COLOR_TEXT,
          },
          "&:hover .flecha-menu": { opacity: 1 },
        }}
      >
        <Box
          sx={{
            width: 30,
            height: 30,
            flexShrink: 0,
            borderRadius: 1.25,
            display: "grid",
            placeItems: "center",
            backgroundColor: activo ? COLOR_TEXT : "rgba(13, 58, 73, 0.06)",
            color: activo ? "#fff" : COLOR_TEXT,
            "& svg": { fontSize: 18, color: "inherit !important" },
          }}
        >
          {item.icon}
        </Box>

        <Typography
          noWrap
          sx={{ flex: 1, minWidth: 0, fontSize: 14, fontWeight: activo ? 700 : 500, color: COLOR_TEXT }}
        >
          {item.text}
        </Typography>

        <ChevronRightRoundedIcon
          className="flecha-menu"
          sx={{ fontSize: 18, color: "#9aa7b0", opacity: activo ? 1 : 0, transition: "opacity .15s ease" }}
        />
      </ListItemButton>
    );
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />

        {/* Menú lateral */}
        {menuVisible && (
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
                backgroundColor: "#ffffff",
                borderRight: `1px solid ${COLOR_BORDER}`,
                boxShadow: "none",
              },
            }}
            variant="permanent"
            anchor="left"
          >
            <Navbar />
            <Toolbar />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pl: 2.5,
                pr: 1.25,
                pt: 1.5,
                pb: 0.5,
              }}
            >
              <Typography
                sx={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.8, color: "#6b7a86", textTransform: "uppercase" }}
              >
                Menú
              </Typography>
              <IconButton
                size="small"
                onClick={toggleMenu}
                title="Ocultar menú"
                sx={{ color: "#6b7a86", "&:hover": { color: COLOR_TEXT, backgroundColor: "#f6f8f9" } }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>

            <List sx={{ py: 0.5 }}>
              {user ? (user.nivel === 2 ? menuItems.map(renderItem) : menuItems2.map(renderItem)) : null}
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
              variant="outlined"
              onClick={toggleMenu}
              sx={{
                mb: 2,
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 1.5,
                px: 2.25,
                color: COLOR_TEXT,
                borderColor: '#c9d2d8',
                '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' },
              }}
            >
              Mostrar menú
            </Button>
          )}

          {children}
        </Box>
      </Box>
    </>
  );


}
