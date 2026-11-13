// Constantes compartidas del mapa PIT: estados de los lotes y casillas de infraestructura.

// `capa` es la casilla del panel lateral que muestra/oculta ese estado.
export const ESTADOS_PIT = [
    { valor: "DISPONIBLE",    etiqueta: "Disponible",    capa: "pitdisponible",   color: "#22c55e", borde: "#15803d" },
    { valor: "NO DISPONIBLE", etiqueta: "No disponible", capa: "pitnodisponible", color: "#ef4444", borde: "#b91c1c" },
    { valor: "RESERVADO",     etiqueta: "Reservado",     capa: "pitreservado",    color: "#eab308", borde: "#a16207" },
];

export const estadoPit = (valor) => ESTADOS_PIT.find((e) => e.valor === valor) || null;

export const GRUPOS_FLAGS = [
    {
        titulo: "Acceso",
        campos: [
            { campo: "acceso_sin", etiqueta: "Sin acceso" },
            { campo: "acceso_tierra", etiqueta: "Acceso de tierra" },
            { campo: "acceso_ripio", etiqueta: "Acceso de ripio" },
            { campo: "acceso_pavimento", etiqueta: "Acceso pavimentado" },
        ],
    },
    {
        titulo: "Servicios",
        campos: [
            { campo: "agua", etiqueta: "Agua" },
            { campo: "cloacas", etiqueta: "Cloacas" },
            { campo: "sumidero", etiqueta: "Sumidero y entubado" },
            { campo: "cuneta_tierra", etiqueta: "Cuneta de tierra" },
            { campo: "energia_mt_bt", etiqueta: "Energía MT y BT" },
            { campo: "energia_alum_publ", etiqueta: "Alumbrado público" },
            { campo: "fibra_optica", etiqueta: "Fibra óptica" },
        ],
    },
    {
        titulo: "Otros",
        campos: [{ campo: "pasto_alto", etiqueta: "Pasto alto" }],
    },
];

// Etiquetas de las casillas marcadas, para mostrar un resumen en la ficha del lote.
export const resumenFlags = (info, titulo) => {
    const grupo = GRUPOS_FLAGS.find((g) => g.titulo === titulo);
    if (!grupo || !info) return [];
    return grupo.campos.filter(({ campo }) => Number(info[campo]) === 1).map(({ etiqueta }) => etiqueta);
};
