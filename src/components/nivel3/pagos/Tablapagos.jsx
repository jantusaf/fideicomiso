import { useState, useEffect, useMemo } from "react";

import { createTheme, alpha } from "@mui/material/styles";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Paper,
  Typography,
  Chip,
  Stack,
  Divider,
  TextField,
  InputAdornment
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary, sxBtnOutlined } from "../../nivel2/detalleclienteIngresos/estilos";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material";
import logo from "../../../Assets/marcas.png";
import PrintIcon from "@mui/icons-material/Print";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import AssessmentIcon from "@mui/icons-material/Assessment";

import servicioPagos from "../../../services/pagos";
import serviciousuario1 from "../../../services/usuario1"; // (no lo uso, pero lo dejo como lo tenés)
import servicioLotes from "../../../services/lotes"; // ✅ NUEVO: para completar datos IC3 desde tabla lotes

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const PagosInusuales = () => {
  const [pagos, setPagos] = useState([]);
  const [filtroMes, setFiltroMes] = useState("");
  const [filtroAnio, setFiltroAnio] = useState("");
  const [filtroZona, setFiltroZona] = useState("PIT");
const [desdeMes, setDesdeMes] = useState("");
const [desdeAnio, setDesdeAnio] = useState("");
const [filtroTexto, setFiltroTexto] = useState("");
const [hastaMes, setHastaMes] = useState("");
const [hastaAnio, setHastaAnio] = useState("");
const [page, setPage] = useState(0);
const [rowsPerPage, setRowsPerPage] = useState(10);
const [tipoFecha, setTipoFecha] = useState("pago"); // "pago" o "cuota"
  // helper
  const esVacio = (v) =>
    v === null || v === undefined || v === "" || v === "-" || v === "Sin determinar";

  const formatMoney = (v) =>
    Number(v || 0).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // ✅ Traer pagos y completar fraccion/manzana/lote para IC3 sin tocar backend
  const getPagos = async () => {
  if (!desdeMes || !desdeAnio || !hastaMes || !hastaAnio) {
    alert("Completá el rango de fechas");
    return;
  }

  const resp = await servicioPagos.todoslospagos({
    desde_mes: desdeMes,
    desde_anio: desdeAnio,
    hasta_mes: hastaMes,
    hasta_anio: hastaAnio,
    tipo_fecha: tipoFecha,
  });

  const lotesResp = await servicioLotes.lista({});
  const lotes = Array.isArray(lotesResp) ? lotesResp[0] || [] : [];

  const normDigits = (v) => String(v ?? "").replace(/[^\d]/g, "");

  const normNombre = (s) =>
    String(s ?? "")
      .toUpperCase()
      .replace(/\(\s*\d+\s*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const idxIC3ByCuit = new Map();
  const idxIC3ByDni = new Map();
  const idxIC3ByNombre = new Map();

  lotes
    .filter((l) => String(l.zona ?? "").trim().toUpperCase() === "IC3")
    .forEach((l) => {
      const c = normDigits(l.cuil_cuit);
      const nombreLote = normNombre(l.nombre);

      if (nombreLote && !idxIC3ByNombre.has(nombreLote)) {
        idxIC3ByNombre.set(nombreLote, l);
      }

      if (!c || c === "0") return;

      if (!idxIC3ByCuit.has(c)) idxIC3ByCuit.set(c, l);

      if (c.length === 11) {
        const dni = c.slice(2, 10);
        if (!idxIC3ByDni.has(dni)) idxIC3ByDni.set(dni, l);
      }

      if (c.length <= 8) {
        if (!idxIC3ByDni.has(c)) idxIC3ByDni.set(c, l);
      }
    });

  const pagosFix = resp.map((p) => {
    if (p.origen !== "ic3") return p;

    const yaTieneDatos =
      !esVacio(p.fraccion) || !esVacio(p.manzana) || !esVacio(p.lote);
    if (yaTieneDatos) return p;

    const c = normDigits(p.cuil_cuit);

    let loteReal = idxIC3ByCuit.get(c);

    if (!loteReal) {
      const dni = c.length === 11 ? c.slice(2, 10) : c;
      loteReal = idxIC3ByDni.get(dni);
    }

    if (!loteReal) {
      const nombrePago = normNombre(p.nombre);
      loteReal = idxIC3ByNombre.get(nombrePago);
    }

    if (!loteReal) return p;

    return {
      ...p,
      fraccion: esVacio(p.fraccion) ? loteReal.fraccion : p.fraccion,
      manzana: esVacio(p.manzana) ? loteReal.manzana : p.manzana,
      lote: esVacio(p.lote) ? loteReal.lote : p.lote,
    };
  });

  setPagos(pagosFix);
};
useEffect(() => {
  const hoy = new Date();

  const mesActual = hoy.getMonth() + 1;
  const anioActual = hoy.getFullYear();

  setDesdeMes(1);
  setDesdeAnio(2026);

  setHastaMes(mesActual);
  setHastaAnio(anioActual);

  setTipoFecha("cuota");


  cargarInicial(1, 2026, mesActual, anioActual);
}, []);
useEffect(() => {
  // NO cargar automático
}, []);


const cargarInicial = async (dMes, dAnio, hMes, hAnio) => {
  const resp = await servicioPagos.todoslospagos({
    desde_mes: dMes,
    desde_anio: dAnio,
    hasta_mes: hMes,
    hasta_anio: hAnio,
    tipo_fecha: "cuota",
  });

  setPagos(resp);
};
  // =======================
  // OPCIONES DE FILTROS
  // =======================
  const meses = [...new Set(pagos.map((p) => Number(p.mes)))]
    .filter((m) => !isNaN(m))
    .sort((a, b) => a - b);

  const anios = [...new Set(pagos.map((p) => p.anio))].filter(Boolean);

  // =======================
  // FILTRADO (ZONA POR ORIGEN)
  // =======================
const pagosFiltrados = pagos.filter((p) => {
  const zonaOk =
    filtroZona === "" ||
    (filtroZona === "IC3" && p.origen === "ic3") ||
    (filtroZona === "PIT" && p.origen === "normal");

 const texto = filtroTexto.toLowerCase();

const textoOk =
  !filtroTexto ||
  p.cuil_cuit?.toString().includes(texto) ||
  p.nombre?.toLowerCase().includes(texto);

  return zonaOk && textoOk;
});

  // =======================
  // COLUMNAS (BASE)
  // =======================
  const columnsBase = useMemo(() => {
    // Índices por el orden DE ESTE ARRAY:
    // 0 mes
    // 1 anio
    // 2 fraccion
    // 3 manzana
    // 4 lote
    // 5 parcela
    // 6 origen
    // 7 cuil_cuit
    // 8 nombre
    // 9 monto
    const LOTE_INDEX = 4;
    const ORIGEN_INDEX = 6;

    return [
      { name: "mes", label: "Mes" },
      { name: "anio", label: "Año" },
      { name: "fraccion", label: "Fracción" },
      { name: "manzana", label: "Manzana" },

      // ✅ LOTE (PIT => "No corresponde")
      {
        name: "lote",
        label: "Lote",
        options: {
          customBodyRender: (value, tableMeta) => {
            const origen = tableMeta.rowData[ORIGEN_INDEX]; // "normal" o "ic3"
            if (origen === "normal") return "No corresponde";
            return esVacio(value) ? "-" : value;
          },
        },
      },

      // ✅ PARCELA (IC3 => "No corresponde")
      {
        name: "parcela",
        label: "Parcela",
        options: {
          customBodyRender: (value, tableMeta) => {
            const origen = tableMeta.rowData[ORIGEN_INDEX];
            const lote = tableMeta.rowData[LOTE_INDEX];

            if (origen === "ic3") return "No corresponde";

            const invalida =
              value === 0 ||
              value === "0" ||
              value === "Sin determinar" ||
              value === "" ||
              value === null ||
              value === undefined;

            return invalida ? (esVacio(lote) ? "-" : lote) : value;
          },
        },
      },

      {
        name: "origen",
        label: "Zona",
        options: {
          customBodyRender: (value) => (value === "ic3" ? "IC3" : "PIT"),
        },
      },

      { name: "cuil_cuit", label: "CUIL / CUIT" },
      { name: "nombre", label: "Nombre" },

      // ✅ MONTO con formato
      {
        name: "monto",
        label: "Monto",
        options: {
          customBodyRender: (value) => formatMoney(value),
        },
      },
    ];
  }, [formatMoney]); // ✅ important: cierro el useMemo BIEN

  // =======================
  // COLUMNAS VISIBLES SEGÚN FILTRO ZONA
  // =======================
  const columns = useMemo(() => {
    if (filtroZona === "PIT") {
      return columnsBase.filter((c) => c.name !== "lote");
    }
    if (filtroZona === "IC3") {
      return columnsBase.filter((c) => c.name !== "parcela");
    }
    return columnsBase;
  }, [columnsBase, filtroZona]);

  // =======================
  // EXPORTAR A EXCEL
  // =======================
  const exportarExcel = () => {
    const visibles = columns.map((c) => c.name);

    const data = pagosFiltrados.map((p) => {
      const esIC3 = p.origen === "ic3";
      const esPIT = p.origen === "normal";

      const row = {
        Mes: p.mes,
        Año: p.anio,
        Zona: esIC3 ? "IC3" : "PIT",
        "CUIL / CUIT": p.cuil_cuit,
        Nombre: p.nombre,
        Estado: p.estado === "A" ? "Aprobado" : "Pendiente",
        Monto: Number(p.monto || 0).toFixed(2),
      };

      if (visibles.includes("fraccion")) row.Fracción = p.fraccion ?? "-";
      if (visibles.includes("manzana")) row.Manzana = p.manzana ?? "-";

      if (visibles.includes("lote")) {
        row.Lote = esPIT ? "No corresponde" : p.lote ?? "-";
      }

      if (visibles.includes("parcela")) {
        row.Parcela = esIC3 ? "No corresponde" : p.parcela ?? "-";
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Pagos");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "pagos_filtrados.xlsx");
  };

  // =======================
  // OPCIONES TABLA
  // =======================
  const options = {
    selectableRows: false,
    responsive: "standard",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20],
    print: false,
    download: false,
    filter: false,
    viewColumns: true,
    textLabels: {
      body: { noMatch: "No se encontraron registros" },
      pagination: {
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        viewColumns: "Ver columnas",
      },
    },
  };

  const sxTh = {
    backgroundColor: "#f6f8f9",
    color: COLOR_TEXT,
    fontWeight: 700,
    fontSize: 11.5,
    letterSpacing: 0.4,
    borderBottom: `1px solid ${COLOR_BORDER}`,
    whiteSpace: "nowrap",
    py: 1.25,
  };
  const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };
  const sxSel = { minWidth: 120, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };

  const registros = pagosFiltrados?.length || 0;

  return (
    <>
      <Box sx={{ width: "100%", maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6, minWidth: 0 }}>
        {/* ENCABEZADO */}
        <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
          <Box
            sx={{
              display: "flex",
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 46,
                  height: 46,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "rgba(13,58,73,0.08)",
                  flexShrink: 0,
                }}
              >
                <AssessmentIcon sx={{ color: COLOR_ACCENT }} />
              </Box>

              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
                >
                  Reporte de pagos registrados
                </Typography>
                <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                  Consultá los pagos por rango de fechas y zona
                </Typography>
              </Box>
            </Box>

            <Chip variant="outlined" label={`Registros: ${registros}`} sx={{ fontWeight: 600 }} />
          </Box>
        </Paper>

        {/* FILTROS */}
        <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2, md: 2.5 } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "stretch", md: "center" },
              justifyContent: "space-between",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, flexWrap: "wrap", gap: 1.25 }}>
              <FormControl size="small" sx={{ ...sxSel, minWidth: 160 }}>
                <InputLabel>Tipo fecha</InputLabel>
                <Select value={tipoFecha} label="Tipo fecha" onChange={(e) => setTipoFecha(e.target.value)}>
                  <MenuItem value="pago">Fecha de Pago</MenuItem>
                  <MenuItem value="cuota">Fecha de Cuota</MenuItem>
                </Select>
              </FormControl>

              <FormControl size="small" sx={sxSel}>
                <InputLabel>Desde mes</InputLabel>
                <Select value={desdeMes} label="Desde mes" onChange={(e) => setDesdeMes(e.target.value)}>
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={sxSel}>
                <InputLabel>Desde año</InputLabel>
                <Select value={desdeAnio} label="Desde año" onChange={(e) => setDesdeAnio(e.target.value)}>
                  {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={sxSel}>
                <InputLabel>Hasta mes</InputLabel>
                <Select value={hastaMes} label="Hasta mes" onChange={(e) => setHastaMes(e.target.value)}>
                  {[...Array(12)].map((_, i) => (
                    <MenuItem key={i + 1} value={i + 1}>
                      {i + 1}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={sxSel}>
                <InputLabel>Hasta año</InputLabel>
                <Select value={hastaAnio} label="Hasta año" onChange={(e) => setHastaAnio(e.target.value)}>
                  {[2020, 2021, 2022, 2023, 2024, 2025, 2026].map((a) => (
                    <MenuItem key={a} value={a}>
                      {a}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl size="small" sx={{ ...sxSel, minWidth: 140 }}>
                <InputLabel>Zona</InputLabel>
                <Select value={filtroZona} label="Zona" onChange={(e) => setFiltroZona(e.target.value)}>
                  <MenuItem value="">Todas</MenuItem>
                  <MenuItem value="IC3">IC3</MenuItem>
                  <MenuItem value="PIT">PIT</MenuItem>
                </Select>
              </FormControl>

              <Button variant="contained" onClick={getPagos} sx={sxBtnPrimary}>
                Buscar
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                onClick={exportarExcel}
                sx={sxBtnOutlined}
              >
                Excel
              </Button>

              <Button
                variant="outlined"
                startIcon={<PrintIcon />}
                onClick={() => window.print()}
                sx={sxBtnOutlined}
              >
                Imprimir
              </Button>

              <Button
                variant="outlined"
                onClick={() => {
                  setFiltroZona("");
                  setDesdeMes("");
                  setDesdeAnio("");
                  setHastaMes("");
                  setHastaAnio("");
                  setTipoFecha("pago");
                }}
                sx={sxBtnOutlined}
              >
                Limpiar
              </Button>
            </Box>
          </Box>
        </Paper>

        {/* LISTADO */}
        <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
          <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
            <TextField
              size="small"
              placeholder="Buscar por nombre o CUIT"
              value={filtroTexto}
              onChange={(e) => setFiltroTexto(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: COLOR_MUTED, fontSize: 20 }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ width: { xs: "100%", md: 380 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Box>

          <Divider sx={{ borderColor: COLOR_BORDER }} />

          <TableContainer sx={{ maxHeight: "68vh" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={sxTh}>MES</TableCell>
                  <TableCell sx={sxTh}>AÑO</TableCell>
                  <TableCell sx={sxTh}>ZONA</TableCell>
                  <TableCell sx={sxTh}>FRACCIÓN</TableCell>
                  <TableCell sx={sxTh}>MANZANA</TableCell>

                  {filtroZona !== "PIT" && <TableCell sx={sxTh}>LOTE</TableCell>}

                  {filtroZona !== "IC3" && <TableCell sx={sxTh}>PARCELA</TableCell>}

                  <TableCell sx={sxTh}>CUIL / CUIT</TableCell>
                  <TableCell sx={sxTh}>NOMBRE</TableCell>
                  <TableCell sx={{ ...sxTh, textAlign: "right" }}>MONTO</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {pagosFiltrados
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((p, index) => {
                    const esIC3 = p.origen === "ic3";
                    const esPIT = p.origen === "normal";

                    return (
                      <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                        <TableCell sx={sxTd}>{p.mes}</TableCell>

                        <TableCell sx={sxTd}>{p.anio}</TableCell>

                        <TableCell sx={sxTd}>
                          <Chip
                            label={esIC3 ? "IC3" : "PIT"}
                            size="small"
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>

                        <TableCell sx={sxTd}>{p.fraccion || "-"}</TableCell>

                        <TableCell sx={sxTd}>{p.manzana || "-"}</TableCell>

                        {filtroZona !== "PIT" && (
                          <TableCell sx={sxTd}>{esPIT ? "No corresponde" : p.lote || "-"}</TableCell>
                        )}

                        {filtroZona !== "IC3" && (
                          <TableCell sx={sxTd}>{esIC3 ? "No corresponde" : p.parcela || "-"}</TableCell>
                        )}

                        <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{p.cuil_cuit}</TableCell>

                        <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{p.nombre}</TableCell>

                        <TableCell sx={{ ...sxTd, textAlign: "right", whiteSpace: "nowrap" }}>
                          ${formatMoney(p.monto)}
                        </TableCell>
                      </TableRow>
                    );
                  })}

                {pagosFiltrados.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={10} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                      No hay pagos para mostrar. Elegí un rango de fechas y tocá Buscar.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={pagosFiltrados.length}
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(e, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 20, 50]}
            labelRowsPerPage="Filas por página:"
            sx={{
              borderTop: `1px solid ${COLOR_BORDER}`,
              "& .MuiTablePagination-toolbar": { minHeight: 48 },
              "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows": {
                fontSize: 13,
                color: COLOR_MUTED,
              },
            }}
          />
        </Paper>
      </Box>


      {/* ===== VISTA SOLO IMPRESIÓN ===== */}
      <div id="print-area" style={{ display: "none" }}>
        <Box sx={{ padding: "30px", fontFamily: "Arial" }}>
          {/* HEADER */}
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <img src={logo} alt="logo" style={{ height: 70, marginRight: 20 }} />
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Informe de Pagos Registrados
              </Typography>
              <Typography variant="body2">
                Municipalidad de Corrientes
              </Typography>
              <Typography variant="body2">
                Fecha de emisión: {new Date().toLocaleDateString()}
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* FILTROS */}
          <Typography variant="subtitle2" fontWeight="bold">
            Filtros aplicados:
          </Typography>
          <Typography variant="body2" mb={2}>
            Mes: {filtroMes || "Todos"} | Año: {filtroAnio || "Todos"} | Zona:{" "}
            {filtroZona || "Todas"}
          </Typography>

          {/* TABLA */}
          <table
            width="100%"
            border="1"
            cellSpacing="0"
            style={{ borderCollapse: "collapse", fontSize: "12px" }}
          >
            <thead style={{ background: "#0b4f6c", color: "white" }}>
              <tr>
                <th>Mes</th>
                <th>Año</th>
                <th>Zona</th>
                <th>CUIL/CUIT</th>
                <th>Nombre</th>
                <th>Monto</th>
              </tr>
            </thead>
            <tbody>
              {pagosFiltrados.map((p, i) => (
                <tr key={i}>
                  <td>{p.mes}</td>
                  <td>{p.anio}</td>
                  <td>{p.origen === "ic3" ? "IC3" : "PIT"}</td>
                  <td>{p.cuil_cuit}</td>
                  <td>{p.nombre}</td>
                  <td>${p.monto}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <Typography variant="body2" mt={2}>
            Total de registros: {pagosFiltrados.length}
          </Typography>
        </Box>
      </div>
    </>
  );
};

export default PagosInusuales;
