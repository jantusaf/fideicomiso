import React, { useEffect, useState } from "react";
import servicioCuotas from "../../services/cuotas";
import { useTemaColores } from "../../context/ModoOscuroContext";
import datos from "./flujoproyectadoData";
import { crearEstilos, CabeceraSeccion } from "./flujoproyectado";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import PaidIcon from "@mui/icons-material/Paid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const fmt = (v) => "$" + Math.round(Math.abs(v)).toLocaleString("es-AR");
const fmtMoneda = (v) => (v === null || v === undefined ? "" : (v < 0 && Math.round(v) !== 0 ? "-" : "") + fmt(v));
const fmtPct = (v) => (v === null || v === undefined ? "" : (v * 100).toFixed(1) + "%");

// Filas de cada bloque. `total` define cómo se resume el año:
//  - "suma": flujo del mes (se suman los meses ya devengados)
//  - "ultimo": acumulados y saldos (valor del último mes disponible)
//  - "ratio": porcentaje recalculado con las sumas del año
const FILAS_VERDE = [
  { concepto: "Deuda inicial (años anteriores)", key: "deudaInicial", total: "ultimo", destacada: true },
  { concepto: "Devengado", key: "devengado", total: "suma" },
  { concepto: "Devengado acumulado", key: "devengadoAcumulado", total: "ultimo" },
  { concepto: "Cobrado (cuotas)", key: "cobradoCuotas", total: "suma" },
  { concepto: "Cobrado cuotas acumulado", key: "cobradoAcumulado", total: "ultimo" },
  { concepto: "Monto no cobrado (créditos a favor en el período)", key: "noCobrado", total: "suma", destacada: true },
  { concepto: "Monto no cobrado acumulado (incobrables acumulados)", key: "noCobradoAcumulado", total: "ultimo", destacada: true },
  { concepto: "% Incobrabilidad del período (mes)", key: "incobrabilidadMes", total: "ratio", ratio: ["noCobrado", "devengado"], pct: true },
  { concepto: "% Incobrabilidad acumulada", key: "incobrabilidadAcumulada", total: "ultimo", pct: true },
];

const FILAS_NARANJA = [
  { concepto: "Monto neto inicial (años anteriores)", key: "netoInicial", total: "ultimo", destacada: true },
  { concepto: "Total ingresado por cobranzas (mes)", key: "totalIngresado", total: "suma" },
  { concepto: "Total ingresado por cobranzas acumulado", key: "totalIngresadoAcumulado", total: "ultimo" },
  { concepto: "Pagos a cuenta (mes)", key: "pagosACuenta", total: "suma" },
  { concepto: "Pagos a cuenta (saldo al cierre)", key: "pagosACuentaAcumulados", total: "ultimo" },
  { concepto: "Monto NETO a cobrar al cierre del período", key: "netoACobrar", total: "ultimo", destacada: true },
  { concepto: "% Incobrabilidad neta", key: "incobrabilidadNeta", total: "ultimo", pct: true },
];

