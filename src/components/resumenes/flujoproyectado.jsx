import React from "react";
import { useTemaColores } from "../../context/ModoOscuroContext";
import datos from "./flujoproyectadoData";

import EventNoteIcon from "@mui/icons-material/EventNote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const FONT_FORMAL = "'Helvetica Neue', Helvetica, Arial, sans-serif";

// Mismo formato que el Excel: importes con "$" y 2 decimales; el flujo neto sin "$" ni decimales.
const fmtPesos = (v) =>
  "$" + Number(v).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtEntero = (v) => Number(v).toLocaleString("es-AR", { maximumFractionDigits: 0 });

// Las celdas del Excel pueden ser número, "-" (guion), "—" (error en el Excel) o vacías (null).
const celda = (v, formato) => {
  if (v === null || v === undefined || v === "") return "";
  if (typeof v === "number") return formato(v);
  return v;
};

export const crearEstilos = (c) => ({
  page: { fontFamily: FONT_FORMAL, padding: 18, minHeight: "100vh", boxSizing: "border-box", background: c.BG_PAGE },
  pageHeader: { display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" },
  pageIcon: {
    width: 46, height: 46, borderRadius: 14, display: "flex", alignItems: "center",
    justifyContent: "center", flexShrink: 0, background: "rgba(201,138,62,0.14)", color: "#c98a3e",
  },
  pageTitle: { margin: 0, fontSize: 21, fontWeight: 800, color: c.COLOR_NAVY },
  pageSubtitle: { fontSize: 13, color: c.TEXT_MUTED, marginTop: 2 },
  section: {
    background: c.BG_CARD, borderRadius: 18, marginBottom: 22, boxShadow: c.SHADOW_CARD,
    border: `1px solid ${c.BORDER}`, overflow: "hidden",
  },
  sectionHeader: { display: "flex", alignItems: "center", gap: 12, padding: "18px 22px 14px" },
  sectionIcon: { width: 42, height: 42, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sectionTitle: { margin: 0, fontSize: 17, fontWeight: 700, color: c.TEXT_FUERTE },
  sectionSubtitle: { marginTop: 2, fontSize: 12.5, color: c.TEXT_MUTED, fontWeight: 500 },
  sectionBody: { padding: "0 22px 22px" },
  tablaWrap: { overflowX: "auto", borderRadius: 12, border: `1px solid ${c.BORDER}` },
  tabla: { borderCollapse: "collapse", width: "100%", fontSize: 10.5, fontFamily: FONT_FORMAL },
  th: {
    padding: "7px 5px", fontWeight: 800, fontSize: 10.5, color: c.TEXT_FUERTE, background: c.BG_INPUT,
    borderBottom: `2px solid ${c.COLOR_TEAL}`, whiteSpace: "nowrap", textAlign: "right",
  },
  thConcepto: { textAlign: "left", minWidth: 150, position: "sticky", left: 0, background: c.BG_INPUT },
  td: {
    padding: "5px 5px", textAlign: "right", border: `1px solid ${c.BORDER_INPUT}`,
    color: c.TEXT_FUERTE, whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums",
  },
  tdConcepto: {
    textAlign: "left", fontWeight: 600, whiteSpace: "normal", lineHeight: 1.25,
    position: "sticky", left: 0, background: c.BG_CARD,
  },
  tdTotalCol: { fontWeight: 800 },
  filaTotal: { background: c.BG_INPUT, fontWeight: 800 },
});

export function CabeceraSeccion({ s, icono, color, titulo, subtitulo }) {
  return (
    <div style={s.sectionHeader}>
      <div style={{ ...s.sectionIcon, background: `${color}1f`, color }}>{icono}</div>
      <div>
        <h3 style={s.sectionTitle}>{titulo}</h3>
        {subtitulo ? <div style={s.sectionSubtitle}>{subtitulo}</div> : null}
      </div>
    </div>
  );
}

function TablaConceptoMes({ s, c, meses, filas, filaTotal, colorTotal }) {
  return (
    <div style={s.tablaWrap}>
      <table style={s.tabla}>
        <thead>
          <tr>
            <th style={{ ...s.th, ...s.thConcepto }}>Concepto</th>
            {meses.map((m) => (
              <th key={m} style={s.th}>{m}</th>
            ))}
            <th style={s.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila, i) => (
            <tr key={`${fila.concepto}-${i}`}>
              <td style={{ ...s.td, ...s.tdConcepto }}>{fila.concepto}</td>
              {fila.valores.map((v, j) => (
                <td key={j} style={s.td}>{celda(v, fmtPesos)}</td>
              ))}
              <td style={{ ...s.td, ...s.tdTotalCol }}>{celda(fila.total, fmtPesos)}</td>
            </tr>
          ))}
          <tr style={s.filaTotal}>
            <td style={{ ...s.td, ...s.tdConcepto, ...s.filaTotal }}>{filaTotal.concepto}</td>
            {filaTotal.valores.map((v, j) => (
              <td key={j} style={{ ...s.td, ...s.filaTotal }}>{celda(v, fmtPesos)}</td>
            ))}
            <td style={{ ...s.td, ...s.filaTotal, color: colorTotal }}>{celda(filaTotal.total, fmtPesos)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default function FlujoProyectado() {
  const c = useTemaColores();
  const s = crearEstilos(c);
  const { ingresos, egresos, flujoNeto, meses } = datos;
  const colorNeto = (v) => (typeof v !== "number" || v === 0 ? c.TEXT_FUERTE : v > 0 ? c.COLOR_GREEN : c.COLOR_RED_SUAVE);

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.pageIcon}><EventNoteIcon /></div>
        <div>
          <h2 style={s.pageTitle}>Flujo de Fondos Proyectado</h2>
          <div style={s.pageSubtitle}>{datos.titulo} · {datos.generado} · valores fijos</div>
        </div>
      </div>

      <div style={s.section}>
        <CabeceraSeccion s={s} icono={<TrendingUpIcon />} color={c.COLOR_GREEN} titulo={ingresos.titulo} />
        <div style={s.sectionBody}>
          <TablaConceptoMes s={s} c={c} meses={meses} filas={ingresos.filas} filaTotal={ingresos.total} colorTotal={c.COLOR_GREEN} />
        </div>
      </div>

      <div style={s.section}>
        <CabeceraSeccion s={s} icono={<TrendingDownIcon />} color={c.COLOR_RED} titulo={egresos.titulo} />
        <div style={s.sectionBody}>
          <TablaConceptoMes s={s} c={c} meses={meses} filas={egresos.filas} filaTotal={egresos.total} colorTotal={c.COLOR_RED_SUAVE} />
        </div>
      </div>

      <div style={s.section}>
        <CabeceraSeccion s={s} icono={<AccountBalanceIcon />} color={c.COLOR_TEAL} titulo={flujoNeto.titulo} />
        <div style={s.sectionBody}>
          <div style={s.tablaWrap}>
            <table style={s.tabla}>
              <thead>
                <tr>
                  <th style={{ ...s.th, ...s.thConcepto }}>Concepto</th>
                  {meses.map((m) => (
                    <th key={m} style={s.th}>{m}</th>
                  ))}
                  <th style={s.th}>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ ...s.td, ...s.tdConcepto, fontWeight: 800 }}>{flujoNeto.concepto}</td>
                  {flujoNeto.valores.map((v, j) => (
                    <td key={j} style={{ ...s.td, fontWeight: 700, color: colorNeto(v) }}>{celda(v, fmtEntero)}</td>
                  ))}
                  <td style={{ ...s.td, fontWeight: 800, color: colorNeto(flujoNeto.total) }}>{celda(flujoNeto.total, fmtEntero)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
