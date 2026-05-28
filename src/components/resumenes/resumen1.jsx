import React, { useEffect, useRef, useState } from "react";
import servicionivel3 from "../../services/nivel3";

const headerGradient =
  "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #148D8D 100%)";

const styles = {
  dashboard: {
    fontFamily: "Segoe UI, Inter, sans-serif",
    background: "linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%)",
    padding: 24,
    minHeight: "100vh",
    boxSizing: "border-box",
  },

  hero: {
    background: headerGradient,
    borderRadius: 24,
    padding: "22px 26px",
    marginBottom: 22,
    color: "#fff",
    boxShadow: "0 20px 45px rgba(11, 79, 108, 0.18)",
    border: "1px solid rgba(255,255,255,0.10)",
  },

  heroEyebrow: {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.9,
    marginBottom: 6,
  },

  titulo: {
    margin: 0,
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.1,
  },

  heroSub: {
    marginTop: 8,
    fontSize: 15,
    color: "rgba(255,255,255,0.92)",
  },

  seccion: {
    background: "rgba(255,255,255,0.92)",
    borderRadius: 22,
    marginBottom: 22,
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.06)",
    border: "1px solid rgba(11,79,108,0.08)",
    overflow: "hidden",
    backdropFilter: "blur(10px)",
  },

  seccionHeader: {
    background: headerGradient,
    padding: "16px 20px",
    color: "#fff",
  },

  seccionBody: {
    padding: 20,
  },

  subtitulo: {
    margin: 0,
    fontSize: 22,
    fontWeight: 800,
    color: "#fff",
  },

  subtituloSecundario: {
    marginTop: 4,
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    fontWeight: 600,
  },

  kpis: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 16,
  },

  graficos: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
    gap: 18,
  },

  cardGrafico: {
    background: "linear-gradient(180deg, #ffffff 0%, #f7fbfd 100%)",
    borderRadius: 18,
    padding: 14,
    border: "1px solid rgba(148,163,184,0.12)",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
  },

  chartInner: {
    height: 290,
    width: "100%",
  },

  filtroWrap: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 18,
  },

  filtroGrupo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    flexWrap: "wrap",
  },

  label: {
    fontSize: 14,
    fontWeight: 700,
    color: "#0F172A",
  },

  select: {
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(11,79,108,0.12)",
    background: "#fff",
    minWidth: 230,
    outline: "none",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 600,
    color: "#0F172A",
    boxShadow: "0 8px 18px rgba(15,23,42,0.04)",
  },

  textoSecundario: {
    fontSize: 14,
    color: "#0b4f6c",
    fontWeight: 700,
    background: "rgba(20, 141, 141, 0.08)",
    padding: "10px 14px",
    borderRadius: 999,
    border: "1px solid rgba(20,141,141,0.10)",
  },

  sinDatos: {
    textAlign: "center",
    padding: "34px 12px",
    color: "#64748B",
    fontSize: 15,
    fontWeight: 600,
    background: "#fff",
    borderRadius: 16,
    border: "1px dashed rgba(148,163,184,0.28)",
  },

  kpiCard: {
    background: "rgba(255,255,255,0.96)",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 14px 30px rgba(15,23,42,0.05)",
    border: "1px solid rgba(11,79,108,0.08)",
    minWidth: 0,
    position: "relative",
    overflow: "hidden",
  },

  kpiAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },

  kpiLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: 700,
    marginTop: 6,
  },

  kpiValue: {
    fontSize: 34,
    fontWeight: 800,
    marginTop: 10,
    color: "#0F172A",
    lineHeight: 1.1,
    wordBreak: "break-word",
  },
};

const GOOGLE_CHARTS_SRC = "https://www.gstatic.com/charts/loader.js";

function normalizarAnio(anio) {
  const texto = String(anio || "").trim();
  if (texto.length === 2) {
    return `20${texto}`;
  }
  return texto;
}

function limpiarFecha(fecha) {
  if (!fecha) return "";
  return String(fecha)
    .replace("T", " ")
    .split(" ")[0]
    .split(".")[0]
    .trim();
}

