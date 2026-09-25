import { useState, useEffect } from "react";
import servicioPagos from "../../../services/pagos";
import { useNavigate } from "react-router-dom";
import BotonRechazo from "./RechazoPagoInusual";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

import { Box, Paper, Typography, alpha, Button, Chip } from "@mui/material";

import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, COLOR_ERROR, sxCard, sxBtnPrimary } from "../detalleclienteIngresos/estilos";

const PagosInusuales = () => {
    const [pagos, setPagos] = useState([]);
    const [search, setSearch] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    useEffect(() => {
        getPagosi();
    }, []);

    const getPagosi = async () => {
        const pagos = await servicioPagos.pagosinusuales2();
        setPagos(pagos);
    };

    // ✅ Columnas (misma data, misma lógica)
    const columns = [
        { name: "id", label: "Id" },
        {
            name: "Nombre",
            label: "Nombre/Razón Social",
            options: {
                display: "excluded", // 👈 no aparece en la tabla ni en "Columnas"
            },

        },
        {
            name: "cuil_cuitc",
            label: "Cuil/Cuit",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <Box
                        onClick={() =>
                            navigate(
                                "/usuario2/detallecliente/" + pagos[dataIndex]?.cuil_cuitc
                            )
                        }
                        sx={{
                            cursor: "pointer",
                            fontWeight: 900,
                            color: "#01567c",
                            textDecoration: "underline",
                            textUnderlineOffset: "3px",
                            textDecorationColor: alpha("#148D8D", 0.55),
                            "&:hover": {
                                color: "#148D8D",
                                textDecorationColor: alpha("#148D8D", 0.95),
                            },
                        }}
                    >
                        {pagos[dataIndex]?.cuil_cuitc}
                    </Box>
                ),
            },
        },
        { name: "tipologia", label: "Tipología" },
        { name: "fechanotificacion", label: "Fecha Notificación" },
        { name: "fechavencimiento", label: "Fecha Vencimiento" },
        {
            name: "monto",
            label: "Importe (Pesos)",
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const v = pagos[dataIndex]?.monto;
                    return (
                        <Box sx={{ fontWeight: 900, color: "#0b2b3a" }}>
                            {isNaN(Number(v)) ? `$${v}` : `$${Number(v).toFixed(2)}`}
                        </Box>
                    );
                },
            },
        },
        {
            name: "riesgo",
            label: "Riesgo",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <Box sx={{ fontWeight: 900, color: "#0b2b3a" }}>
                        {pagos[dataIndex]?.riesgo}%
                    </Box>
                ),
            },
        },
        {
            name: "proceso",
            label: "Estado",
            options: {
                customBodyRenderLite: (dataIndex) => {
                    const p = pagos[dataIndex]?.proceso;
                    return (
                        <Box sx={{ fontWeight: 800, color: "#0b2b3a" }}>
                            {p === "averificarnivel2" &&
                                "Pendiente carga de documentación"}
                            {p === "averificarnivel3" &&
                                "Pendiente clasificación de Gerencia"}
                            {p === "Inusual" && "Cerrado (Sin alerta)"}
                            {p === "Sospechoso" && "Cerrado (Con Alerta)"}
                        </Box>
                    );
                },
            },
        },
        {
            name: "fecha",
            label: "Fecha",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <Box sx={{ fontWeight: 800, color: "#0b2b3a", whiteSpace: "nowrap" }}>
                        Pago({pagos[dataIndex]?.fecha}) <br />Cuota({pagos[dataIndex]?.mesc}/
                        {pagos[dataIndex]?.anioc})
                    </Box>
                ),
            },
        },
        {
            name: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <BotonRechazo id={pagos[dataIndex]?.id} getPagosi={getPagosi}  sx={{
                              px: 1.6,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 900,
                              backgroundColor: "#148D8D",
                              boxShadow: "0 10px 20px rgba(20,141,141,0.18)",
                              "&:hover": { backgroundColor: "#0f6f6f" },
                            }} />
                ),
            },
        },
        {
            name: "Descarga",
            options: {
                customBodyRenderLite: (dataIndex) => (
                    <Button
                        onClick={() =>
                            navigate(
                                pagos[dataIndex]?.zona === "IC3"
                                    ? `/usuario2/cuotaic3/${pagos[dataIndex]?.id_cuota}`
                                    : `/usuario2/pagoscuotas/${pagos[dataIndex]?.id_cuota}`
                            )
                        }
                        sx={{
                            textTransform: "none",
                            fontWeight: 900,
                            borderRadius: 999,
                            px: 2,
                            color: "#fff",
                            background: "#1a303e",
                            boxShadow: "0 10px 22px rgba(20,141,141,0.22)",
                            "&:hover": {
                                transform: "translateY(-1px)",
                                boxShadow: "0 14px 30px rgba(20,141,141,0.30)",
                            },
                            transition: "0.2s ease",
                            whiteSpace: "nowrap",
                        }}
                    >
                        Ver pagos de cuota
                    </Button>
                ),
            },
        },
    ];

    // ✅ Opciones (toolbar + iconos)
    const options = {
        selectableRows: "none",
        responsive: "standard",
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15],
        filter: true,
        viewColumns: true,
        download: true,
        print: true,
        search: true,
        pagination: true,

        textLabels: {
            body: {
                noMatch: "No se encontraron registros",
                toolTip: "Ordenar",
            },
            pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar",
                print: "Imprimir",
                viewColumns: "Columnas",
                filterTable: "Filtrar",
            },
            filter: {
                all: "Todos",
                title: "FILTROS",
                reset: "RESETEAR",
            },
            viewColumns: {
                title: "Mostrar columnas",
                titleAria: "Mostrar/ocultar columnas",
            },
        },
    };
