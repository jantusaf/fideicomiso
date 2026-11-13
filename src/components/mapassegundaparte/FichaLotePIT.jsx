import { useEffect } from "react";
import { GRUPOS_FLAGS } from "./pitLotesUtil";

const GRIS = "#6b7a86";
const TINTA = "#1a303e";

// "Lote    4" / "Estado lote\tNo Disponible" / "medidas= 100X100" -> { etiqueta, valor }
const partirLinea = (linea) => {
    const limpia = linea.replace(/\s+/g, " ").trim();
    const m = linea.trim().match(/^([^\t:=]{2,40}?)(?:\t+|\s{2,}|\s*[:=]\s*)(.+)$/);
    if (!m) return { etiqueta: null, valor: limpia };
    return { etiqueta: m[1].replace(/\s+/g, " ").trim(), valor: m[2].replace(/\s+/g, " ").trim() };
};

// Lineas del texto original que son casillas (acceso, servicios...): se muestran como lista, no como "etiqueta: valor".
const ES_CASILLA = /^(sin acceso|con acceso|agua|cloacas|sumidero|cuneta|energ[ií]a|fibra|pasto alto)/i;
const MARCA = /\s+(x|si|sí)\s*$/i;

// Texto original del pin, ordenado en filas (en vez de mostrarlo crudo con tabulaciones y espacios).
function TextoOriginal({ desc }) {
    const lineas = desc.split("\n").map((l) => l.trim()).filter(Boolean);
    return (
        <div style={{ marginTop: 8, background: "#f7f9fa", borderRadius: 10, padding: "6px 12px", maxHeight: 190, overflowY: "auto", border: "1px solid #eaeef0" }}>
            {lineas.map((l, i) => {
                if (/^consumo energ/i.test(l) && !/\d/.test(l)) return null; // casillas vacias que no aportan
                if (ES_CASILLA.test(l)) {
                    const marcada = MARCA.test(l);
                    const texto = l.replace(MARCA, "").replace(/\s+/g, " ").replace(/\s*:\s*/, ": ").trim();
                    return (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 12, borderBottom: "1px solid #eef1f3", color: marcada ? "#166534" : "#a3adb5", fontWeight: marcada ? 600 : 400 }}>
                            <span style={{ width: 14, textAlign: "center", fontWeight: 800 }}>{marcada ? "✓" : "–"}</span>
                            {texto}
                        </div>
                    );
                }
                const { etiqueta, valor } = partirLinea(l);
                if (!etiqueta) {
                    return <div key={i} style={{ padding: "4px 0", fontSize: 12, color: "#44515b", borderBottom: "1px solid #eef1f3" }}>{valor}</div>;
                }
                return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 10, padding: "4px 0", fontSize: 12, borderBottom: "1px solid #eef1f3" }}>
                        <span style={{ color: GRIS, fontWeight: 600 }}>{etiqueta}</span>
                        <span style={{ color: "#2b3943", textAlign: "right", maxWidth: "62%" }}>{valor}</span>
                    </div>
                );
            })}
        </div>
    );
}

function Dato({ etiqueta, valor }) {
    return (
        <div style={{ flex: 1, minWidth: 0, background: "#f4f7f9", borderRadius: 10, padding: "9px 12px" }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: GRIS, textTransform: "uppercase", letterSpacing: 0.4 }}>{etiqueta}</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: valor ? TINTA : "#b5bec6", marginTop: 2, overflowWrap: "anywhere" }}>{valor || "—"}</div>
        </div>
    );
}

