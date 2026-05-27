import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Button,
  Paper,
  Stack,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import { useNavigate } from "react-router-dom";

const pickFirstTruthy = (...vals) =>
  vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "");

const moneyARS = (v) =>
  Number(v ?? 0).toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Donut con color dinámico según % pagado */
function DonutPagoVsDeuda({ total = 0, pagado = 0, size = 140, stroke = 18 }) {
  const safeTotal = Math.max(0, Number(total ?? 0));
  const safePagado = Math.max(0, Number(pagado ?? 0));

  const pctPagado = safeTotal > 0 ? Math.min(1, safePagado / safeTotal) : 0;
  const pctNoPagado = 1 - pctPagado;

  // 🎨 Color dinámico del sector "Pagado"
  const paidColor = (() => {
    if (pctPagado > 0.7) return alpha("#2e7d32", 0.9); // verde
    if (pctPagado < 0.3) return alpha("#c62828", 0.85); // rojo
    return alpha("#ed6c02", 0.9); // naranja
  })();

  const paidChipBg = (() => {
    if (pctPagado > 0.7) return alpha("#2e7d32", 0.08);
    if (pctPagado < 0.3) return alpha("#c62828", 0.08);
    return alpha("#ed6c02", 0.1);
  })();

  const paidChipBorder = (() => {
    if (pctPagado > 0.7) return alpha("#2e7d32", 0.22);
    if (pctPagado < 0.3) return alpha("#c62828", 0.22);
    return alpha("#ed6c02", 0.25);
  })();

  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  const paidLen = c * pctPagado;
  const restLen = c - paidLen;

  const rotate = `rotate(-90 ${size / 2} ${size / 2})`;

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <Box sx={{ width: size, height: size, position: "relative" }}>
        <svg width={size} height={size} style={{ display: "block" }}>
          {/* base */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={alpha("#0b4f6c", 0.12)}
            strokeWidth={stroke}
          />

          {/* pagado (color dinámico) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={paidColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${paidLen} ${restLen}`}
            transform={rotate}
          />

          {/* no pagado */}
          {pctNoPagado > 0 && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={alpha("#c62828", 0.55)}
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={`${restLen} ${paidLen}`}
              transform={rotate}
              strokeDashoffset={-paidLen}
            />
          )}
        </svg>

        {/* texto centrado */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            display: "grid",
            placeItems: "center",
            textAlign: "center",
            px: 1,
          }}
        >
          <Typography sx={{ fontWeight: 900, color: "#063a52", lineHeight: 1 }}>
            {Math.round(pctPagado * 100)}%
          </Typography>
          <Typography sx={{ fontSize: 12, color: alpha("#063a52", 0.7) }}>
            Pagado
          </Typography>
        </Box>
      </Box>

      {/* leyenda */}
      <Stack spacing={1} sx={{ minWidth: 0 }}>
        <Chip
          size="small"
          label={`Pagado: ${Math.round(pctPagado * 100)}% (${moneyARS(
            safePagado
          )})`}
          sx={{
            fontWeight: 900,
            backgroundColor: paidChipBg,
            border: `1px solid ${paidChipBorder}`,
          }}
        />
        <Chip
          size="small"
          label={`No pagado: ${Math.round(pctNoPagado * 100)}% (${moneyARS(
            safeTotal - safePagado
          )})`}
          sx={{
            fontWeight: 900,
            backgroundColor: alpha("#c62828", 0.08),
            border: `1px solid ${alpha("#c62828", 0.22)}`,
          }}
        />
        <Chip
          size="small"
          label={`Total devengado: ${moneyARS(safeTotal)}`}
          sx={{ fontWeight: 900, backgroundColor: alpha("#0b4f6c", 0.06) }}
        />
      </Stack>
    </Box>
  );
}

