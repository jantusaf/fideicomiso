import { useState, useEffect } from "react";
import servicioPagos from "../../../services/pagos";
import servicioAdmin from "../../../services/Administracion";

import CargaDeTabla from "../../CargaDeTabla";
import { useNavigate } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import { Button, CircularProgress } from "@mui/material";
import * as React from "react";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import { Box, Paper, Typography, Divider, alpha, Chip } from "@mui/material";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Estracto = () => {
    //configuracion de Hooks
    const [dats, setDats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([""]);
    const [fecha, setFecha] = useState([""]);
    const [activo, setActivo] = useState(false);
    const navigate = useNavigate();

    const getTodos = async () => {
        const tod = await servicioPagos.listaExtractos();
        console.log(tod);
        setTodos(tod);
    };

    const getClients = async () => {
        setActivo(true);
        const datos = await servicioPagos.VerExtracto(fecha);
        setDats(datos);
        setLoading(false);
    };

    const handleChange = (e) => {
        setFecha({ ...fecha, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getTodos();
    }, []);

    // definimos las columnas
    const columns = [
        { name: "fecha", label: "fecha" },
        { name: "descripcion", label: "Cuil/Cuit" },
        { name: "nombre", label: "Nombre" },
        { name: "referencia", label: "Referencia" },
        { name: "creditos", label: "creditos" },
    ];

    const options = {};
    const selectedFechaLabel =
        Array.isArray(todos)
            ? (todos.find((o) => String(o.id) === String(fecha?.id))?.fecha || "")
            : "";
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
                            <EventAvailableRoundedIcon sx={{ color: "#fff" }} />
                        </Box>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 900,
                                    fontSize: { xs: 18, md: 22 },
                                    lineHeight: 1.1,
                                    letterSpacing: 0.2,
                                }}
                            >
                                Extracto
                            </Typography>
                            <Typography
                                sx={{
                                    mt: 0.4,
                                    fontWeight: 600,
                                    opacity: 0.9,
                                    fontSize: 14,
                                }}
                            >
                                Elegí una fecha y consultá los movimientos del extracto.
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        icon={<TableRowsRoundedIcon />}
                        label={`Registros: ${Array.isArray(dats) ? dats.length : 0}`}
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

            {/* CONTENIDO */}
            <Box sx={{ p: { xs: 2, md: 3 } }}>
                {/* PANEL DE FILTRO (CENTRADO Y “GRANDE”) */}
                <Paper
                    elevation={0}
                    sx={{
                        borderRadius: 4,
                        p: { xs: 2, md: 2.25 },
                        border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
                        background:
                            "linear-gradient(180deg, rgba(10,59,79,0.06) 0%, rgba(15,127,134,0.04) 50%, rgba(255,255,255,0.92) 100%)",
                        boxShadow: "0 14px 35px rgba(15,127,134,0.10)",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: { xs: "stretch", md: "flex-start" },
                            gap: 2,
                            flexWrap: "wrap",
                        }}
                    >
                        {/* IZQUIERDA: select + tip */}
                        <Box sx={{ flex: 1, minWidth: { xs: "100%", md: 520 } }}>
                            <TextField
                                component="form"
                                noValidate
                                id="outlined-select-currency"
                                select
                                label="Elegir Fecha"
                                name="id"
                                onChange={handleChange}
                                value={fecha?.id ?? ""} // ✅ queda marcada
                                helperText={
                                    fecha?.id != undefined && selectedFechaLabel
                                        ? `Seleccionada: ${selectedFechaLabel}`
                                        : "Seleccionar fecha"
                                }
                                fullWidth
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        borderRadius: 3,
                                        backgroundColor: "rgba(255,255,255,0.85)",
                                    },
                                    "& .MuiInputLabel-root": { fontWeight: 800 },
                                    "& .MuiFormHelperText-root": { fontWeight: 700, opacity: 0.85 },
                                }}
                            >
                                {todos.map((option) => (
                                    <MenuItem
                                        key={option.id}
                                        value={option.id}
                                        sx={{
                                            fontWeight: 700,
                                            "&.Mui-selected": {
                                                backgroundColor: alpha("#0f7f86", 0.14),
                                            },
                                            "&.Mui-selected:hover": {
                                                backgroundColor: alpha("#0f7f86", 0.2),
                                            },
                                        }}
                                    >
                                        {option.fecha}
                                    </MenuItem>
                                ))}
                            </TextField>

                            <Typography
                                sx={{
                                    mt: 1,
                                    fontSize: 13,
                                    fontWeight: 700,
                                    color: alpha("#0a3b4f", 0.75),
                                }}
                            >
                                Elegí una fecha, luego tocá <b>“Ver extracto”</b>.
                            </Typography>
                        </Box>

                        {/* DERECHA: botón al lado del select */}
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: { xs: "stretch", md: "flex-end" },
                                justifyContent: { xs: "flex-start", md: "flex-end" },
                                minWidth: { xs: "100%", md: 220 },
                            }}
                        >
                            {fecha.id != undefined ? (
                                <Button
                                    onClick={getClients}
                                    startIcon={<VisibilityRoundedIcon />}
                                    sx={{
                                        width: { xs: "100%", md: "auto" },
                                        textTransform: "none",
                                        fontWeight: 900,
                                        borderRadius: 999,
                                        px: 3,
                                        py: 1.2,
                                        color: "#fff",
                                        background:
                                            "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
                                        boxShadow: "0 14px 35px rgba(15,127,134,0.28)",
                                        "&:hover": {
                                            transform: "translateY(-1px)",
                                            boxShadow: "0 18px 40px rgba(15,127,134,0.34)",
                                        },
                                        transition: "0.25s ease",
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Ver extracto
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    sx={{
                                        width: { xs: "100%", md: "auto" },
                                        textTransform: "none",
                                        fontWeight: 900,
                                        borderRadius: 999,
                                        px: 3,
                                        py: 1.2,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    Ver extracto
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Paper>
            </Box>



            {/* RESULTADO */}
            {
                activo ? (
                    <>
                        {loading ? (
                            <Box sx={{ py: 2 }}>
                                <CargaDeTabla />
                            </Box>
                        ) : (
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
                                    }}>
                                   {/*  <MUIDataTable

                                        data={dats}
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
                            </Paper>
                        )}
                    </>
                ) : (
                    // Estado vacío “lindo” (solo UI)
                    <Box
                        sx={{
                            borderRadius: 4,
                            p: { xs: 2, md: 3 },
                            border: `1px dashed ${alpha("#0b4f6c", 0.22)}`,
                            background: alpha("#0f7f86", 0.04),
                            textAlign: "center",
                        }}
                    >
                        <Typography sx={{ fontWeight: 900, color: alpha("#0a3b4f", 0.9) }}>
                            Elegí una fecha para ver el extracto
                        </Typography>
                        <Typography sx={{ mt: 0.5, fontWeight: 650, color: alpha("#0a3b4f", 0.7) }}>
                            Cuando selecciones una fecha, habilitamos el botón “Ver extracto”.
                        </Typography>
                    </Box>
                )
            }

        </Box >


    );
};

export default Estracto;
