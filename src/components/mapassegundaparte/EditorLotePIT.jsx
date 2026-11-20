import { useEffect, useState } from "react";
import servicioPitLotes from "../../services/pitLotes";
import { ESTADOS_PIT, GRUPOS_FLAGS, SITUACIONES_PIT } from "./pitLotesUtil";

const TEXTOS = ["manzana", "lote", "medidas", "superficie", "empresa", "observaciones"];
const FLAGS = GRUPOS_FLAGS.flatMap((g) => g.campos.map((c) => c.campo));

const estiloInput = {
    width: "100%", boxSizing: "border-box", padding: "7px 9px", fontSize: 13,
    border: "1px solid #d5dbe0", borderRadius: 7, fontFamily: "inherit", background: "#fff", color: "#222",
};
const estiloEtiqueta = { display: "block", fontSize: 11, fontWeight: 700, color: "#6b7a86", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.3 };

const formatoFecha = (valor) => {
    const f = new Date(valor);
    return Number.isNaN(f.getTime()) ? String(valor) : f.toLocaleString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" });
};

const resumenCambio = (campo, { antes, despues }) => {
    const v = (x) => (x === null || x === undefined || x === "" ? "—" : x === 1 ? "sí" : x === 0 ? "no" : x);
    return `${campo.replace(/_/g, " ")}: ${v(antes)} → ${v(despues)}`;
};

