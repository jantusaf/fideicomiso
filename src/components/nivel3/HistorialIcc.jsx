import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import servicionivel3 from "../../services/nivel3";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Divider,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import QueryStatsIcon from "@mui/icons-material/QueryStats";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
  sxBtnPrimary,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
} from "../nivel2/detalleclienteIngresos/estilos";

const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(0);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const navigate = useNavigate();

  const traer = async () => {
    try {
      const respuesta = await servicionivel3.traerhistorial();
      setHistorial(Array.isArray(respuesta) ? respuesta : respuesta?.data || []);
    } catch (error) {
      console.error("Error al traer historial:", error);
      setHistorial([]);
    }
  };

  useEffect(() => {
    traer();
  }, []);

  // Busca por zona, mes, año o valor ICC.
  const historialFiltrado = historial.filter((item) => {
    const texto = busqueda.toLowerCase();

    return (
      String(item.zona || "").toLowerCase().includes(texto) ||
      String(item.mes || "").toLowerCase().includes(texto) ||
      String(item.anio || "").toLowerCase().includes(texto) ||
      String(item.ICC || "").toLowerCase().includes(texto)
    );
  });

  const inicio = pagina * filasPorPagina;
  const historialPaginado = historialFiltrado.slice(inicio, inicio + filasPorPagina);

  const cambiarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(0);
  };

  const sxTh = {
    backgroundColor: COLOR_BRAND_SOFT,
    color: COLOR_BRAND,
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
              <QueryStatsIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                Historial de ICC
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Índices de ajuste cargados por zona, mes y año
              </Typography>
            </Box>
          </Box>

          <Button variant="contained" onClick={() => navigate("/nivel3/agregaricc")} sx={sxBtnPrimary}>
            Nuevo
          </Button>
        </Box>
      </Paper>

      {/* LISTADO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <TextField
            placeholder="Buscar por zona, mes, año o valor"
            size="small"
            value={busqueda}
            onChange={cambiarBusqueda}
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
        </Box>

        <Divider sx={{ borderColor: COLOR_BORDER }} />

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {["ZONA", "MES", "AÑO", "VALOR ICC"].map((h) => (
                  <TableCell key={h} sx={sxTh}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {historialPaginado.length > 0 ? (
                historialPaginado.map((item, index) => (
                  <TableRow key={item.id || `${item.zona}-${item.mes}-${item.anio}-${index}`} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{item.zona}</TableCell>
                    <TableCell sx={sxTd}>{item.mes}</TableCell>
                    <TableCell sx={sxTd}>{item.anio}</TableCell>
                    <TableCell sx={sxTd}>
                      {item.ICC !== null && item.ICC !== undefined
                        ? Number(item.ICC).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 15, 20]}
          component="div"
          count={historialFiltrado.length}
          rowsPerPage={filasPorPagina}
          page={pagina}
          onPageChange={(e, newPage) => setPagina(newPage)}
          onRowsPerPageChange={(e) => {
            setFilasPorPagina(parseInt(e.target.value, 10));
            setPagina(0);
          }}
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

export default Historial;
