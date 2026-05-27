import { useState, useEffect } from "react";
import servicioClientes from "../../../services/clientes";
import Nuevo from "./ClienteNuevo";
import CargaDeTabla from "../../CargaDeTabla";
import { useNavigate } from "react-router-dom";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
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
import { alpha } from "@mui/material/styles";

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

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

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        background:
          "linear-gradient(180deg, rgba(10,59,79,0.06) 0%, rgba(15,127,134,0.04) 45%, rgba(255,255,255,0.92) 100%)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER TOP (igual estética) */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 3,
          px: { xs: 2, md: 2.5 },
          py: { xs: 2, md: 2.25 },
          background:
            "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
          boxShadow: "0 14px 35px rgba(15,127,134,0.25)",
          color: "#fff",
          border: `1px solid ${alpha("#ffffff", 0.12)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.22)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <PeopleRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
                Clientes (parque)
              </Typography>
              <Typography sx={{ opacity: 0.9, fontSize: 13 }}>
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
            <Chip
              label={`Cantidad: ${clients.length}`}
              sx={{
                color: "#fff",
                fontWeight: 900,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.24)",
                px: 0.75,
                borderRadius: 999,
              }}
            />

            <Button
              variant="contained"
              startIcon={<PersonAddAlt1Icon />}
              onClick={() => navigate("/usuario2/nuevocliente/")}
              sx={{
               borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      px: 2,
                      backgroundColor: "rgba(255,255,255,0.16)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.25)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.24)" },
              }}
            >
              Agregar cliente
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* CARD BÚSQUEDA (título izquierda, input derecha) */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 3,
          p: { xs: 2, md: 2.25 },
          border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
          background: "#fff",
          boxShadow: "0 10px 30px rgba(2,85,123,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 900, color: "#063a52" }}>
              Búsqueda
            </Typography>
            <Typography sx={{ fontSize: 13, color: "rgba(0,0,0,0.6)" }}>
              Filtrá por CUIL/CUIT o nombre
            </Typography>
          </Box>

          <TextField
            label="Buscar por CUIL, nombre o razón"
            variant="outlined"
            size="small"
            value={search}
            onChange={handleSearch}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#0f7f86" }} />
                </InputAdornment>
              ),
            }}
            sx={{
              width: { xs: "100%", md: 430 },
              "& .MuiOutlinedInput-root": {
                borderRadius: "14px",
                backgroundColor: "#fff",
                "& fieldset": { borderColor: "#e6e6e6" },
                "&:hover fieldset": { borderColor: "#0f7f86" },
                "&.Mui-focused fieldset": { borderColor: "#0b4f6c", borderWidth: 2 },
              },
              "& .MuiInputLabel-root": { color: "#6b6b6b" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#0b4f6c" },
            }}
          />
        </Box>
      </Paper>

      {/* CARD LISTADO + BOTÓN ORDEN */}
      <Paper
        elevation={0}
        sx={{
          mt: 2,
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
          background: "#fff",
          boxShadow: "0 14px 35px rgba(15,127,134,0.10)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 2.25 },
            py: 1.6,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            background:
              "linear-gradient(180deg, rgba(10,59,79,0.06) 0%, rgba(255,255,255,1) 100%)",
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "#063a52" }}>
            Listado
          </Typography>

          <Button
            onClick={() => {
              const sorted = [...filteredClients].sort((a, b) => {
                const aVal = parseCuota(a.ultimaCuota);
                const bVal = parseCuota(b.ultimaCuota);
                return orderCuota === "asc" ? aVal - bVal : bVal - aVal;
              });
              setFilteredClients(sorted);
              setOrderCuota(orderCuota === "asc" ? "desc" : "asc");
            }}
            sx={{
              textTransform: "none",
              fontWeight: 900,
              color: "#0b4f6c",
              borderRadius: 2,
              px: 1.6,
              background: alpha("#0b4f6c", 0.06),
              border: `1px solid ${alpha("#0b4f6c", 0.16)}`,
              "&:hover": { background: alpha("#0b4f6c", 0.10) },
            }}
          >
            Ordenar por última cuota {orderCuota === "asc" ? "↑" : "↓"}
          </Button>
        </Box>

        <Divider />

        <TableContainer sx={{ maxHeight: "68vh" }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {["CUIL / CUIT", "NOMBRE", "RIESGO", "RAZÓN SOCIAL", "ULTIMA CUOTA", "OPCIONES"].map(
                  (h) => (
                    <TableCell
                      key={h}
                      sx={{
                        backgroundColor: "#0799b6",
                        color: "#fff",
                        fontWeight: 900,
                        borderBottom: "none",
                        py: 1.35,
                        letterSpacing: 0.2,
                      }}
                    >
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

                  // emoji como ya lo tenías (no tocamos lógica)
                  let emoji = "⚪";
                  if (value > 0 && value <= 58) emoji = "🟢";
                  else if (value > 59 && value <= 70) emoji = "🟡";
                  else if (value > 70) emoji = "🔴";

                  return (
                    <TableRow
                      key={index}
                      hover
                      sx={{
                        "&:nth-of-type(odd)": { backgroundColor: alpha("#0f7f86", 0.03) },
                        "&:hover": { backgroundColor: alpha("#0799b6", 0.07) },
                      }}
                    >
                      <TableCell
                        sx={{ cursor: "pointer", fontWeight: 800, color: "#063a52" }}
                        onClick={() =>
                          navigate(
                            client.zona === "IC3"
                              ? `/usuario2/detalleclic3/${client.cuil_cuit}`
                              : `/usuario2/detallecliente/${client.cuil_cuit}`
                          )
                        }
                      >
                        {client.cuil_cuit}
                      </TableCell>

                      <TableCell
                        sx={{ cursor: "pointer", fontWeight: 800 }}
                        onClick={() =>
                          navigate(
                            client.zona === "IC3"
                              ? `/usuario2/detalleclic3/${client.cuil_cuit}`
                              : `/usuario2/detallecliente/${client.cuil_cuit}`
                          )
                        }
                      >
                        {client.Nombre}
                      </TableCell>

                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box sx={{ width: 22, textAlign: "center" }}>
                            <span>{emoji}</span>
                          </Box>

                          <LinearProgress
                            variant="determinate"
                            value={value}
                            sx={{
                              flex: 1,
                              height: 10,
                              borderRadius: 999,
                              backgroundColor: alpha("#0f7f86", 0.12),
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 999,
                                backgroundColor: "#0f7f86",
                              },
                            }}
                          />

                          <Chip
                            size="small"
                            label={value ? `${value}%` : "Sin datos • 0%"}
                            sx={{
                              ml: 1,
                              fontWeight: 900,
                              borderRadius: 999,
                              background: alpha("#0b4f6c", 0.06),
                              border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
                            }}
                          />
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: "rgba(0,0,0,0.72)" }}>
                        {client.razon}
                      </TableCell>

                      <TableCell sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                        {client.ultimaCuota}
                      </TableCell>

                      <TableCell>
                        <Tooltip title="Editar cliente">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              navigate(`/usuario2/modificarcliente/${client.cuil_cuit}`)
                            }
                            sx={{
                              mr: 1,
                              px: 1.6,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 900,
                              backgroundColor: "#0b4f6c",
                              boxShadow: "0 10px 20px rgba(1,86,124,0.18)",
                              "&:hover": { backgroundColor: "#09465f" },
                            }}
                          >
                            Editar
                          </Button>
                        </Tooltip>

                        <Tooltip title="Ver detalle">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              navigate(`/usuario2/detallecliente/${client.cuil_cuit}`)
                            }
                            sx={{
                              px: 1.6,
                              borderRadius: 2,
                              textTransform: "none",
                              fontWeight: 900,
                              backgroundColor: "#0f7f86",
                              boxShadow: "0 10px 20px rgba(20,141,141,0.18)",
                              "&:hover": { backgroundColor: "#0c6b71" },
                            }}
                          >
                            Ver
                          </Button>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

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
              "& .MuiTablePagination-toolbar": { py: 0.75 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontWeight: 700,
                color: "rgba(0,0,0,0.7)",
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default Lotes;
