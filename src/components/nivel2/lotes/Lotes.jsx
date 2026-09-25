import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  MenuItem,
  Grid,
  Button,
  Chip,
  InputAdornment,
  Divider,
} from "@mui/material";
import servicioLotes from '../../../services/lotes'
import { useNavigate } from "react-router-dom";
import CargaDeTabla from "../../CargaDeTabla"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import Modaldetalles from './modalver'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import GridViewRoundedIcon from "@mui/icons-material/GridViewRounded";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, COLOR_ERROR, sxCard } from "../detalleclienteIngresos/estilos";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const Lotes = () => {
    //configuracion de Hooks
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
const [zonaFilter, setZonaFilter] = useState("");
const [fraccionFilter, setFraccionFilter] = useState("");
const [parcelaFilter, setParcelaFilter] = useState("");
const [loteFilter, setLoteFilter] = useState("");

const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
    const navigate = useNavigate();

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Modaldetalles
                    zona={clients[0][dataIndex]['zona']}
                    fraccion={clients[0][dataIndex]['fraccion']}
                    manzana={clients[0][dataIndex]['manzana']}
                    lote={clients[0][dataIndex]['lote']}
                    parcela={clients[0][dataIndex]['parcela']}
                    adrema={clients[0][dataIndex]['adrema']}
                    superficie={clients[0][dataIndex]['superficie']}
                    mensura={clients[0][dataIndex]['mensura']}
                    nombre={clients[0][dataIndex]['nombre']}
                    cuil_cuit={clients[0][dataIndex]['cuil_cuit']}


                />
            </>
        );
    }

    const getClients = async () => {

        const clients = await servicioLotes.lista({

        })

        setClients(clients)
        setLoading(false);
    }

    useEffect(() => {
        getClients()
    }, [])