export default function ModalDetalleDeudor({
  open,
  onClose,
  clienteBase, // el "c" de la tabla (deudores)
  getDetalleCliente, // async (cuil) => objeto con fraccion/manzana/lote/parcela
}) {
  const [loading, setLoading] = useState(false);
  const [detalle, setDetalle] = useState(null);

  const navigate = useNavigate();
  const cuil = clienteBase?.cuil_cuit;

  useEffect(() => {
    let alive = true;

    const load = async () => {
      if (!open || !cuil) {
        setDetalle(null);
        return;
      }

      // mostramos base inmediatamente
      setDetalle(clienteBase);

      if (!getDetalleCliente) return;

      try {
        setLoading(true);
        const resp = await getDetalleCliente(cuil);
        const data = resp?.data ?? resp;

        if (!alive) return;

        // merge: lo que venga del detalle pisa lo base
        setDetalle((prev) => ({ ...(prev ?? {}), ...(data ?? {}) }));
      } catch (e) {
        if (!alive) return;
        setDetalle(clienteBase);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();
    return () => {
      alive = false;
    };
  }, [open, cuil, clienteBase, getDetalleCliente]);

  const nombreCompleto = useMemo(() => {
    const n = detalle?.nombre ?? clienteBase?.nombre ?? "";
    const a = detalle?.apellido ?? clienteBase?.apellido ?? "";
    return `${n} ${a}`.trim();
  }, [detalle, clienteBase]);

  const fraccion = pickFirstTruthy(
    detalle?.fraccion,
    detalle?.Fraccion,
    detalle?.frac,
    detalle?.fracc
  );
  const manzana = pickFirstTruthy(
    detalle?.manzana,
    detalle?.Manzana,
    detalle?.mz,
    detalle?.mza
  );
  const parcela = pickFirstTruthy(
    detalle?.parcela,
    detalle?.Parcela,
    detalle?.nro_parcela,
    detalle?.parc
  );
  const lote = pickFirstTruthy(detalle?.lote, detalle?.Lote, detalle?.nro_lote);

  const totalDevengado = Number(
    detalle?.total_devengado ?? clienteBase?.total_devengado ?? 0
  );
  const totalPagado = Number(detalle?.pagado ?? clienteBase?.pagado ?? 0);

  // ✅ IMPORTANTÍSIMO: usa el MISMO criterio/campo que tu tabla (siempre que exista)
  // Si no lo tenés, dejalo en false y lo seteás donde abrís el modal.
  const esIC3 = Boolean(
    clienteBase?.esIC3 ||
      clienteBase?.es_ic3 ||
      (String(clienteBase?.tipo ?? "").toLowerCase() == "ic3") ||
      (String(clienteBase?.zona ?? "").toLowerCase() == "ic3")
  );

  // ✅ Rutas EXACTAS como vos las usás en el resto del sistema (SIN encodeURIComponent)
 const buildDetallePath = () => {
  if (!cuil) return "";
  return esIC3
    ? `/usuario2/detalleclic3/${cuil}`
    : `/usuario2/detallecliente/${cuil}`;
};

const handleIrADetalle = () => {
  const path = buildDetallePath();
  if (!path) return;

  onClose?.();      // ✅ cerrá el modal
  navigate(path);   // ✅ navegá igual que tu tabla
};

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
        },
      }}
    >
      <DialogTitle
        sx={{
          background:
            "linear-gradient(90deg, rgba(10,59,79,0.95) 0%, rgba(11,79,108,0.95) 55%, rgba(15,127,134,0.95) 100%)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          mb: 1,
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ReceiptLongRoundedIcon fontSize="small" />
            <Typography fontWeight={900} sx={{ lineHeight: 1.15 }}>
              Detalle de deuda
            </Typography>
          </Box>
        </Box>

        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.25 }}>
        {/* CARD: Datos cliente */}
        <Paper
          elevation={0}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
            background:
              "linear-gradient(180deg, rgba(15,127,134,0.06) 0%, rgba(255,255,255,0.92) 100%)",
            mb: 2,
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            gap={1.5}
          >
            <Typography
              fontSize={13}
              sx={{ opacity: 0.9, mt: 0.25, minWidth: 0 }}
            >
              {nombreCompleto || "-"} {cuil ? `— ${cuil}` : ""}
            </Typography>

            {/* ✅ BOTÓN QUE LLEVA AL CUADRO DE CUOTAS */}
            <Button
              size="small"
              variant="contained"
              onClick={handleIrADetalle}
              endIcon={<OpenInNewRoundedIcon />}
              sx={{
                borderRadius: 2,
                fontWeight: 900,
                textTransform: "none",
                backgroundColor: "#148D8D",
                boxShadow: "0 10px 26px rgba(0,0,0,0.12)",
                whiteSpace: "nowrap",
                "&:hover": { backgroundColor: "#0f6f6f" },
              }}
            >
              Ver cuadro de cuotas
            </Button>
          </Stack>

          {loading ? (
            <Stack spacing={1} sx={{ mt: 1 }}>
              <Skeleton height={18} />
              <Skeleton height={18} />
            </Stack>
          ) : (
            <>
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1 }}>
                <Chip
                  size="small"
                  label={`Fracción: ${fraccion ?? "-"}`}
                  sx={{ fontWeight: 800 }}
                />
                <Chip
                  size="small"
                  label={`Manzana: ${manzana ?? "-"}`}
                  sx={{ fontWeight: 800 }}
                />
                <Chip
                  size="small"
                  label={`Parcela: ${parcela ?? "-"}`}
                  sx={{ fontWeight: 800 }}
                />
                <Chip
                  size="small"
                  label={`Lote: ${lote ?? "-"}`}
                  sx={{ fontWeight: 800 }}
                />
              </Stack>

              {!fraccion && !manzana && !parcela && !lote && (
                <Typography
                  sx={{
                    mt: 1.25,
                    fontSize: 13,
                    color: alpha("#063a52", 0.75),
                  }}
                >
                  No hay datos del terreno disponibles para este cliente
                  (fracción/manzana/lote/parcela).
                </Typography>
              )}
            </>
          )}
        </Paper>

        {/* CARD: Estado + Donut */}
        <Paper
          elevation={0}
          sx={{
            p: 1.75,
            borderRadius: 2.5,
            border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
            background:
              "linear-gradient(180deg, rgba(10,59,79,0.04) 0%, rgba(20,141,141,0.03) 45%, rgba(255,255,255,0.95) 100%)",
            mb: 2,
          }}
        >
          <Typography fontWeight={900} sx={{ color: "#063a52", mb: 1 }}>
            Estado de cuotas / montos
          </Typography>

          <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
            <Chip
              label={`Liquidadas: ${detalle?.liquidadas ?? clienteBase?.liquidadas ?? "-"}`}
              sx={{ fontWeight: 900, backgroundColor: alpha("#1565c0", 0.08) }}
            />
            <Chip
              label={`Debe: ${detalle?.debe ?? clienteBase?.debe ?? "-"}`}
              sx={{ fontWeight: 900, backgroundColor: alpha("#c62828", 0.08) }}
            />
            <Chip
              label={`Pagadas: ${detalle?.pagadas ?? clienteBase?.pagadas ?? "-"}`}
              sx={{ fontWeight: 900, backgroundColor: alpha("#2e7d32", 0.08) }}
            />
          </Stack>

          {/* ✅ reemplaza listado de cuotas por gráfico */}
          <DonutPagoVsDeuda total={totalDevengado} pagado={totalPagado} />
        </Paper>

        <Divider sx={{ mb: 1.5 }} />

        {/* mini estado */}
        <Stack direction="row" gap={1} flexWrap="wrap">
          {totalDevengado - totalPagado > 0 ? (
            <Chip
              label={`Deuda actual: ${moneyARS(totalDevengado - totalPagado)}`}
              color="error"
              variant="outlined"
              sx={{
                fontWeight: 900,
                borderWidth: 2,
                backgroundColor: alpha("#c62828", 0.06),
              }}
            />
          ) : (
            <Chip label="Sin deuda" color="success" sx={{ fontWeight: 900 }} />
          )}
        </Stack>
      </DialogContent>
    </Dialog>
  );
}