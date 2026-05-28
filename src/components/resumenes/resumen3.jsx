import React, { useEffect, useMemo, useRef, useState } from "react";
import servicionivel3 from "../../services/nivel3";


const PALETTE = [
  "#0B4F6C",
  "#148D8D",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
  "#6366F1",
  "#A855F7",
  "#EC4899",
];

export default function DashboardFinanciero() {
  const flujoRef = useRef(null);
  const resultadoRef = useRef(null);
  const ingresosConceptoRef = useRef(null);
  const gastosCategoriaRef = useRef(null);
const [kpisExtra, setKpisExtra] = useState({
  variacionIngresos: 0,
  variacionGastos: 0,
  mejorCategoriaGasto: "",
  mejorConceptoIngreso: "",
});
  const [kpis, setKpis] = useState({
    ingresos: 0,
    gastos: 0,
    ganancia: 0,
    rentabilidad: 0,
  });

  const [flujoCaja, setFlujoCaja] = useState([]);
  const [resultadoGeneral, setResultadoGeneral] = useState([]);
  const [ingresosPorConcepto, setIngresosPorConcepto] = useState([]);
  const [gastosPorCategoria, setGastosPorCategoria] = useState([]);

  useEffect(() => {
    traerDatos();
  }, []);

  useEffect(() => {
    drawBarChart(flujoRef.current, flujoCaja, {
      colors: ["#16A34A", "#DC2626"],
    });
  }, [flujoCaja]);

  useEffect(() => {
    drawSingleResultChart(resultadoRef.current, resultadoGeneral);
  }, [resultadoGeneral]);

  useEffect(() => {
    drawDonut(ingresosConceptoRef.current, ingresosPorConcepto);
  }, [ingresosPorConcepto]);

  useEffect(() => {
    drawDonut(gastosCategoriaRef.current, gastosPorCategoria);
  }, [gastosPorCategoria]);

  const traerDatos = async () => {
    try {
      const resp = await servicionivel3.traermovimientos();
      const lista = Array.isArray(resp) ? resp : [];
      const movimientos = deduplicarMovimientos(lista);

      let ingresos = 0;
      let gastos = 0;

      const ingresosConceptoMap = {};
      const gastosCategoriaMap = {};

      movimientos.forEach((mov) => {
        const credito = Number(mov.credito) || 0;
        const debito = Number(mov.debito) || 0;

        const concepto = (mov.concepto || "SIN CLASIFICAR").trim();
        const categoria =
          (mov.categoria_general || mov.categoria || "SIN CLASIFICAR").trim();

        ingresos += credito;
        gastos += debito;

        if (credito > 0) {
          if (!ingresosConceptoMap[concepto]) ingresosConceptoMap[concepto] = 0;
          ingresosConceptoMap[concepto] += credito;
        }

        if (debito > 0) {
          if (!gastosCategoriaMap[categoria]) gastosCategoriaMap[categoria] = 0;
          gastosCategoriaMap[categoria] += debito;
        }
      });
// Agrupar por fecha (mes simple)
const porMes = {};

movimientos.forEach((mov) => {
  const fecha = new Date(mov.fecha);
  const key = `${fecha.getFullYear()}-${fecha.getMonth()}`;

  if (!porMes[key]) {
    porMes[key] = { ingresos: 0, gastos: 0 };
  }

  porMes[key].ingresos += Number(mov.credito) || 0;
  porMes[key].gastos += Number(mov.debito) || 0;
});

const meses = Object.entries(porMes)
  .sort((a, b) => new Date(a[0]) - new Date(b[0]))
  .map((item) => item[1]);

let variacionIngresos = 0;
let variacionGastos = 0;

if (meses.length >= 2) {
  const actual = meses[meses.length - 1];
  const anterior = meses[meses.length - 2];

  variacionIngresos =
    anterior.ingresos > 0
      ? ((actual.ingresos - anterior.ingresos) / anterior.ingresos) * 100
      : 0;

  variacionGastos =
    anterior.gastos > 0
      ? ((actual.gastos - anterior.gastos) / anterior.gastos) * 100
      : 0;
}
      const ganancia = ingresos - gastos;
      const rentabilidad =
        ingresos > 0 ? Number(((ganancia / ingresos) * 100).toFixed(2)) : 0;

      setKpis({
        ingresos,
        gastos,
        ganancia,
        rentabilidad,
      });

      setFlujoCaja([
        { label: "Ingresos", value: ingresos },
        { label: "Gastos", value: gastos },
      ]);
const mejorCategoriaGasto = Object.entries(gastosCategoriaMap)
  .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";

const mejorConceptoIngreso = Object.entries(ingresosConceptoMap)
  .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
setKpisExtra({
  variacionIngresos: variacionIngresos.toFixed(2),
  variacionGastos: variacionGastos.toFixed(2),
  mejorCategoriaGasto,
  mejorConceptoIngreso,
});

      setResultadoGeneral([{ label: "Resultado", value: ganancia }]);

      setIngresosPorConcepto(prepararDonutData(ingresosConceptoMap));
      setGastosPorCategoria(prepararDonutData(gastosCategoriaMap));
    } catch (e) {
      console.error(e);
    }
  };

  const ingresosConColor = useMemo(
    () =>
      ingresosPorConcepto.map((item, index) => ({
        ...item,
        color: PALETTE[index % PALETTE.length],
      })),
    [ingresosPorConcepto]
  );

  const gastosConColor = useMemo(
    () =>
      gastosPorCategoria.map((item, index) => ({
        ...item,
        color: PALETTE[index % PALETTE.length],
      })),
    [gastosPorCategoria]
  );

  return (
    <div style={styles.dashboard}>
      <div style={styles.hero}>
        <div>
          
          <h2 style={styles.titulo}>PANEL FINANCIERO</h2>
          <div style={styles.heroSub}>
            Vista consolidada de ingresos, gastos, resultado y distribución.
          </div>
        </div>
      </div>

      <div style={styles.kpis}>
        <KpiCard titulo="Ingresos" valor={kpis.ingresos} color="#16A34A" tipo="money" />
        <KpiCard titulo="Gastos" valor={kpis.gastos} color="#DC2626" tipo="money" />
        <KpiCard titulo="Resultado" valor={kpis.ganancia} color="#1E3A8A" tipo="money" />
        <KpiCard
          titulo="Rentabilidad"
          valor={kpis.rentabilidad}
          color="#7C3AED"
          tipo="percent"
        />
      </div>
<div style={styles.kpis}>
  <KpiCard
    titulo="Ingresos vs Mes Anterior"
    valor={kpisExtra.variacionIngresos}
    color="#16A34A"
    tipo="percent"
  />

  <KpiCard
    titulo="Gastos vs Mes Anterior"
    valor={kpisExtra.variacionGastos}
    color="#DC2626"
    tipo="percent"
  />

  <KpiCard
    titulo="Principal Gasto"
    valor={kpisExtra.mejorCategoriaGasto}
    color="#F59E0B"
    tipo="text"
  />

  <KpiCard
    titulo="Principal Ingreso"
    valor={kpisExtra.mejorConceptoIngreso}
    color="#0B4F6C"
    tipo="text"
  />
</div>
      <div style={styles.graficos}>
        <Section
          titulo="Flujo de Caja"
          subtitulo="Comparación general entre ingresos y gastos"
        >
          <canvas ref={flujoRef} width={320} height={210} style={styles.canvas} />
        </Section>

        <Section
          titulo="Resultado General"
          subtitulo="Diferencia total entre ingresos y gastos"
        >
          <canvas ref={resultadoRef} width={320} height={210} style={styles.canvas} />
        </Section>

        <Section
          titulo="Ingresos por Concepto"
          subtitulo="Distribución porcentual según concepto"
        >
          <div style={styles.donutWrap}>
            <canvas
              ref={ingresosConceptoRef}
              width={220}
              height={220}
              style={styles.donutCanvas}
            />
            <LegendList items={ingresosConColor} />
          </div>
        </Section>

        <Section
          titulo="Gastos por Categoría"
          subtitulo="Distribución porcentual según categoría"
        >
          <div style={styles.donutWrap}>
            <canvas
              ref={gastosCategoriaRef}
              width={220}
              height={220}
              style={styles.donutCanvas}
            />
            <LegendList items={gastosConColor} />
          </div>
        </Section>
      </div>

      {/* 
<div style={styles.movimientosCard}>
  <Tabla />
</div>
*/}
    </div>
  );
}

