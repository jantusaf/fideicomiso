import * as React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";

import NfcIcon from "@mui/icons-material/Nfc";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import PaidIcon from "@mui/icons-material/Paid";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";

import { useState, useEffect } from "react";
import useInusual from "../../hooks/useInusual";
import servicioPagos from "../../services/pagos";
import Navbar from "./Navbar3";
import { COLOR_TEXT, COLOR_BORDER, sxBtnOutlined } from "../nivel2/detalleclienteIngresos/estilos";

const drawerWidth = 224; // mismo ancho que el menú de nivel 2

export default function MenuIzq3({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [notificaciones, setNotificaciones] = useState(0);
  const [menuVisible, setMenuVisible] = useState(true);

  const { cantidadInusual } = useInusual();

  const handleClick = (path) => {
    navigate(path);
  };

  useEffect(() => {
    cantidadnoti();
  }, []);

  const cantidadnoti = async () => {
    const notis = await servicioPagos.cantidadpendientesadmin();
    setNotificaciones(notis[0]);
  };

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const menuItems = [
    { text: "Lotes", icon: <NfcIcon />, path: "/nivel3/lotes" },
    { text: "Aprobación de Pagos", icon: <PriceCheckIcon />, path: "/nivel3/aprobacionesdepagos" },
    {
      text: "Pagos Inusuales",
      icon: (
        <Badge
          color="error"
          badgeContent={notificaciones > 0 ? notificaciones : null}
          sx={{ "& .MuiBadge-badge": { fontWeight: 700 } }}
        >
          <PaidIcon />
        </Badge>
      ),
      path: "/nivel3/pagosinusuales",
    },
    { text: "Agregar ICC", icon: <QueryStatsIcon />, path: "/nivel3/icc" },
    { text: "Valor Metro Cuadrado", icon: <PlagiarismIcon />, path: "/nivel3/declaraciones" },
    { text: "Extracto", icon: <GroupAddIcon />, path: "/nivel3/extracto" },
    { text: "Agregar usuario", icon: <GroupAddIcon />, path: "/nivel3/agregarusuario" },
    { text: "Pagos Inusuales Mensuales", icon: <MoneyOffIcon />, path: "/nivel3/pagosmensualesinusuales" },
    { text: "Todos los pagos", icon: <MoneyOffIcon />, path: "/nivel3/pagos" },
    { text: "Agenda de novedades", icon: <AccountBalanceIcon />, path: "/nivel3/novedades" },
  ];

  // ===== Presentación del menú (compacto, sin degradés; mismo criterio que nivel 2) =====
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

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

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
          <Toolbar sx={{ minHeight: "64px !important" }} />

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

          <List sx={{ py: 0.5 }}>{menuItems.map(renderItem)}</List>
        </Drawer>
      )}

      {/* Contenido principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          transition: "margin 0.3s ease-in-out",
        }}
      >
        <Navbar />
        <Toolbar sx={{ minHeight: "64px !important" }} />

        {!menuVisible && (
          <Button variant="outlined" onClick={toggleMenu} sx={{ ...sxBtnOutlined, mb: 2 }}>
            Mostrar menú
          </Button>
        )}

        {children}
      </Box>
    </Box>
  );
}
