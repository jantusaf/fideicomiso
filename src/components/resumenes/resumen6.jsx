import React, { useEffect, useRef, useState } from "react";
import servicionivel3 from "../../services/nivel3";

const headerGradient =
  "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #148D8D 100%)";

export default function DashboardIngresos() {

  // =====================================================
  // STATES
  // =====================================================

  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [modoVista, setModoVista] = useState("mes");

  const [principalesIngresos, setPrincipalesIngresos] = useState([]);
  const [evolucionIngresos, setEvolucionIngresos] = useState([]);
const [datosOriginales, setDatosOriginales] = useState([]);
const [mesSeleccionado, setMesSeleccionado] = useState("todos");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined"
      ? window.innerWidth
      : 1366
  );

  // =====================================================
  // CANVAS
  // =====================================================

  const canvasIngresos = useRef(null);
  const canvasEvolucion = useRef(null);

  // =====================================================
  // FECHAS DEFAULT
  // =====================================================

  useEffect(() => {

    const hoy = new Date();

    const primerDiaMesAnterior = new Date(
      hoy.getFullYear(),
      hoy.getMonth() - 1,
      1
    );

    const ultimoDiaMesAnterior = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      0
    );

    const format = (fecha) =>
      fecha.toISOString().slice(0, 10);

    setFechaDesde(format(primerDiaMesAnterior));
    setFechaHasta(format(ultimoDiaMesAnterior));

  }, []);

  // =====================================================
  // RESIZE
  // =====================================================

  useEffect(() => {

    const onResize = () =>
      setWindowWidth(window.innerWidth);

    window.addEventListener("resize", onResize);

    return () =>
      window.removeEventListener("resize", onResize);

  }, []);

  // =====================================================
  // TRAER DATOS
  // =====================================================

useEffect(() => {

  traerDatos();

}, [modoVista]);

const traerDatos = async () => {

  try {

    const resp =
      await servicionivel3.traeringresos();

    setDatosOriginales(
      resp.movimientos || []
    );

    setPrincipalesIngresos(
      resp.principalesIngresos || []
    );

    if (modoVista === "mes") {

      setEvolucionIngresos(
        resp.ingresosPorMes || []
      );

    } else {

      setEvolucionIngresos(
        resp.ingresosPorDia || []
      );

    }

  } catch (error) {

    console.log(error);

  }

};
  // =====================================================
  // ANIMACIONES
  // =====================================================

  useEffect(() => {

    if (principalesIngresos.length) {

      animarIngresos(principalesIngresos);

    } else {

      limpiarCanvas(canvasIngresos.current);

    }

  }, [principalesIngresos, windowWidth]);

  useEffect(() => {

    if (evolucionIngresos.length) {

      animarEvolucion(evolucionIngresos);

    } else {

      limpiarCanvas(canvasEvolucion.current);

    }

  }, [evolucionIngresos, windowWidth]);
useEffect(() => {

  if (!datosOriginales.length) return;

  // =====================================================
  // TODOS
  // =====================================================

  if (mesSeleccionado === "todos") {

    const conceptosMap = {};

    datosOriginales.forEach((mov) => {

      const concepto =
        mov.concepto || "Sin concepto";

      const monto =
        Number(mov.credito) || 0;

      if (!conceptosMap[concepto]) {

        conceptosMap[concepto] = 0;

      }

      conceptosMap[concepto] += monto;

    });

    const ranking =
      Object.entries(conceptosMap)
        .map(([concepto, monto]) => ({
          concepto,
          monto
        }))
        .sort((a, b) => b.monto - a.monto)
        .slice(0, 10);

    setPrincipalesIngresos(ranking);

    return;

  }

  // =====================================================
  // FILTRADO POR MES
  // =====================================================

  const filtrados =
    datosOriginales.filter((mov) => {

      const fecha =
        new Date(mov.fecha);

      const mes =
        String(fecha.getMonth() + 1)
          .padStart(2, "0");

      const anio =
        fecha.getFullYear();

      const key =
        `${mes}-${anio}`;

      return key === mesSeleccionado;

    });

  const conceptosMap = {};

  filtrados.forEach((mov) => {

    const concepto =
      mov.concepto || "Sin concepto";

    const monto =
      Number(mov.credito) || 0;

    if (!conceptosMap[concepto]) {

      conceptosMap[concepto] = 0;

    }

    conceptosMap[concepto] += monto;

  });

  const ranking =
    Object.entries(conceptosMap)
      .map(([concepto, monto]) => ({
        concepto,
        monto
      }))
      .sort((a, b) => b.monto - a.monto)
      .slice(0, 10);

  setPrincipalesIngresos(ranking);

}, [mesSeleccionado, datosOriginales]);
  // =====================================================
  // HELPERS
  // =====================================================
