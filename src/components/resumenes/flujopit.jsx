import { useEffect, useState } from "react";
import servicioCuotas from "../../services/cuotas";
import { useTemaColores } from "../../context/ModoOscuroContext";
import datos from "./flujoproyectadoData";
import { crearEstilos, CabeceraSeccion } from "./flujoproyectado";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import PaidIcon from "@mui/icons-material/Paid";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const formatoMoneda = (valor) => {
  const n = Number(valor) || 0;
  if (n === 0) return "-";
  return (n < 0 ? "-$" : "$") + Math.round(Math.abs(n)).toLocaleString("es-AR");
};

const formatoPorcentaje = (valor) => {
  if (valor === null || valor === undefined) return "-";
  return (Number(valor) * 100).toFixed(1) + "%";
};

// Filas del cuadro, en dos bloques. `destacada` resalta las filas clave y
// `total` define cómo se resume el año ("suma" o "ratio" para el porcentaje).
const FILAS_CUOTAS = [
  { label: "Devengado", key: "devengado", formato: formatoMoneda },
  { label: "Cobrado (Cuotas)", key: "cobradoCuotas", formato: formatoMoneda },
  { label: "Cuotas Impagas", key: "cuotasImpagas", formato: formatoMoneda, destacada: true },
  { label: "% Cobranza", key: "porcentajeCobranza", formato: formatoPorcentaje, total: "ratio" },
  { label: "Diferencia Dev.", key: "diferenciaDev", formato: formatoMoneda },
];

const FILAS_INGRESOS = [
  { label: "Total ingresado por pagos", key: "totalIngresadoPorPagos", formato: formatoMoneda },
  { label: "TOTAL MENSUAL", key: "totalMensual", formato: formatoMoneda, destacada: true },
  { label: "Importe a cuotas del mes", key: "importeACuotasDelMes", formato: formatoMoneda },
  { label: "Total ingresado en el mes", key: "totalIngresadoEnElMes", formato: formatoMoneda },
  { label: "Diferencia", key: "diferencia", formato: formatoMoneda, destacada: true },
];

export default function FlujoPit() {
  const c = useTemaColores();
  const s = crearEstilos(c);
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

  const sumaAnual = (key) => (meses ? meses.reduce((acc, m) => acc + (m[key] || 0), 0) : 0);

  // Total anual por fila: suma para los montos, recalculado para el %.
  const totalAnual = (fila) => {
    if (!meses) return null;
    if (fila.total === "ratio") {
      const devengado = sumaAnual("devengado");
      return devengado > 0 ? sumaAnual("cobradoCuotas") / devengado : null;
    }
    return sumaAnual(fila.key);
  };

  const tabla = (filas) => (
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
          {filas.map((fila) => {
            const extra = fila.destacada ? s.filaTotal : {};
            return (
              <tr key={fila.key} style={fila.destacada ? s.filaTotal : undefined}>
                <td style={{ ...s.td, ...s.tdConcepto, ...extra }}>{fila.label}</td>
                {meses.map((m) => (
                  <td key={m.mes} style={{ ...s.td, ...extra }}>
                    {fila.formato(m[fila.key])}
                  </td>
                ))}
                <td style={{ ...s.td, ...s.tdTotalCol, ...extra }}>{fila.formato(totalAnual(fila))}</td>
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

  const devengadoAnual = sumaAnual("devengado");
  const cobradoAnual = sumaAnual("cobradoCuotas");

  return (
    <div style={s.page}>
      <div style={s.pageHeader}>
        <div style={s.pageIcon}><AccountBalanceIcon /></div>
        <div>
          <h2 style={s.pageTitle}>Flujo de Fondos PIT</h2>
          <div style={s.pageSubtitle}>Cobranzas de todos los clientes del Parque, agregadas por mes · {anio}</div>
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
      ) : (
        <>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
            {tarjeta({
              titulo: "Devengado del año",
              valor: formatoMoneda(devengadoAnual),
              detalle: "Cuotas que vencían en el año",
              color: c.COLOR_TEAL,
            })}
            {tarjeta({
              titulo: "Cobrado (cuotas)",
              valor: formatoMoneda(cobradoAnual),
              detalle: `${formatoPorcentaje(devengadoAnual > 0 ? cobradoAnual / devengadoAnual : null)} del devengado`,
              color: c.COLOR_GREEN,
            })}
            {tarjeta({
              titulo: "Total ingresado por pagos",
              valor: formatoMoneda(sumaAnual("totalIngresadoPorPagos")),
              detalle: "Toda la plata que entró, con excedentes",
              color: c.COLOR_NAVY,
            })}
          </div>

          <div style={s.section}>
            <CabeceraSeccion
              s={s}
              icono={<RequestQuoteIcon />}
              color={c.COLOR_TEAL}
              titulo="Devengado y cobranza de cuotas"
              subtitulo="Lo que se devengó cada mes contra lo cobrado, sin contar los excedentes"
            />
            <div style={s.sectionBody}>{tabla(FILAS_CUOTAS)}</div>
          </div>

          <div style={s.section}>
            <CabeceraSeccion
              s={s}
              icono={<PaidIcon />}
              color={c.COLOR_GREEN}
              titulo="Ingresos por pagos"
              subtitulo="Toda la plata que entró cada mes, con excedentes, y cuánto fue a las cuotas del mes"
            />
            <div style={s.sectionBody}>{tabla(FILAS_INGRESOS)}</div>
          </div>
        </>
      )}
    </div>
  );
}