/* ---------------- HELPERS ---------------- */

function deduplicarMovimientos(lista) {
  const vistos = new Set();

  return lista.filter((mov) => {
    const key = [
      normalizarFecha(mov.fecha),
      String(mov.cuil_cuit || "").trim(),
      Number(mov.debito || 0).toFixed(2),
      Number(mov.credito || 0).toFixed(2),
      String(mov.descripcion || "").trim().toLowerCase(),
      String(mov.nombre_razon || "").trim().toLowerCase(),
    ].join("|");

    if (vistos.has(key)) return false;
    vistos.add(key);
    return true;
  });
}

function normalizarFecha(fecha) {
  if (!fecha) return "";
  return String(fecha).replace("T", " ").split(".")[0].trim();
}

function prepararDonutData(obj) {
  const entries = Object.entries(obj)
    .map(([label, amount]) => ({
      label,
      amount,
    }))
    .sort((a, b) => b.amount - a.amount);

  if (entries.length === 0) return [];

  const limit = 5;
  const principales = entries.slice(0, limit);
  const resto = entries.slice(limit);

  if (resto.length > 0) {
    const totalResto = resto.reduce((acc, item) => acc + item.amount, 0);
    principales.push({
      label: "Otros",
      amount: totalResto,
    });
  }

  const total = principales.reduce((acc, item) => acc + item.amount, 0);

  return principales.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.amount / total) * 100 : 0,
  }));
}