const mesesDisponibles = [
  ...new Set(

    datosOriginales.map((mov) => {

      const fecha =
        new Date(mov.fecha);

      const mes =
        String(fecha.getMonth() + 1)
          .padStart(2, "0");

      const anio =
        fecha.getFullYear();

      return `${mes}-${anio}`;

    })

  )
];
  function limpiarCanvas(canvas) {

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

  }

  function recortarTexto(ctx, texto, maxWidth) {

    if (
      ctx.measureText(texto).width <= maxWidth
    ) {
      return texto;
    }

    let resultado = texto;

    while (
      resultado.length > 0 &&
      ctx.measureText(resultado + "...")
        .width > maxWidth
    ) {

      resultado = resultado.slice(0, -1);

    }

    return resultado + "...";

  }

  // =====================================================
  // GRAFICO PRINCIPALES INGRESOS
  // =====================================================

  function animarIngresos(data) {

    const canvas = canvasIngresos.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const max = Math.max(
      ...data.map((d) => d.monto),
      1
    );

    let progreso = 0;

    function frame() {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const leftLabel = 10;

      const labelWidth = Math.min(
        175,
        canvas.width * 0.32
      );

      const barStartX = labelWidth + 18;

      const rightPadding = 90;

      const usableBarWidth =
        canvas.width -
        barStartX -
        rightPadding;

      const rowGap = 23;

      const top = 22;

      data.forEach((item, i) => {

        const y = top + i * rowGap;

        const width =
          (item.monto / max) *
          usableBarWidth *
          progreso;

        // fondo

        roundRectCanvas(
          ctx,
          barStartX,
          y,
          usableBarWidth,
          14,
          7,
          "#E7EEF2"
        );

        // barra

        roundRectCanvas(
          ctx,
          barStartX,
          y,
          width,
          14,
          7,
          "#49AF50"
        );

        // texto

        ctx.fillStyle = "#334155";

        ctx.font = "600 11px Segoe UI";

        const concepto = recortarTexto(
          ctx,
          item.concepto,
          labelWidth - 8
        );

        ctx.fillText(
          concepto,
          leftLabel,
          y + 11
        );

        // monto

        ctx.fillStyle = "#111827";

        ctx.font = "700 11px Segoe UI";

        ctx.fillText(
          "$" +
            Math.round(item.monto)
              .toLocaleString("es-AR"),
          barStartX + width + 8,
          y + 11
        );

      });

      progreso += 0.035;

      if (progreso <= 1) {

        requestAnimationFrame(frame);

      }

    }

    frame();

  }

  // =====================================================
  // GRAFICO EVOLUCION
  // =====================================================

  function animarEvolucion(data) {

    const canvas = canvasEvolucion.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const max = Math.max(
      ...data.map((d) => d.total),
      1
    );

    let progreso = 0;

    function frame() {

      ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
      );

      const paddingX = 42;
      const paddingTop = 24;
      const paddingBottom = 34;

      const usableWidth =
        canvas.width - paddingX * 2;

      const usableHeight =
        canvas.height -
        paddingTop -
        paddingBottom;

      // GRID

      for (let i = 0; i < 4; i++) {

        const y =
          paddingTop +
          (usableHeight / 3) * i;

        ctx.beginPath();

        ctx.moveTo(paddingX, y);

        ctx.lineTo(
          canvas.width - paddingX,
          y
        );

        ctx.strokeStyle = "#DCE7EB";

        ctx.lineWidth = 1;

        ctx.stroke();

      }

      // linea

      ctx.beginPath();

      data.forEach((p, i) => {

        const x =
          paddingX +
          (i / (data.length - 1 || 1)) *
            usableWidth;

        const y =
          paddingTop +
          usableHeight -
          (p.total / max) *
            usableHeight *
            progreso;

        if (i === 0) {

          ctx.moveTo(x, y);

        } else {

          ctx.lineTo(x, y);

        }

      });

      ctx.strokeStyle = "#16A34A";

      ctx.lineWidth = 3;

      ctx.stroke();

      // puntos

      data.forEach((p, i) => {

        const x =
          paddingX +
          (i / (data.length - 1 || 1)) *
            usableWidth;

        const y =
          paddingTop +
          usableHeight -
          (p.total / max) *
            usableHeight *
            progreso;

        ctx.beginPath();

        ctx.arc(
          x,
          y,
          3.5,
          0,
          Math.PI * 2
        );

        ctx.fillStyle = "#16A34A";

        ctx.fill();

        ctx.fillStyle = "#64748B";

        ctx.font = "600 11px Segoe UI";

      ctx.fillText(
  p.fecha || p.mes,
  x - 10,
  canvas.height - 10
);

      });

      progreso += 0.035;

      if (progreso <= 1) {

        requestAnimationFrame(frame);

      }

    }

    frame();

  }

  // =====================================================
  // MOBILE
  // =====================================================

  const isMobile = windowWidth < 900;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div style={styles.page}>

      <div style={styles.dashboard}>

        {/* ================================================= */}
        {/* PRINCIPALES INGRESOS */}
        {/* ================================================= */}

        <SectionCard
          title="Principales ingresos"
          subtitle="Ranking de conceptos con mayor impacto en los créditos."
        >
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 12
  }}
