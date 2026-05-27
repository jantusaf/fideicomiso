import { useState, useEffect } from "react";
import servicioPagos from "../../../services/pagos";
import { useNavigate } from "react-router-dom";
import BotonRechazo from "./RechazoPagoInusual";


import { Box, Paper, Typography, alpha, Button, Chip } from "@mui/material";

import ReportProblemRoundedIcon from "@mui/icons-material/ReportProblemRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";

const PagosInusuales = () => {
    const [pagos, setPagos] = useState([]);
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
                            background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
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

    return (
        <Box
            sx={{
                width: "100%",
                maxWidth: "100%",
                flex: 1,
                minWidth: 0,
            }}
        >
            {/* CARD PRINCIPAL */}
            <Paper
                elevation={0}
                sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 22px 55px rgba(15, 127, 134, 0.10)",
                }}
            >
                {/* HEADER (GRADIENT) */}
                <Box
                    sx={{
                        px: { xs: 2, md: 3 },
                        py: { xs: 2, md: 2.5 },
                        background:
                            "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
                        color: "#fff",
                        display: "flex",
                        alignItems: { xs: "flex-start", md: "center" },
                        justifyContent: "space-between",
                        gap: 2,
                        flexWrap: "wrap",

                    }}
                >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "14px",
                                display: "grid",
                                placeItems: "center",
                                background: "rgba(255,255,255,0.18)",
                                border: "1px solid rgba(255,255,255,0.35)",
                                flexShrink: 0,
                            }}
                        >
                            <ReportProblemRoundedIcon sx={{ color: "#fff" }} />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: 18, md: 22 },
                                    lineHeight: 1.1,
                                }}
                            >
                                Pagos inusuales
                            </Typography>
                            <Typography
                                sx={{ mt: 0.35, fontWeight: 650, opacity: 0.9, fontSize: 14 }}
                            >
                                Revisá, filtrá y gestioná pagos inusuales / sospechosos.
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={<TableRowsRoundedIcon />}
                        label={`Registros: ${pagos.length}`}
                        sx={{
                            color: "#fff",
                            fontWeight: 900,
                            borderRadius: 999,
                            background: "rgba(255,255,255,0.18)",
                            border: "1px solid rgba(255,255,255,0.35)",
                            "& .MuiChip-icon": { color: "#fff" },
                        }}
                    />
                </Box>
            </Paper>
            <Paper
                elevation={0}
                sx={{
                    mt: { xs: 2, md: 3 }, // 👈 separación arriba
                    borderRadius: 4,
                    overflow: "hidden",
                    border: `1px solid ${alpha("#01567c", 0.12)}`,
                    background: "rgba(255,255,255,0.92)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 22px 55px rgba(20, 141, 141, 0.10)",
                }}
            >
                {/* ✅ SOLO TABLA: estilo “como CBU” (toolbar + íconos) */}
                <Box
                    sx={{
                        p: { xs: 1.5, md: 2 },

                        /* ===== BODY ===== */
                        "& .MuiTableBody-root .MuiTableCell-root": {
                            borderBottom: `1px solid ${alpha("#01567c", 0.08)}`,
                            fontWeight: 650,
                            color: "#0b2b3a",
                        },

                        /* ===== HEADER ===== */
                        "& .MuiTableHead-root .MuiTableCell-root": {
                            borderBottom: "0px",
                            color: "#01567c",
                            fontWeight: 800,
                        },

                        /* ===== TOOLBAR ===== */
                        "& .MuiToolbar-root": {
                            px: 2,
                            color: "#01567c",
                        },
                        "& .MuiToolbar-root .MuiInputBase-input": {
                            color: "#0b2b3a",
                            fontWeight: 700,
                        },

                        /* ===== ICONOS ===== */
                        "& .MuiIconButton-root, & svg": {
                            color: alpha("#01567c", 0.75),
                            transition: "all 0.2s ease",
                        },
                        "& .MuiIconButton-root:hover, & svg:hover": {
                            color: "#148D8D",
                            transform: "translateY(-1px)",
                        },

                        /* ===== HOVER FILAS ===== */
                        "& .MuiTableRow-root:hover td": {
                            backgroundColor: `${alpha("#148D8D", 0.06)} !important`,
                        },

                        /* ===== PAGINACIÓN ===== */
                        "& .MuiTablePagination-root, & .MuiTablePagination-root *": {
                            color: "#01567c",
                            fontWeight: 700,
                        },

                        /* (Opcional) “card” interna de la tabla sin sombra extra */
                        "& .MuiPaper-root": { boxShadow: "none" },
                    }}
                >
                   {/*  <MUIDataTable
                        title={""}
                        data={pagos}
                        columns={columns}
                        options={options}
                    /> */}
                </Box>
            </Paper>

        </Box>

    );
};

export default PagosInusuales;
