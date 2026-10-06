import "./MapaConCapas.css";
import REFERENCIAS from "../mapas/referenciasData";

// Cuadro de referencias de mensuras (mismo estilo que las otras tablas de referencias del mapa).
// El contenido sale de ../mapas/referenciasData.js (mapa "1").
const TablaReferenciasMensuras = () => {
  const datos = REFERENCIAS["1"];

  return (
    <div className="refCard">
      <div className="refHeader">
        <div className="refHeaderLeft">
          <span className="refTitle">Referencias de mensuras</span>
        </div>
      </div>

      <div className="refBody">
        {datos.secciones.length === 0 ? (
          <div className="refText">Todavía no hay referencias cargadas.</div>
        ) : (
          datos.secciones.map((sec, i) => (
            <div key={`${sec.titulo}-${i}`} style={{ marginTop: i === 0 ? 0 : 12 }}>
              {sec.titulo ? <div className="refSectionTitle">{sec.titulo}</div> : null}
              {sec.items.map((item, j) => (
                <div key={j} className="refRow" style={{ paddingLeft: item.sub ? 26 : 8 }}>
                  {item.color ? <div className="refSwatch" style={{ background: item.color }} /> : null}
                  {item.borde ? (
                    <div className="refSwatch" style={{ background: "transparent", border: `2.5px dashed ${item.borde}` }} />
                  ) : null}
                  {item.linea ? (
                    <div className="refSwatch" style={{ height: 0, borderRadius: 0, border: "none", borderTop: `3px solid ${item.linea}`, marginTop: 8 }} />
                  ) : null}
                  <div className="refText">{item.texto}</div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TablaReferenciasMensuras;