function parseFecha(fecha) {
  const limpia = limpiarFecha(fecha);
  if (!limpia) return null;

  let dia = "";
  let mes = "";
  let anio = "";

  if (limpia.includes("/")) {
    const partes = limpia.split("/");
    if (partes.length !== 3) return null;
    [dia, mes, anio] = partes;
  } else if (limpia.includes("-")) {
    const partes = limpia.split("-");
    if (partes.length !== 3) return null;

    if (partes[0].length === 4) {
      [anio, mes, dia] = partes;
    } else {
      [dia, mes, anio] = partes;
    }
  } else {
    return null;
  }

  const dia2 = String(dia).padStart(2, "0");
  const mes2 = String(mes).padStart(2, "0");
  const anio4 = normalizarAnio(anio);

  return {
    dia: dia2,
    mes: mes2,
    anio: anio4,
    iso: `${anio4}-${mes2}-${dia2}`,
    periodo: `${anio4}-${mes2}`,
    label: `${dia2}/${mes2}/${anio4}`,
  };
}

function valorFecha(fecha) {
  const parsed = parseFecha(fecha);
  if (!parsed) return 0;
  return new Date(`${parsed.anio}-${parsed.mes}-${parsed.dia}`).getTime();
}

function obtenerPeriodo(fecha) {
  const parsed = parseFecha(fecha);
  return parsed ? parsed.periodo : "";
}

function formatearFecha(fecha) {
  const parsed = parseFecha(fecha);
  return parsed ? parsed.label : "-";
}

function deduplicarMovimientos(lista) {
  const vistos = new Set();

  return lista.filter((mov) => {
    const key = [
      limpiarFecha(mov.fecha),
      String(mov.cuil_cuit || "").trim(),
      Number(mov.debito || 0).toFixed(2),
      Number(mov.credito || 0).toFixed(2),
      String(mov.descripcion || "").trim().toLowerCase(),
      String(mov.nombre_razon || "").trim().toLowerCase(),
    ].join("|");

    if (vistos.has(key)) {
      return false;
    }

    vistos.add(key);
    return true;
  });
}

function formatearPeriodo(periodo) {
  if (!periodo) return "-";

  const [anio, mes] = periodo.split("-");
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  return `${meses[Number(mes) - 1] || mes} ${anio}`;
}

function formatearPeriodoCorto(periodo) {
  if (!periodo) return "-";

  const [anio, mes] = periodo.split("-");
  const meses = [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ];

  return `${meses[Number(mes) - 1] || mes}/${anio}`;
}

