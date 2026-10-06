import REFERENCIAS from "./referenciasData";

const COLOR_TEXT = "#1a303e";
const COLOR_MUTED = "#6b7a86";
const COLOR_BORDER = "#e2e6e9";

function Muestra({ item }) {
  if (item.linea) {
    return <div style={{ width: 22, height: 0, borderTop: `3px solid ${item.linea}`, flexShrink: 0 }} />;
  }
  if (item.borde) {
    return (
      <div
        style={{
          width: 22, height: 14, flexShrink: 0, borderRadius: 3,
          background: "transparent", border: `2.5px dashed ${item.borde}`,
        }}
      />
    );
  }
  if (item.color) {
    return (
      <div
        style={{
          width: 22, height: 14, flexShrink: 0, borderRadius: 3,
          background: item.color, border: "1px solid rgba(0,0,0,0.18)",
        }}
      />
    );
  }
  return null;
}

// Cuadro flotante de referencias del mapa elegido (mapa = "1" IC3, "2" Parque).
export default function CuadroReferencias({ mapa, onCerrar }) {
  const datos = REFERENCIAS[mapa];
  if (!datos) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: 20,
        bottom: 20,
        zIndex: 1100,
        width: 300,
        maxWidth: "calc(100vw - 40px)",
        maxHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        background: "#fff",
        border: `1px solid ${COLOR_BORDER}`,
        borderTop: `3px solid ${COLOR_TEXT}`,
        borderRadius: 12,
        boxShadow: "0 10px 30px rgba(15, 34, 48, 0.18)",
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderBottom: `1px solid ${COLOR_BORDER}`,
        }}
      >
        <span style={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT }}>{datos.titulo}</span>
        <button
          onClick={onCerrar}
          title="Cerrar"
          style={{
            border: "none", background: "transparent", cursor: "pointer",
            fontSize: 16, lineHeight: 1, color: COLOR_MUTED, padding: 4,
          }}
        >
          ✕
        </button>
      </div>

      <div style={{ padding: "8px 14px 12px", overflowY: "auto" }}>
        {datos.secciones.length === 0 ? (
          <div style={{ fontSize: 13, color: COLOR_MUTED, padding: "10px 0" }}>
            Todavía no hay referencias cargadas para este mapa.
          </div>
        ) : (
          datos.secciones.map((sec, i) => (
            <div key={`${sec.titulo}-${i}`} style={{ marginTop: i === 0 ? 4 : 12 }}>
              {sec.titulo ? (
                <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: COLOR_MUTED, marginBottom: 6 }}>
                  {sec.titulo}
                </div>
              ) : null}
              {sec.items.map((item, j) => (
                <div
                  key={j}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "4px 0",
                    paddingLeft: item.sub ? 18 : 0,
                  }}
                >
                  <Muestra item={item} />
                  <span style={{ fontSize: 13, color: COLOR_TEXT, lineHeight: 1.25 }}>{item.texto}</span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