>

  <select
    value={mesSeleccionado}
    onChange={(e) =>
      setMesSeleccionado(
        e.target.value
      )
    }
  >

    <option value="todos">
      Todos los meses
    </option>

    {mesesDisponibles.map((mes) => (

      <option
        key={mes}
        value={mes}
      >
        {mes}
      </option>

    ))}

  </select>

</div>
          <div
            style={{
              ...styles.grid,
              gridTemplateColumns: isMobile
                ? "1fr"
                : "minmax(290px, 0.95fr) minmax(360px, 1.05fr)",
            }}
          >

            {/* TABLA */}

            <div style={styles.cardTabla}>

              <table style={styles.table}>

                <thead>

                  <tr>
                    <th style={styles.th}>
                      Concepto
                    </th>

                    <th style={styles.th}>
                      Monto
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {principalesIngresos.map(
                    (e, i) => (

                      <tr key={i}>

                        <td style={styles.td}>
                          {e.concepto}
                        </td>

                        <td style={styles.tdMonto}>
                          $
                          {Math.round(e.monto)
                            .toLocaleString(
                              "es-AR"
                            )}
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

            {/* GRAFICO */}

            <div style={styles.cardGrafico}>

              <canvas
                ref={canvasIngresos}
                width={560}
                height={290}
                style={styles.canvasResponsive}
              />

            </div>

          </div>

        </SectionCard>

        {/* ================================================= */}
        {/* EVOLUCION */}
        {/* ================================================= */}

        <SectionCard
          title="Evolución de ingresos"
          subtitle="Comportamiento de ingresos en el tiempo."
        >

          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 10,
              flexWrap: "wrap",
            }}
          >

            <input
              type="date"
              value={fechaDesde}
              onChange={(e) =>
                setFechaDesde(
                  e.target.value
                )
              }
            />

            <input
              type="date"
              value={fechaHasta}
              onChange={(e) =>
                setFechaHasta(
                  e.target.value
                )
              }
            />

            <select
              value={modoVista}
              onChange={(e) =>
                setModoVista(
                  e.target.value
                )
              }
            >
              <option value="dia">
                Día
              </option>

              <option value="mes">
                Mes
              </option>

            </select>

          </div>

          <div style={styles.cardGraficoGrande}>

            <canvas
              ref={canvasEvolucion}
              width={820}
              height={230}
              style={styles.canvasResponsive}
            />

          </div>

        </SectionCard>

      </div>

    </div>
  );
}