// Lista de casillas: lo que tiene el lote (✓ verde) y lo que no (gris tenue), para ver qué falta de un vistazo.
function Checklist({ titulo, campos, info }) {
    return (
        <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: GRIS, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{titulo}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                {campos.map(({ campo, etiqueta }) => {
                    const si = Number(info[campo]) === 1;
                    return (
                        <div key={campo} style={{
                            display: "flex", alignItems: "center", gap: 7, padding: "6px 9px", borderRadius: 8, fontSize: 12.5,
                            background: si ? "#ecf8f0" : "#f6f7f8", color: si ? "#166534" : "#a3adb5", fontWeight: si ? 600 : 500,
                        }}>
                            <span style={{
                                width: 16, height: 16, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
                                fontSize: 10, fontWeight: 800, background: si ? "#22c55e" : "#e1e6ea", color: si ? "#fff" : "#a3adb5",
                            }}>{si ? "✓" : "–"}</span>
                            {etiqueta}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Ficha de un lote del PIT (se abre al hacer clic en un pin del mapa).
// `datos` = el objeto que arma componente1 (datosPin + id + color).
export default function FichaLotePIT({ datos, puedeEditar, onEditar, onCerrar }) {
    useEffect(() => {
        const alTeclear = (e) => { if (e.key === "Escape") onCerrar(); };
        window.addEventListener("keydown", alTeclear);
        return () => window.removeEventListener("keydown", alTeclear);
    }, [onCerrar]);

    const titulo = datos.lote
        ? `${datos.mz ? `Manzana ${datos.mz} · ` : ""}Lote ${datos.lote}`
        : datos.mz ? `Manzana ${datos.mz}` : "Lote PIT";
    const info = datos.info;
    const grupos = GRUPOS_FLAGS.filter((g) => g.titulo !== "Otros");
    const pasto = info && Number(info.pasto_alto) === 1;

    return (
        <div onClick={onCerrar} style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(10,25,35,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            <div onClick={(e) => e.stopPropagation()} style={{
                background: "#fff", borderRadius: 16, width: 400, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column",
                boxShadow: "0 12px 48px rgba(0,0,0,0.28)", overflow: "hidden", fontFamily: "inherit",
            }}>
                {/* Cabecera con el color del estado */}
                <div style={{ background: datos.color, padding: "16px 18px 15px", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ color: "#fff", fontWeight: 800, fontSize: 18, letterSpacing: 0.1, overflowWrap: "anywhere" }}>{titulo}</div>
                        {datos.estado && (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 7, background: "rgba(255,255,255,0.26)", color: "#fff", borderRadius: 999, padding: "3px 11px", fontSize: 12, fontWeight: 700 }}>
                                <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff" }} />
                                {datos.estado}
                            </span>
                        )}
                    </div>
                    <button onClick={onCerrar} aria-label="Cerrar" style={{ background: "rgba(255,255,255,0.26)", border: "none", borderRadius: 9, color: "#fff", fontSize: 19, lineHeight: 1, width: 32, height: 32, cursor: "pointer", fontWeight: 700, flexShrink: 0 }}>×</button>
                </div>

                {/* Cuerpo */}
                <div style={{ padding: "16px 18px 18px", overflowY: "auto" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                        <Dato etiqueta="Superficie" valor={datos.sup ? `${datos.sup} m²` : null} />
                        <Dato etiqueta="Medidas" valor={datos.medidas} />
                    </div>

                    {/* Quien edita ve siempre la tarjeta (para poder agregar el nombre); el resto solo si hay empresa */}
                    {(datos.empresa || puedeEditar) && (
                        <div style={{ marginTop: 10, border: "1px solid #e3e8ec", borderRadius: 10, padding: "9px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ minWidth: 0 }}>
                                <div style={{ fontSize: 10.5, fontWeight: 700, color: GRIS, textTransform: "uppercase", letterSpacing: 0.4 }}>Empresa</div>
                                {datos.empresa ? (
                                    <div style={{ fontSize: 14, fontWeight: 700, color: TINTA, marginTop: 2, overflowWrap: "anywhere" }}>{datos.empresa}</div>
                                ) : (
                                    <div style={{ fontSize: 13, color: "#b5bec6", marginTop: 2, fontStyle: "italic" }}>Sin empresa asignada</div>
                                )}
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                                {datos.empresa && datos.empresaTipo && (
                                    <span style={{ background: "#e8f1fb", color: "#1565c0", borderRadius: 999, padding: "3px 10px", fontSize: 11.5, fontWeight: 700 }}>{datos.empresaTipo}</span>
                                )}
                                {puedeEditar && datos.id && (
                                    <button onClick={() => onEditar("empresa")} style={{ background: "#eef3f6", border: "none", borderRadius: 8, padding: "5px 10px", fontSize: 12, fontWeight: 700, color: TINTA, cursor: "pointer" }}>
                                        {datos.empresa ? "Cambiar" : "+ Agregar"}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                    {info && grupos.map((g) => <Checklist key={g.titulo} titulo={g.titulo} campos={g.campos} info={info} />)}

                    {pasto && (
                        <div style={{ marginTop: 10, background: "#fff8e6", color: "#8a5a00", borderRadius: 8, padding: "6px 10px", fontSize: 12, fontWeight: 600 }}>
                            🌿 Con pasto alto
                        </div>
                    )}

                    {datos.observaciones && (
                        <div style={{ marginTop: 14, borderLeft: "3px solid #cfd8dc", background: "#f7f9fa", borderRadius: "0 8px 8px 0", padding: "8px 12px" }}>
                            <div style={{ fontSize: 10.5, fontWeight: 800, color: GRIS, textTransform: "uppercase", letterSpacing: 0.4 }}>Observaciones</div>
                            <div style={{ fontSize: 13, color: "#33414c", marginTop: 3, whiteSpace: "pre-wrap" }}>{datos.observaciones}</div>
                        </div>
                    )}

                    {puedeEditar && datos.id && (
                        <button onClick={() => onEditar()} style={{ marginTop: 16, width: "100%", padding: "10px 0", borderRadius: 9, border: "none", background: TINTA, color: "#fff", fontWeight: 700, fontSize: 13.5, cursor: "pointer" }}>
                            Editar datos del lote
                        </button>
                    )}

                    {datos.desc && (
                        <details style={{ marginTop: 14 }}>
                            <summary style={{ cursor: "pointer", fontSize: 12, color: GRIS, fontWeight: 700 }}>
                                {info ? "Ver texto original de la ficha" : "Ver ficha completa"}
                            </summary>
                            <TextoOriginal desc={datos.desc} />
                        </details>
                    )}
                </div>
            </div>
        </div>
    );
}
