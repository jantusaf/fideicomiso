import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import servicioPagos from "../../../services/pagos";
import ModalEditarPago, { fechaAISO } from "./ModalEditarPago";
import ModalCancelarPago from "./ModalCancelarPago";

const COLOR_TEXT = "#1a303e";
const COLOR_ACCENT = "#0d3a49";

const formatoARS = (n) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(Number(n) || 0);

// AAAA-MM-DD o DD/MM/AAAA -> DD/MM/AAAA (si no se puede interpretar, se muestra tal cual)
const formatoFecha = (texto) => {
  const iso = fechaAISO(texto);
  if (!iso) return texto || "—";
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
};

// Los comprobantes nuevos se guardan en la carpeta pública del backend; los
// más viejos pueden estar en el visor histórico. Se prueba primero la ruta
// directa y, si no está, el visor histórico.
const verComprobante = async (pago) => {
  const base = import.meta.env.VITE_API_URL;
  const url = `${base}/${encodeURIComponent(pago.ubicacion)}`;
  try {
    const r = await fetch(url, { method: "HEAD" });
    const tipo = r.headers.get("content-type") || "";
    if (r.ok && !tipo.includes("text/html")) {
      window.open(url, "_blank");
      return;
    }
  } catch (e) {
    // sigue con el visor histórico
  }
  try {
    const blob = await servicioPagos.traerPdfConstanciadepago(pago.id);
    if (blob && blob.size > 0 && !String(blob.type).includes("html") && !String(blob.type).includes("json")) {
      window.open(URL.createObjectURL(blob), "_blank");
      return;
    }
  } catch (e) {
    // cae al aviso
  }
  alert("No se encontró el archivo del comprobante en el servidor.");
};

export default function DetallesPagos() {
  const params = useParams();
  const idCuota = params.id;

  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const traer = useCallback(async () => {
    setError(null);
    try {
      const data = await servicioPagos.detallesPago({ id: idCuota });
      setPagos(Array.isArray(data) ? [...data].sort((a, b) => b.id - a.id) : []);
    } catch (e) {
      console.error(e);
      setError("No se pudieron cargar los pagos. Revisá la conexión con el servidor.");
    } finally {
      setCargando(false);
    }
  }, [idCuota]);

  useEffect(() => {
    traer();
  }, [traer]);

  const totalPagado = pagos.reduce((acc, p) => acc + (Number(p.monto) || 0), 0);

  return (
    <Box sx={{ width: "100%", maxWidth: 1100, mx: "auto", px: { xs: 0, md: 1 }, pb: 6 }}>
      <Paper
        elevation={0}
        sx={{
          borderRadius: 2.5,
          overflow: "hidden",
          border: "1px solid #e2e6e9",
          boxShadow: "0 10px 30px rgba(15, 34, 48, 0.08)",
        }}
      >
        <Box sx={{ height: 4, backgroundColor: COLOR_TEXT }} />

        {/* Encabezado */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
         
         
          spacing={2}
          sx={{ alignItems: { xs: "flex-start", sm: "center" }, justifyContent: "space-between", p: { xs: 2.5, sm: 3.5 }, pb: 2 }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "rgba(13,58,73,0.08)",
              }}
            >
              <ReceiptLongRoundedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                Pagos de la cuota
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revisá los pagos cargados; podés corregir un monto o cancelar un pago.
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Chip label={`Pagos: ${pagos.length}`} variant="outlined" sx={{ fontWeight: 700 }} />
            <Chip
              label={`Total: ${formatoARS(totalPagado)}`}
              sx={{ fontWeight: 700, bgcolor: "rgba(13,58,73,0.08)", color: COLOR_TEXT }}
            />
          </Stack>
        </Stack>

        {/* Contenido */}
        <Box sx={{ px: { xs: 1.5, sm: 3.5 }, pb: 3.5 }}>
          {cargando ? (
            <Box sx={{ py: 6, textAlign: "center" }}>
              <CircularProgress size={28} />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ borderRadius: 1.5 }}>
              {error}
            </Alert>
          ) : pagos.length === 0 ? (
            <Alert severity="info" sx={{ borderRadius: 1.5 }}>
              Esta cuota todavía no tiene pagos cargados.
            </Alert>
          ) : (
            <TableContainer sx={{ border: "1px solid #e2e6e9", borderRadius: 2 }}>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ "& th": { bgcolor: COLOR_TEXT, color: "#fff", fontWeight: 700, py: 1.4 } }}>
                    <TableCell>Fecha de pago</TableCell>
                    <TableCell>Período</TableCell>
                    <TableCell align="right">Monto</TableCell>
                    <TableCell>Control</TableCell>
                    <TableCell>Comprobante</TableCell>
                    <TableCell align="right">Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {pagos.map((p) => (
                    <TableRow key={p.id} hover sx={{ "& td": { py: 1.4 } }}>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>{formatoFecha(p.fecha)}</TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {String(p.mes).padStart(2, "0")}/{p.anio}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 800, whiteSpace: "nowrap", color: COLOR_TEXT }}>
                        {formatoARS(p.monto)}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: "wrap" }}>
                          {p.monto_distinto === "Si" ? (
                            <Chip size="small" color="warning" variant="outlined" label="No coincide con banco" />
                          ) : (
                            <Chip size="small" color="success" variant="outlined" label="Coincide con banco" />
                          )}
                          {p.monto_inusual === "Si" && (
                            <Chip size="small" color="error" variant="outlined" label="Monto inusual" />
                          )}
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {p.ubicacion ? (
                          <Button
                            size="small"
                            startIcon={<VisibilityRoundedIcon fontSize="small" />}
                            onClick={() => verComprobante(p)}
                            sx={{ textTransform: "none", fontWeight: 700, color: COLOR_ACCENT }}
                          >
                            Ver comprobante
                          </Button>
                        ) : (
                          <Stack direction="row" spacing={0.5} sx={{ alignItems: "center", color: "#b26a00" }}>
                            <ErrorOutlineRoundedIcon fontSize="small" />
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>
                              Sin comprobante
                            </Typography>
                          </Stack>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                          <ModalEditarPago pago={p} onGuardado={traer} />
                          <ModalCancelarPago pago={p} onCancelado={traer} />
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
