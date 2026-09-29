import { useState, useEffect } from "react";

import { createTheme } from '@mui/material/styles';
import servicioPagos from '../../../services/pagos';
import { useNavigate } from "react-router-dom";
import BotonRechazo from './RechazoPagoInusual';
import ModalDetallePago from './Modaldetalle';

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import Modalveronline from './modalveronline'
import Modalveronline2 from './modalveronline2'
import {
    COLOR_TEXT,
    COLOR_ACCENT,
    COLOR_MUTED,
    COLOR_BORDER,
    COLOR_OK,
    COLOR_ERROR,
    sxCard,
    sxBtnOutlined,
} from "../../nivel2/detalleclienteIngresos/estilos";

const COLOR_WARN = "#ed6c02";

const PagosInusuales = () => {
    const [pagos, setPagos] = useState([]);
    const [vista, setVista] = useState(true);

    const [openModal, setOpenModal] = useState(false);
    const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
    const navigate = useNavigate();
    const handleOpenModal = (row) => {
        setDetalleSeleccionado(row);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setDetalleSeleccionado(null);
    };
    useEffect(() => {
        getPagosi();
    }, []);

    const getPagosi = async () => {
        const pagos = await servicioPagos.pagosinusuales();
        setPagos(pagos);
    };

    const StyledTable = () =>
        createTheme({
            overrides: {
                MUIDataTableBodyRow: {
                    root: {
                        backgroundColor: "#f5f5f5",
                    }
                }
            }
        });

    const columns = [
        { name: "cuil_cuit", label: "Cuil/cuit" },
        {
            name: "Nombre",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <p onClick={() => navigate('/usuario2/detallecliente/' + pagos[dataIndex].cuil_cuit)}
                        style={{ marginRight: "10px", cursor: "pointer" }}>
                        {pagos[dataIndex].Nombre}
                    </p>
                )
            }
        },
        { name: "monto", label: "Monto" },
        { name: "ingresos", label: "Ingresos declarados" },
        { name: "riesgo", label: "riesgo" },
        {
            name: "ver pago online",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => verFile(dataIndex, rowIndex)
            }
        },
        {
            name: "ver justificacion online",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => verFile2(dataIndex, rowIndex)
            }
        },
        {
            name: "Actions",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <>
                        <BotonRechazo id={pagos[dataIndex].id} getPagosi={getPagosi} />
                    </>
                )
            }
        },
        {
            name: "Descarga",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <Button onClick={() => navigate('/nivel3/cuota/' + pagos[dataIndex].id_cuota)}>Ver pagos de cuota</Button>
                )
            }
        },
    ];
    function verFile(index, rowIndex, data) {
        return (
            <>
                <Modalveronline id={pagos[0][index].id} />
            </>
        );
    }
    function verFile2(index, rowIndex, data) {
        return (
            <>
                <Modalveronline2 id={pagos[0][index].id} />
            </>
        );
    }

    const sxTh = {
        backgroundColor: "#f6f8f9",
        color: COLOR_TEXT,
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: 0.4,
        borderBottom: `1px solid ${COLOR_BORDER}`,
        whiteSpace: "nowrap",
        py: 1.25,
    };
    const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };

    const colorRiesgo = (v) => (Number(v) > 70 ? COLOR_ERROR : Number(v) > 40 ? COLOR_WARN : COLOR_OK);

    const textoEstado = (proceso) => {
        if (proceso === "averificarnivel2") return "Pendiente carga de documentación";
        if (proceso === "averificarnivel3") return "Pendiente clasificación de Gerencia";
        if (proceso === "Inusual") return "Cerrado (Sin alerta)";
        if (proceso === "Sospechoso") return "Cerrado (Con Alerta)";
        return "";
    };

    return (
        <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
            {/* ENCABEZADO */}
            <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: "rgba(13,58,73,0.08)",
                                flexShrink: 0,
                            }}
                        >
                            <ReportProblemRoundedIcon sx={{ color: COLOR_ACCENT }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                                Pagos inusuales
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                Revisá, clasificá y gestioná los pagos inusuales
                            </Typography>
                        </Box>
                    </Box>

                    <Button variant="outlined" onClick={() => setVista(!vista)} sx={sxBtnOutlined}>
                        Cambiar vista
                    </Button>
                </Box>
            </Paper>

            {/* LISTADO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                {pagos.length === 0 ? (
                    <Typography sx={{ textAlign: "center", color: COLOR_MUTED, py: 5, fontWeight: 600 }}>
                        No hay elementos
                    </Typography>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {["ID", "NOMBRE Y APELLIDO / RAZÓN SOCIAL", "CUIL/CUIT", "TIPOLOGÍA", "F. NOTIFICACIÓN", "F. VENCIMIENTO", "IMPORTE", "RIESGO", "ESTADO", "CONSTANCIA PAGO", "CONSTANCIA JUSTIFICACIÓN", "ACCIONES", "VER DETALLES"].map((h) => (
                                        <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {pagos.map((row, index) => (
                                    <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                        <TableCell sx={sxTd}>{row.id}</TableCell>
                                        <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{row.Nombre}</TableCell>
                                        <TableCell
                                            sx={{ ...sxTd, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                                            onClick={() => navigate('/usuario2/detallecliente/' + row.cuil_cuitc)}
                                        >
                                            {row.cuil_cuitc}
                                        </TableCell>
                                        <TableCell sx={sxTd}>{row.tipologia}</TableCell>
                                        <TableCell sx={sxTd}>{row.fechanotificacion}</TableCell>
                                        <TableCell sx={sxTd}>{row.fechavencimiento}</TableCell>
                                        <TableCell sx={{ ...sxTd, fontWeight: 600, whiteSpace: "nowrap" }}>
                                            {isNaN(Number(row.monto)) ? `$${row.monto}` : `$${Number(row.monto).toFixed(2)}`}
                                        </TableCell>
                                        <TableCell sx={sxTd}>
                                            <Chip
                                                label={`${row.riesgo}%`}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontWeight: 600, color: colorRiesgo(row.riesgo), borderColor: colorRiesgo(row.riesgo) }}
                                            />
                                        </TableCell>
                                        <TableCell sx={sxTd}>{textoEstado(row.proceso)}</TableCell>
                                        <TableCell sx={sxTd}><Modalveronline id={row.id} /></TableCell>
                                        <TableCell sx={sxTd}><Modalveronline2 id={row.id} /></TableCell>
                                        <TableCell sx={sxTd}>
                                            <BotonRechazo id={row.id} getPagosi={getPagosi} />
                                        </TableCell>
                                        <TableCell sx={sxTd}>
                                            <Button variant="outlined" size="small" onClick={() => handleOpenModal(row)} sx={{ ...sxBtnOutlined, px: 1.75 }}>
                                                Ver detalles
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>

            <ModalDetallePago open={openModal} handleClose={handleCloseModal} data={detalleSeleccionado} />
        </Box>
    );
};

export default PagosInusuales;
