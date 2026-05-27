import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
} from "@mui/material";
import servicioClientes from "../../../services/clientes";
import serviciousuario1 from "../../../services/usuario1";
import servicioaprobaciones from "../../../services/Aprobaciones";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import ThumbDownAltIcon from "@mui/icons-material/ThumbDownAlt";
import CheckIcon from "@mui/icons-material/Check";
import BotonRechazo from "./Rechazocbu";
import CargaDeTabla from "../../CargaDeTabla";
import Tooltip from "@mui/material/Tooltip";
import Button from "@mui/material/Button";

// ✅ SOLO FRONT (igual a pagos)
import * as React from "react";
import {
    Box,
    Paper,
    Typography,
    Chip,
    Divider,
    IconButton,
    Stack,
    alpha,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PendingActionsRoundedIcon from "@mui/icons-material/PendingActionsRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const TablaAprobaciones = () => {
    //configuracion de Hooks
    const [pendientes, setPendientes] = useState([]);
    const [act, setAct] = useState(false);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(5);
    const navigate = useNavigate();

    const getPendientes = async () => {
        const pendientes = await servicioClientes.listacbupendientes({});
        setPendientes(pendientes);
        setLoading(false);
    };

    const aprobar = async (id) => {
        console.log(id);
        await servicioaprobaciones.aprobacioncbu(id);
        getPendientes();
    };

    useEffect(() => {
        getPendientes();
    }, []);
const handleChangePage = (event, newPage) => {
    setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
};
    async function download(index, rowIndex, data) {
        const filename = pendientes[index].ubicacion;
        const link = await serviciousuario1.obtenerurl(filename);
        console.log(link.data);
        window.open(link.data);
    }

    async function veronline(index, rowIndex, data) {
        const filename = pendientes[index].ubicacion;
        const link = await serviciousuario1.obtenerurlonline(filename);
        console.log(link.data);
        window.open(link.data);
    }

    function downloadFile(index, rowIndex, data) {
        return (
            <Tooltip title="Descargar constancia" arrow>
                <Button
                    onClick={() => download(index)}
                    variant="contained"
                    size="small"
                    startIcon={<CloudDownloadRoundedIcon />}
                    sx={{
                        textTransform: "none",
                        borderRadius: 999,
                        px: 2,
                        fontWeight: 800,
                        boxShadow: "none",
                        background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
                        "&:hover": {
                            boxShadow: "0 10px 22px rgba(20,141,141,0.25)",
                            transform: "translateY(-1px)",
                        },
                        transition: "0.25s ease",
                    }}
                >
                    Descargar
                </Button>
            </Tooltip>
        );
    }

    function verFile(index, rowIndex, data) {
        return (
            <Tooltip title="Ver online" arrow>
                <Button
                    onClick={() => veronline(index)}
                    variant="outlined"
                    size="small"
                    endIcon={<OpenInNewRoundedIcon />}
                    sx={{
                        textTransform: "none",
                        borderRadius: 999,
                        px: 2,
                        fontWeight: 800,
                        borderColor: alpha("#148D8D", 0.55),
                        color: "#01567c",
                        background: alpha("#148D8D", 0.06),
                        "&:hover": {
                            borderColor: "#148D8D",
                            background: alpha("#148D8D", 0.12),
                            transform: "translateY(-1px)",
                        },
                        transition: "0.25s ease",
                    }}
                >
                    Ver online
                </Button>
            </Tooltip>
        );
    }

    // 👇 Solo estética: Chip de estado (sin tocar data/logic)
    function EstadoRenderer(dataIndex, rowIndex, data, onClick) {
        const value = pendientes[dataIndex]?.estado ?? "";
        const texto = String(value);

        let sx = {
            fontWeight: 900,
            borderRadius: 999,
            backgroundColor: alpha("#607d8b", 0.12),
            color: "#37474f",
            border: `1px solid ${alpha("#000", 0.08)}`,
        };

        const t = texto.toLowerCase();
        if (t.includes("pend") || t.includes("esper")) {
            sx = {
                ...sx,
                backgroundColor: alpha("#f59e0b", 0.16),
                color: "#9a5b00",
            };
        }
        if (t.includes("aprob") || t.includes("ok")) {
            sx = {
                ...sx,
                backgroundColor: alpha("#22c55e", 0.16),
                color: "#0b6b2a",
            };
        }
        if (t.includes("rech") || t.includes("error")) {
            sx = {
                ...sx,
                backgroundColor: alpha("#ef4444", 0.16),
                color: "#9f1d1d",
            };
        }

        return <Chip size="small" label={texto || "—"} sx={sx} />;
    }

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
        return (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BotonRechazo id={pendientes[dataIndex].id} />

                <Tooltip title="Aprobar" arrow>
                    <IconButton
                        onClick={() => {
                            aprobar(pendientes[dataIndex].id);
                        }}
                        sx={{
                            width: 38,
                            height: 38,
                            borderRadius: "14px",
                            background:
                                "linear-gradient(135deg, rgba(34,197,94,0.18), rgba(20,141,141,0.12))",
                            border: `1px solid ${alpha("#22c55e", 0.35)}`,
                            "&:hover": {
                                transform: "translateY(-1px)",
                                background:
                                    "linear-gradient(135deg, rgba(34,197,94,0.26), rgba(20,141,141,0.18))",
                            },
                            transition: "0.2s ease",
                        }}
                    >
                        <TaskAltRoundedIcon sx={{ color: "#0b6b2a" }} />
                    </IconButton>
                </Tooltip>
            </Box>
        );
    }

    // definimos las columnas
    const columns = [
        { name: "numero", label: "CBU" },
        { name: "cuil_cuit", label: "Cuil/Cuit Cliente" },
        { name: "cuil_cuit_lazo", label: "Cuil/Cuit Titular CBU" },
        { name: "ubicacion", label: "Descripcion" },
        {
            name: "estado",
            label: "Estado",
            actions: { onClick: (event, rowData) => alert(rowData) },
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    EstadoRenderer(dataIndex, rowIndex),
            },
        },
        {
            name: "Descarga",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    downloadFile(dataIndex, rowIndex),
            },
        },
        {
            name: "Ver online",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) => verFile(dataIndex, rowIndex),
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
        // ✅ IGUAL a pagos
        setTableProps: () => ({
            style: { backgroundColor: "transparent" },
        }),

        customHeadRender: (columnMeta, handleToggleColumn) => ({
            TableCell: {
                style: {
                    background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
                    color: "white",
                    fontWeight: 800,
                    borderBottom: "0px",
                },
            },
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

        // ✅ mismo look de filas
        setRowProps: (row, dataIndex, rowIndex) => ({
            style: {
                backgroundColor: rowIndex % 2 === 0 ? alpha("#148D8D", 0.03) : "#fff",
                transition: "0.2s ease",
            },
        }),

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

    // ✅ render igual a pagos (layout + cards)
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
                            <DescriptionRoundedIcon sx={{ color: "#fff", fontSize: 22 }} />
                        </Box>

                        <Box sx={{ lineHeight: 1.1 }}>
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
                                Lista de aprobaciones de CBU
                            </Typography>

                            <Typography
                                sx={{
                                    mt: 0.25,
                                    color: "rgba(255,255,255,0.9)",
                                    fontWeight: 600,
                                    textShadow: "0 1px 6px rgba(0,0,0,0.25)",
                                }}
                            >
                                Gestioná descargas, visualización y aprobación con un panel claro.
                            </Typography>
                        </Box>
                    </Box>

                    {/* DERECHA */}
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <Chip
                            icon={<PendingActionsRoundedIcon />}
                            label={`Pendientes: ${pendientes.length}`}
                            sx={{
                                borderRadius: 999,
                                fontWeight: 900,
                                px: 0.5,
                                background: "rgba(255,255,255,0.14)",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.22)",
                                backdropFilter: "blur(8px)",
                                "& .MuiChip-icon": { color: "rgba(255,255,255,0.92)" },
                            }}
                        />

                        <Chip
                            icon={<CheckCircleRoundedIcon />}
                            label="Aprobación / Rechazo"
                            sx={{
                                borderRadius: 999,
                                fontWeight: 900,
                                px: 0.5,
                                background: "rgba(255,255,255,0.10)",
                                color: "#fff",
                                border: "1px solid rgba(255,255,255,0.18)",
                                backdropFilter: "blur(8px)",
                                "& .MuiChip-icon": { color: "rgba(255,255,255,0.92)" },
                            }}
                        />
                    </Box>
                </Box>
            </Paper>

            {/* TABLA (igual a pagos) */}
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
                       <TableContainer>
    <Table stickyHeader>
        <TableHead>
            <TableRow>
                <TableCell>CBU</TableCell>
                <TableCell>Cuil/Cuit Cliente</TableCell>
                <TableCell>Cuil/Cuit Titular</TableCell>
                <TableCell>Descripción</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell>Descarga</TableCell>
                <TableCell>Ver Online</TableCell>
                <TableCell>Acciones</TableCell>
            </TableRow>
        </TableHead>

        <TableBody>
            {pendientes
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                    <TableRow
                        key={row.id}
                        hover
                        sx={{
                            backgroundColor:
                                index % 2 === 0
                                    ? alpha("#148D8D", 0.03)
                                    : "#fff",
                        }}
                    >
                        <TableCell>{row.numero}</TableCell>

                        <TableCell>{row.cuil_cuit}</TableCell>

                        <TableCell>{row.cuil_cuit_lazo}</TableCell>

                        <TableCell>{row.ubicacion}</TableCell>

                        <TableCell>
                            {EstadoRenderer(index)}
                        </TableCell>

                        <TableCell>
                            {downloadFile(index)}
                        </TableCell>

                        <TableCell>
                            {verFile(index)}
                        </TableCell>

                        <TableCell>
                            {CutomButtonsRenderer(index)}
                        </TableCell>
                    </TableRow>
                ))}
        </TableBody>
    </Table>

    <TablePagination
        component="div"
        count={pendientes.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 15]}
    />
</TableContainer>
                    </Box>
                )}
            </Paper>

        </Box>
    );
};

export default TablaAprobaciones;
