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
                    borderBottom: "1px solid #e2e6e9",
                    padding: "10px 28px",
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    boxShadow: "none",
                }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, color: "#6b7a86" }}>Ver mapa:</span>
                    <div style={{ position: "relative" }}>
                        <select
                            value={mapa}
                            onChange={(e) => setMapa(e.target.value)}
                            style={{
                                appearance: "none",
                                WebkitAppearance: "none",
                                background: "#fff",
                                border: "1px solid #c9d2d8",
                                borderRadius: 6,
                                padding: "7px 38px 7px 12px",
                                fontSize: 14,
                                fontWeight: 600,
                                color: "#1a303e",
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
                            color: "#6b7a86", fontSize: 11,
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
                        color: "#9aa7b0",
                        gap: 24,
                    }}>
                        {/* Selector centrado */}
                        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                            <span style={{ fontWeight: 600, fontSize: 14.5, color: "#6b7a86" }}>Ver mapa:</span>
                            <div style={{ position: "relative" }}>
                                <select
                                    value={mapa}
                                    onChange={(e) => setMapa(e.target.value)}
                                    style={{
                                        appearance: "none",
                                        WebkitAppearance: "none",
                                        background: "#fff",
                                        border: "1px solid #c9d2d8",
                                        borderRadius: 6,
                                        padding: "8px 40px 8px 14px",
                                        fontSize: 14.5,
                                        fontWeight: 600,
                                        color: "#6b7a86",
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
                                    color: "#6b7a86", fontSize: 11,
                                }}>▼</span>
                            </div>
                        </div>

                        {/* Ícono y texto */}
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9aa7b0" strokeWidth="1.5">
                            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 9m0 8V9m0 0L9 7" />
                        </svg>
                        <span style={{ fontSize: 14.5, color: "#6b7a86" }}>Seleccioná un mapa para visualizarlo</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lotes;
