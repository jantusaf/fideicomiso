import * as XLSX from "xlsx";

// Lee el cuadro de cuotas en Excel (el mismo formato que se usa en los legajos)
// y devuelve las filas con cobranza: mes, nro de cuota, valor de la cuota,
// fecha de cobro y monto cobrado. Solo lee: no calcula ni decide nada.

const normalizar = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

const dosDigitos = (n) => String(n).padStart(2, "0");

// Serie de fecha de Excel (p. ej. 45108) -> { anio, mes, dia }
const desdeSerie = (n) => {
  if (typeof n !== "number" || n < 20000 || n > 80000) return null;
  // Excel cuenta los días desde el 30/12/1899 (las series válidas son posteriores a 1900).
  const d = new Date(Date.UTC(1899, 11, 30) + Math.floor(n) * 86400000);
  return { anio: d.getUTCFullYear(), mes: d.getUTCMonth() + 1, dia: d.getUTCDate() };
};

// Acepta serie de Excel, "2023-07-01", "01/07/2023", "07/2023" y "2023-07".
export const leerFecha = (v) => {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v === "number") return desdeSerie(v);

  const t = String(v).trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);
  if (m) return { anio: +m[1], mes: +m[2], dia: +m[3] };
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{4})/.exec(t);
  if (m) return { anio: +m[3], mes: +m[2], dia: +m[1] };
  m = /^(\d{4})-(\d{1,2})$/.exec(t);
  if (m) return { anio: +m[1], mes: +m[2], dia: 1 };
  m = /^(\d{1,2})\/(\d{4})$/.exec(t);
  if (m) return { anio: +m[2], mes: +m[1], dia: 1 };
  return null;
};

const aISO = (f) =>
  f && f.mes >= 1 && f.mes <= 12 && f.dia >= 1 && f.dia <= 31
    ? f.anio + "-" + dosDigitos(f.mes) + "-" + dosDigitos(f.dia)
    : null;

// "$ 1.234,56", "1,234.56", 1234.56 -> 1234.56
export const leerNumero = (v) => {
  if (typeof v === "number") return Number.isFinite(v) ? v : 0;
  if (v === null || v === undefined || v === "") return 0;

  let t = String(v).replace(/\$/g, "").replace(/\s/g, "");
  if (!/\d/.test(t)) return 0;

  const ultimaComa = t.lastIndexOf(",");
  const ultimoPunto = t.lastIndexOf(".");
  if (ultimaComa !== -1 && ultimoPunto !== -1) {
    // El separador que aparece al final es el decimal.
    t = ultimaComa > ultimoPunto ? t.replace(/\./g, "").replace(",", ".") : t.replace(/,/g, "");
  } else if (ultimaComa !== -1) {
    t = /^-?\d{1,3}(,\d{3})+$/.test(t) ? t.replace(/,/g, "") : t.replace(",", ".");
  } else if (ultimoPunto !== -1 && /^-?\d{1,3}(\.\d{3})+$/.test(t)) {
    t = t.replace(/\./g, "");
  }

  const n = Number(t);
  return Number.isFinite(n) ? n : 0;
};

// Busca la fila de encabezados (con "Mes" y "Cobranza") y la posición de cada columna.
const buscarEncabezado = (filas) => {
  for (let i = 0; i < Math.min(filas.length, 60); i++) {
    const celdas = (filas[i] || []).map(normalizar);
    const iMes = celdas.indexOf("mes");
    const iCobranza = celdas.findIndex((c) => c === "cobranza");
    if (iMes === -1 || iCobranza === -1) continue;

    return {
      fila: i,
      mes: iMes,
      nro: celdas.indexOf("cuota"),
      cuotaExcel: celdas.findIndex((c) => c.startsWith("cuota con ajuste")),
      fecha: celdas.findIndex((c) => c.startsWith("fecha de cobro")),
      cobranza: iCobranza,
      comprobante: celdas.findIndex((c) => c === "comprobante"),
    };
  }
  return null;
};

/**
 * @param {ArrayBuffer} buffer contenido del archivo .xlsx/.xls
 * @returns {{ filas: Array, hoja: string, totalCobranza: number, cuotasLeidas: number }}
 * Lanza un Error con un mensaje claro si el archivo no tiene el formato esperado.
 */
export const parsearCuadroExcel = (buffer) => {
  let libro;
  try {
    libro = XLSX.read(buffer, { type: "array" });
  } catch (causa) {
    throw new Error("No se pudo abrir el archivo. Verificá que sea un Excel (.xlsx o .xls).", { cause: causa });
  }

  for (const nombre of libro.SheetNames) {
    const filas = XLSX.utils.sheet_to_json(libro.Sheets[nombre], { header: 1, raw: true, defval: null });
    const enc = buscarEncabezado(filas);
    if (!enc) continue;

    const resultado = [];
    let cuotasLeidas = 0;

    for (let i = enc.fila + 1; i < filas.length; i++) {
      const fila = filas[i] || [];
      const mes = leerFecha(fila[enc.mes]);
      if (!mes) continue; // filas vacías, totales o instrucciones

      cuotasLeidas += 1
      const monto = leerNumero(fila[enc.cobranza]);
      if (monto <= 0) continue; // sin cobranza no hay pago

      resultado.push({
        fila: i + 1, // número de fila en el Excel
        mes: mes.mes,
        anio: mes.anio,
        nro: enc.nro !== -1 ? leerNumero(fila[enc.nro]) || null : null,
        cuotaExcel: enc.cuotaExcel !== -1 ? leerNumero(fila[enc.cuotaExcel]) : 0,
        monto,
        fecha: enc.fecha !== -1 ? aISO(leerFecha(fila[enc.fecha])) : null,
        comprobante: enc.comprobante !== -1 && fila[enc.comprobante] ? String(fila[enc.comprobante]).slice(0, 60) : "",
      });
    }

    if (cuotasLeidas === 0) continue;

    return {
      filas: resultado,
      hoja: nombre,
      cuotasLeidas,
      totalCobranza: Math.round(resultado.reduce((a, f) => a + f.monto, 0) * 100) / 100,
    };
  }

  throw new Error(
    'No se encontró el cuadro de cuotas. El Excel debe tener una tabla con las columnas "Mes", "Cuota" y "Cobranza" (y opcionalmente "Fecha de cobro").'
  );
};
