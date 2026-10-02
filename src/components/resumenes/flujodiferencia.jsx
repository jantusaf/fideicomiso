import React, { useEffect, useMemo, useState } from "react";
import servicionivel3 from "../../services/nivel3";
import { useTemaColores } from "../../context/ModoOscuroContext";
import { parseFechaCorta } from "./movimientosUtils";
import datos from "./flujoproyectadoData";
import { crearEstilos, CabeceraSeccion } from "./flujoproyectado";

import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

const ANIO = "2026";
const MESES_LARGOS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

// Convención de signo: positivo = a favor, negativo = en contra.
//  - Ingresos: real - proyectado (entró más de lo previsto => positivo).
//  - Egresos: proyectado - real (se gastó menos de lo previsto => positivo).
//  - Flujo neto: (ingresos reales - egresos reales) - flujo neto proyectado.

const num = (v) => (typeof v === "number" ? v : 0);
const clave = (t) =>
  String(t || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// Mismo criterio que el Ingresos/Egresos real: ingresos = movimientos con crédito > 0,
// egresos = movimientos con débito > 0, sumados por concepto y por mes del año.
const pivoteReal = (movimientos, campoMonto) => {
  const mapa = {};
  movimientos
    .filter((m) => Number(m[campoMonto]) > 0)
    .forEach((m) => {
      const f = parseFechaCorta(m.fecha);
      if (f.anio !== ANIO) return;
      const mesIdx = Number(f.mes) - 1;
      if (Number.isNaN(mesIdx) || mesIdx < 0 || mesIdx > 11) return;
      const concepto = m.concepto || "Sin concepto";
      const k = clave(concepto);
      if (!mapa[k]) mapa[k] = { concepto, valores: Array(12).fill(0) };
      mapa[k].valores[mesIdx] += Number(m[campoMonto] || 0);
    });
  return mapa;
};

// Une los conceptos del proyectado (en su orden) con los que solo existen en el real.
// `hasta` = último mes (0-11) con datos reales: los meses posteriores no se comparan.
const construirDiferencia = (filasProyectado, mapaReal, hasta, signo) => {
  const usados = new Set();
  const filas = filasProyectado.map((fp) => {
    const k = clave(fp.concepto);
    usados.add(k);
    const real = mapaReal[k]?.valores || Array(12).fill(0);
    return { concepto: fp.concepto, proy: fp.valores.map(num), real };
  });
  Object.entries(mapaReal).forEach(([k, r]) => {
    if (!usados.has(k)) filas.push({ concepto: r.concepto, proy: Array(12).fill(0), real: r.valores, soloReal: true });
  });

  return filas.map((f) => {
    const dif = f.real.map((r, i) => (i <= hasta ? signo * (r - f.proy[i]) : null));
    const total = dif.reduce((a, b) => a + (b || 0), 0);
    const realTot = f.real.reduce((a, r, i) => a + (i <= hasta ? r : 0), 0);
    const proyTot = f.proy.reduce((a, p, i) => a + (i <= hasta ? p : 0), 0);
    return { concepto: f.concepto, soloReal: f.soloReal, dif, total, realTot, proyTot };
  });
};

const sumarColumnas = (filas) =>
  Array.from({ length: 12 }, (_, i) =>
    filas.some((f) => f.dif[i] !== null) ? filas.reduce((a, f) => a + (f.dif[i] || 0), 0) : null
  );

export default function FlujoDiferencia() {
  const c = useTemaColores();
  const s = crearEstilos(c);
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    (async () => {
      try {
        const resp = await servicionivel3.traermovimientos();
        if (!cancelado) setMovimientos(Array.isArray(resp) ? resp : []);
      } catch (e) {
        console.error(e);
        if (!cancelado) setError("No se pudieron cargar los movimientos reales.");
      } finally {
        if (!cancelado) setCargando(false);
      }
    })();
    return () => {
      cancelado = true;
    };
  }, []);

  const calculo = useMemo(() => {
    const realIng = pivoteReal(movimientos, "credito");
    const realEgr = pivoteReal(movimientos, "debito");

    let hasta = -1;
    [realIng, realEgr].forEach((mapa) =>
      Object.values(mapa).forEach((r) =>
        r.valores.forEach((v, i) => {
          if (v > 0 && i > hasta) hasta = i;
        })
      )
    );

    const ingresos = construirDiferencia(datos.ingresos.filas, realIng, hasta, 1);
    const egresos = construirDiferencia(datos.egresos.filas, realEgr, hasta, -1);

    const difIng = sumarColumnas(ingresos);
    const difEgr = sumarColumnas(egresos);

    const sumaReal = (mapa, i) => Object.values(mapa).reduce((a, r) => a + r.valores[i], 0);
    const netoReal = Array.from({ length: 12 }, (_, i) => (i <= hasta ? sumaReal(realIng, i) - sumaReal(realEgr, i) : null));
    const netoProy = datos.flujoNeto.valores.map((v) => num(v));
    const netoDif = netoReal.map((r, i) => (r === null ? null : r - netoProy[i]));
    const sum = (arr) => arr.reduce((a, v) => a + (v || 0), 0);

    return {
      hasta,
      ingresos,
      egresos,
      difIng,
      difEgr,
      netoReal,
      netoProy,
      netoDif,
      resumen: {
        ingresos: { real: sum(ingresos.map((f) => f.realTot)), proy: sum(ingresos.map((f) => f.proyTot)) },
        egresos: { real: sum(egresos.map((f) => f.realTot)), proy: sum(egresos.map((f) => f.proyTot)) },
        neto: { real: sum(netoReal), proy: sum(netoProy.filter((_, i) => i <= hasta)) },
      },
    };
  }, [movimientos]);

  const fmt = (v) => "$" + Math.abs(v).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const fmtDif = (v) => (v === null || v === undefined ? "" : (v < 0 ? "-" : v > 0 ? "+" : "") + fmt(v));
  const colorDif = (v) => (v === null || Math.abs(v) < 0.005 ? c.TEXT_MUTED : v > 0 ? c.COLOR_GREEN : c.COLOR_RED_SUAVE);
  const hastaTxt = calculo.hasta >= 0 ? MESES_LARGOS[calculo.hasta] : null;

  const TablaDif = ({ filas, totales, etiquetaTotal }) => (
    <div style={s.tablaWrap}>
      <table style={s.tabla}>
        <thead>
          <tr>
            <th style={{ ...s.th, ...s.thConcepto }}>Concepto</th>
            {datos.meses.map((m) => (
              <th key={m} style={s.th}>{m}</th>
            ))}
            <th style={s.th}>Total</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((f, i) => (
            <tr key={`${f.concepto}-${i}`}>
              <td style={{ ...s.td, ...s.tdConcepto }}>
                {f.concepto}
                {f.soloReal ? <span style={{ color: c.TEXT_MUTED, fontWeight: 400 }}> (no proyectado)</span> : null}
              </td>
              {f.dif.map((v, j) => (
                <td key={j} style={{ ...s.td, color: colorDif(v) }}>{fmtDif(v)}</td>
              ))}
              <td style={{ ...s.td, ...s.tdTotalCol, color: colorDif(f.total) }}>{fmtDif(f.total)}</td>
            </tr>
          ))}
          <tr style={s.filaTotal}>
            <td style={{ ...s.td, ...s.tdConcepto, ...s.filaTotal }}>{etiquetaTotal}</td>
            {totales.map((v, j) => (
              <td key={j} style={{ ...s.td, ...s.filaTotal, color: colorDif(v) }}>{fmtDif(v)}</td>
            ))}
            <td style={{ ...s.td, ...s.filaTotal, color: colorDif(totales.reduce((a, v) => a + (v || 0), 0)) }}>
              {fmtDif(totales.reduce((a, v) => a + (v || 0), 0))}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  const Tarjeta = ({ titulo, real, proy, color }) => {
    const dif = real - proy;
    return (
      <div style={{ ...s.section, marginBottom: 0, padding: "14px 18px", flex: "1 1 260px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: c.TEXT_MUTED }}>{titulo}</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: colorDif(dif), margin: "4px 0 6px" }}>{fmtDif(dif)}</div>
        <div style={{ fontSize: 12, color: c.TEXT_MUTED }}>
          Real {(real < 0 ? "-" : "") + fmt(real)} · Proyectado {(proy < 0 ? "-" : "") + fmt(proy)}
        </div>
        <div style={{ height: 3, borderRadius: 3, background: color, marginTop: 10, opacity: 0.7 }} />
      </div>
    );
  };

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.pageIcon}><CompareArrowsIcon /></div>
        <div>
          <h2 style={s.pageTitle}>Flujo de Fondos Diferencia</h2>
          <div style={s.pageSubtitle}>
            Contraste entre el flujo real (movimientos cargados) y el proyectado · {ANIO}
            {hastaTxt ? ` · comparado hasta ${hastaTxt} (el mes en curso puede estar incompleto)` : ""}
          </div>
        </div>
      </div>

      {cargando ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.TEXT_MUTED }}>Cargando movimientos…</div></div>
      ) : error ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.COLOR_RED }}>{error}</div></div>
      ) : calculo.hasta < 0 ? (
        <div style={s.section}><div style={{ padding: 28, textAlign: "center", color: c.TEXT_MUTED }}>No hay movimientos cargados en {ANIO} para comparar.</div></div>
      ) : (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            <Tarjeta titulo="Ingresos (real − proyectado)" real={calculo.resumen.ingresos.real} proy={calculo.resumen.ingresos.proy} color={c.COLOR_GREEN} />
            <Tarjeta titulo="Egresos (proyectado − real)" real={calculo.resumen.egresos.real} proy={calculo.resumen.egresos.proy}
              color={c.COLOR_RED} />
            <Tarjeta titulo="Flujo neto (real − proyectado)" real={calculo.resumen.neto.real} proy={calculo.resumen.neto.proy} color={c.COLOR_TEAL} />
          </div>

          <div style={s.section}>
            <CabeceraSeccion s={s} icono={<TrendingUpIcon />} color={c.COLOR_GREEN} titulo="Ingresos: real − proyectado" subtitulo="Positivo = entró más de lo proyectado" />
            <div style={s.sectionBody}>
              <TablaDif filas={calculo.ingresos} totales={calculo.difIng} etiquetaTotal="Total diferencia ingresos" />
            </div>
          </div>

          <div style={s.section}>
            <CabeceraSeccion s={s} icono={<TrendingDownIcon />} color={c.COLOR_RED} titulo="Egresos: proyectado − real" subtitulo="Positivo = se gastó menos de lo proyectado" />
            <div style={s.sectionBody}>
              <TablaDif filas={calculo.egresos} totales={calculo.difEgr} etiquetaTotal="Total diferencia egresos" />
            </div>
          </div>

          <div style={s.section}>
            <CabeceraSeccion s={s} icono={<AccountBalanceIcon />} color={c.COLOR_TEAL} titulo="Flujo neto: real − proyectado" subtitulo="Ingresos reales − egresos reales, contra el flujo neto proyectado" />
            <div style={s.sectionBody}>
              <div style={s.tablaWrap}>
                <table style={s.tabla}>
                  <thead>
                    <tr>
                      <th style={{ ...s.th, ...s.thConcepto }}>Concepto</th>
                      {datos.meses.map((m) => (
                        <th key={m} style={s.th}>{m}</th>
                      ))}
                      <th style={s.th}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { nombre: "Flujo neto real", valores: calculo.netoReal, neutro: true },
                      { nombre: "Flujo neto proyectado", valores: calculo.netoProy.map((v, i) => (i <= calculo.hasta ? v : null)), neutro: true },
                      { nombre: "Diferencia", valores: calculo.netoDif, neutro: false },
                    ].map((fila) => {
                      const total = fila.valores.reduce((a, v) => a + (v || 0), 0);
                      const color = (v) => (fila.neutro ? c.TEXT_FUERTE : colorDif(v));
                      return (
                        <tr key={fila.nombre} style={fila.neutro ? undefined : s.filaTotal}>
                          <td style={{ ...s.td, ...s.tdConcepto, ...(fila.neutro ? {} : s.filaTotal) }}>{fila.nombre}</td>
                          {fila.valores.map((v, j) => (
                            <td key={j} style={{ ...s.td, ...(fila.neutro ? {} : s.filaTotal), color: color(v) }}>
                              {v === null ? "" : fila.neutro ? (v < 0 ? "-" : "") + fmt(v) : fmtDif(v)}
                            </td>
                          ))}
                          <td style={{ ...s.td, ...s.tdTotalCol, ...(fila.neutro ? {} : s.filaTotal), color: color(total) }}>
                            {fila.neutro ? (total < 0 ? "-" : "") + fmt(total) : fmtDif(total)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
