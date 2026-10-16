import { useState, useEffect, useMemo } from "react";
import servicioClientes from "../../../services/clientes";
import CargaDeTabla from "../../CargaDeTabla";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Divider,
  TextField,
  InputAdornment,
  Button,
  Tooltip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletRoundedIcon from "@mui/icons-material/AccountBalanceWalletRounded";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_OK,
  COLOR_ERROR,
  sxCard,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
  COLOR_BRAND_WARM,
  sxBtnBrand,
} from "../detalleclienteIngresos/estilos";

const MESES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

const moneda = (v) =>
  Number(v || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

const mesAnio = (f) => (f ? `${MESES[f.mes - 1]} ${f.anio}` : "—");
const fechaPago = (f) => (f ? `${String(f.dia || 1).padStart(2, "0")}/${String(f.mes).padStart(2, "0")}/${f.anio}` : "Sin pagos");

const normalizar = (s) =>
  String(s ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, " ")
    .trim();

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

const sxTd = {
  fontSize: 13.5,
  color: COLOR_TEXT,
  borderBottom: "1px solid #eef1f3",
  py: 1.1,
};

// Columnas del listado: clave para ordenar, título y si se alinea a la derecha.
const COLUMNAS = [
  { key: "cuil_cuit", label: "CUIL/CUIT" },
  { key: "nombre", label: "CLIENTE" },
  { key: "cuotasAdeudadas", label: "CUOTAS ADEUDADAS", derecha: true },
  { key: "impagaDesde", label: "IMPAGA DESDE" },
  { key: "ultimoPago", label: "ÚLTIMO PAGO" },
  { key: "devengado", label: "DEVENGADO", derecha: true },
  { key: "pagado", label: "PAGADO", derecha: true },
  { key: "deudaVencida", label: "DEUDA VENCIDA", derecha: true },
  { key: "deudaMesEnCurso", label: "MES EN CURSO", derecha: true },
  { key: "deudaTotal", label: "DEUDA TOTAL", derecha: true },
];

const valorOrden = (c, key) => {
  if (key === "impagaDesde") return c.impagaDesde ? c.impagaDesde.anio * 100 + c.impagaDesde.mes : 0;
  if (key === "ultimoPago") return c.ultimoPago ? c.ultimoPago.anio * 10000 + c.ultimoPago.mes * 100 + (c.ultimoPago.dia || 1) : 0;
  return c[key];
};

function Indicador({ titulo, valor, detalle, color, grande }) {
  return (
    <Paper
      elevation={0}
      sx={{
        ...sxCard,
        p: 2.5,
        flex: grande ? "1.4 1 300px" : "1 1 220px",
        borderTop: `3px solid ${color}`,
      }}
    >
      <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: COLOR_MUTED, letterSpacing: 0.3 }}>{titulo}</Typography>
      <Typography sx={{ fontSize: grande ? 30 : 22, fontWeight: 800, color: COLOR_TEXT, my: 0.5, lineHeight: 1.15 }}>
        {valor}
      </Typography>
      <Typography sx={{ fontSize: 12.5, color: COLOR_MUTED }}>{detalle}</Typography>
    </Paper>
  );
}