// =====================================================
// COMPONENTES
// =====================================================

function SectionCard({
  title,
  subtitle,
  children,
}) {

  return (

    <div style={styles.section}>

      <div style={styles.sectionHeaderGradient}>

        <div style={styles.sectionHeaderTextWrap}>

          <div style={styles.sectionEyebrow}>
            RESUMEN
          </div>

          <h3 style={styles.sectionTitle}>
            {title}
          </h3>

          {subtitle ? (

            <div style={styles.sectionSubtitle}>
              {subtitle}
            </div>

          ) : null}

        </div>

      </div>

      <div style={styles.sectionBody}>
        {children}
      </div>

    </div>

  );

}

function roundRectCanvas(
  ctx,
  x,
  y,
  width,
  height,
  radius,
  fillStyle
) {

  if (width <= 0 || height <= 0) return;

  const r = Math.min(
    radius,
    width / 2,
    height / 2
  );

  ctx.beginPath();

  ctx.moveTo(x + r, y);

  ctx.lineTo(x + width - r, y);

  ctx.quadraticCurveTo(
    x + width,
    y,
    x + width,
    y + r
  );

  ctx.lineTo(
    x + width,
    y + height - r
  );

  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - r,
    y + height
  );

  ctx.lineTo(x + r, y + height);

  ctx.quadraticCurveTo(
    x,
    y + height,
    x,
    y + height - r
  );

  ctx.lineTo(x, y + r);

  ctx.quadraticCurveTo(
    x,
    y,
    x + r,
    y
  );

  ctx.closePath();

  ctx.fillStyle = fillStyle;

  ctx.fill();

}

// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    width: "100%",
    padding: 12,
    background:
      "linear-gradient(180deg, #f4f7fb 0%, #eef3f8 100%)",
  },

  dashboard: {
    fontFamily:
      "Segoe UI, Inter, sans-serif",
    width: "100%",
    maxWidth: 1180,
    margin: "0 auto",
  },

  section: {
    background:
      "rgba(255,255,255,0.96)",
    borderRadius: 22,
    marginBottom: 14,
    boxShadow:
      "0 14px 28px rgba(15,23,42,0.05)",
    border:
      "1px solid rgba(11,79,108,0.08)",
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
    marginBottom: 4,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 800,
    color: "#fff",
  },

  sectionSubtitle: {
    marginTop: 5,
    fontSize: 13,
    color: "rgba(255,255,255,0.92)",
  },

  sectionBody: {
    padding: 14,
  },

  grid: {
    display: "grid",
    gap: 14,
    alignItems: "start",
  },

  cardTabla: {
    overflow: "auto",
    border:
      "1px solid rgba(148,163,184,0.18)",
    borderRadius: 14,
    background: "#fff",
    maxHeight: 250,
  },

  cardGrafico: {
    background:
      "linear-gradient(180deg, #fbfdff 0%, #f4f7fb 100%)",
    padding: 10,
    borderRadius: 16,
    overflow: "hidden",
    border:
      "1px solid rgba(148,163,184,0.14)",
  },

  cardGraficoGrande: {
    background:
      "linear-gradient(180deg, #fbfdff 0%, #f4f7fb 100%)",
    padding: 10,
    borderRadius: 16,
    width: "100%",
    overflow: "hidden",
    border:
      "1px solid rgba(148,163,184,0.14)",
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
    fontSize: 12.5,
  },

  tdMonto: {
    padding: "9px 12px",
    borderBottom: "1px solid #F1F5F9",
    fontSize: 12.5,
    fontWeight: 700,
    color: "#0F172A",
    whiteSpace: "nowrap",
  },

};