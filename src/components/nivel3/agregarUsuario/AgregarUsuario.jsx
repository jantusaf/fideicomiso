import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useState } from "react";
import servicioNivel3 from '../../../services/nivel3'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
  sxBtnPrimary,
} from "../../nivel2/detalleclienteIngresos/estilos";

export default function Ingresos() {
    const [usuario, setUsuario] = useState({});

    const handleChange = (e) => {
        console.log(usuario)
        setUsuario({ ...usuario, [e.target.name]: e.target.value })
    }

    const handleDeterminar = async (event) => {
        event.preventDefault()
        const rta = await servicioNivel3.registronivel3(usuario)
    };

    const sxLabel = { fontWeight: 600, fontSize: 13, color: COLOR_TEXT, mb: 0.6 };
    const sxInput = { "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };

    return (
        <Box sx={{ maxWidth: 720, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
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
                        <GroupAddIcon sx={{ color: COLOR_ACCENT }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                            Agregar usuario
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                            Creá un nuevo acceso al sistema
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* FORMULARIO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <form onSubmit={handleDeterminar}>
                    <Box sx={{ display: "grid", gap: 2.25 }}>
                        <Box>
                            <Typography sx={sxLabel}>CUIL/CUIT</Typography>
                            <TextField
                                name="cuil_cuit"
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={sxInput}
                            />
                        </Box>

                        <Box>
                            <Typography sx={sxLabel}>Contraseña</Typography>
                            <TextField
                                type="password"
                                name="password"
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={sxInput}
                            />
                        </Box>

                        <Box>
                            <Typography sx={sxLabel}>Nivel</Typography>
                            <FormControl fullWidth size="small">
                                <Select
                                    displayEmpty
                                    name="nivel"
                                    onChange={handleChange}
                                    defaultValue=""
                                    sx={{ borderRadius: 1.5 }}
                                >
                                    <MenuItem value=""><em>Seleccionar</em></MenuItem>
                                    <MenuItem value={'1'}>1 - Cliente</MenuItem>
                                    <MenuItem value={'2'}>2 - Administración</MenuItem>
                                    <MenuItem value={'3'}>3 - Gerencia</MenuItem>
                                    <MenuItem value={'4'}>Legales</MenuItem>
                                    <MenuItem value={'5'}>Mapas</MenuItem>
                                    <MenuItem value={'6'}>Estadísticas</MenuItem>
                                    <MenuItem value={'7'}>Movimientos2</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box>
                            <Typography sx={sxLabel}>Nombre</Typography>
                            <TextField
                                name="nombre"
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={sxInput}
                            />
                        </Box>

                        <Box>
                            <Typography sx={sxLabel}>Mail</Typography>
                            <TextField
                                name="mail"
                                onChange={handleChange}
                                fullWidth
                                size="small"
                                variant="outlined"
                                sx={sxInput}
                            />
                        </Box>
                    </Box>

                    <Divider sx={{ my: 3, borderColor: COLOR_BORDER }} />

                    <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                        <Button type="submit" variant="contained" sx={sxBtnPrimary}>
                            Enviar
                        </Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
}
