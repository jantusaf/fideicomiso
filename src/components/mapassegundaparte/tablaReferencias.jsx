import React, { useMemo, useState } from "react";
import "./MapaConCapas.css";

const referencias = [
  { tipo: "titulo", texto: "CORREDORES" },
  {
    color: "#ffbc8e", texto: "C1 - Corredor de densidad 1",
    norma: { fot: "6.5", fos: "0.70", altura: "10 plantas / 31 m", parcela: "450 m²" },
  },
  {
    color: "#efc700", texto: "C2 - Corredor de densidad 2",
    norma: { fot: "4", fos: "0.70", altura: "6 plantas / 19 m", parcela: "450 m²" },
  },
  {
    color: "#fca24c", texto: "C3 - Corredor comercial, logístico y productivo",
    norma: { fot: "2", fos: "0.70", altura: "PB + 2 pisos", parcela: "1.500 m²" },
  },
  {
    color: "#9bcfed", texto: "CC - Corredor Comercial mixto",
    norma: { fot: "6", fos: "0.70", altura: "6 a 10 plantas (según tipo)", parcela: "450 m²" },
  },

  { tipo: "titulo", texto: "ÁREAS INTERIORES" },
  {
    color: "#6d4692", texto: "AI1 - Área interior - Densidad media baja",
    norma: { fot: "2.8", fos: "0.70", altura: "4 plantas / 13 m", parcela: "300 m²" },
  },
  {
    color: "#bda7d3", texto: "AI2 - Área interior - Densidad baja",
    norma: { fot: "2", fos: "0.65", altura: "3 plantas / 10 m", parcela: "300 m²" },
  },
  {
    color: "#d64ebd", texto: "AI3 - Área interior de densidad media baja",
    norma: { fot: "1.8", fos: "0.60", altura: "3 plantas / 10 m", parcela: "450 m²" },
  },
  {
    color: "#40a7e9", texto: "AIE - Área interior Especial - Densidad alta",
    norma: { fot: "6", fos: "0.60", altura: "12 plantas / 37 m", parcela: "1.800 m²" },
  },

  { tipo: "titulo", texto: "ÁREAS MIXTAS Y RESIDENCIALES" },
  {
    color: "#c14e4e", texto: "AM1 - Área Mixta 1 - Densidad alta",
    norma: { fot: "6", fos: "0.70", altura: "mín. 6 pl · máx. 12 pl / 37 m", parcela: "600 m²" },
  },
  {
    color: "#f0abab", texto: "AM2 - Área Mixta 2 - Densidad alta",
    norma: { fot: "4", fos: "0.70", altura: "mín. 3 pl · máx. 10 pl / 31 m", parcela: "500 m²" },
  },
  {
    color: "#debf6f", texto: "AR - Área Residencial de baja densidad",
    norma: { fot: "0.8", fos: "0.40", altura: "PB + 2 pisos", parcela: "1.000 m²" },
  },
  {
    color: "#e4eeb1", texto: "ARP - Área Residencial y agroproductiva complementaria",
    norma: { fot: "0.4", fos: "0.40", altura: "PB + 2 pisos", parcela: "2.000 m²" },
  },

  { tipo: "titulo", texto: "EQUIPAMIENTO / ESPACIOS" },
  {
    color: "#bfd1f0", texto: "EDR - Equipamiento Deportivo Recreativo",
    norma: { fot: "0.7", fos: "0.35", altura: "PB + 2 pisos", parcela: "5.000 m²" },
  },
  {
    color: "#9c9c9c", texto: "EP - Equipamiento Público",
    norma: { fot: "—", fos: "—", altura: "Según plan de sector", parcela: "—" },
  },
  {
    color: "#afd9b7", texto: "EVP - Espacio Verde Público",
    norma: { fot: "—", fos: "—", altura: "No aplica", parcela: "—" },
  },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 1" },
  { color: "#b2a792", texto: "UG1 - Distrito Administrativo" },
  { color: "#dccfb6", texto: "UG2 - Áreas Residenciales y Mixtas / PROCREAR, INVICO..." },
  { color: "#e8e1d2", texto: "UG3 - Residenciales, Mixtas y Paseo borde B° PIRAYUÍ" },
  { color: "#f5eee0", texto: "UG4 - Recreativas, Residenciales y Mixtas - Parque Bosque Nativo" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 2" },
  { color: "#c89132", texto: "UG1 - Residenciales y Mixtas / Conjuntos Habitacionales del Estado" },
  { color: "#e3a53a", texto: "UG2 - Residenciales y Mixtas - Parque Metropolitano" },
  { color: "#eeba5f", texto: "UG3 - Mixtas y Equipamientos - Borde costero Río Paraná" },
  { color: "#eccb78", texto: "UG4 - Actividades productivas y logísticas" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 3" },
  { color: "#8d3774", texto: "UG1 - Residenciales, Mixtas y Paseo borde Arroyo PIRAYUÍ" },
  { color: "#b55d9b", texto: "UG2 - Residencial Suburbana y Agroproductivas" },
  { color: "#ca7cb3", texto: "UG3 - Clubes y Equipamientos Generales" },
  { color: "#e0a3ce", texto: "UG4 - Reordenamiento Urbano de Asentamientos" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 4" },
  { color: "#ee7562", texto: "UG1 - Suburbana y Usos Recreativos, Sociales y Deportivos" },
  { color: "#f6b2a7", texto: "UG2 - Suburbana baja densidad y Paseo Público" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 5" },
  { color: "#8a8a8a", texto: "UG1 - Reordenamiento Urbano y Lotes con servicios / Parque Lineal FF.CC" },
  { color: "#c2c1c1", texto: "UG2 - Residenciales, Mixtas, Equipamientos y Parque Lineal FF.CC" },

  { tipo: "titulo", texto: "PARQUE INDUSTRIAL TECNOLÓGICO" },
  { color: "#2c73e6ff", texto: "PIT - (FASE 1 - FASE 2 - FASE 3)" },

  { tipo: "titulo", texto: "PLANTA DE LÍQUIDOS CLOACALES" },
  { color: "#c85b01", texto: "PLC" },

  { tipo: "titulo", texto: "ZONA FUELLE" },
  { color: "#f1a465", texto: "PLC - Z. Fuelle" },

  { tipo: "titulo", texto: "ZONA DE PROTECCIÓN AMBIENTAL" },
  { color: "#034F04", texto: "ZPA - Santa Catalina" },

  { tipo: "titulo", texto: "INVICO" },
  { tipo: "overlay", texto: "Invico - Otros" },

  { tipo: "titulo", texto: "RESERVA" },
  { color: "#e08c3a", texto: "Reserva Municipal" },
];

const TablaReferencias = () => {
  const [expandido, setExpandido] = useState(false);
  const [mostrarNorma, setMostrarNorma] = useState(true);

  const titulo = useMemo(
    () => (expandido ? "Referencias (expandido)" : "Referencias de Zonificación"),
    [expandido]
  );

  return (
    <div className={`refCard ${expandido ? "isExpanded" : ""}`}>
      <div className="refHeader">
        <div className="refHeaderLeft">
          <span className="refTitle">{titulo}</span>
        </div>
        <div className="refHeaderRight" style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            className="refBtn"
            onClick={() => setMostrarNorma(p => !p)}
            title={mostrarNorma ? "Ocultar parámetros" : "Ver parámetros"}
            style={{ fontSize: 11 }}
          >
            {mostrarNorma ? "Ocultar normas" : "Ver normas"}
          </button>
          <button
            type="button"
            className="refBtn"
            onClick={() => setExpandido(p => !p)}
            title={expandido ? "Contraer" : "Expandir"}
          >
            {expandido ? "Contraer" : "Expandir"}
          </button>
        </div>
      </div>

      <div className="refBody">
        {referencias.map((ref, index) => {
          if (ref.tipo === "titulo") {
            return (
              <div key={`t-${index}`} className="refSectionTitle">
                {ref.texto}
              </div>
            );
          }

          if (ref.tipo === "overlay") {
            return (
              <div className="refRow" key={`r-${index}`}>
                <div className="refSwatch" style={{
                  background: "rgba(255,0,0,0.25)",
                  border: "1.5px solid red",
                }} />
                <div className="refText">{ref.texto}</div>
              </div>
            );
          }

          return (
            <div key={`r-${index}`} style={{ marginBottom: ref.norma && mostrarNorma ? 6 : 2 }}>
              <div className="refRow">
                <div className="refSwatch" style={{ background: ref.color }} />
                <div className="refText">{ref.texto}</div>
              </div>
              {ref.norma && mostrarNorma && (
                <div style={{
                  marginLeft: 28,
                  marginTop: 3,
                  padding: "4px 8px",
                  background: "#f0f7ff",
                  borderLeft: "3px solid #93c5fd",
                  borderRadius: "0 6px 6px 0",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2px 12px",
                  fontSize: 10,
                  color: "#334155",
                }}>
                  <span><b>FOT máx:</b> {ref.norma.fot}</span>
                  <span><b>FOS máx:</b> {ref.norma.fos}</span>
                  <span><b>Sup. mín:</b> {ref.norma.parcela}</span>
                  <span><b>Altura:</b> {ref.norma.altura}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablaReferencias;
