import React, { useMemo, useState } from "react";
import "./MapaConCapas.css";

const referencias = [
  { tipo: "titulo", texto: "CORREDORES" },
  { color: "#ffbc8e", texto: "C1 - Corredor de densidad 1" },
  { color: "#efc700", texto: "C2 - Corredor de densidad 2" },
  { color: "#fca24c", texto: "C3 - Corredor comercial, logístico y productivo" },
  { color: "#9bcfed", texto: "CC - Corredor Comercial mixto" },

  { tipo: "titulo", texto: "AREAS" },
  { color: "#6d4692", texto: "AI1 - Área interior - Densidad media baja" },
  { color: "#bda7d3", texto: "AI2 - Área interior - Densidad baja" },
  { color: "#d64ebd", texto: "AI3 - Área interior de densidad media baja" },
  { color: "#40a7e9", texto: "AIE - Área interior Especial - Densidad alta" },
  { color: "#c14e4e", texto: "AM1 - Área Mixta 1 - Densidad alta" },
  { color: "#f0abab", texto: "AM1 - Área Mixta 2 - Densidad alta" },
  { color: "#debf6f", texto: "AR - Área Residencial de baja densidad" },
  { color: "#e4eeb1", texto: "ARP - Área Residencial y agroproductiva complementaria" },

  { tipo: "titulo", texto: "EQUIPAMIENTO / ESPACIOS" },
  { color: "#bfd1f0", texto: "EDR - Equipamiento Deportivo Recreativo" },
  { color: "#9c9c9c", texto: "EP - Equipamiento Público" },
  { color: "#afd9b7", texto: "EVP - Espacio Verde Público" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 1" },
  { color: "#b2a792", texto: "UG1 - Distrito Administrativo" },
  { color: "#dccfb6", texto: "UG2 - Áreas Residenciales y Mixtas / Conjuntos Habitacionales PROCREAR, INVICO..." },
  { color: "#e8e1d2", texto: "UG3 - Áreas Residenciales, Mixtas y Paseo de borde del B° PIRAYUÍ" },
  { color: "#f5eee0", texto: "UG4 - Áreas Recreativas, Residenciales y Mixtas - Reordenamiento Urbano..." },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 2" },
  { color: "#c89132", texto: "UG1 - Áreas Residenciales y Mixtas / Conjuntos Habitacionales del Estado" },
  { color: "#e3a53a", texto: "UG2 - Áreas Residenciales y Mixtas - Parque Metropolitano" },
  { color: "#eeba5f", texto: "UG3 - Áreas Mixtas y Equipamientos generales - Borde costero del Río Paraná" },
  { color: "#eccb78", texto: "UG4 - Actividades productivas y logísticas vinculadas a residencias" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 3" },
  { color: "#8d3774", texto: "UG1 - Residenciales, Mixtas y Paseo de borde del Arroyo PIRAYUÍ" },
  { color: "#b55d9b", texto: "UG2 - Residencial Suburbana y Agro productivas" },
  { color: "#ca7cb3", texto: "UG3 - Clubes y Equipamientos Generales" },
  { color: "#e0a3ce", texto: "UG4 - Reordenamiento Urbano de Asentamientos" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 4" },
  { color: "#ee7562", texto: "UG1 - Suburbana y Usos Recreativos, Sociales y Deportivos" },
  { color: "#f6b2a7", texto: "UG2 - Suburbana baja densidad y Paseo Público" },

  { tipo: "titulo", texto: "PLAN ESPECIAL - ETAPA 5" },
  { color: "#8a8a8a", texto: "UG1 - Reordenamiento Urbano y Lotes con servicios / Parque Lineal FF.CC" },
  { color: "#c2c1c1", texto: "UG2 - Residenciales, Mixtas, Equipamientos y Parque Lineal FF.CC" },

  { tipo: "titulo", texto: "PARQUE INDUSTRIAL TECNOLOGICO" },
  { color: "#2c73e6ff", texto: "PIT - (FASE 1 - FASE 2 - FASE 3)" },
  { tipo: "titulo", texto: "PLANTA DE LIQUIDOS CLOACALES" },
  { color: "#c85b01", texto: "PLC" },
  { tipo: "titulo", texto: "ZONA FUELLE" },
  { color: "#f1a465", texto: "PLC - Z. Fuelle" },
  { tipo: "titulo", texto: "ZONA DE PROTECCIÓN AMBIENTAL - Santa Catalina" },
  { color: "#034F04", texto: "ZPA" },

  { tipo: "titulo", texto: "INVICO" },
  { tipo: "overlay", texto: "Invico - Otros" },

  { tipo: "titulo", texto: "RESERVA" },
  { color: "#e08c3a", texto: "Reserva Municipal" },
];

const TablaReferencias = () => {
  const [expandido, setExpandido] = useState(false);

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

        <div className="refHeaderRight">
          <button
            type="button"
            className="refBtn"
            onClick={() => setExpandido((p) => !p)}
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
            <div className="refRow" key={`r-${index}`}>
              <div className="refSwatch" style={{ background: ref.color }} />
              <div className="refText">{ref.texto}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TablaReferencias;