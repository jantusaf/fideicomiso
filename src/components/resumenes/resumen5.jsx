import React, { useEffect, useState } from "react";
import servicionivel3 from "../../services/nivel3";

export default function DashboardPro() {

  const [data, setData] = useState({
    ingresos: [],
    egresos: [],
    saldoMensual: [],
    totalIngresos: 0,
    totalEgresos: 0,
    proporcion: 0
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const resp = await servicionivel3.traermovimientos();

      const ingresosMap = {};
      const egresosMap = {};
      const saldoPorMes = {};

      let totalIngresos = 0;
      let totalEgresos = 0;

      resp.forEach(mov => {

        const concepto = mov.concepto || "Sin categoría";

        const debito = Number(mov.debito) || 0;
        const credito = Number(mov.credito) || 0;

        const fecha = new Date(mov.fecha);
        const mes = fecha.toLocaleString("es-AR", { month: "short" });

        /* ---------------- INGRESOS ---------------- */
        if (credito > 0) {
          if (!ingresosMap[concepto]) ingresosMap[concepto] = 0;

          ingresosMap[concepto] += credito;
          totalIngresos += credito;
        }

        /* ---------------- EGRESOS ---------------- */
        if (debito > 0) {
          if (!egresosMap[concepto]) egresosMap[concepto] = 0;

          egresosMap[concepto] += debito;
          totalEgresos += debito;
        }

        /* ---------------- SALDO MENSUAL ---------------- */
        const saldo = credito - debito;

        if (!saldoPorMes[mes]) saldoPorMes[mes] = 0;

        saldoPorMes[mes] += saldo;

      });

      /* ---------------- TRANSFORMACIONES ---------------- */

      const ingresosArray = Object.entries(ingresosMap)
        .map(([concepto, monto]) => ({ concepto, monto }))
        .sort((a, b) => b.monto - a.monto);

      const egresosArray = Object.entries(egresosMap)
        .map(([concepto, monto]) => ({ concepto, monto }))
        .sort((a, b) => b.monto - a.monto);

      let acumulado = 0;

      const saldoArray = Object.entries(saldoPorMes).map(([mes, valor]) => {
        acumulado += valor;
        return { mes, saldo: acumulado };
      });

      const proporcion = totalEgresos / totalIngresos;

      setData({
        ingresos: ingresosArray,
        egresos: egresosArray,
        saldoMensual: saldoArray,
        totalIngresos,
        totalEgresos,
        proporcion
      });

    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>Dashboard Financiero</h2>

      {/* RESUMEN */}
      <div style={styles.resumen}>

        <Card title="Ingresos">
          ${data.totalIngresos.toLocaleString()}
        </Card>

        <Card title="Egresos">
          ${data.totalEgresos.toLocaleString()}
        </Card>

        <Card title="Proporción">
          {data.proporcion.toFixed(2)}
        </Card>

      </div>

      {/* TABLAS */}
      <div style={styles.grid}>

        <Tabla titulo="Ingresos" data={data.ingresos} />

        <Tabla titulo="Egresos" data={data.egresos} />

      </div>

      {/* SALDO MENSUAL */}
      <div style={styles.card}>
        <h3>Saldo mensual acumulado</h3>

        {data.saldoMensual.map((m, i) => (
          <div key={i} style={styles.row}>
            <span>{m.mes}</span>
            <strong>${m.saldo.toLocaleString()}</strong>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ---------------- COMPONENTES ---------------- */

function Tabla({ titulo, data }) {
  return (
    <div style={styles.card}>
      <h3>{titulo}</h3>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>Concepto</th>
            <th>Monto</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item, i) => (
            <tr key={i}>
              <td>{item.concepto}</td>
              <td>${item.monto.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div style={styles.cardMini}>
      <span>{title}</span>
      <h2>{children}</h2>
    </div>
  );
}

/* ---------------- ESTILOS ---------------- */

const styles = {

  container: {
    padding: 30,
    background: "#f5f7fa",
    minHeight: "100vh",
    fontFamily: "Segoe UI"
  },

  title: {
    textAlign: "center",
    marginBottom: 30
  },

  resumen: {
    display: "flex",
    gap: 20,
    marginBottom: 30,
    justifyContent: "center"
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20
  },

  card: {
    background: "#fff",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },

  cardMini: {
    background: "#fff",
    padding: 15,
    borderRadius: 10,
    minWidth: 150,
    textAlign: "center",
    boxShadow: "0 5px 15px rgba(0,0,0,0.05)"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse"
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "5px 0",
    borderBottom: "1px solid #eee"
  }

};