// Formulario para editar los datos de un lote del PIT (solo lo abre el nivel 8).
// `lote` = { id, ...campos actuales }. `onGuardado(fila)` recibe la fila ya guardada en la base.
// `enfocar` = campo que recibe el cursor al abrir (por ahora "empresa"). `empresasSugeridas` = nombres ya cargados,
// para elegir uno existente en vez de volver a escribirlo (evita variantes del mismo nombre).
export default function EditorLotePIT({ lote, onCerrar, onGuardado, enfocar, empresasSugeridas = [] }) {
    const [form, setForm] = useState(() => ({ ...lote.valores }));
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [verHistorial, setVerHistorial] = useState(false);
    const [historial, setHistorial] = useState(null);

    useEffect(() => {
        if (!verHistorial || historial) return;
        servicioPitLotes.historial(lote.id).then(setHistorial).catch(() => setHistorial([]));
    }, [verHistorial, historial, lote.id]);

    const cambiar = (campo, valor) => setForm((f) => ({ ...f, [campo]: valor }));

    const guardar = async () => {
        setGuardando(true);
        setError("");
        try {
            const cambios = { estado: form.estado, empresa_tipo: form.empresa_tipo || "", situacion: form.situacion || "" };
            TEXTOS.forEach((c) => { cambios[c] = form[c] ?? ""; });
            FLAGS.forEach((c) => { cambios[c] = Number(form[c]) === 1; });
            const fila = await servicioPitLotes.guardar(lote.id, cambios);
            onGuardado(fila);
        } catch (e) {
            const respuesta = e?.response;
            const mensajeDelServidor = typeof respuesta?.data === "object" ? respuesta.data?.error : null;
            setError(
                mensajeDelServidor ||
                (e?.message === "error login"
                    ? "Tu sesión venció. Volvé a iniciar sesión para guardar."
                    : respuesta?.status === 404
                        ? "El servidor todavía no tiene activada la edición de lotes (falta actualizar el back y cargar pit_lotes.sql)."
                        : "No se pudo guardar. Revisá tu conexión e intentá de nuevo.")
            );
        }
        setGuardando(false);
    };

    return (
        <div onClick={onCerrar} style={{ position: "fixed", inset: 0, zIndex: 10000, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", padding: 12 }}>
            <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 14, width: 440, maxWidth: "100%", maxHeight: "92vh", display: "flex", flexDirection: "column", boxShadow: "0 8px 40px rgba(0,0,0,0.28)", fontFamily: "inherit" }}>
                <div style={{ padding: "14px 18px", borderBottom: "1px solid #e8ecef", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                        <div style={{ fontWeight: 800, fontSize: 16, color: "#1a303e" }}>Editar lote</div>
                        <div style={{ fontSize: 11, color: "#8a97a1" }}>{lote.id}</div>
                    </div>
                    <button onClick={onCerrar} style={{ background: "#f1f4f6", border: "none", borderRadius: 8, width: 30, height: 30, fontSize: 18, cursor: "pointer", color: "#51616d" }}>×</button>
                </div>

                <div style={{ padding: "14px 18px", overflowY: "auto" }}>
                    <span style={estiloEtiqueta}>Estado (define el color del pin)</span>
                    <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                        {ESTADOS_PIT.map((e) => {
                            const activo = form.estado === e.valor;
                            return (
                                <button key={e.valor} type="button" onClick={() => cambiar("estado", e.valor)} style={{
                                    flex: 1, padding: "8px 4px", fontSize: 12, fontWeight: 700, cursor: "pointer", borderRadius: 8, fontFamily: "inherit",
                                    border: `2px solid ${activo ? e.borde : "#e1e6ea"}`, background: activo ? e.color : "#fff", color: activo ? "#fff" : "#51616d",
                                }}>
                                    <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: activo ? "#fff" : e.color, marginRight: 5 }} />
                                    {e.etiqueta}
                                </button>
                            );
                        })}
                    </div>

                    <label style={{ display: "block", marginBottom: 14 }}>
                        <span style={estiloEtiqueta}>Situación (dato adicional, no cambia el color)</span>
                        <select style={estiloInput} value={form.situacion || ""} onChange={(e) => cambiar("situacion", e.target.value)}>
                            <option value="">— Sin definir —</option>
                            {SITUACIONES_PIT.map((s) => <option key={s.valor} value={s.valor}>{s.valor}</option>)}
                        </select>
                    </label>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                        {[["manzana", "Manzana"], ["lote", "Lote"], ["medidas", "Medidas"], ["superficie", "Superficie (m²)"]].map(([campo, etiqueta]) => (
                            <label key={campo}>
                                <span style={estiloEtiqueta}>{etiqueta}</span>
                                <input style={estiloInput} value={form[campo] ?? ""} maxLength={120} onChange={(e) => cambiar(campo, e.target.value)} />
                            </label>
                        ))}
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 130px", gap: 10, marginBottom: 12 }}>
                        <label>
                            <span style={estiloEtiqueta}>Empresa</span>
                            <input
                                style={estiloInput}
                                value={form.empresa ?? ""}
                                maxLength={200}
                                list="pit-empresas"
                                autoFocus={enfocar === "empresa"}
                                placeholder="Nombre de la empresa"
                                onChange={(e) => cambiar("empresa", e.target.value)}
                            />
                            <datalist id="pit-empresas">
                                {empresasSugeridas.map((nombre) => <option key={nombre} value={nombre} />)}
                            </datalist>
                        </label>
                        <label>
                            <span style={estiloEtiqueta}>Vínculo</span>
                            <select style={estiloInput} value={form.empresa_tipo || ""} onChange={(e) => cambiar("empresa_tipo", e.target.value)}>
                                <option value="">—</option>
                                <option value="Boleto">Boleto</option>
                                <option value="Usufructo">Usufructo</option>
                            </select>
                        </label>
                    </div>

                    {GRUPOS_FLAGS.map((g) => (
                        <div key={g.titulo} style={{ marginBottom: 10 }}>
                            <span style={estiloEtiqueta}>{g.titulo}</span>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 10px" }}>
                                {g.campos.map(({ campo, etiqueta }) => (
                                    <label key={campo} style={{ fontSize: 13, color: "#33414c", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}>
                                        <input type="checkbox" checked={Number(form[campo]) === 1} onChange={(e) => cambiar(campo, e.target.checked ? 1 : 0)} />
                                        {etiqueta}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    <label>
                        <span style={estiloEtiqueta}>Observaciones</span>
                        <textarea style={{ ...estiloInput, minHeight: 64, resize: "vertical" }} maxLength={2000} value={form.observaciones ?? ""} onChange={(e) => cambiar("observaciones", e.target.value)} />
                    </label>

                    <div style={{ marginTop: 10 }}>
                        <button type="button" onClick={() => setVerHistorial((v) => !v)} style={{ background: "none", border: "none", padding: 0, color: "#1E88E5", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                            {verHistorial ? "Ocultar historial" : "Ver historial de cambios"}
                        </button>
                        {verHistorial && (
                            <div style={{ marginTop: 6, maxHeight: 130, overflowY: "auto", background: "#f7f9fa", borderRadius: 8, padding: "6px 10px", fontSize: 11.5, color: "#44515b" }}>
                                {!historial && "Cargando…"}
                                {historial && historial.length === 0 && "Todavía no se hicieron cambios."}
                                {historial && historial.map((h) => (
                                    <div key={h.id} style={{ padding: "4px 0", borderBottom: "1px solid #eaeef0" }}>
                                        <b>{formatoFecha(h.creado_en)}</b> · {h.usuario || "—"}
                                        <div>{Object.entries(h.cambios).map(([c, v]) => resumenCambio(c, v)).join(" · ")}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {error && <div style={{ marginTop: 10, padding: "8px 10px", background: "#fdecea", color: "#b3261e", borderRadius: 8, fontSize: 12.5 }}>{error}</div>}
                </div>

                <div style={{ padding: "12px 18px", borderTop: "1px solid #e8ecef", display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <button onClick={onCerrar} disabled={guardando} style={{ padding: "8px 16px", borderRadius: 8, border: "1px solid #d5dbe0", background: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", color: "#51616d" }}>Cancelar</button>
                    <button onClick={guardar} disabled={guardando} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#1a303e", color: "#fff", fontWeight: 700, fontSize: 13, cursor: guardando ? "default" : "pointer", opacity: guardando ? 0.7 : 1 }}>
                        {guardando ? "Guardando…" : "Guardar"}
                    </button>
                </div>
            </div>
        </div>
    );
}
