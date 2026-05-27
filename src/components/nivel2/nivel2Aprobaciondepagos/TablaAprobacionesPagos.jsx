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
// ✅ SOLO FRONT (MUI) - sin tocar lógica
import { Box, Paper, Typography, Chip, alpha } from "@mui/material";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";

const TablaAprobaciones = () => {
    //configuracion de Hooks
    const [pendientes, setPendientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const id = open ? "simple-popover" : undefined;

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

    function verFile(index, rowIndex, data) {
        return (
            <>
                <Button
                    onClick={() => veronline(index)}
                    variant="outlined"
                    size="small"
                    sx={{
                        textTransform: "none",
                        borderRadius: 999,
                        px: 2,
                        fontWeight: 700,
                        borderColor: alpha("#148D8D", 0.55),
                        color: "#01567c",
                        background: alpha("#148D8D", 0.06),
                        "&:hover": {
                            borderColor: "#148D8D",
                            background: alpha("#148D8D", 0.12),
                        },
                    }}
                >
                    Ver online
                </Button>
            </>
        );
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

    function downloadFile(dataIndex, rowIndex, data) {
        return (
            <>
                <VerConstancias id={pendientes[dataIndex].id} />
            </>
        );
    }

    function CutomButtonsRendererr(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Box
                    sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1,
                        px: 1.25,
                        py: 0.5,
                        borderRadius: 999,
                        background: alpha("#01567c", 0.08),
                        border: `1px solid ${alpha("#01567c", 0.18)}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: 800,
                            color: "#01567c",
                            fontSize: 13,
                            lineHeight: 1,
                        }}
                    >
                        ${pendientes[dataIndex].monto}
                    </Typography>
                </Box>
            </>
        );
    }

    ///inconsistencia
    function Inconsistencia(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Inconscistencia
                    monto_distinto={pendientes[dataIndex].monto_distinto}
                    cuil_cuit_distinto={pendientes[dataIndex].cuil_cuit_distinto}
                    monto_inusual={pendientes[dataIndex].monto_inusual}
                    id={pendientes[dataIndex].id}
                    yarealizado={pendientes[dataIndex].yarealizado}
                />
            </>
        );
    }

    function fechacuota(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Chip
                    size="small"
                    label={`${pendientes[dataIndex].mes} / ${pendientes[dataIndex].anio}`}
                    sx={{
                        borderRadius: 999,
                        fontWeight: 800,
                        background: alpha("#148D8D", 0.12),
                        color: "#01567c",
                        border: `1px solid ${alpha("#148D8D", 0.22)}`,
                    }}
                />
            </>
        );
    }

    ///Cuil/Cuit Navega
    function cuilCuit_nav(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Tooltip title="Ver detalle" arrow>
                    <Box
                        component="span"
                        onClick={() =>
                            navigate(
                                "/usuario2/detallecliente/" + pendientes[dataIndex].cuil_cuit
                            )
                        }
                        sx={{
                            cursor: "pointer",
                            fontWeight: 800,
                            color: "#01567c",
                            textDecoration: "underline",
                            textDecorationColor: alpha("#148D8D", 0.55),
                            textUnderlineOffset: "3px",
                            "&:hover": {
                                color: "#148D8D",
                                textDecorationColor: alpha("#148D8D", 0.95),
                            },
                        }}
                    >
                        {pendientes[dataIndex].cuil_cuit}
                    </Box>
                </Tooltip>
            </>
        );
    }

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BotonRechazo id={pendientes[dataIndex].id} />
                <Tooltip title="Aprobar" arrow>
                    <Box sx={{ display: "inline-flex" }}>
                        <BotonAprobacion
                            id={pendientes[dataIndex].id}
                            monto={pendientes[dataIndex].monto}
                        />
                    </Box>
                </Tooltip>
            </Box>
        );
    }

    // definimos las columnas
    const columns = [
        {
            name: "Fecha Cuota",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    fechacuota(dataIndex, rowIndex),
            },
        },
        { name: "fecha", label: "Fecha Pago" },
        {
            name: "Cuil/Cuit",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    cuilCuit_nav(dataIndex, rowIndex),
            },
        },
        { name: "descripcion", label: "Estado" },
        { name: "monto_inusual", label: "Monto Inusual" },
        {
            name: "Inconsistencia",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    Inconsistencia(dataIndex, rowIndex),
            },
        },
        {
            name: "Monto",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    CutomButtonsRendererr(dataIndex, rowIndex),
            },
        },
        {
            name: "Ver online",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => verFile(dataIndex, rowIndex),
            },
        },
        {
            name: "Ver Constancias",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    downloadFile(dataIndex, rowIndex),
            },
        },
        {
            name: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    CutomButtonsRenderer(dataIndex, rowIndex),
            },
        },
    ];

    const options = {
        // ✅ IGUAL A CBU: limpio, sin gradiente en header
        setTableProps: () => ({
            style: { backgroundColor: "transparent" },
        }),

        selectableRows: false,
        stickyHeader: true,
        selectableRowsHeader: false,
        selectableRowsOnClick: true,
        responsive: "scroll",
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15],
        downloadOptions: { filename: "tableDownload.csv", separator: "," },
        print: true,
        filter: true,
        viewColumns: true,
        pagination: true,

        textLabels: {
            body: {
                noMatch:
                    "No se encontraron registros de pagos pendientes de aprobacion",
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
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver columnas",
                filterTable: "Filtrar tabla",
            },
            filter: {
                all: "Todos",
                title: "FILTROS",
                reset: "RESETEAR",
            },
            viewColumns: {
                title: "Mostrar columnas",
                titleAria: "Mostrar/ocultar columnas de la tabla",
            },
            selectedRows: {
                text: "fila(s) seleccionada(s)",
                delete: "Eliminar",
                deleteAria: "Eliminar filas seleccionadas",
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
                            <DescriptionRoundedIcon sx={{ color: "#ffffff" }} />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontSize: { xs: 18, md: 20 },
                                    fontWeight: 900,
                                    color: "#ffffff",
                                    letterSpacing: 0.2,
                                    lineHeight: 1.2,
                                    textShadow: "0 2px 10px rgba(0,0,0,0.35)",
                                }}
                            >
                                Lista de aprobaciones pendientes
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    color: "rgba(255,255,255,0.9)",
                                    fontWeight: 600,
                                    textShadow: "0 1px 6px rgba(0,0,0,0.25)",
                                }}
                            >
                                Revisá pagos, inconsistencias y constancias antes de aprobar.
                            </Typography>
                        </Box>
                    </Box>

                    {/* DERECHA: CHIP */}
                    <Chip
                        label={`Pendientes: ${pendientes.length}`}
                        icon={<PendingActionsRoundedIcon />}
                        sx={{
                            borderRadius: 999,
                            fontWeight: 900,
                            px: 1,
                            background: "rgba(255,255,255,0.18)",
                            color: "#ffffff",
                            border: "1px solid rgba(255,255,255,0.28)",
                            backdropFilter: "blur(8px)",
                            "& .MuiChip-icon": {
                                color: "#ffffff",
                            },
                        }}
                    />
                </Box>
            </Paper>



            {/*  TABLA (misma sensación que CBU) */}
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
                {loading ? (
                    <Box sx={{ p: 2 }}>
                        <CargaDeTabla />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            /* =========================
                               TEXTO GENERAL (BODY)
                            ========================== */
                            "& .MuiTableBody-root .MuiTableCell-root": {
                                borderBottom: `1px solid ${alpha("#01567c", 0.08)}`,
                                fontWeight: 650,
                                color: "#0b2b3a", // ✅ color letra filas
                            },

                            /* =========================
                               TEXTO HEADER
                            ========================== */
                            "& .MuiTableHead-root .MuiTableCell-root": {
                                borderBottom: "0px",
                                color: "#01567c", // ✅ texto blanco en header
                                fontWeight: 800,
                            },

                            /* =========================
                               TOOLBAR (buscar, icons)
                            ========================== */
                            "& .MuiToolbar-root": {
                                px: 2,
                                color: "#01567c",
                            },

                            "& .MuiToolbar-root .MuiInputBase-input": {
                                color: "#0b2b3a", // texto del buscador
                                fontWeight: 700,
                            },

                            /* =========================
                               ICONOS (DEFAULT)
                            ========================== */
                            "& .MuiIconButton-root, & svg": {
                                color: alpha("#01567c", 0.75),
                                transition: "all 0.2s ease",
                            },

                            /* =========================
                               ICONOS HOVER
                            ========================== */
                            "& .MuiIconButton-root:hover, & svg:hover": {
                                color: "#148D8D", // ✅ color hover íconos
                                transform: "translateY(-1px)",
                            },

                            /* =========================
                               HOVER FILAS
                            ========================== */


                            /* =========================
                               PAGINACIÓN
                            ========================== */
                            "& .MuiTablePagination-root, & .MuiTablePagination-root *": {
                                color: "#01567c",
                                fontWeight: 700,
                            },
                        }}
                    >
                       {/*  <MUIDataTable
                            title={""}
                            data={pendientes}
                            columns={columns}
                            actions={[
                                {
                                    icon: "save",
                                    tooltip: "Save User",
                                    onClick: (event, rowData) => alert("You saved " + rowData.name),
                                },
                            ]}
                            options={options}
                        /> */}
                    </Box>
                )}
            </Paper>

        </Box>
    );
};

export default TablaAprobaciones;