const pagosFiltrados = pagos.filter((p) => {
    const texto = search.toLowerCase();

    return (
        p?.cuil_cuitc?.toString().includes(texto) ||
        p?.Nombre?.toLowerCase().includes(texto) ||
        p?.tipologia?.toLowerCase().includes(texto)
    );
});
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

    const colorRiesgo = (v) =>
        Number(v) > 70 ? COLOR_ERROR : Number(v) > 40 ? "#ed6c02" : COLOR_OK;

    const textoEstado = (proceso) => {
        if (proceso === "averificarnivel2") return "Pendiente carga documentación";
        if (proceso === "averificarnivel3") return "Pendiente clasificación";
        if (proceso === "Inusual") return "Cerrado (Sin alerta)";
        if (proceso === "Sospechoso") return "Cerrado (Con alerta)";
        return "";
    };

    return (
        <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
            {/* ENCABEZADO */}
            <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", md: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
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
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
                            >
                                Pagos inusuales
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                Revisá, filtrá y gestioná pagos inusuales / sospechosos
                            </Typography>
                        </Box>
                    </Box>

                    <Chip variant="outlined" label={`Registros: ${pagos.length}`} sx={{ fontWeight: 600 }} />
                </Box>
            </Paper>

            {/* LISTADO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
                    <TextField
                        size="small"
                        placeholder="Buscar por CUIL, nombre o tipología"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ color: COLOR_MUTED, fontSize: 20 }} />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        sx={{ width: { xs: "100%", md: 420 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                    />
                </Box>

                <Divider sx={{ borderColor: COLOR_BORDER }} />

                <TableContainer>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow>
                                {["ID", "CUIL/CUIT", "TIPOLOGÍA", "F. NOTIFICACIÓN", "F. VENCIMIENTO", "IMPORTE", "RIESGO", "ESTADO", "FECHA", "ACCIONES", "DESCARGA"].map((h) => (
                                    <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {pagosFiltrados
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((p, index) => (
                                    <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                        <TableCell sx={sxTd}>{p.id}</TableCell>

                                        <TableCell
                                            sx={{ ...sxTd, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                                            onClick={() => navigate("/usuario2/detallecliente/" + p?.cuil_cuitc)}
                                        >
                                            {p.cuil_cuitc}
                                        </TableCell>

                                        <TableCell sx={sxTd}>{p.tipologia}</TableCell>
                                        <TableCell sx={sxTd}>{p.fechanotificacion}</TableCell>
                                        <TableCell sx={sxTd}>{p.fechavencimiento}</TableCell>

                                        <TableCell sx={{ ...sxTd, fontWeight: 600, whiteSpace: "nowrap" }}>
                                            $
                                            {isNaN(Number(p.monto)) ? p.monto : Number(p.monto).toFixed(2)}
                                        </TableCell>

                                        <TableCell sx={sxTd}>
                                            <Chip
                                                label={`${p.riesgo}%`}
                                                size="small"
                                                variant="outlined"
                                                sx={{
                                                    fontWeight: 600,
                                                    color: colorRiesgo(p.riesgo),
                                                    borderColor: colorRiesgo(p.riesgo),
                                                }}
                                            />
                                        </TableCell>

                                        <TableCell sx={sxTd}>{textoEstado(p.proceso)}</TableCell>

                                        <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>
                                            Pago({p.fecha})
                                            <br />
                                            Cuota({p.mesc}/{p.anioc})
                                        </TableCell>

                                        <TableCell sx={sxTd}>
                                            <BotonRechazo id={p.id} getPagosi={getPagosi} />
                                        </TableCell>

                                        <TableCell sx={sxTd}>
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() =>
                                                    navigate(
                                                        p?.zona === "IC3"
                                                            ? `/usuario2/cuotaic3/${p?.id_cuota}`
                                                            : `/usuario2/pagoscuotas/${p?.id_cuota}`
                                                    )
                                                }
                                                sx={{ ...sxBtnPrimary, px: 1.75, whiteSpace: "nowrap" }}
                                            >
                                                Ver pagos
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                            {pagosFiltrados.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={11} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                        No se encontraron registros.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    component="div"
                    count={pagosFiltrados.length}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    onRowsPerPageChange={(e) => {
                        setRowsPerPage(parseInt(e.target.value, 10));
                        setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 15, 20]}
                    labelRowsPerPage="Filas por página:"
                    sx={{
                        borderTop: `1px solid ${COLOR_BORDER}`,
                        "& .MuiTablePagination-toolbar": { minHeight: 48 },
                        "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                            fontSize: 13,
                            color: COLOR_MUTED,
                        },
                    }}
                />
            </Paper>
        </Box>
    );
};

export default PagosInusuales;