export default function PanelFinanciero() {
  const [movimientos, setMovimientos] = useState([]);
  const [periodosDisponibles, setPeriodosDisponibles] = useState([]);
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("");

  const [ingresosGenerales, setIngresosGenerales] = useState(0);
  const [egresosGenerales, setEgresosGenerales] = useState(0);
  const [ingresosGeneralesAnim, setIngresosGeneralesAnim] = useState(0);
  const [egresosGeneralesAnim, setEgresosGeneralesAnim] = useState(0);

  const [ingresosMes, setIngresosMes] = useState(0);
  const [egresosMes, setEgresosMes] = useState(0);
  const [ingresosMesAnim, setIngresosMesAnim] = useState(0);
  const [egresosMesAnim, setEgresosMesAnim] = useState(0);

  const timersRef = useRef({});
  const chartsPromiseRef = useRef(null);

  useEffect(() => {
    traerDatos();

    return () => {
      Object.values(timersRef.current).forEach((timer) => clearInterval(timer));
    };
  }, []);

  useEffect(() => {
    if (!movimientos.length) {
      setIngresosGenerales(0);
      setEgresosGenerales(0);
      setIngresosGeneralesAnim(0);
      setEgresosGeneralesAnim(0);
      limpiarGrafico("graficoBarrasGeneral");
      limpiarGrafico("graficoLineaGeneral");
      return;
    }

    const resumenGeneral = calcularResumenGeneral(movimientos);

    setIngresosGenerales(resumenGeneral.totalIngresos);
    setEgresosGenerales(resumenGeneral.totalEgresos);

    animarNumero(resumenGeneral.totalIngresos, setIngresosGeneralesAnim, "ingGeneral");
    animarNumero(resumenGeneral.totalEgresos, setEgresosGeneralesAnim, "egGeneral");

    dibujarGraficosGenerales(
      resumenGeneral.totalIngresos,
      resumenGeneral.totalEgresos,
      resumenGeneral.saldoArray
    );
  }, [movimientos]);

  useEffect(() => {
    if (!periodoSeleccionado || !movimientos.length) {
      setIngresosMes(0);
      setEgresosMes(0);
      setIngresosMesAnim(0);
      setEgresosMesAnim(0);
      limpiarGrafico("graficoBarrasMes");
      limpiarGrafico("graficoLineaMes");
      return;
    }

    const resumenMes = calcularResumenPorPeriodo(movimientos, periodoSeleccionado);

    setIngresosMes(resumenMes.totalIngresos);
    setEgresosMes(resumenMes.totalEgresos);

    animarNumero(resumenMes.totalIngresos, setIngresosMesAnim, "ingMes");
    animarNumero(resumenMes.totalEgresos, setEgresosMesAnim, "egMes");

    dibujarGraficosMes(
      resumenMes.totalIngresos,
      resumenMes.totalEgresos,
      resumenMes.saldoArray
    );
  }, [movimientos, periodoSeleccionado]);

  const traerDatos = async () => {
    try {
      const resp = await servicionivel3.traermovimientos();
      const lista = Array.isArray(resp) ? resp : [];
      const listaSinDuplicados = deduplicarMovimientos(lista);

      setMovimientos(listaSinDuplicados);

      const periodos = [
        ...new Set(lista.map((mov) => obtenerPeriodo(mov.fecha)).filter(Boolean)),
      ].sort((a, b) => b.localeCompare(a));

      setPeriodosDisponibles(periodos);

      if (periodos.length > 0) {
        setPeriodoSeleccionado(periodos[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  function animarNumero(valor, setter, key) {
    clearInterval(timersRef.current[key]);

    if (!valor || valor <= 0) {
      setter(0);
      return;
    }

    let actual = 0;
    const incremento = valor / 60;

    timersRef.current[key] = setInterval(() => {
      actual += incremento;

      if (actual >= valor) {
        actual = valor;
        clearInterval(timersRef.current[key]);
      }

      setter(actual);
    }, 20);
  }

  function calcularResumenGeneral(lista) {
  let totalIngresos = 0;
  let totalEgresos = 0;

  const acumuladoPorPeriodo = {};
  const ingresosPorPeriodo = {};
  const egresosPorPeriodo = {};

  lista.forEach((mov) => {
    const periodo = obtenerPeriodo(mov.fecha);
    if (!periodo) return;

    const credito = Number(mov.credito) || 0;
    const debito = Number(mov.debito) || 0;

    totalIngresos += credito;
    totalEgresos += debito;

    if (!acumuladoPorPeriodo[periodo]) {
      acumuladoPorPeriodo[periodo] = 0;
      ingresosPorPeriodo[periodo] = 0;
      egresosPorPeriodo[periodo] = 0;
    }

    acumuladoPorPeriodo[periodo] += credito - debito;
    ingresosPorPeriodo[periodo] += credito;
    egresosPorPeriodo[periodo] += debito;
  });

  const saldoArray = [["Mes", "Saldo", "Ingresos", "Egresos"]];

  let saldoAcum = 0;
  let ingAcum = 0;
  let egAcum = 0;

  Object.keys(acumuladoPorPeriodo)
    .sort((a, b) => a.localeCompare(b))
    .forEach((periodo) => {
      saldoAcum += acumuladoPorPeriodo[periodo];
      ingAcum += ingresosPorPeriodo[periodo];
      egAcum += egresosPorPeriodo[periodo];

      saldoArray.push([
        formatearPeriodoCorto(periodo),
        saldoAcum,
        ingAcum,
        egAcum,
      ]);
    });

  return {
    totalIngresos,
    totalEgresos,
    saldoArray,
  };
}

  function calcularResumenPorPeriodo(lista, periodoSeleccionadoActual) {
  const filtrados = lista
    .filter((mov) => obtenerPeriodo(mov.fecha) === periodoSeleccionadoActual)
    .sort((a, b) => valorFecha(a.fecha) - valorFecha(b.fecha));

  let totalIngresos = 0;
  let totalEgresos = 0;

  const acumuladoPorFecha = {};
  const ingresosPorFecha = {};
  const egresosPorFecha = {};

  filtrados.forEach((mov) => {
    const credito = Number(mov.credito) || 0;
    const debito = Number(mov.debito) || 0;

    totalIngresos += credito;
    totalEgresos += debito;

    const parsed = parseFecha(mov.fecha);
    if (!parsed) return;

    if (!acumuladoPorFecha[parsed.iso]) {
      acumuladoPorFecha[parsed.iso] = 0;
      ingresosPorFecha[parsed.iso] = 0;
      egresosPorFecha[parsed.iso] = 0;
    }

    acumuladoPorFecha[parsed.iso] += credito - debito;
    ingresosPorFecha[parsed.iso] += credito;
    egresosPorFecha[parsed.iso] += debito;
  });

  const saldoArray = [["Fecha", "Saldo", "Ingresos", "Egresos"]];

  let saldoAcum = 0;
  let ingAcum = 0;
  let egAcum = 0;

  Object.keys(acumuladoPorFecha)
    .sort((a, b) => a.localeCompare(b))
    .forEach((fechaIso) => {
      saldoAcum += acumuladoPorFecha[fechaIso];
      ingAcum += ingresosPorFecha[fechaIso];
      egAcum += egresosPorFecha[fechaIso];

      saldoArray.push([
        formatearFecha(fechaIso),
        saldoAcum,
        ingAcum,
        egAcum,
      ]);
    });

  if (saldoArray.length === 1) {
    saldoArray.push([formatearPeriodo(periodoSeleccionadoActual), 0, 0, 0]);
  }

  return {
    totalIngresos,
    totalEgresos,
    saldoArray,
  };
}
  function limpiarGrafico(id) {
    const nodo = document.getElementById(id);
    if (nodo) nodo.innerHTML = "";
  }

  function cargarGoogleCharts() {
    if (window.google?.visualization) {
      return Promise.resolve();
    }

    if (chartsPromiseRef.current) {
      return chartsPromiseRef.current;
    }

    chartsPromiseRef.current = new Promise((resolve, reject) => {
      const iniciar = () => {
        if (!window.google?.charts) {
          reject(new Error("No se pudo iniciar Google Charts"));
          return;
        }

        window.google.charts.load("current", { packages: ["corechart"] });
        window.google.charts.setOnLoadCallback(() => resolve());
      };

      const scriptExistente = document.querySelector(`script[src="${GOOGLE_CHARTS_SRC}"]`);

      if (scriptExistente) {
        if (window.google?.charts) {
          iniciar();
        } else {
          scriptExistente.addEventListener("load", iniciar, { once: true });
          scriptExistente.addEventListener("error", reject, { once: true });
        }
        return;
      }

      const script = document.createElement("script");
      script.src = GOOGLE_CHARTS_SRC;
      script.onload = iniciar;
      script.onerror = reject;
      document.body.appendChild(script);
    });

    return chartsPromiseRef.current;
  }

  async function dibujarGraficosGenerales(ingresos, egresos, saldoArray) {
    try {
      await cargarGoogleCharts();

      const resultado = ingresos - egresos;

 const dataBar = window.google.visualization.arrayToDataTable([
  ["Concepto", "Monto", { role: "style" }],
  ["Ingresos", ingresos, "#22C55E"], // verde
  ["Egresos", egresos, "#EF4444"],   // rojo
  ["Resultado", resultado, "#0B4F6C"], // azul
]);

      const chartBar = new window.google.visualization.ColumnChart(
        document.getElementById("graficoBarrasGeneral")
      );

      chartBar.draw(dataBar, {
        legend: { position: "none" },
        animation: { startup: true, duration: 900 },
        chartArea: { width: "80%", height: "70%" },
        backgroundColor: "transparent",
     colors: ["#22C55E", "#EF4444", "#0B4F6C"],
      });

      const dataLine = window.google.visualization.arrayToDataTable(saldoArray);

      const chartLine = new window.google.visualization.LineChart(
        document.getElementById("graficoLineaGeneral")
      );

      chartLine.draw(dataLine, {
    
        curveType: "function",
        animation: { startup: true, duration: 900 },
        chartArea: { width: "85%", height: "70%" },
        backgroundColor: "transparent",
       legend: { position: "top" },
colors: ["#0B4F6C", "#22C55E", "#EF4444"],

series: {
  0: { lineWidth: 4 }, // saldo
  1: { lineWidth: 2 }, // ingresos
  2: { lineWidth: 2 }, // egresos
},
      });
    } catch (error) {
      console.error("Error al dibujar gráficos generales:", error);
    }
  }

  async function dibujarGraficosMes(ingresos, egresos, saldoArray) {
    try {
      await cargarGoogleCharts();

      const resultado = ingresos - egresos;

  const dataBar = window.google.visualization.arrayToDataTable([
  ["Concepto", "Monto", { role: "style" }],
  ["Ingresos", ingresos, "#22C55E"], // verde
  ["Egresos", egresos, "#EF4444"],   // rojo
  ["Resultado", resultado, "#0B4F6C"], // azul
]);

      const chartBar = new window.google.visualization.ColumnChart(
        document.getElementById("graficoBarrasMes")
      );

      chartBar.draw(dataBar, {
        legend: { position: "none" },
        animation: { startup: true, duration: 900 },
        chartArea: { width: "80%", height: "70%" },
        backgroundColor: "transparent",
      colors: ["#22C55E", "#EF4444", "#0B4F6C"],
      });

      const dataLine = window.google.visualization.arrayToDataTable(saldoArray);

      const chartLine = new window.google.visualization.LineChart(
        document.getElementById("graficoLineaMes")
      );

      chartLine.draw(dataLine, {
        legend: "none",
        curveType: "function",
        animation: { startup: true, duration: 900 },
        chartArea: { width: "85%", height: "70%" },
        backgroundColor: "transparent",
      colors: ["#0B4F6C", "#22C55E", "#EF4444"],
      });
    } catch (error) {
      console.error("Error al dibujar gráficos por mes:", error);
    }
  }

  const resultadoGeneral = ingresosGenerales - egresosGenerales;
  const proporcionGeneral =
    ingresosGenerales > 0 ? ((egresosGenerales / ingresosGenerales) * 100).toFixed(2) : 0;

  const resultadoMes = ingresosMes - egresosMes;
  const proporcionMes =
    ingresosMes > 0 ? ((egresosMes / ingresosMes) * 100).toFixed(2) : 0;

  return (
    <div style={styles.dashboard}>
      

      <SectionCard
        title="Analisis Financiero GENERAL"
        subtitle="Totales acumulados de todos los extractos cargados"
      >
        <div style={styles.kpis}>
          <Card titulo="Ingresos" valor={ingresosGeneralesAnim} color="#22C55E" />
          <Card titulo="Egresos" valor={egresosGeneralesAnim} color="#EF4444" />
          <Card
            titulo="Resultado"
            valor={resultadoGeneral}
            color={resultadoGeneral < 0 ? "#EF4444" : "#148D8D"}
          />
          <Card
            titulo="Egreso / Ingreso"
            valor={proporcionGeneral + "%"}
            color="#0B4F6C"
          />
          
        </div><div style={styles.graficos}>
          <div style={styles.cardGrafico}>
            <div id="graficoBarrasGeneral" style={styles.chartInner} />
          </div>

          <div style={styles.cardGrafico}>
            <div id="graficoLineaGeneral" style={styles.chartInner} />
          </div>
        </div>
      </SectionCard>

      

      <SectionCard
        title="Analisis Financiero MENSUAL"
        
      >
        <div style={styles.filtroWrap}>
          <div style={styles.filtroGrupo}>
            <label style={styles.label}>Seleccionar período</label>

            <select
              value={periodoSeleccionado}
              onChange={(e) => setPeriodoSeleccionado(e.target.value)}
              style={styles.select}
            >
              {periodosDisponibles.length === 0 && (
                <option value="">Sin períodos</option>
              )}

              {periodosDisponibles.map((periodo) => (
                <option key={periodo} value={periodo}>
                  {formatearPeriodo(periodo)}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.textoSecundario}>
            {periodoSeleccionado
              ? `Mostrando: ${formatearPeriodo(periodoSeleccionado)}`
              : "Sin datos"}
          </div>
        </div>

        <div style={styles.kpis}>
          <Card titulo="Ingresos" valor={ingresosMesAnim} color="#22C55E" />
          <Card titulo="Egresos" valor={egresosMesAnim} color="#EF4444" />
          <Card
            titulo="Resultado"
            valor={resultadoMes}
            color={resultadoMes < 0 ? "#EF4444" : "#148D8D"}
          />
          <Card titulo="Egreso / Ingreso" valor={proporcionMes + "%"} color="#0B4F6C" />
        </div>

        {periodoSeleccionado ? (
          <div style={styles.graficos}>
            <div style={styles.cardGrafico}>
              <div id="graficoBarrasMes" style={styles.chartInner} />
            </div>

            <div style={styles.cardGrafico}>
              <div id="graficoLineaMes" style={styles.chartInner} />
            </div>
          </div>
        ) : (
          <div style={styles.sinDatos}>No hay datos disponibles para ese período.</div>
        )}
      </SectionCard>

     
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <div style={styles.seccion}>
      <div style={styles.seccionHeader}>
        <h3 style={styles.subtitulo}>{title}</h3>
        <div style={styles.subtituloSecundario}>{subtitle}</div>
      </div>
      <div style={styles.seccionBody}>{children}</div>
    </div>
  );
}

function Card({ titulo, valor, color }) {
  return (
    <div style={styles.kpiCard}>
      <div style={{ ...styles.kpiAccent, background: color }} />
      <div style={styles.kpiLabel}>{titulo}</div>

      <div style={styles.kpiValue}>
        {typeof valor === "number"
          ? "$" + Math.round(valor).toLocaleString("es-AR")
          : valor}
      </div>
    </div>
  );
}