function formatMoney(valor) {
  return `$ ${Math.round(Number(valor || 0)).toLocaleString("es-AR")}`;
}

function formatPercent(valor) {
  const num = Number(valor || 0);
  const signo = num > 0 ? "+" : "";
  return `${signo}${num.toFixed(2)}%`;
}

/* ---------------- CHARTS ---------------- */

function drawBarChart(canvas, data, options = {}) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!data || data.length === 0) {
    drawEmptyState(ctx, width, height);
    return;
  }

  const paddingLeft = 42;
  const paddingBottom = 30;
  const chartHeight = 130;
  const baseY = height - paddingBottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const barWidth = 60;
  const gap = 36;

  drawGrid(ctx, paddingLeft, 20, width - 16, baseY, 4);

  data.forEach((d, i) => {
    const x = paddingLeft + 18 + i * (barWidth + gap);
    const barHeight = (d.value / max) * chartHeight;
    const y = baseY - barHeight;
    const color = options.colors?.[i] || PALETTE[i % PALETTE.length];

    roundRect(ctx, x, y, barWidth, barHeight, 10, color);

    ctx.fillStyle = "#111827";
    ctx.font = "600 10px Segoe UI";
    ctx.fillText(formatMoney(d.value), x, y - 8);

    ctx.fillStyle = "#334155";
    ctx.font = "600 11px Segoe UI";
    ctx.fillText(d.label, x + 2, baseY + 18);
  });
}

function drawSingleResultChart(canvas, data) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  if (!data || data.length === 0) {
    drawEmptyState(ctx, width, height);
    return;
  }

  const item = data[0];
  const value = Number(item.value || 0);
  const max = Math.max(Math.abs(value), 1);

  const paddingLeft = 105;
  const paddingBottom = 30;
  const baseY = height - paddingBottom;
  const chartHeight = 130;
  const barHeight = (Math.abs(value) / max) * chartHeight;
  const y = baseY - barHeight;
  const color = value >= 0 ? "#1E3A8A" : "#DC2626";

  drawGrid(ctx, 44, 20, width - 16, baseY, 4);
  roundRect(ctx, paddingLeft, y, 82, barHeight, 10, color);

  ctx.fillStyle = "#111827";
  ctx.font = "600 10px Segoe UI";
  ctx.fillText(formatMoney(value), paddingLeft - 6, y - 8);

  ctx.fillStyle = "#334155";
  ctx.font = "600 11px Segoe UI";
  ctx.fillText(item.label, paddingLeft + 10, baseY + 18);
}

function drawDonut(canvas, dataArray) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  const cx = width / 2;
  const cy = height / 2;
  const outer = 60;
  const inner = 34;

  ctx.clearRect(0, 0, width, height);

  if (!dataArray || dataArray.length === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, outer, 0, Math.PI * 2);
    ctx.fillStyle = "#E5E7EB";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(cx, cy, inner, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();

    ctx.fillStyle = "#64748B";
    ctx.font = "600 12px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText("Sin datos", cx, cy + 4);
    ctx.textAlign = "start";
    return;
  }

  const total = dataArray.reduce((acc, item) => acc + item.amount, 0);
  let start = -Math.PI / 2;

  dataArray.forEach((item, index) => {
    const slice = total > 0 ? (item.amount / total) * Math.PI * 2 : 0;

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outer, start, start + slice);
    ctx.closePath();
    ctx.fillStyle = PALETTE[index % PALETTE.length];
    ctx.fill();

    start += slice;
  });

  ctx.beginPath();
  ctx.arc(cx, cy, inner, 0, Math.PI * 2);
  ctx.fillStyle = "#FFFFFF";
  ctx.fill();

  ctx.fillStyle = "#0F172A";
  ctx.font = "700 11px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("100%", cx, cy - 2);

  ctx.fillStyle = "#64748B";
  ctx.font = "600 9px Segoe UI";
  ctx.fillText("Distribución", cx, cy + 12);
  ctx.textAlign = "start";
}

function drawGrid(ctx, x1, y1, x2, y2, lines = 4) {
  ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
  ctx.lineWidth = 1;

  for (let i = 0; i <= lines; i++) {
    const y = y1 + ((y2 - y1) / lines) * i;
    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  }
}

function roundRect(ctx, x, y, width, height, radius, fill) {
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

  ctx.fillStyle = fill;
  ctx.fill();
}

