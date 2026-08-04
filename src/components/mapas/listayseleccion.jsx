import { useState } from "react";
import Ic3 from "./soloic3";
import PIT from "./soloparque";
import * as React from "react";

const MAPAS = [
    { value: "1", label: "IC3" },
    { value: "2", label: "Parque" },
];

const Lotes = () => {
    const [mapa, setMapa] = useState("");

    const mapaActual = MAPAS.find((m) => m.value === mapa);

    return (
        <div>
            {/* Barra superior sticky — solo visible cuando hay mapa seleccionado */}
            {mapa && (
                <div style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 200,
                    background: "#fff",
                    borderBottom: "1px solid #e0e0e0",
                    padding: "12px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                }}>
                    <span style={{ fontWeight: 600, fontSize: 14, color: "#555" }}>Ver mapa:</span>
                    <div style={{ position: "relative" }}>
                        <select
                            value={mapa}
                            onChange={(e) => setMapa(e.target.value)}
                            style={{
                                appearance: "none",
                                WebkitAppearance: "none",
                                background: "#f4f6f8",
                                border: "1.5px solid #b0bec5",
                                borderRadius: 8,
                                padding: "8px 40px 8px 14px",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#0097a7",
                                cursor: "pointer",
                                outline: "none",
                                minWidth: 160,
                            }}
                        >
                            {MAPAS.map(({ value, label }) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                        <span style={{
                            position: "absolute", right: 12, top: "50%",
                            transform: "translateY(-50%)", pointerEvents: "none",
                            color: "#0097a7", fontSize: 12,
                        }}>▼</span>
                    </div>
                </div>
            )}

            {/* Contenido */}
            <div style={{ padding: "20px 28px" }}>
                {mapa === "1" && <Ic3 />}
                {mapa === "2" && <PIT />}
                {!mapa && (
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 80,
                        color: "#b0bec5",
                        gap: 24,
                    }}>
                        {/* Selector centrado */}
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontWeight: 600, fontSize: 15, color: "#555" }}>Ver mapa:</span>
                            <div style={{ position: "relative" }}>
                                <select
                                    value={mapa}
                                    onChange={(e) => setMapa(e.target.value)}
                                    style={{
                                        appearance: "none",
                                        WebkitAppearance: "none",
                                        background: "#f4f6f8",
                                        border: "1.5px solid #b0bec5",
                                        borderRadius: 8,
                                        padding: "9px 44px 9px 16px",
                                        fontSize: 15,
                                        fontWeight: 600,
                                        color: "#888",
                                        cursor: "pointer",
                                        outline: "none",
                                        minWidth: 180,
                                    }}
                                >
                                    <option value="" disabled>Seleccionar...</option>
                                    {MAPAS.map(({ value, label }) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                                <span style={{
                                    position: "absolute", right: 14, top: "50%",
                                    transform: "translateY(-50%)", pointerEvents: "none",
                                    color: "#0097a7", fontSize: 12,
                                }}>▼</span>
                            </div>
                        </div>

                        {/* Ícono y texto */}
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0bec5" strokeWidth="1.5">
                            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                        </svg>
                        <span style={{ fontSize: 15 }}>Seleccioná un mapa para visualizarlo</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lotes;
