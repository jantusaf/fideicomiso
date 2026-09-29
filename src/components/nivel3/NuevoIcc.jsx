import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Modal from './ModalIcc';
import { useState } from "react";
import servicionivel3 from '../../services/nivel3'
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
} from "../nivel2/detalleclienteIngresos/estilos";

const MESES = [
  [1, "Enero"], [2, "Febrero"], [3, "Marzo"], [4, "Abril"], [5, "Mayo"], [6, "Junio"],
  [7, "Julio"], [8, "Agosto"], [9, "Septiembre"], [10, "Octubre"], [11, "Noviembre"], [12, "Diciembre"],
];
const ANIOS = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027];

const NievoIcc = () => {
    const [form, setForm] = useState({})

    const handleChange = (e) => {
        console.log(form)
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const sxSelect = {
        border: "1px solid #c9d2d8",
        borderRadius: 1.5,
        px: 1.5,
        height: 40,
        display: "flex",
        alignItems: "center",
        "&:hover": { borderColor: COLOR_ACCENT },
        "&:focus-within": { borderColor: COLOR_ACCENT, boxShadow: `0 0 0 1px ${COLOR_ACCENT}` },
    };
    const sxLabel = { fontWeight: 600, fontSize: 13, color: COLOR_TEXT, mb: 0.6 };

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
                        <QueryStatsIcon sx={{ color: COLOR_ACCENT }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                            Agregar ICC
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                            Ingresá el ICC. Ejemplo: 4.5 = 0.045%
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* FORMULARIO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2.5 }}>
                    <Box>
                        <Typography sx={sxLabel}>Mes</Typography>
                        <Box sx={sxSelect}>
                            <NativeSelect
                                defaultValue={1}
                                onChange={handleChange}
                                disableUnderline
                                fullWidth
                                inputProps={{ name: 'mes', id: 'mes-select' }}
                                sx={{ fontSize: 15, color: COLOR_TEXT }}
                            >
                                <option value={'1'}>Elegir</option>
                                {MESES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box>
                        <Typography sx={sxLabel}>Año</Typography>
                        <Box sx={sxSelect}>
                            <NativeSelect
                                defaultValue={30}
                                onChange={handleChange}
                                disableUnderline
                                fullWidth
                                inputProps={{ name: 'anio', id: 'anio-select' }}
                                sx={{ fontSize: 15, color: COLOR_TEXT }}
                            >
                                <option value={'Empresa'}>Elegir</option>
                                {ANIOS.map((a) => <option key={a} value={a}>{a}</option>)}
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box>
                        <Typography sx={sxLabel}>Zona</Typography>
                        <Box sx={sxSelect}>
                            <NativeSelect
                                defaultValue={30}
                                onChange={handleChange}
                                disableUnderline
                                fullWidth
                                inputProps={{ name: 'zona', id: 'zona-select' }}
                                sx={{ fontSize: 15, color: COLOR_TEXT }}
                            >
                                <option value={'Empresa'}>Elegir</option>
                                <option value={'PIT'}>PIT</option>
                                <option value={'IC3'}>IC3</option>
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box>
                        <Typography sx={sxLabel}>Valor</Typography>
                        <TextField
                            id="name"
                            name="ICC"
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            variant="outlined"
                            type="number"
                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        />
                    </Box>
                </Box>

                <Divider sx={{ my: 3, borderColor: COLOR_BORDER }} />

                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Modal datos={form} />
                </Box>
            </Paper>
        </Box>
    )
}
export default NievoIcc