const filteredClients = clients[0]?.filter((item) => {
    return (
        (item.nombre?.toLowerCase().includes(search.toLowerCase()) ||
            item.cuil_cuit?.toLowerCase().includes(search.toLowerCase())) &&

        (zonaFilter === "" || item.zona === zonaFilter) &&
        (fraccionFilter === "" || item.fraccion === fraccionFilter) &&
        (parcelaFilter === "" || item.parcela === parcelaFilter) &&
        (loteFilter === "" || item.lote === loteFilter)
    );
}) || [];
    // definimos las columnas
    const columns = [
        {
            name: "Ver",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    CutomButtonsRenderer(
                        dataIndex,
                        rowIndex,
                        // overbookingData,
                        // handleEditOpen
                    )
            }

        },
        {
            name: "zona",
            label: "Zona",
        },
        {
            name: "fraccion",
            label: "Fraccion",


        },
        {
            name: "manzana",
            label: "Manzana",

        },
        {
            name: "lote",
            label: "Lote",
        },
        {
            name: "parcela",
            label: "Parcela",
        },
        {
            name: "superficie",
            label: "superficie",
        },
        {
            name: "estado",
            label: "Estado",
        },
        {
            name: "cuil_cuit",
            label: "cuil_cuit",
        },
        {
            name: "nombre",
            label: "Persona",
        },

        /*   {
              name: "Actions",
              options: {
                  customBodyRenderLite: (dataIndex, rowIndex) =>
                      CutomButtonsRenderer(
                          dataIndex,
                          rowIndex,
                         // overbookingData,
                         // handleEditOpen
                      )
              }
          
          },   */

    ];
    // renderiza la data table
    const options = {
        selectableRows: false, // Deshabilita los checkboxes
    };
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
        <>
            {loading ? (<CargaDeTabla />)
                : (
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
                                        <GridViewRoundedIcon sx={{ color: COLOR_ACCENT }} />
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h5"
                                            sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
                                        >
                                            Lotes
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                            Resumen general de lotes por zona y estado
                                        </Typography>
                                    </Box>
                                </Box>

                                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                                    <Chip variant="outlined" label={`Total: ${clients[0].length}`} sx={{ fontWeight: 600 }} />
                                    <Chip
                                        variant="outlined"
                                        label={`Disponibles: ${clients[1]}`}
                                        sx={{ fontWeight: 600, color: COLOR_OK, borderColor: COLOR_OK }}
                                    />
                                    <Chip variant="outlined" label={`Parque: ${clients[2]}`} sx={{ fontWeight: 600 }} />
                                    <Chip variant="outlined" label={`IC3: ${clients[3]}`} sx={{ fontWeight: 600 }} />
                                </Box>
                            </Box>
                        </Paper>

                        {/* LISTADO */}
                        <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
                            <Box
                                sx={{
                                    px: { xs: 2, md: 3 },
                                    py: 2,
                                    display: "flex",
                                    gap: 2,
                                    flexDirection: { xs: "column", md: "row" },
                                    alignItems: { xs: "stretch", md: "center" },
                                }}
                            >
                                <TextField
                                    placeholder="Buscar por nombre o CUIL"
                                    size="small"
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
                                    sx={{ width: { xs: "100%", md: 380 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                />

                                <TextField
                                    select
                                    size="small"
                                    label="Zona"
                                    value={zonaFilter}
                                    onChange={(e) => setZonaFilter(e.target.value)}
                                    sx={{ width: { xs: "100%", md: 180 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                                >
                                    <MenuItem value="">Todas</MenuItem>
                                    {[...new Set(clients[0]?.map((x) => x.zona))].map((zona) => (
                                        <MenuItem key={zona} value={zona}>
                                            {zona}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            <Divider sx={{ borderColor: COLOR_BORDER }} />

                            <TableContainer sx={{ maxHeight: "68vh" }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            {["VER", "ZONA", "FRACCIÓN", "MANZANA", "LOTE", "PARCELA", "SUPERFICIE", "ESTADO", "CUIL/CUIT", "PERSONA"].map((h) => (
                                                <TableCell key={h} sx={sxTh}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {filteredClients
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                            .map((item, index) => {
                                                const disponible = String(item.estado || "").toLowerCase() === "disponible";
                                                return (
                                                    <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                                        <TableCell sx={sxTd}>
                                                            <Modaldetalles
                                                                zona={item.zona}
                                                                fraccion={item.fraccion}
                                                                manzana={item.manzana}
                                                                lote={item.lote}
                                                                parcela={item.parcela}
                                                                adrema={item.adrema}
                                                                superficie={item.superficie}
                                                                mensura={item.mensura}
                                                                nombre={item.nombre}
                                                                cuil_cuit={item.cuil_cuit}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={sxTd}>{item.zona}</TableCell>
                                                        <TableCell sx={sxTd}>{item.fraccion}</TableCell>
                                                        <TableCell sx={sxTd}>{item.manzana}</TableCell>
                                                        <TableCell sx={sxTd}>{item.lote}</TableCell>
                                                        <TableCell sx={sxTd}>{item.parcela}</TableCell>
                                                        <TableCell sx={sxTd}>{item.superficie}</TableCell>

                                                        <TableCell sx={sxTd}>
                                                            <Chip
                                                                label={item.estado}
                                                                size="small"
                                                                variant="outlined"
                                                                sx={{
                                                                    fontWeight: 600,
                                                                    color: disponible ? COLOR_OK : COLOR_ERROR,
                                                                    borderColor: disponible ? COLOR_OK : COLOR_ERROR,
                                                                }}
                                                            />
                                                        </TableCell>

                                                        <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{item.cuil_cuit}</TableCell>
                                                        <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{item.nombre}</TableCell>
                                                    </TableRow>
                                                );
                                            })}

                                        {filteredClients.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={10} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                                    No se encontraron lotes con ese criterio.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <TablePagination
                                component="div"
                                count={filteredClients.length}
                                page={page}
                                onPageChange={(e, newPage) => setPage(newPage)}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value, 10));
                                    setPage(0);
                                }}
                                rowsPerPageOptions={[5, 10, 25, 50]}
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
                )}
        </>
    )
}

export default Lotes;
