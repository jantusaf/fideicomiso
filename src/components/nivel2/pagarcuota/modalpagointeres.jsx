import React, { useEffect, useState } from "react";
import serviciopagos from "../../../services/pagos";

const ModalPagos = (props) => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pagos, setPagos] = useState([]);
  const [pagoSeleccionado, setPagoSeleccionado] = useState("");
  const [tipoOperacion, setTipoOperacion] = useState("");

  const cargarPagos = async () => {
    try {
      const data = await serviciopagos.traerpagosdeuncliente(props.cuil_cuit);
      console.log(data);
      setPagos(data);
    } catch (error) {
      console.error("Error al traer pagos:", error);
    }
  };

  const puedeEnviar = () => {
    if (tipoOperacion === "pago interes") {
      return pagoSeleccionado !== "";
    } else if (tipoOperacion === "diferencia minima") {
      return true;
    }
    return false;
  };

  const handleEnviar = async () => {
    const datosAEnviar = {
      id_interes: props.id_interes,
      id_pago: pagoSeleccionado,
      tipo_operacion: tipoOperacion,
    };

    const rta = await serviciopagos.registrarInteres(datosAEnviar);
    alert(rta);
    props.traer();
    setModalAbierto(false);
  };

  return (
    <>
      <button
        type="button"
        style={styles.botonAbrir}
        onClick={() => {
          cargarPagos();
          setModalAbierto(true);
        }}
      >
        Pagar interés
      </button>

      {modalAbierto && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.header}>Registrar interés</div>

            <div style={styles.body}>
              <label style={styles.label}>Tipo de operación</label>
              <select
                value={tipoOperacion}
                onChange={(e) => setTipoOperacion(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Seleccioná tipo de operación --</option>
                <option value="pago interes">Pago Interés</option>
                <option value="diferencia minima">Diferencia Mínima</option>
                <option value="no aplica">No aplica</option>
              </select>

              <label style={styles.label}>Seleccionar pago</label>
              <select
                value={pagoSeleccionado}
                onChange={(e) => setPagoSeleccionado(e.target.value)}
                style={styles.select}
              >
                <option value="">-- Seleccioná un pago --</option>
                {pagos.map((pago) => (
                  <option key={pago.id} value={pago.id}>
                    {`${pago.mes}/${pago.anio} - $${pago.monto}`}
                  </option>
                ))}
              </select>

              <div style={styles.botones}>
                <button
                  type="button"
                  onClick={handleEnviar}
                  disabled={!puedeEnviar()}
                  style={{
                    ...styles.botonEnviar,
                    opacity: puedeEnviar() ? 1 : 0.5,
                    cursor: puedeEnviar() ? "pointer" : "not-allowed",
                  }}
                >
                  Enviar
                </button>

                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  style={styles.botonCerrar}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  // ✅ COMPACTO para que no agrande la fila de la tabla
  botonAbrir: {
    borderRadius: 10,
    textTransform: "none",
    fontWeight: 900,
    fontSize: "0.78rem",
    lineHeight: 1,
    backgroundColor: "#d32f2f",
    boxShadow: "0 10px 25px rgba(211,47,47,0.22)",
    color: "#fff",
    padding: "6px 10px",
    minHeight: 30,
    border: "none",
    cursor: "pointer",
    whiteSpace: "nowrap",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(15,34,48,0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  modal: {
    background: "#fff",
    borderRadius: 14,
    minWidth: 340,
    boxShadow: "0 20px 50px rgba(15,34,48,0.25)",
    overflow: "hidden",
  },

  header: {
    background: "#fff",
    color: "#1a303e",
    fontWeight: 700,
    padding: "14px 18px",
    fontSize: 16,
    borderBottom: "1px solid #e2e6e9",
  },

  body: {
    padding: "16px",
  },

  label: {
    fontWeight: 600,
    fontSize: 13,
    color: "#1a303e",
    display: "block",
    marginTop: 10,
    marginBottom: 6,
  },

  select: {
    width: "100%",
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #c9d2d8",
    fontWeight: 500,
  },

  botones: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 16,
  },

  botonEnviar: {
    borderRadius: 8,
    background: "#1a303e",
    color: "#fff",
    fontWeight: 600,
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
  },

  botonCerrar: {
    borderRadius: 8,
    background: "#fff",
    border: "1px solid #c9d2d8",
    color: "#1a303e",
    fontWeight: 600,
    padding: "8px 14px",
    cursor: "pointer",
  },
};

export default ModalPagos;
