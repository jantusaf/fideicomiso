import { useParams } from "react-router-dom"
import servicioPagosInusuales from '../../services/pagosInusuales'
import React, { useState, Fragment } from "react";
import NativeSelect from '@mui/material/NativeSelect';
import Button from '@mui/material/Button';

import { useNavigate } from "react-router-dom";
import VerConstancias from "../nivel2/nivel2Aprobaciondepagos/VerConstancias";
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell from '@mui/material/TableCell';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { Typography } from '@mui/material';
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
  sxBtnPrimary,
  sxBtnOutlined,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
} from "../nivel2/detalleclienteIngresos/estilos";

const MensualInusuales = (props) => {
    let params = useParams()
    const [FormFecha, setFormFecha] = useState({
        mes: 1,
        anio: 2015
    })
    const navigate = useNavigate();

    const [pagos, setPagos] = useState([''])
    const [vista, setVista] = useState(true)

    const buscar = async (e) => {
        e.preventDefault()
        const pagos = await servicioPagosInusuales.buscar(FormFecha)
        console.log(pagos)
        setPagos(pagos)
    }

    const handleChange = (e) => {
        console.log(FormFecha)
        setFormFecha({ ...FormFecha, [e.target.name]: e.target.value })
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
    const sxTh = {
        backgroundColor: COLOR_BRAND_SOFT,
        color: COLOR_BRAND,
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: 0.4,
        borderBottom: `1px solid ${COLOR_BORDER}`,
        py: 1.25,
    };
    const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };

    return (
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
                        <MoneyOffIcon sx={{ color: COLOR_ACCENT }} />
                    </Box>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                            Pagos inusuales mensuales
                        </Typography>
                        <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                            Buscá pagos inusuales por mes y año
                        </Typography>
                    </Box>
                </Box>
            </Paper>

            {/* FILTRO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
                    <Box sx={{ width: 180 }}>
                        <Typography sx={sxLabel}>Mes</Typography>
                        <Box sx={sxSelect}>
                            <NativeSelect
                                defaultValue={'1'}
                                onChange={handleChange}
                                disableUnderline
                                fullWidth
                                inputProps={{ name: 'mes', id: 'mes-select' }}
                                sx={{ fontSize: 15, color: COLOR_TEXT }}
                            >
                                <option value={'1'}>Enero</option>
                                <option value={'2'}>Febrero</option>
                                <option value={'3'}>Marzo</option>
                                <option value={'4'}>Abril</option>
                                <option value={'5'}>Mayo</option>
                                <option value={'6'}>Junio</option>
                                <option value={'7'}>Julio</option>
                                <option value={'8'}>Agosto</option>
                                <option value={'9'}>Septiembre</option>
                                <option value={'10'}>Octubre</option>
                                <option value={'11'}>Noviembre</option>
                                <option value={'12'}>Diciembre</option>
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Box sx={{ width: 160 }}>
                        <Typography sx={sxLabel}>Año</Typography>
                        <Box sx={sxSelect}>
                            <NativeSelect
                                defaultValue={'2015'}
                                onChange={handleChange}
                                disableUnderline
                                fullWidth
                                inputProps={{ name: 'anio', id: 'anio-select' }}
                                sx={{ fontSize: 15, color: COLOR_TEXT }}
                            >
                                <option value={'2015'}>2015</option>
                                <option value={'2016'}>2016</option>
                                <option value={'2017'}>2017</option>
                                <option value={'2018'}>2018</option>
                                <option value={'2019'}>2019</option>
                                <option value={'2020'}>2020</option>
                                <option value={'2021'}>2021</option>
                                <option value={'2022'}>2022</option>
                                <option value={'2023'}>2023</option>
                                <option value={'2024'}>2024</option>
                                <option value={'2025'}>2025</option>
                            </NativeSelect>
                        </Box>
                    </Box>

                    <Button onClick={buscar} variant="contained" sx={{ ...sxBtnPrimary, height: 40 }}>
                        Buscar
                    </Button>

                    <Button variant="outlined" onClick={() => { setVista(!vista) }} sx={{ ...sxBtnOutlined, height: 40 }}>
                        Cambiar vista
                    </Button>
                </Box>
            </Paper>

            {/* RESULTADO */}
            {vista ? (
                <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 }, textAlign: "center" }}>
                    <Typography sx={{ color: COLOR_MUTED, fontWeight: 500 }}>
                        Tocá "Cambiar vista" para ver la tabla de resultados.
                    </Typography>
                </Paper>
            ) : (
                <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                    <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: 15, color: COLOR_TEXT }}>Cuotas</Typography>
                    </Box>
                    <Divider sx={{ borderColor: COLOR_BORDER }} />

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {["FECHA", "CUIL/CUIT", "INGRESOS", "MONTO", "ESTADO", "CLASIFICACIÓN"].map((h) => (
                                        <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {Array.isArray(pagos) && pagos.length > 0 && pagos[0] !== '' ? (
                                    pagos.map((row, index) => (
                                        <TableRow key={row.name || index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                            <TableCell sx={sxTd}>{row.mes}/{row.anio}</TableCell>
                                            <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{row.cuil_cuit}</TableCell>
                                            <TableCell sx={sxTd}>{row.ingresos}</TableCell>
                                            <TableCell sx={sxTd}>{row.monto}</TableCell>
                                            <TableCell sx={sxTd}>{row.estado == 'P' ? 'Pendiente' : 'Aprobado'}</TableCell>
                                            <TableCell sx={sxTd}>{row.proceso}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                            No se encontraron registros de pagos inusuales para el mes seleccionado.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}
        </Box>
    )
}
export default MensualInusuales
