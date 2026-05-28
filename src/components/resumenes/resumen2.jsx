import React, { useEffect, useRef, useState } from "react";
import servicionivel3 from "../../services/nivel3";


const headerGradient = "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #148D8D 100%)";

export default function DashboardFinanciero() {
  const canvasEgresos = useRef(null);
  const canvasSaldo = useRef(null);
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [modoVista, setModoVista] = useState("dia"); // "dia" o "mes"
  const [egresos, setEgresos] = useState([]);
  const [saldoMensual, setSaldoMensual] = useState([]);
  const canvasGastos = useRef(null);
  const [gastosEvolucion, setGastosEvolucion] = useState([]);
  const [fechaDesde2, setFechaDesde2] = useState("");
const [fechaHasta2, setFechaHasta2] = useState("");
const [gastosEvolucion2, setGastosEvolucion2] = useState([]);
const [tablaMovimientos, setTablaMovimientos] = useState([]);
const [tablaDesde, setTablaDesde] = useState("");
const [tablaHasta, setTablaHasta] = useState("");
const [tablaModo, setTablaModo] = useState("dia");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1366
  );
  useEffect(() => {
    const hoy = new Date();

    // 🔥 ir al mes anterior
    const primerDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1);
    const ultimoDiaMesAnterior = new Date(hoy.getFullYear(), hoy.getMonth(), 0);

    // 🔥 formatear a YYYY-MM-DD (input date)
    const format = (fecha) => fecha.toISOString().slice(0, 10);

    setFechaDesde(format(primerDiaMesAnterior));
    setFechaHasta(format(ultimoDiaMesAnterior));
  }, []);
  useEffect(() => {
    traerDatos();
  }, []);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (egresos.length) {
      animarEgresos(egresos);
    } else {
      limpiarCanvas(canvasEgresos.current);
    }
  }, [egresos, windowWidth]);

  useEffect(() => {
    if (saldoMensual.length) {
      animarSaldo(saldoMensual);
    } else {
      limpiarCanvas(canvasSaldo.current);
    }
  }, [saldoMensual, windowWidth]);
  useEffect(() => {
    traerDatos();
  }, [fechaDesde, fechaHasta, modoVista]);
 useEffect(() => {
  if (gastosEvolucion.length) {
    animarGastos(gastosEvolucion, gastosEvolucion2);
  } else {
    limpiarCanvas(canvasGastos.current);
  }
}, [gastosEvolucion, gastosEvolucion2, windowWidth]);
  
useEffect(() => {
  traerDatos();
}, [tablaDesde, tablaHasta, tablaModo]);

