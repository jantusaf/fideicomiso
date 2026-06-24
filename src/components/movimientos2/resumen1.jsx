import React, { useEffect, useMemo, useState } from "react";
import servicionivel3 from "../../services/nivel3";

import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Chip,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
} from "@mui/material";

const formatoNumero = (valor, moneda = "USD") => {
  const numero = Number(valor || 0);

  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: moneda,
    minimumFractionDigits: 2,
  }).format(numero);
};

const formatoFecha = (fecha) => {
  if (!fecha) return "-";

  const fechaObj = new Date(fecha);

  if (Number.isNaN(fechaObj.getTime())) return fecha;

  return fechaObj.toLocaleDateString("es-AR", {
    timeZone: "UTC",
  });
};

export default function TablaVentas() {
  const [ventas, setVentas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
const [manzana, setManzana] = useState("");
const [lote, setLote] = useState("");
const [mes, setMes] = useState("");

const manzanasDisponibles = useMemo(() => {
  return [...new Set(
    ventas
      .map((venta) => venta.manzana)
      .filter(Boolean)
  )].sort((a, b) =>
    String(a).localeCompare(String(b), "es", { numeric: true })
  );
}, [ventas]);

const lotesDisponibles = useMemo(() => {
  return [...new Set(
    ventas
      .filter((venta) => !manzana || venta.manzana === manzana)
      .map((venta) => venta.lote)
      .filter(Boolean)
  )].sort((a, b) =>
    String(a).localeCompare(String(b), "es", { numeric: true })
  );
}, [ventas, manzana]);
const traerVentas = async () => {
  try {
    setLoading(true);

    const res = await servicionivel3.traerventas2({
      manzana,
      lote,
      mes,
      busqueda,
      vendedor:"Remax"
    });

    setVentas(res.data || res || []);
  } catch (error) {
    console.error("Error al traer ventas:", error);
    alert("No se pudieron cargar las ventas");
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const tiempoEspera = setTimeout(() => {
    traerVentas();
  }, 400);

  return () => clearTimeout(tiempoEspera);
}, [manzana, lote, mes, busqueda]);

  const ventasFiltradas = useMemo(() => {
    const texto = busqueda.toLowerCase().trim();

    if (!texto) return ventas;

    return ventas.filter((venta) => {
      return [
        venta.manzana,
        venta.lote,
        venta.tipo,
        venta.comprador,
        venta.estado,
        venta.uso_de_suelo,
        venta.plan,
      ]
        .join(" ")
        .toLowerCase()
        .includes(texto);
    });
  }, [ventas, busqueda]);

  return (
    <Box sx={{ mt: 2 }}>
      {/* CABECERA DE TABLA */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
          mb: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography fontWeight={800} fontSize={20} color="#083b5c">
            Ventas de lotes
          </Typography>

          <Typography color="text.secondary" fontSize={13}>
            Total de registros: {ventasFiltradas.length}
          </Typography>
        </Box>

        <TextField
          size="small"
          placeholder="Buscar por manzana, lote, comprador..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          sx={{
            width: { xs: "100%", sm: 350 },
            background: "#fff",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">🔎</InputAdornment>
            ),
          }}
        />
      </Box>
<Box
  sx={{
    display: "flex",
    gap: 1.5,
    flexWrap: "wrap",
    width: { xs: "100%", md: "auto" },
  }}
>
<TextField
  select
  size="small"
  label="Manzana"
  value={manzana}
  onChange={(e) => {
    setManzana(e.target.value);
    setLote("");
  }}
  sx={{ width: { xs: "100%", sm: 180 } }}
>
  <MenuItem value="">Todas las manzanas</MenuItem>

  {manzanasDisponibles.map((opcion) => (
    <MenuItem key={opcion} value={opcion}>
      {opcion}
    </MenuItem>
  ))}
</TextField>

<TextField
  select
  size="small"
  label="Lote"
  value={lote}
  onChange={(e) => setLote(e.target.value)}
  disabled={!manzana}
  sx={{ width: { xs: "100%", sm: 160 } }}
>
  <MenuItem value="">
    {manzana ? "Todos los lotes" : "Elegí una manzana"}
  </MenuItem>

  {lotesDisponibles.map((opcion) => (
    <MenuItem key={opcion} value={opcion}>
      {opcion}
    </MenuItem>
  ))}
</TextField>

  <TextField
    size="small"
    label="Mes de venta"
    type="month"
    value={mes}
    onChange={(e) => setMes(e.target.value)}
    InputLabelProps={{ shrink: true }}
    sx={{ width: { xs: "100%", sm: 180 } }}
  />

  <TextField
    size="small"
    placeholder="Buscar comprador, estado..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    sx={{ width: { xs: "100%", sm: 280 } }}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">🔎</InputAdornment>
      ),
    }}
  />
</Box>
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
          maxHeight: "70vh",
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              {[
                "Manzana",
                "Lote",
                "Tipo",
                "Fecha",
                "Comprador",
                "Valor",
                "Anticipo",
                "M²",
                "Valor M²",
                "Uso de suelo",
                "Plan",
                "Valor cuota",
                "Cuotas pagadas",
                "Cuotas pendientes",
                "Monto cobrado",
                "Saldo",
                "Estado",
              ].map((titulo) => (
                <TableCell
                  key={titulo}
                  sx={{
                    fontWeight: 800,
                    whiteSpace: "nowrap",
                    background: "#083b5c",
                    color: "#fff",
                    borderBottom: "none",
                  }}
                >
                  {titulo}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={17} align="center" sx={{ py: 5 }}>
                  <CircularProgress size={28} />
                  <Typography sx={{ mt: 1 }}>
                    Cargando ventas...
                  </Typography>
                </TableCell>
              </TableRow>
            ) : ventasFiltradas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={17} align="center" sx={{ py: 5 }}>
                  No se encontraron ventas.
                </TableCell>
              </TableRow>
            ) : (
              ventasFiltradas.map((venta, index) => {
                const cancelado =
                  venta.estado?.toLowerCase() === "cancelado";

                return (
                  <TableRow
                    key={venta.id || index}
                    hover
                    sx={{
                      "&:nth-of-type(even)": {
                        backgroundColor: "#f7fafc",
                      },
                    }}
                  >
                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                      {venta.manzana}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {venta.lote}
                    </TableCell>

                    <TableCell>{venta.tipo}</TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatoFecha(venta.fecha)}
                    </TableCell>

                    <TableCell sx={{ minWidth: 230 }}>
                      {venta.comprador || "-"}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                      {formatoNumero(venta.valor)}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatoNumero(venta.anticipo)}
                    </TableCell>

                    <TableCell>{venta.m2}</TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {formatoNumero(venta.valor_pagado_m2)}
                    </TableCell>

                    <TableCell>{venta.uso_de_suelo}</TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {venta.plan || "-"}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {venta.valor_cuota
                        ? formatoNumero(venta.valor_cuota)
                        : "-"}
                    </TableCell>

                    <TableCell align="center">
                      {venta.cuotas_pagadas || 0}
                    </TableCell>

                    <TableCell align="center">
                      {venta.cuotas_pendientes || 0}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 700 }}>
                      {formatoNumero(venta.monto_cobrado)}
                    </TableCell>

                    <TableCell
                      sx={{
                        whiteSpace: "nowrap",
                        fontWeight: 800,
                        color: Number(venta.saldo) > 0 ? "#d97706" : "#15803d",
                      }}
                    >
                      {formatoNumero(venta.saldo)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={venta.estado || "-"}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          color: cancelado ? "#166534" : "#9a3412",
                          backgroundColor: cancelado ? "#dcfce7" : "#ffedd5",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}