export default function FlujoDeudores() {
  const c = useTemaColores();
  const s = crearEstilos(c);

  const [anio, setAnio] = useState(new Date().getFullYear());
  const [meses, setMeses] = useState(null);
  const [ultimoMes, setUltimoMes] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    setCargando(true);
    setError(null);

    servicioCuotas
      .flujoDeudores(anio)
      .then((data) => {
        if (cancelado) return;
        if (!data || !Array.isArray(data.meses)) {
          setError("No se pudo cargar el flujo de fondos de deudores.");
          setMeses(null);
        } else {
          setMeses(data.meses);
          setUltimoMes(data.ultimoMes || null);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!cancelado) setError("No se pudo cargar el flujo de fondos de deudores.");
      })
      .finally(() => {
        if (!cancelado) setCargando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [anio]);

  const disponibles = meses ? meses.filter((m) => m.disponible) : [];
  const hayDatos = disponibles.length > 0;
  const ultimo = hayDatos ? disponibles[disponibles.length - 1] : null;

  const totalFila = (fila) => {
    if (!hayDatos) return null;
    if (fila.total === "ultimo") return ultimo[fila.key];
    if (fila.total === "ratio") {
      const [num, den] = fila.ratio;
      const d = disponibles.reduce((a, m) => a + (m[den] || 0), 0);
      const n = disponibles.reduce((a, m) => a + (m[num] || 0), 0);
      return d > 0 ? n / d : null;
    }
    return disponibles.reduce((a, m) => a + (m[fila.key] || 0), 0);
  };

  const tablaBloque = (filas) => (
    <div style={s.tablaWrap}>
      <table style={s.tabla}>
        <thead>
          <tr>
            <th style={{ ...s.th, ...s.thConcepto, minWidth: 260 }}>Concepto</th>
            {datos.meses.map((m) => (
              <th key={m} style={s.th}>{m}</th>
            ))}
            <th style={s.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => {
            const f = fila.pct ? fmtPct : fmtMoneda;
            const extra = fila.destacada ? s.filaTotal : {};
            return (
              <tr key={fila.key} style={fila.destacada ? s.filaTotal : undefined}>
                <td style={{ ...s.td, ...s.tdConcepto, ...extra }}>{fila.concepto}</td>
                {meses.map((m) => (
                  <td key={m.mes} style={{ ...s.td, ...extra }}>
                    {m.disponible ? f(m[fila.key]) : ""}
                  </td>
                ))}
                <td style={{ ...s.td, ...s.tdTotalCol, ...extra }}>{f(totalFila(fila))}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const tarjeta = ({ titulo, valor, detalle, color }) => (
    <div style={{ ...s.section, marginBottom: 0, padding: "14px 18px", flex: "1 1 260px" }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: c.TEXT_MUTED }}>{titulo}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: c.TEXT_FUERTE, margin: "4px 0 6px" }}>{valor}</div>
      <div style={{ fontSize: 12, color: c.TEXT_MUTED }}>{detalle}</div>
      <div style={{ height: 3, borderRadius: 3, background: color, marginTop: 10, opacity: 0.7 }} />
    </div>
  );

  const hastaTxt = ultimoMes ? `${MESES_LARGOS[ultimoMes.mes - 1]} ${ultimoMes.anio}` : null;

  const selectorAnio = {
    marginLeft: "auto",
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: c.BG_CARD,
    border: `1px solid ${c.BORDER}`,
    borderRadius: 10,
    padding: "6px 10px",
    boxShadow: c.SHADOW_CARD,
  };
  const botonAnio = {
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
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.pageIcon}><AccountBalanceIcon /></div>
        <div>
          <h2 style={s.pageTitle}>Flujo de Fondos de Deudores</h2>
          <div style={s.pageSubtitle}>
            Deuda de los clientes habilitados del Parque, medida en plata
            {hastaTxt ? ` · devengado hasta ${hastaTxt} (último mes con ICC aplicado)` : ""}
          </div>
        </div>

        <div style={selectorAnio}>
          <button style={botonAnio} onClick={() => setAnio((a) => a - 1)} title="Año anterior">
            <ChevronLeftIcon fontSize="small" />
          </button>
          <span style={{ fontSize: 15, fontWeight: 700, color: c.TEXT_FUERTE, minWidth: 46, textAlign: "center" }}>{anio}</span>
          <button style={botonAnio} onClick={() => setAnio((a) => a + 1)} title="Año siguiente">
            <ChevronRightIcon fontSize="small" />
          </button>
        </div>
      </div>

      {cargando ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.TEXT_MUTED }}>Cargando…</div></div>
      ) : error ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.COLOR_RED }}>{error}</div></div>
      ) : !hayDatos ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.TEXT_MUTED }}>No hay cuotas devengadas en {anio}.</div></div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            {tarjeta({
              titulo: "Deuda acumulada (sin excedentes)",
              valor: fmtMoneda(ultimo.noCobradoAcumulado),
              detalle: `${fmtPct(ultimo.incobrabilidadAcumulada)} del devengado histórico`,
              color: c.COLOR_RED,
            })}
            {tarjeta({
              titulo: "Pagos a cuenta acumulados",
              valor: fmtMoneda(ultimo.pagosACuentaAcumulados),
              detalle: "Excedentes de clientes que pagaron de más",
              color: c.COLOR_GREEN,
            })}
            {tarjeta({
              titulo: "Monto neto a cobrar",
              valor: fmtMoneda(ultimo.netoACobrar),
              detalle: `${fmtPct(ultimo.incobrabilidadNeta)} del devengado histórico`,
              color: c.COLOR_TEAL,
            })}
          </div>

          <div style={s.section}>
            <CabeceraSeccion
              s={s}
              icono={<TrendingDownIcon />}
              color={c.COLOR_GREEN}
              titulo="Cobranza de cuotas (sin excedentes)"
              subtitulo="Los pagos de cada cliente se aplican a sus cuotas más viejas primero, con tope en el valor de cada cuota (el excedente no cuenta). Los acumulados arrancan en enero y suman la deuda inicial"
            />
            <div style={s.sectionBody}>
              {tablaBloque(FILAS_VERDE)}
            </div>
          </div>

          <div style={s.section}>
            <CabeceraSeccion
              s={s}
              icono={<PaidIcon />}
              color="#e0a458"
              titulo="Ingresos totales (con excedentes)"
              subtitulo="Todo lo ingresado por fecha de pago, incluidos los pagos a cuenta. Los acumulados arrancan en enero y parten del monto neto inicial"
            />
            <div style={s.sectionBody}>
              {tablaBloque(FILAS_NARANJA)}
              <div style={{ marginTop: 12, fontSize: 11.5, color: c.TEXT_MUTED, lineHeight: 1.5 }}>
                La columna Total suma los flujos del año y toma el último mes devengado para saldos, acumulados y porcentajes. Los porcentajes acumulados se miden contra todo lo devengado desde el inicio. La deuda inicial se actualiza con los pagos posteriores (estado actual de cada cuota).
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