const traerDatos = async () => {
  try {
    const resp = await servicionivel3.traermovimientos();

    // ================================
    // 🔴 GASTOS COMPARATIVO
    // ================================
    const gastos1 = calcularGastosComparativo(resp, fechaDesde, fechaHasta);
    const gastos2 = calcularGastosComparativo(resp, fechaDesde2, fechaHasta2);

    setGastosEvolucion(gastos1);
    setGastosEvolucion2(gastos2);

    // ================================
    // 🟢 EGRESOS (ranking)
    // ================================
    const egresosMap = {};

    // ================================
    // 🔵 SALDO
    // ================================
    const saldoAgrupado = {};

    resp.forEach((mov) => {
      const fecha = new Date(mov.fecha);

      if (fechaDesde && fecha < new Date(fechaDesde)) return;
      if (fechaHasta && fecha > new Date(fechaHasta)) return;

      let clave =
        modoVista === "dia"
          ? fecha.toISOString().slice(0, 10)
          : fecha.toISOString().slice(0, 7);

      const debito = Number(mov.debito) || 0;
      const credito = Number(mov.credito) || 0;
      const concepto = mov.concepto || "Sin categoría";

      // 🔴 EGRESOS ranking
      if (debito > 0) {
        if (!egresosMap[concepto]) egresosMap[concepto] = 0;
        egresosMap[concepto] += debito;
      }

      // 🔵 SALDO
      const saldo = credito - debito;

      if (!saldoAgrupado[clave]) saldoAgrupado[clave] = 0;
      saldoAgrupado[clave] += saldo;
    });

    // ================================
    // 🟢 ARMAR EGRESOS
    // ================================
    const egresosArray = Object.keys(egresosMap)
      .map((key) => ({
        concepto: key,
        monto: egresosMap[key],
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 10);

    // ================================
    // 🔵 ARMAR SALDO
    // ================================
    const saldoArray = [];
    let acumulado = 0;

    Object.keys(saldoAgrupado)
      .sort()
      .forEach((key) => {
        acumulado += saldoAgrupado[key];

        saldoArray.push({
          fecha: formatearFecha(key),
          saldo: acumulado,
        });
      });

    setEgresos(egresosArray);
    setSaldoMensual(saldoArray);
// ================================
// 🟡 TABLA MOVIMIENTOS
// ================================
const tabla = calcularTabla(resp, tablaDesde, tablaHasta, tablaModo);
setTablaMovimientos(tabla);
  } catch (error) {
    console.error(error);
  }
};

function animarGastos(data) {
  const canvas = canvasGastos.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  const max = Math.max(...data.map((d) => d.monto), 1);

  let progreso = 0;

  function frame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const paddingX = 42;
    const paddingTop = 24;
    const paddingBottom = 34;
    const usableWidth = canvas.width - paddingX * 2;
    const usableHeight = canvas.height - paddingTop - paddingBottom;

    // 🔲 GRID
   // 🔲 GRID + EJE Y + VALORES
const steps = 4;

ctx.font = "600 10px Segoe UI";
ctx.fillStyle = "#64748B";
ctx.textAlign = "right";

for (let i = 0; i < steps; i++) {
  const ratio = i / (steps - 1);
  const y = paddingTop + usableHeight * ratio;

  // línea horizontal (grid)
  ctx.beginPath();
  ctx.moveTo(paddingX, y);
  ctx.lineTo(canvas.width - paddingX, y);
  ctx.strokeStyle = "#DCE7EB";
  ctx.lineWidth = 1;
  ctx.stroke();

  // valor eje Y
  const valor = Math.round(max * (1 - ratio));

  ctx.fillText(
    "$" + valor.toLocaleString("es-AR"),
    paddingX - 6,
    y + 3
  );
}

// 🔳 eje vertical
ctx.beginPath();
ctx.moveTo(paddingX, paddingTop);
ctx.lineTo(paddingX, canvas.height - paddingBottom);
ctx.strokeStyle = "#94A3B8";
ctx.lineWidth = 1.2;
ctx.stroke();

    // =========================
    // 🔴 LINEA (UN SOLO PERIODO)
    // =========================
    ctx.beginPath();

    data.forEach((p, i) => {
      const x = paddingX + (i / (data.length - 1 || 1)) * usableWidth;
      const y =
        paddingTop +
        usableHeight -
        (p.monto / max) * usableHeight * progreso;

      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.strokeStyle = "#EF4444";
    ctx.lineWidth = 3;
    ctx.stroke();

    // 🔴 puntos
    data.forEach((p, i) => {
      const x = paddingX + (i / (data.length - 1 || 1)) * usableWidth;
      const y =
        paddingTop +
        usableHeight -
        (p.monto / max) * usableHeight * progreso;

      ctx.beginPath();
      ctx.arc(x, y, 3.5, 0, Math.PI * 2);
      ctx.fillStyle = "#EF4444";
      ctx.fill();
    });

    // 🏷️ FECHAS
    data.forEach((p, i) => {
      const x = paddingX + (i / (data.length - 1 || 1)) * usableWidth;

      ctx.fillStyle = "#64748B";
      ctx.font = "600 11px Segoe UI";
      ctx.fillText(p.fecha, x - 10, canvas.height - 10);
    });

    // 🏷️ LEYENDA
    const legendX = canvas.width - 180;
    const legendY = 20;

    ctx.fillStyle = "#EF4444";
    ctx.fillRect(legendX, legendY, 12, 12);

    ctx.fillStyle = "#111827";
    ctx.font = "600 12px Segoe UI";
    ctx.fillText("Gastos acumulados", legendX + 18, legendY + 10);

    progreso += 0.035;
    if (progreso <= 1) requestAnimationFrame(frame);
  }

  frame();
}


function calcularTabla(resp, desde, hasta, modo) {
  const agrupado = {};

  resp.forEach((mov) => {
    const fecha = new Date(mov.fecha);

    if (desde && fecha < new Date(desde)) return;
    if (hasta && fecha > new Date(hasta)) return;

    let clave;

    if (modo === "dia") {
      clave = fecha.toISOString().slice(0, 10);
    } else {
      clave = fecha.toISOString().slice(0, 7);
    }

    const debito = Number(mov.debito) || 0;
    const credito = Number(mov.credito) || 0;

    if (!agrupado[clave]) {
      agrupado[clave] = {
        debito: 0,
        credito: 0,
      };
    }

    agrupado[clave].debito += debito;
    agrupado[clave].credito += credito;
  });

  return Object.keys(agrupado)
    .sort()
    .map((key) => ({
      fecha: formatearFecha(key),
      debito: agrupado[key].debito,
      credito: agrupado[key].credito,
      saldo: agrupado[key].credito - agrupado[key].debito,
    }));
}




  function formatearFecha(fechaStr) {
    if (fechaStr.length === 10) {
      // día
      const [anio, mes, dia] = fechaStr.split("-");
      return `${dia}/${mes}`;
    } else {
      // mes
      const [anio, mes] = fechaStr.split("-");
      return `${mes}/${anio}`;
    }
  }
  function limpiarCanvas(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function recortarTexto(ctx, texto, maxWidth) {
    if (ctx.measureText(texto).width <= maxWidth) return texto;
    let resultado = texto;
    while (resultado.length > 0 && ctx.measureText(resultado + "...").width > maxWidth) {
      resultado = resultado.slice(0, -1);
    }
    return resultado + "...";
  }
function calcularGastosComparativo(resp, desde, hasta) {
  const agrupado = {};

  resp.forEach((mov) => {
    const fecha = new Date(mov.fecha);

    if (desde && fecha < new Date(desde)) return;
    if (hasta && fecha > new Date(hasta)) return;

    let clave =
      modoVista === "dia"
        ? fecha.toISOString().slice(0, 10)
        : fecha.toISOString().slice(0, 7);

    const debito = Number(mov.debito) || 0;

    if (debito > 0) {
      if (!agrupado[clave]) agrupado[clave] = 0;
      agrupado[clave] += debito;
    }
  });

  return Object.keys(agrupado)
    .sort()
    .map((key) => ({
      fecha: formatearFecha(key),
      monto: agrupado[key], // ✅ SIN acumulado
    }));
}
  function animarEgresos(data) {
    const canvas = canvasEgresos.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const max = Math.max(...data.map((d) => d.monto), 1);

    let progreso = 0;

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const leftLabel = 10;
      const labelWidth = Math.min(175, canvas.width * 0.32);
      const barStartX = labelWidth + 18;
      const rightPadding = 90;
      const usableBarWidth = canvas.width - barStartX - rightPadding;
      const rowGap = 23;
      const top = 22;

      data.forEach((item, i) => {
        const y = top + i * rowGap;
        const width = (item.monto / max) * usableBarWidth * progreso;

        roundRectCanvas(ctx, barStartX, y, usableBarWidth, 14, 7, "#E7EEF2");
        roundRectCanvas(ctx, barStartX, y, width, 14, 7, "#49AF50");

        ctx.fillStyle = "#334155";
        ctx.font = "600 11px Segoe UI";
        const concepto = recortarTexto(ctx, item.concepto, labelWidth - 8);
        ctx.fillText(concepto, leftLabel, y + 11);

        ctx.fillStyle = "#111827";
        ctx.font = "700 11px Segoe UI";
        ctx.fillText(
          "$" + Math.round(item.monto).toLocaleString("es-AR"),
          barStartX + width + 8,
          y + 11
        );
      });

      progreso += 0.035;
      if (progreso <= 1) requestAnimationFrame(frame);
    }

    frame();
  }

  function animarSaldo(data) {
    const canvas = canvasSaldo.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const max = Math.max(...data.map((d) => d.saldo), 1);
    const min = Math.min(...data.map((d) => d.saldo), 0);

    let progreso = 0;

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const paddingX = 42;
      const paddingTop = 24;
      const paddingBottom = 34;
      const usableWidth = canvas.width - paddingX * 2;
      const usableHeight = canvas.height - paddingTop - paddingBottom;

      for (let i = 0; i < 4; i++) {
        const y = paddingTop + (usableHeight / 3) * i;
        ctx.beginPath();
        ctx.moveTo(paddingX, y);
        ctx.lineTo(canvas.width - paddingX, y);
        ctx.strokeStyle = "#DCE7EB";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();

      data.forEach((p, i) => {
        const x = paddingX + (i / (data.length - 1 || 1)) * usableWidth;
        const y =
          paddingTop +
          usableHeight -
          ((p.saldo - min) / (max - min || 1)) * usableHeight * progreso;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });

      ctx.strokeStyle = "#2E7D32";
      ctx.lineWidth = 3;
      ctx.stroke();

      data.forEach((p, i) => {
        const x = paddingX + (i / (data.length - 1 || 1)) * usableWidth;
        const y =
          paddingTop +
          usableHeight -
          ((p.saldo - min) / (max - min || 1)) * usableHeight * progreso;

        ctx.beginPath();
        ctx.arc(x, y, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#2E7D32";
        ctx.fill();

        ctx.fillStyle = "#64748B";
        ctx.font = "600 11px Segoe UI";
        ctx.fillText(p.fecha, x - 10, canvas.height - 10);
      });

      progreso += 0.035;
      if (progreso <= 1) requestAnimationFrame(frame);
    }

    frame();
  }

  const isMobile = windowWidth < 900;

  return (
    <div style={styles.page}>
      <div style={styles.dashboard}>

        <div />


        <SectionCard
          title="Principales egresos"
          subtitle="Ranking de conceptos con mayor impacto en los débitos."
        >
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(290px, 0.95fr) minmax(360px, 1.05fr)",
            }}
          >
            <div style={styles.cardTabla}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Concepto</th>
                    <th style={styles.th}>Monto</th>
                  </tr>
                </thead>
                <tbody>
                  {egresos.map((e, i) => (
                    <tr key={i}>
                      <td style={styles.td}>{e.concepto}</td>
                      <td style={styles.tdMonto}>
                        ${Math.round(e.monto).toLocaleString("es-AR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.cardGrafico}>
              <canvas
                ref={canvasEgresos}
                width={560}
                height={290}
                style={styles.canvasResponsive}
              />
            </div>
          </div>
        </SectionCard>
        <SectionCard
          title="Evolución de gastos"
          subtitle="Acumulado de egresos en el tiempo."
        >
          
      <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
    
    {/* PERIODO 1 */}
    <div>
      <div style={{ fontSize: 11 }}>Periodo 1</div>
      <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
      <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />
    </div>

    {/* PERIODO 2 */}
    <div>
      <div style={{ fontSize: 11 }}>Periodo 2</div>
      <input type="date" value={fechaDesde2} onChange={(e) => setFechaDesde2(e.target.value)} />
      <input type="date" value={fechaHasta2} onChange={(e) => setFechaHasta2(e.target.value)} />
    </div>

    {/* MODO */}
    <div>
      <div style={{ fontSize: 11 }}>Vista</div>
      <select value={modoVista} onChange={(e) => setModoVista(e.target.value)}>
        <option value="dia">Día</option>
        <option value="mes">Mes</option>
      </select>
    </div>
  </div>
  <div style={styles.cardGraficoGrande}>
  <canvas
    ref={canvasGastos}
    width={820}
    height={230}
    style={styles.canvasResponsive}
  />
</div>
        </SectionCard>
        <SectionCard
          title="Evolución saldo banco"
          subtitle="Comportamiento acumulado del saldo a lo largo de los meses."
        >
          <div style={styles.cardGraficoGrande}>
            <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
              <input type="date" value={fechaDesde} onChange={(e) => setFechaDesde(e.target.value)} />
              <input type="date" value={fechaHasta} onChange={(e) => setFechaHasta(e.target.value)} />

              <select value={modoVista} onChange={(e) => setModoVista(e.target.value)}>
                <option value="dia">Día</option>
                <option value="mes">Mes</option>
              </select>
            </div>
            <canvas
              ref={canvasSaldo}
              width={820}
              height={230}
              style={styles.canvasResponsive}
            />
          </div>
        </SectionCard>

     <SectionCard title="Tabla de Movimientos">
  <div style={{ display: "flex", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
    <input type="date" value={tablaDesde} onChange={(e) => setTablaDesde(e.target.value)} />
    <input type="date" value={tablaHasta} onChange={(e) => setTablaHasta(e.target.value)} />

    <select value={tablaModo} onChange={(e) => setTablaModo(e.target.value)}>
      <option value="dia">Día</option>
      <option value="mes">Mes</option>
    </select>
  </div>

  <div style={styles.tablaScrollContainer}>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.th}>Fecha</th>
          <th style={styles.th}>Ingresos</th>
          <th style={styles.th}>Egresos</th>
          <th style={styles.th}>Saldo</th>
        </tr>
      </thead>
      <tbody>
        {tablaMovimientos.map((m, i) => (
          <tr key={i}>
            <td style={styles.td}>{m.fecha}</td>
            <td style={styles.td}>${Math.round(m.credito).toLocaleString("es-AR")}</td>
            <td style={styles.td}>${Math.round(m.debito).toLocaleString("es-AR")}</td>
            <td style={styles.tdMonto}>
              ${Math.round(m.saldo).toLocaleString("es-AR")}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, subtitle, children, hero = false }) {
  return (
    <div style={hero ? styles.sectionHero : styles.section}>
      <div style={styles.sectionHeaderGradient}>
        <div style={styles.sectionHeaderTextWrap}>
          <div style={hero ? styles.heroEyebrow : styles.sectionEyebrow}>
            {hero ? "PANEL FINANCIERO" : "RESUMEN"}
          </div>
          <h3 style={hero ? styles.heroTitle : styles.sectionTitle}>{title}</h3>
          {subtitle ? (
            <div style={hero ? styles.heroSubtitle : styles.sectionSubtitle}>
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>

      <div style={styles.sectionBody}>{children}</div>
    </div>
  );
}

function roundRectCanvas(ctx, x, y, width, height, radius, fillStyle) {
  if (width <= 0 || height <= 0) return;
  const r = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();

  ctx.fillStyle = fillStyle;
  ctx.fill();
}

const styles = {
  page: {
    width: "100%",
    minWidth: 0,
    padding: 12,
    boxSizing: "border-box",
    background: "linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%)",
  },

  dashboard: {
    fontFamily: "Segoe UI, Inter, sans-serif",
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
    minWidth: 0,
    boxSizing: "border-box",
  },

  section: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 22,
    marginBottom: 14,
    boxShadow: "0 14px 28px rgba(15,23,42,0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    overflow: "hidden",
  },

  sectionHero: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 22,
    marginBottom: 14,
    boxShadow: "0 14px 28px rgba(15,23,42,0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    overflow: "hidden",
  },

  sectionHeaderGradient: {
    background: headerGradient,
    padding: "16px 18px",
    color: "#fff",
  },

  sectionHeaderTextWrap: {
    minWidth: 0,
  },

  sectionEyebrow: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: 4,
  },

  heroEyebrow: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.1,
    textTransform: "uppercase",
    opacity: 0.92,
    marginBottom: 4,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#fff",
  },

  heroTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    lineHeight: 1.15,
    color: "#fff",
  },

  sectionSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.35,
    fontWeight: 600,
  },

  heroSubtitle: {
    marginTop: 6,
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.35,
  },

  sectionBody: {
    padding: 14,
    background: "rgba(255,255,255,0.96)",
  },

  grid: {
    display: "grid",
    gap: 14,
    alignItems: "start",
  },

  cardTabla: {
    overflow: "auto",
    border: "1px solid rgba(148,163,184,0.18)",
    borderRadius: 14,
    background: "#fff",
    maxHeight: 250,
  },

  cardGrafico: {
    background: "linear-gradient(180deg, #fbfdff 0%, #f4f7fb 100%)",
    padding: 10,
    borderRadius: 16,
    overflow: "hidden",
    border: "1px solid rgba(148,163,184,0.14)",
    minWidth: 0,
  },

  cardGraficoGrande: {
    background: "linear-gradient(180deg, #fbfdff 0%, #f4f7fb 100%)",
    padding: 10,
    borderRadius: 16,
    width: "100%",
    overflow: "hidden",
    boxSizing: "border-box",
    border: "1px solid rgba(148,163,184,0.14)",
  },

  canvasResponsive: {
    width: "100%",
    maxWidth: "100%",
    height: "auto",
    display: "block",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 12.5,
    color: "#0F172A",
    minWidth: 300,
  },

  th: {
    textAlign: "left",
    padding: "9px 12px",
    borderBottom: "1px solid #E5E7EB",
    background: "#F8FAFC",
    position: "sticky",
    top: 0,
    zIndex: 1,
    fontSize: 12.5,
    fontWeight: 800,
    color: "#334155",
  },

  td: {
    padding: "9px 12px",
    borderBottom: "1px solid #F1F5F9",
    verticalAlign: "top",
    fontSize: 12.5,
  },

  tdMonto: {
    padding: "9px 12px",
    borderBottom: "1px solid #F1F5F9",
    verticalAlign: "top",
    fontSize: 12.5,
    fontWeight: 700,
    color: "#0F172A",
    whiteSpace: "nowrap",
  },

  tablaScrollContainer: {
    maxHeight: "360px",
    overflowY: "auto",
    overflowX: "auto",
    padding: 10,
    boxSizing: "border-box",
    background: "#fff",
    borderRadius: 14,
    border: "1px solid rgba(148,163,184,0.14)",
  },
};