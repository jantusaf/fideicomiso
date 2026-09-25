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
import { Box, Paper, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary } from "../detalleclienteIngresos/estilos";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
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
                            <EventAvailableRoundedIcon sx={{ color: COLOR_ACCENT }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
                            >
                                Extracto
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                Elegí una fecha y consultá los movimientos del extracto
                            </Typography>
                        </Box>
                    </Box>

                    <Chip
                        variant="outlined"
                        label={`Registros: ${Array.isArray(dats) ? dats.length : 0}`}
                        sx={{ fontWeight: 600 }}
                    />
                </Box>
            </Paper>

            {/* FILTRO */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: { xs: "stretch", md: "flex-start" },
                        gap: 2,
                        flexDirection: { xs: "column", md: "row" },
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <TextField
                            component="form"
                            noValidate
                            id="outlined-select-currency"
                            select
                            size="small"
                            label="Elegir fecha"
                            name="id"
                            onChange={handleChange}
                            value={fecha?.id ?? ""}
                            helperText={
                                fecha?.id != undefined && selectedFechaLabel
                                    ? `Seleccionada: ${selectedFechaLabel}`
                                    : "Elegí una fecha y luego tocá Ver extracto"
                            }
                            fullWidth
                            sx={{ maxWidth: { md: 520 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                        >
                            {todos.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.fecha}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    <Button
                        onClick={getClients}
                        disabled={fecha.id == undefined}
                        variant="contained"
                        startIcon={<VisibilityRoundedIcon />}
                        sx={{ ...sxBtnPrimary, whiteSpace: "nowrap", height: 40 }}
                    >
                        Ver extracto
                    </Button>
                </Box>
            </Paper>

            {/* RESULTADO */}
            {activo ? (
                loading ? (
                    <Box sx={{ py: 2 }}>
                        <CargaDeTabla />
                    </Box>
                ) : (
                    <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                        <TableContainer sx={{ maxHeight: "68vh" }}>
                            <Table stickyHeader size="small">
                                <TableHead>
                                    <TableRow>
                                        {["FECHA", "CUIL/CUIT", "NOMBRE", "REFERENCIA", "CRÉDITOS"].map((h) => (
                                            <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {Array.isArray(dats) && dats.map((r, i) => (
                                        <TableRow key={i} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                            <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{r.fecha}</TableCell>
                                            <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{r.descripcion}</TableCell>
                                            <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{r.nombre}</TableCell>
                                            <TableCell sx={sxTd}>{r.referencia}</TableCell>
                                            <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{r.creditos}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(!Array.isArray(dats) || dats.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                                No hay movimientos para la fecha elegida.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )
            ) : (
                <Box
                    sx={{
                        mt: 2.5,
                        borderRadius: 2.5,
                        p: { xs: 2.5, md: 3.5 },
                        border: `1px dashed #b7c2c9`,
                        backgroundColor: "#f9fafb",
                        textAlign: "center",
                    }}
                >
                    <Typography sx={{ fontWeight: 600, color: COLOR_TEXT }}>
                        Elegí una fecha para ver el extracto
                    </Typography>
                    <Typography sx={{ mt: 0.5, fontSize: 13.5, color: COLOR_MUTED }}>
                        Cuando selecciones una fecha, se habilita el botón Ver extracto.
                    </Typography>
                </Box>
            )}
        </Box>
    );
};

export default Estracto;
