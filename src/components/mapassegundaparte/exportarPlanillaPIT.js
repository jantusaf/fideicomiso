import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ESTADOS_PIT, SITUACIONES_PIT } from "./pitLotesUtil";

// Planilla de lotes del PIT en Excel: una fila por lote, con todos sus datos, mas una hoja de resumen.
// `filas` = lista de objetos con los datos de cada pin ({ id, mz, lote, estado, situacion, empresa, ...info }),
// los mismos que muestra la ficha del mapa.

const TITULOS_FLAGS = [
    ["agua", "Agua"],
    ["cloacas", "Cloacas"],
    ["sumidero", "Sumidero y entubado"],
    ["cuneta_tierra", "Cuneta de tierra"],
    ["energia_mt_bt", "Energía MT y BT"],
    ["energia_alum_publ", "Alumbrado público"],
    ["fibra_optica", "Fibra óptica"],
    ["pasto_alto", "Pasto alto"],
];

const COLUMNAS = [
    ["Manzana", 10],
    ["Lote", 10],
    ["Estado", 15],
    ["Situación", 14],
    ["Empresa", 34],
    ["Vínculo", 11],
    ["Superficie (m²)", 15],
    ["Medidas", 16],
    ["Acceso", 30],
    ...TITULOS_FLAGS.map(([, titulo]) => [titulo, Math.max(9, titulo.length + 2)]),
    ["Observaciones", 40],
    ["Última modificación", 19],
    ["Modificado por", 16],
    ["Identificador del pin", 22],
];

const fechaLegible = (valor) => {
    if (!valor) return "";
    const f = new Date(valor);
    if (Number.isNaN(f.getTime())) return String(valor);
    const dos = (n) => String(n).padStart(2, "0");
    return `${dos(f.getDate())}/${dos(f.getMonth() + 1)}/${f.getFullYear()} ${dos(f.getHours())}:${dos(f.getMinutes())}`;
};

// "5.000,50 m²" / "15641.46M2" -> se deja el texto tal cual, sin la unidad (ya va en el titulo de la columna).
const sinUnidad = (sup) => (sup ? String(sup).replace(/\s*(m\s*2|m²)\s*$/i, "").trim() : "");

const siNo = (info, campo) => (info ? (Number(info[campo]) === 1 ? "Sí" : "No") : "");

const comparar = (a, b) => String(a ?? "").localeCompare(String(b ?? ""), "es", { numeric: true, sensitivity: "base" });

export const armarFilasPlanilla = (datos) =>
    [...datos]
        .sort((a, b) => comparar(a.mz, b.mz) || comparar(a.lote, b.lote) || comparar(a.id, b.id))
        .map((d) => {
            const info = d.info;
            return [
                d.mz ?? "",
                d.lote ?? "",
                d.estado ?? "",
                d.situacion ?? "",
                d.empresa ?? "",
                d.empresa && d.empresaTipo ? d.empresaTipo : "",
                sinUnidad(d.sup),
                d.medidas ?? "",
                (d.acceso || []).join(", "),
                ...TITULOS_FLAGS.map(([campo]) => siNo(info, campo)),
                (d.observaciones ?? "").replace(/[ \t]+/g, " ").trim(),
                fechaLegible(info?.actualizado_en),
                info?.actualizado_por ?? "",
                d.id ?? "",
            ];
        });

const contar = (lista) => lista.reduce((acc, v) => ((acc[v] = (acc[v] || 0) + 1), acc), {});

export const armarLibroPlanillaPIT = (datos, ahora = new Date()) => {
    const encabezados = COLUMNAS.map(([titulo]) => titulo);
    const filas = armarFilasPlanilla(datos);

    const hoja = XLSX.utils.aoa_to_sheet([encabezados, ...filas]);
    hoja["!cols"] = COLUMNAS.map(([, ancho]) => ({ wch: ancho }));
    hoja["!autofilter"] = { ref: XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: filas.length, c: encabezados.length - 1 } }) };

    // Resumen: cuántos lotes hay por estado y por situación.
    const porEstado = contar(datos.map((d) => d.estado || "Sin estado"));
    const porSituacion = contar(datos.map((d) => d.situacion || "Sin definir"));
    const resumen = [
        ["Planilla de lotes — Parque Industrial Tecnológico"],
        [`Generada el ${fechaLegible(ahora)}`],
        [],
        ["Estado", "Cantidad de lotes"],
        ...ESTADOS_PIT.map((e) => [e.etiqueta, porEstado[e.etiqueta] || 0]),
        ["Total", datos.length],
        [],
        ["Situación", "Cantidad de lotes"],
        ...SITUACIONES_PIT.map((s) => [s.valor, porSituacion[s.valor] || 0]),
        ["Sin definir", porSituacion["Sin definir"] || 0],
    ];
    const hojaResumen = XLSX.utils.aoa_to_sheet(resumen);
    hojaResumen["!cols"] = [{ wch: 28 }, { wch: 18 }];

    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "Lotes");
    XLSX.utils.book_append_sheet(libro, hojaResumen, "Resumen");
    return libro;
};

export const exportarPlanillaPIT = (datos) => {
    const libro = armarLibroPlanillaPIT(datos);
    const salida = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const hoy = new Date();
    const dos = (n) => String(n).padStart(2, "0");
    const nombre = `Planilla_lotes_PIT_${hoy.getFullYear()}-${dos(hoy.getMonth() + 1)}-${dos(hoy.getDate())}.xlsx`;
    saveAs(new Blob([salida], { type: "application/octet-stream" }), nombre);
    return nombre;
};
