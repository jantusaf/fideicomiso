

import ValorMetro  from "../../../components/nivel3/declaraciones/Valormetro";
import BarraLAteral from '../../../components/nivel3/Menuizq3'
import AgregarIcc from '../../../components/nivel3/ModalIcc'
import BorrarIcc from '../../../components/nivel3/borrarhistorialicc/BorrarHistorialICC'
import CssBaseline from '@mui/material/CssBaseline';
import Button from '@mui/material/Button';
import Tabla from "../../../components/nivel3/declaraciones/ModalAsignacion"; 
import Historial from "../../../components/nivel3/declaraciones/HistorialValorMetro";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Paper, Box, Typography, Divider } from '@mui/material';
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard } from "../../../components/nivel2/detalleclienteIngresos/estilos";





export default function Legajos() {
  const navigate = useNavigate();
  const [logueado, setLogueado] = useState(false) 


useEffect(() => {
  const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
  
  if (loggedUserJSON) {
    const user = JSON.parse(loggedUserJSON)
    if (user.nivel != 3){
      window.localStorage.removeItem('loggedNoteAppUser')
   navigate('/login')

    }else{

      setLogueado(true)
    }
  
    //servicioUsuario.setToken(user.token)  
   
    
  }
 
}, [])
    return (

      <div>
  { logueado ? <div>
            <CssBaseline />
       <BarraLAteral>
       <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
        {/* ENCABEZADO */}
        <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 46, height: 46, borderRadius: "50%", display: "flex",
                alignItems: "center", justifyContent: "center",
                bgcolor: "rgba(13,58,73,0.08)", flexShrink: 0,
              }}
            >
              <PlagiarismIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                Valor metro cuadrado
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Cargá el valor vigente y consultá el historial
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* FORMULARIO */}
        <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
          <ValorMetro/>
        </Paper>

        {/* HISTORIAL */}
        <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
          <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 15, color: COLOR_TEXT }}>Historial</Typography>
          </Box>
          <Divider sx={{ borderColor: COLOR_BORDER }} />
          <Historial/>
        </Paper>
       </Box>
      </BarraLAteral>
         </div>   :<div></div> } </div>

    );

}