function drawEmptyState(ctx, width, height) {
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#94A3B8";
  ctx.font = "600 13px Segoe UI";
  ctx.textAlign = "center";
  ctx.fillText("Sin datos para mostrar", width / 2, height / 2);
  ctx.textAlign = "start";
}

/* ---------------- COMPONENTES ---------------- */

function KpiCard({ titulo, valor, color, tipo = "money" }) {
  
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = Number(valor || 0);
    const increment = target / 35;

    const timer = setInterval(() => {
      current += increment;

      if (current >= target) {
        current = target;
        clearInterval(timer);
      }

      setDisplay(current);
    }, 20);

    return () => clearInterval(timer);
  }, [valor]);

  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <div style={styles.cardTitle}>{titulo}</div>
     <div style={styles.cardValue}>
  {tipo === "percent"
    ? formatPercent(display)
    : tipo === "text"
    ? valor
    : formatMoney(display)}
</div>
    </div>
  );
}

function Section({ titulo, subtitulo, children }) {
  return (
    <div style={styles.section}>
      <div style={styles.sectionHeader}>
        <div>
          <h4 style={styles.sectionTitle}>{titulo}</h4>
          <div style={styles.sectionSubtitle}>{subtitulo}</div>
        </div>
      </div>
      {children}
    </div>
  );
}

function LegendList({ items }) {
  if (!items || items.length === 0) {
    return <div style={styles.legendEmpty}>Sin datos</div>;
  }

  return (
    <div style={styles.legendList}>
      {items.map((item, index) => (
        <div key={`${item.label}-${index}`} style={styles.legendItem}>
          <div style={styles.legendLeft}>
            <span
              style={{
                ...styles.legendDot,
                background: item.color || PALETTE[index % PALETTE.length],
              }}
            />
            <span style={styles.legendLabel} title={item.label}>
              {item.label}
            </span>
          </div>

          <div style={styles.legendRight}>
            <span style={styles.legendValue}>{formatPercent(item.percentage)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- ESTILOS ---------------- */

const styles = {
  dashboard: {
    fontFamily: "Segoe UI, Inter, sans-serif",
    padding: 18,
    minHeight: "100vh",
    background: "linear-gradient(180deg, #f5f8fc 0%, #eef4f8 100%)",
  },

  hero: {
    marginBottom: 16,
    padding: "18px 20px",
    borderRadius: 18,
    background: "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #148D8D 100%)",
    color: "#fff",
    boxShadow: "0 14px 26px rgba(11, 79, 108, 0.14)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  heroEyebrow: {
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: 4,
  },

  titulo: {
    margin: 0,
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
  },

  heroSub: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 14,
    marginBottom: 18,
  },

  card: {
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(10px)",
    padding: 14,
    borderRadius: 16,
    boxShadow: "0 10px 20px rgba(15, 23, 42, 0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    minHeight: 82,
  },

  cardTitle: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: 700,
  },

  cardValue: {
    fontSize: 18,
    fontWeight: 800,
    marginTop: 8,
    color: "#0F172A",
    letterSpacing: "-0.02em",
  },

  graficos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 16,
  },

  section: {
    background: "rgba(255,255,255,0.94)",
    backdropFilter: "blur(10px)",
    padding: 16,
    borderRadius: 18,
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
  },

  sectionHeader: {
    marginBottom: 10,
  },

  sectionTitle: {
    margin: 0,
    color: "#0F172A",
    fontSize: 15,
    fontWeight: 800,
  },

  sectionSubtitle: {
    marginTop: 3,
    color: "#64748B",
    fontSize: 11,
    fontWeight: 600,
  },

  canvas: {
    width: "100%",
    height: 210,
    borderRadius: 12,
    background: "linear-gradient(180deg, #ffffff 0%, #f8fbfd 100%)",
  },

  donutWrap: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 12,
    alignItems: "center",
    flex: 1,
  },

  donutCanvas: {
    width: "100%",
    maxWidth: 220,
    height: "auto",
    justifySelf: "center",
  },

  legendList: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    maxHeight: 210,
    overflowY: "auto",
    paddingRight: 2,
  },

  legendItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "8px 10px",
    borderRadius: 12,
    background: "rgba(248, 250, 252, 0.92)",
    border: "1px solid rgba(148,163,184,0.14)",
  },

  legendLeft: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
    flex: 1,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    flexShrink: 0,
  },

  legendLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: "#334155",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  legendRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 1,
    flexShrink: 0,
  },

  legendValue: {
    fontSize: 11,
    fontWeight: 800,
    color: "#0F172A",
  },

  legendEmpty: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: 700,
    padding: "16px 0",
  },

  movimientosCard: {
    marginTop: 18,
    background: "rgba(255,255,255,0.94)",
    borderRadius: 18,
    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    padding: 14,
  },
};