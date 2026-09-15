import React, { useEffect, useState } from "react";
import servicioCuotas from "../../services/cuotas";
import { useTemaColores } from "../../context/ModoOscuroContext";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const FONT_FORMAL = "'Helvetica Neue', Helvetica, Arial, sans-serif";

const MESES = [
  "Ene", "Feb", "Mar", "Abr", "May", "Jun",
  "Jul", "Ago", "Sep", "Oct", "Nov", "Dic",
];

const formatoMoneda = (valor) => {
  const n = Number(valor) || 0;
  if (n === 0) return "-";
  return (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("es-AR");
};

const formatoPorcentaje = (valor) => {
  if (valor === null || valor === undefined) return "-";
  return (Number(valor) * 100).toFixed(1) + "%";
};

// Definición de las filas del cuadro: label, key de datos, formateador,
// y un color de fondo suave para diferenciar cada bloque (mismo criterio
// visual que el cuadro de referencia en Excel).
const crearFilas = (c) => [
  { label: "Devengado", key: "devengado", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(79,195,247,0.10)" : "rgba(8,59,92,0.05)" },
  { label: "Total ingresado por pagos", key: "totalIngresadoPorPagos", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(34,197,94,0.16)" : "rgba(21,128,61,0.10)" },
  { label: "Cobrado (Cuotas)", key: "cobradoCuotas", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(34,197,94,0.10)" : "rgba(21,128,61,0.06)" },
  { label: "Cuotas Impagas", key: "cuotasImpagas", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(240,85,74,0.10)" : "rgba(220,38,38,0.05)" },
  { label: "TOTAL MENSUAL", key: "totalMensual", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(79,195,247,0.16)" : "rgba(8,59,92,0.09)", negrita: true },
  { label: "% Cobranza", key: "porcentajeCobranza", formato: formatoPorcentaje, bg: c.MODO === "dark" ? "rgba(224,164,88,0.14)" : "rgba(201,138,62,0.10)" },
  { label: "Diferencia Dev.", key: "diferenciaDev", formato: formatoMoneda, bg: "transparent" },
  { label: "Importe a cuotas del mes", key: "importeACuotasDelMes", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(224,164,88,0.18)" : "rgba(201,138,62,0.14)" },
  { label: "Total ingresado en el mes", key: "totalIngresadoEnElMes", formato: formatoMoneda, bg: c.MODO === "dark" ? "rgba(240,85,74,0.14)" : "rgba(220,38,38,0.09)" },
  { label: "Diferencia", key: "diferencia", formato: formatoMoneda, bg: "transparent" },
];

export default function FlujoPit() {
  const c = useTemaColores();
  const anioActual = new Date().getFullYear();

  const [anio, setAnio] = useState(anioActual);
  const [meses, setMeses] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    servicioCuotas
      .flujoPit(anio)
      .then((data) => {
        if (cancelado) return;
        if (!data || !Array.isArray(data.meses)) {
          setError("No se pudo cargar el flujo de fondos del PIT.");
          setMeses(null);
        } else {
          setMeses(data.meses);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelado) setError("No se pudo cargar el flujo de fondos del PIT.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [anio]);

  const filas = crearFilas(c);

  // Total anual por fila: suma para los montos, recalculado para el %.
  const totalAnual = (fila) => {
    if (!meses) return null;
    if (fila.key === "porcentajeCobranza") {
      const totalDevengado = meses.reduce((acc, m) => acc + (m.devengado || 0), 0);
      const totalCobrado = meses.reduce((acc, m) => acc + (m.cobradoCuotas || 0), 0);
      return totalDevengado > 0 ? totalCobrado / totalDevengado : null;
    }
    return meses.reduce((acc, m) => acc + (m[fila.key] || 0), 0);
  };

  const estilos = {
    contenedor: {
      fontFamily: FONT_FORMAL,
      background: c.BG_PAGE,
      padding: 24,
      minHeight: "100vh",
      boxSizing: "border-box",
    },
    header: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 24,
    },
    headerIzq: {
      display: "flex",
      alignItems: "center",
      gap: 12,
    },
    iconWrap: {
      width: 42,
      height: 42,
      borderRadius: 13,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: c.COLOR_TEAL,
      flexShrink: 0,
    },
    titulo: {
      margin: 0,
      fontSize: 18,
      fontWeight: 700,
      color: c.COLOR_NAVY,
    },
    subtitulo: {
      marginTop: 2,
      fontSize: 12.5,
      color: c.TEXT_MUTED,
      fontWeight: 600,
    },
    selectorAnio: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      background: c.BG_CARD,
      border: `1px solid ${c.BORDER}`,
      borderRadius: 10,
      padding: "6px 10px",
      boxShadow: c.SHADOW_CARD,
    },
    botonAnio: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 26,
      height: 26,
      borderRadius: 8,
      border: "none",
      background: "transparent",
      color: c.COLOR_NAVY,
      cursor: "pointer",
    },
    anioTexto: {
      fontSize: 15,
      fontWeight: 700,
      color: c.TEXT_FUERTE,
      minWidth: 46,
      textAlign: "center",
    },
    card: {
      background: c.BG_CARD,
      borderRadius: 16,
      border: `1px solid ${c.BORDER}`,
      boxShadow: c.SHADOW_CARD,
      overflow: "hidden",
    },
    tablaWrap: {
      overflowX: "auto",
    },
    tabla: {
      borderCollapse: "collapse",
      width: "100%",
      minWidth: 1180,
      fontSize: 11.5,
    },
    thConcepto: {
      textAlign: "left",
      padding: "8px 10px",
      background: c.COLOR_NAVY,
      color: "#fff",
      fontWeight: 700,
      position: "sticky",
      left: 0,
      zIndex: 1,
      whiteSpace: "nowrap",
    },
    th: {
      textAlign: "right",
      padding: "8px 8px",
      background: c.COLOR_NAVY,
      color: "#fff",
      fontWeight: 700,
      whiteSpace: "nowrap",
    },
    thTotal: {
      textAlign: "right",
      padding: "8px 10px",
      background: c.COLOR_TEAL,
      color: "#fff",
      fontWeight: 800,
      whiteSpace: "nowrap",
    },
    tdConcepto: {
      textAlign: "left",
      padding: "7px 10px",
      fontWeight: 700,
      color: c.TEXT_FUERTE,
      position: "sticky",
      left: 0,
      whiteSpace: "nowrap",
      borderBottom: `1px solid ${c.BORDER}`,
    },
    td: {
      textAlign: "right",
      padding: "7px 6px",
      color: c.TEXT_FUERTE,
      borderBottom: `1px solid ${c.BORDER}`,
      whiteSpace: "nowrap",
    },
    tdTotal: {
      textAlign: "right",
      padding: "7px 8px",
      fontWeight: 800,
      color: c.TEXT_FUERTE,
      borderBottom: `1px solid ${c.BORDER}`,
      background: c.MODO === "dark" ? "rgba(32,178,178,0.10)" : "rgba(20,141,141,0.06)",
      whiteSpace: "nowrap",
    },
    mensajeEstado: {
      padding: 40,
      textAlign: "center",
      color: c.TEXT_MUTED,
      fontWeight: 600,
    },
    nota: {
      marginTop: 14,
      fontSize: 11.5,
      color: c.TEXT_MUTED,
      lineHeight: 1.5,
    },
  };

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.header}>
        <div style={estilos.headerIzq}>
          <div style={estilos.iconWrap}>
            <AccountBalanceIcon sx={{ color: "#fff", fontSize: 22 }} />
          </div>
          <div>
            <p style={estilos.titulo}>Flujo de Fondos PIT</p>
            <p style={estilos.subtitulo}>
              Cobranzas de todos los clientes del Parque, agregadas por mes
            </p>
          </div>
        </div>

        <div style={estilos.selectorAnio}>
          <button style={estilos.botonAnio} onClick={() => setAnio((a) => a - 1)} title="Año anterior">
            <ChevronLeftIcon fontSize="small" />
          </button>
          <span style={estilos.anioTexto}>{anio}</span>
          <button style={estilos.botonAnio} onClick={() => setAnio((a) => a + 1)} title="Año siguiente">
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div style={estilos.card}>
        {cargando ? (
          <div style={estilos.mensajeEstado}>Cargando...</div>
        ) : error ? (
          <div style={estilos.mensajeEstado}>{error}</div>
        ) : (
          <div style={estilos.tablaWrap}>
            <table style={estilos.tabla}>
              <thead>
                <tr>
                  <th style={estilos.thConcepto}>CONCEPTO</th>
                  {MESES.map((m) => (
                    <th key={m} style={estilos.th}>{m}</th>
                  ))}
                  <th style={estilos.thTotal}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((fila) => (
                  <tr key={fila.key} style={{ background: fila.bg }}>
                    <td style={estilos.tdConcepto}>{fila.label}</td>
                    {meses.map((m) => (
                      <td
                        key={m.mes}
                        style={{
                          ...estilos.td,
                          fontWeight: fila.negrita ? 800 : 600,
                        }}
                      >
                        {fila.formato(m[fila.key])}
                      </td>
                    ))}
                    <td style={estilos.tdTotal}>{fila.formato(totalAnual(fila))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
