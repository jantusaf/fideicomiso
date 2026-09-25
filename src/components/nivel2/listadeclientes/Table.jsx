import { useState, useEffect } from "react";
import servicioClientes from "../../../services/clientes";
import Nuevo from "./ClienteNuevo";
import CargaDeTabla from "../../CargaDeTabla";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Chip,
  Divider,
  InputAdornment,
} from "@mui/material";
import Button from "@mui/material/Button";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_OK,
  COLOR_ERROR,
  sxCard,
  sxBtnPrimary,
  sxBtnOutlined,
} from "../detalleclienteIngresos/estilos";

const Lotes = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [orderCuota, setOrderCuota] = useState("asc"); // asc | desc
  const navigate = useNavigate();

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const data = await servicioClientes.lista({});
    setClients(data);
    setFilteredClients(data);
    setLoading(false);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = clients.filter(
      (c) =>
        c.cuil_cuit?.toLowerCase().includes(value) ||
        c.Nombre?.toLowerCase().includes(value) ||
        c.razon?.toLowerCase().includes(value)
    );
    setFilteredClients(filtered);
    setPage(0);
  };

  const parseCuota = (cuota) => {
    if (!cuota) return 0;
    const [mes, anio] = cuota.split("/").map(Number);
    return anio * 100 + mes; // ej: 202707
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) return <CargaDeTabla />;

  // Encabezado de tabla: claro y discreto (sin fondos de color)
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

  const sxTd = {
    fontSize: 13.5,
    color: COLOR_TEXT,
    borderBottom: "1px solid #eef1f3",
    py: 1.1,
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
              <PeopleRoundedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Clientes PIT
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Listado y acceso rápido a detalle / edición
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              alignItems: "center",
              justifyContent: { xs: "flex-start", md: "flex-end" },
              flexWrap: "wrap",
            }}
          >
            <Chip variant="outlined" label={`Cantidad: ${clients.length}`} sx={{ fontWeight: 600 }} />

            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => navigate("/usuario2/nuevocliente/")}
              sx={sxBtnPrimary}
            >
              Agregar cliente
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* LISTADO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden" }}>
        {/* Barra de herramientas: búsqueda + orden */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 2,
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <TextField
            placeholder="Buscar por CUIL/CUIT, nombre o razón"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: COLOR_MUTED, fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{
              width: { xs: "100%", md: 420 },
              "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
            }}
          />

          <Button
            variant="outlined"
            onClick={() => {
              const sorted = [...filteredClients].sort((a, b) => {
                const aVal = parseCuota(a.ultimaCuota);
                const bVal = parseCuota(b.ultimaCuota);
                return orderCuota === "asc" ? aVal - bVal : bVal - aVal;
              });
              setFilteredClients(sorted);
              setOrderCuota(orderCuota === "asc" ? "desc" : "asc");
            }}
            sx={sxBtnOutlined}
          >
            Ordenar por última cuota {orderCuota === "asc" ? "↑" : "↓"}
          </Button>
        </Box>

        <Divider sx={{ borderColor: COLOR_BORDER }} />

        <TableContainer sx={{ maxHeight: "68vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {["CUIL / CUIT", "NOMBRE", "RIESGO", "RAZÓN SOCIAL", "ULTIMA CUOTA", "OPCIONES"].map(
                  (h) => (
                    <TableCell key={h} sx={{ ...sxTh, ...(h === "OPCIONES" ? { textAlign: "right" } : {}) }}>
                      {h}
                    </TableCell>
                  )
                )}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredClients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((client, index) => {
                  const value = client.porcentaje || 0;

                  // Mismos rangos de siempre; solo cambia cómo se dibuja (punto de color)
                  let colorRiesgo = "#9aa7b0";
                  if (value > 0 && value <= 58) colorRiesgo = COLOR_OK;
                  else if (value > 59 && value <= 70) colorRiesgo = "#ed6c02";
                  else if (value > 70) colorRiesgo = COLOR_ERROR;

                  const irAlDetalle = () =>
                    navigate(
                      client.zona === "IC3"
                        ? `/usuario2/detalleclic3/${client.cuil_cuit}`
                        : `/usuario2/detallecliente/${client.cuil_cuit}`
                    );

                  return (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:hover td": { backgroundColor: "rgba(13, 58, 73, 0.03)" },
                        "&:last-child td": { borderBottom: 0 },
                      }}
                    >
                      <TableCell
                        sx={{ ...sxTd, cursor: "pointer", fontWeight: 600, whiteSpace: "nowrap" }}
                        onClick={irAlDetalle}
                      >
                        {client.cuil_cuit}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, cursor: "pointer", fontWeight: 600 }} onClick={irAlDetalle}>
                        {client.Nombre}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, minWidth: 190 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <Box
                            sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: colorRiesgo, flexShrink: 0 }}
                          />

                          <LinearProgress
                            variant="determinate"
                            value={Math.min(value, 100)}
                            sx={{
                              flex: 1,
                              height: 5,
                              borderRadius: 99,
                              backgroundColor: "#eef1f3",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 99,
                                backgroundColor: colorRiesgo,
                              },
                            }}
                          />

                          <Typography
                            variant="body2"
                            sx={{ minWidth: 40, textAlign: "right", fontWeight: 600, color: COLOR_TEXT }}
                          >
                            {value ? `${value}%` : "0%"}
                          </Typography>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ ...sxTd, color: COLOR_MUTED }}>{client.razon}</TableCell>

                      <TableCell sx={{ ...sxTd, fontWeight: 600, whiteSpace: "nowrap" }}>
                        {client.ultimaCuota}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, whiteSpace: "nowrap", textAlign: "right" }}>
                        <Tooltip title="Editar cliente">
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => navigate(`/usuario2/modificarcliente/${client.cuil_cuit}`)}
                            sx={{ ...sxBtnOutlined, mr: 1, px: 1.75 }}
                          >
                            Editar
                          </Button>
                        </Tooltip>

                        <Tooltip title="Ver detalle">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => navigate(`/usuario2/detallecliente/${client.cuil_cuit}`)}
                            sx={{ ...sxBtnPrimary, px: 1.75 }}
                          >
                            Ver
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {filteredClients.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                    No se encontraron clientes con ese criterio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider sx={{ borderColor: COLOR_BORDER }} />

        <Box sx={{ px: { xs: 1, md: 2 } }}>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={filteredClients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Filas por página:"
            sx={{
              "& .MuiTablePagination-toolbar": { minHeight: 48 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 13,
                color: COLOR_MUTED,
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Lotes;
