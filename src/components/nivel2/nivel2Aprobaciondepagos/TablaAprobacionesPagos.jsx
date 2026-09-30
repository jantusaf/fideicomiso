import { useState, useEffect } from "react";

import servicioAprobacionesPagos from "../../../services/pagos";
import serviciousuario1 from "../../../services/usuario1";
import { useNavigate } from "react-router-dom";
import VerConstancias from "./VerConstancias";
import Inconscistencia from "./Inconscistencia";
import CargaDeTabla from "../../CargaDeTabla";
import BotonRechazo from "./RechazoPago";
import BotonAprobacion from "./AprobacionPago";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";
import * as React from "react";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
  COLOR_BRAND_WARM,
  COLOR_BRAND_WARM_SOFT,
  COLOR_BRAND_WARM_BORDER,
  COLOR_HEADER_BG,
} from "../../nivel2/detalleclienteIngresos/estilos";

const TablaAprobaciones = () => {
    //configuracion de Hooks
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const getPendientes = async () => {
        const pendientes = await servicioAprobacionesPagos.aprobaciones({});
        setPendientes(pendientes);
        setLoading(false);
    };

    const aprobar = async (id) => {
        await servicioAprobacionesPagos.aprobarpago(id);
        window.location.reload(true);
    };

    useEffect(() => {
        getPendientes();
    }, []);

    //// Descarga
    async function download(index, rowIndex, data) {
        const filename = pendientes[index].ubicacion;
        const link = await serviciousuario1.obtenerurl(filename);
        window.open(link.data);
    }

    async function veronline(index, rowIndex, data) {
        const filename = pendientes[index].ubicacion;
        const link = await serviciousuario1.obtenerurl(filename);

        var nueva_ventana = window.open("", "_blank");
        nueva_ventana.document.write(
            '<html><head><title>Imagen de AWS</title></head><body style="text-align:center; margin:0; padding:24px; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial;"><img style="max-width:100%; height:auto; border-radius:16px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" src="' +
            link.data +
            '" /></body></html>'
        );
    }

    const sxTh = {
        backgroundColor: COLOR_HEADER_BG,
        color: COLOR_TEXT,
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: 0.4,
        borderBottom: `1px solid ${COLOR_BORDER}`,
        whiteSpace: "nowrap",
        py: 1.25,
    };
    const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };

    return (
        <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
            {/* ENCABEZADO */}
            <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box
                            sx={{
                                width: 46, height: 46, borderRadius: "50%", display: "flex",
                                alignItems: "center", justifyContent: "center",
                                bgcolor: "rgba(13,58,73,0.08)", flexShrink: 0,
                            }}
                        >
                            <DescriptionRoundedIcon sx={{ color: COLOR_ACCENT }} />
                        </Box>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                                Lista de aprobaciones pendientes
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                Revisá pagos, inconsistencias y constancias antes de aprobar
                            </Typography>
                        </Box>
                    </Box>

                    <Chip variant="outlined" icon={<PendingActionsRoundedIcon />} label={`Pendientes: ${pendientes.length}`} sx={{ fontWeight: 600, color: COLOR_BRAND_WARM, borderColor: COLOR_BRAND_WARM }} />
                </Box>
            </Paper>

            {/* LISTADO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        <CargaDeTabla />
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    {["FECHA CUOTA", "FECHA PAGO", "CUIL/CUIT", "ESTADO", "MONTO INUSUAL", "INCONSISTENCIA", "MONTO", "VER ONLINE", "VER CONSTANCIAS", "ACCIONES"].map((h) => (
                                        <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {pendientes.map((p, index) => (
                                    <TableRow key={p.id ?? index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                        <TableCell sx={sxTd}>
                                            <Chip size="small" variant="outlined" label={`${p.mes} / ${p.anio}`} sx={{ fontWeight: 600 }} />
                                        </TableCell>

                                        <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{p.fecha}</TableCell>

                                        <TableCell
                                            sx={{ ...sxTd, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                                            onClick={() => navigate("/usuario2/detallecliente/" + p.cuil_cuit)}
                                        >
                                            {p.cuil_cuit}
                                        </TableCell>

                                        <TableCell sx={sxTd}>{p.descripcion}</TableCell>
                                        <TableCell sx={sxTd}>{p.monto_inusual}</TableCell>

                                        <TableCell sx={sxTd}>
                                            <Inconscistencia
                                                monto_distinto={p.monto_distinto}
                                                cuil_cuit_distinto={p.cuil_cuit_distinto}
                                                monto_inusual={p.monto_inusual}
                                                id={p.id}
                                                yarealizado={p.yarealizado}
                                            />
                                        </TableCell>

                                        <TableCell sx={{ ...sxTd, fontWeight: 600, whiteSpace: "nowrap" }}>${p.monto}</TableCell>

                                        <TableCell sx={sxTd}>
                                            <Button onClick={() => veronline(index)} variant="outlined" size="small" sx={{ textTransform: "none", borderRadius: 1.5, px: 1.75, fontWeight: 600 }}>
                                                Ver online
                                            </Button>
                                        </TableCell>

                                        <TableCell sx={sxTd}>
                                            <VerConstancias id={p.id} />
                                        </TableCell>

                                        <TableCell sx={sxTd}>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <BotonRechazo id={p.id} />
                                                <Tooltip title="Aprobar" arrow>
                                                    <Box sx={{ display: "inline-flex" }}>
                                                        <BotonAprobacion id={p.id} monto={p.monto} />
                                                    </Box>
                                                </Tooltip>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {pendientes.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={10} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                            No se encontraron registros de pagos pendientes de aprobación.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </Paper>
        </Box>
    );
};

export default TablaAprobaciones;