const DeudoresParque = () => {
  const [datos, setDatos] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [orden, setOrden] = useState({ key: "deudaTotal", dir: "desc" });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelado = false;
    servicioClientes
      .deudoresParque()
      .then((data) => {
        if (cancelado) return;
        if (!data || !Array.isArray(data.clientes)) setError("No se pudo cargar el listado de deudores del Parque.");
        else setDatos(data);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelado) setError("No se pudo cargar el listado de deudores del Parque.");
      })
      .finally(() => {
        if (!cancelado) setLoading(false);
      });
    return () => {
      cancelado = true;
    };
  }, []);

  const filtrados = useMemo(() => {
    if (!datos) return [];
    const q = normalizar(search);
    const digitos = search.replace(/\D/g, "");
    const lista = datos.clientes.filter((c) => {
      if (!q) return true;
      if (digitos.length > 0 && c.cuil_cuit.replace(/\D/g, "").includes(digitos)) return true;
      const texto = normalizar(`${c.nombre} ${c.tipo}`);
      return q.split(" ").every((t) => texto.includes(t));
    });
    const signo = orden.dir === "asc" ? 1 : -1;
    return [...lista].sort((a, b) => {
      const va = valorOrden(a, orden.key);
      const vb = valorOrden(b, orden.key);
      if (typeof va === "string" || typeof vb === "string") return signo * String(va).localeCompare(String(vb), "es");
      return signo * ((va || 0) - (vb || 0));
    });
  }, [datos, search, orden]);

  const cambiarOrden = (key) => {
    setOrden((o) => (o.key === key ? { key, dir: o.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
    setPage(0);
  };

  if (loading) return <CargaDeTabla />;

  if (error || !datos) {
    return (
      <Box sx={{ maxWidth: 1320, mx: "auto", pt: 4, textAlign: "center", color: COLOR_MUTED }}>
        {error || "Sin datos."}
      </Box>
    );
  }

  const { resumen } = datos;
  const pctVencida = resumen.deudaTotal > 0 ? Math.round((resumen.deudaVencida / resumen.deudaTotal) * 100) : 0;
  const pctDeudores = resumen.clientesVigentes > 0 ? Math.round((resumen.clientesDeudores / resumen.clientesVigentes) * 100) : 0;
  const mesActual = `${MESES[resumen.mesActual.mes - 1]} ${resumen.mesActual.anio}`;

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
              <AccountBalanceWalletRoundedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Deudores del Parque
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Clientes habilitados con cuotas vigentes que deben {resumen.umbralCuotas} o más cuotas completas ({resumen.umbralCuotas - 1} vencidas + la del mes en curso). Las cuotas se cuentan por mes: los cuadros de un mismo cliente se suman · deuda neta por cliente
              </Typography>
            </Box>
          </Box>

          <Chip
            variant="outlined"
            label={`Calculado a ${mesActual}`}
            sx={{ fontWeight: 600, color: COLOR_BRAND_WARM, borderColor: COLOR_BRAND_WARM }}
          />
        </Box>
      </Paper>

      {/* TABLERO */}
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2.5 }}>
        <Indicador
          grande
          titulo="DEUDA TOTAL"
          valor={moneda(resumen.deudaTotal)}
          detalle={`${resumen.clientesDeudores} clientes con ${resumen.umbralCuotas}+ cuotas completas adeudadas`}
          color={COLOR_ERROR}
        />
        <Indicador
          titulo="DEUDA VENCIDA"
          valor={moneda(resumen.deudaVencida)}
          detalle={`${pctVencida}% de la deuda · meses anteriores a ${mesActual}`}
          color={COLOR_BRAND_WARM}
        />
        <Indicador
          titulo="CUOTA DEL MES EN CURSO"
          valor={moneda(resumen.deudaMesEnCurso)}
          detalle={`Aún no vencida · ${mesActual}`}
          color={COLOR_ACCENT}
        />
        <Indicador
          titulo="CLIENTES DEUDORES"
          valor={`${resumen.clientesDeudores} de ${resumen.clientesVigentes}`}
          detalle={`${pctDeudores}% de los vigentes · ${resumen.clientesSaldoAFavor} con saldo a favor`}
          color={COLOR_OK}
        />
        <Indicador
          titulo="EN SEGUIMIENTO"
          valor={moneda(resumen.deudaEnSeguimiento)}
          detalle={`${resumen.clientesEnSeguimiento} clientes con deuda de menos de ${resumen.umbralCuotas} cuotas completas (no figuran como deudores)`}
          color={COLOR_MUTED}
        />
      </Box>

      {/* LISTADO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <TextField
            placeholder="Buscar por CUIL/CUIT o nombre"
            size="small"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(0);
            }}
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

        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {COLUMNAS.map((col) => (
                  <TableCell key={col.key} align={col.derecha ? "right" : "left"} sx={sxTh}>
                    <TableSortLabel
                      active={orden.key === col.key}
                      direction={orden.key === col.key ? orden.dir : "desc"}
                      onClick={() => cambiarOrden(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell sx={sxTh}>DETALLE</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtrados.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
                <TableRow key={c.cuil_cuit} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell
                    sx={{ ...sxTd, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                    onClick={() => navigate(`/usuario2/detallecliente/${c.cuil_cuit}`)}
                  >
                    {c.cuil_cuit}
                  </TableCell>

                  <TableCell sx={{ ...sxTd, fontWeight: 600 }}>
                    {c.nombre}
                    {c.cuadros > 1 ? (
                      <Chip size="small" variant="outlined" label={`${c.cuadros} cuadros`} sx={{ ml: 1, height: 20, fontSize: 11 }} />
                    ) : null}
                  </TableCell>

                  <TableCell align="right" sx={{ ...sxTd, fontWeight: 600, color: COLOR_ERROR, whiteSpace: "nowrap" }}>
                    {c.cuotasAdeudadas}
                    {c.cuotaParcial >= 0.05 ? (
                      <Tooltip title="Además debe una parte de otra cuota">
                        <span style={{ fontWeight: 500, color: COLOR_MUTED, marginLeft: 4 }}>
                          +{c.cuotaParcial.toLocaleString("es-AR", { maximumFractionDigits: 2 })}
                        </span>
                      </Tooltip>
                    ) : null}
                  </TableCell>

                  <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{mesAnio(c.impagaDesde)}</TableCell>

                  <TableCell sx={{ ...sxTd, whiteSpace: "nowrap", color: c.ultimoPago ? COLOR_TEXT : COLOR_MUTED }}>
                    {fechaPago(c.ultimoPago)}
                  </TableCell>

                  <TableCell align="right" sx={{ ...sxTd, whiteSpace: "nowrap" }}>{moneda(c.devengado)}</TableCell>
                  <TableCell align="right" sx={{ ...sxTd, whiteSpace: "nowrap" }}>{moneda(c.pagado)}</TableCell>
                  <TableCell align="right" sx={{ ...sxTd, whiteSpace: "nowrap", fontWeight: 600 }}>
                    {moneda(c.deudaVencida)}
                  </TableCell>
                  <TableCell align="right" sx={{ ...sxTd, whiteSpace: "nowrap", color: COLOR_MUTED }}>
                    {moneda(c.deudaMesEnCurso)}
                  </TableCell>
                  <TableCell align="right" sx={{ ...sxTd, whiteSpace: "nowrap", fontWeight: 700 }}>
                    {moneda(c.deudaTotal)}
                  </TableCell>

                  <TableCell sx={sxTd}>
                    <Tooltip title="Ver detalle y cuadro de cuotas">
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => navigate(`/usuario2/detallecliente/${c.cuil_cuit}`)}
                        sx={{ ...sxBtnBrand, minWidth: 64, px: 1.5 }}
                      >
                        Ver
                      </Button>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}

              {filtrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={COLUMNAS.length + 1} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                    No se encontraron deudores con ese criterio.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 20, 50]}
          component="div"
          count={filtrados.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, n) => setPage(n)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
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

export default DeudoresParque;
