import { useState, useEffect } from "react";
import servicioClientes from "../../../services/clientes";
import servicioLotes from "../../../services/lotes";
import CargaDeTabla from "../../CargaDeTabla";
import { useNavigate } from "react-router-dom";

import { IconButton, Tooltip } from "@mui/material";
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  Divider,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_OK,
  COLOR_ERROR,
  sxCard,
} from "../detalleclienteIngresos/estilos";

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

const sxTd = {
  fontSize: 13.5,
  color: COLOR_TEXT,
  borderBottom: "1px solid #eef1f3",
  py: 1.1,
};


import ModalDetalleDeudor from "./ModalDetalleDeudor";

const Deudores = () => {
  const [clientes, setClientes] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDetalle, setOpenDetalle] = useState(false);
  const [detalleCliente, setDetalleCliente] = useState(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();


  const esVacio = (v) =>
    v === null ||
    v === undefined ||
    v === "" ||
    v === "-" ||
    v === "Sin determinar";

  const normDigits = (v) => String(v ?? "").replace(/[^\d]/g, "");

  const normNombre = (s) =>
    String(s ?? "")
      .toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\(\s*\d+\s*\)/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const normalizeText = (s) =>
    String(s ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();

  const onlyDigits = (s) => String(s ?? "").replace(/\D/g, "");


  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = async () => {
    setLoading(true);

    const data = await servicioClientes.deudores();
    const detalleClientes = data?.[0] || [];
    const resumenGeneral = data?.[1] || null;

    //  Lotes para completar terreno SIN romper casos multi-lote
    const lotesResp = await servicioLotes.lista({});
    const lotes = Array.isArray(lotesResp) ? lotesResp[0] || [] : [];

    // Índices por zona
    const idxByZonaDni = new Map();     // ZONA|DNI -> lote (primero)
    const idxByZonaNombre = new Map();  // ZONA|NOMBRE -> lote (primero)

    //  CUIT SOLO si es ÚNICO (si tiene más de 1 terreno, NO autocompletamos por CUIT)
    const idxByZonaCuitSingle = new Map(); // ZONA|CUIT -> lote
    const countByZonaCuit = new Map();     // ZONA|CUIT -> count

    lotes.forEach((l) => {
      const zona = String(l.zona ?? "").trim().toUpperCase();
      if (!zona) return;

      const c = normDigits(l.cuil_cuit);
      const nombreLote = normNombre(l.nombre);

      if (nombreLote) {
        const kNom = `${zona}|${nombreLote}`;
        if (!idxByZonaNombre.has(kNom)) idxByZonaNombre.set(kNom, l);
      }

      if (!c || c === "0") return;

      const kCuit = `${zona}|${c}`;
      countByZonaCuit.set(kCuit, (countByZonaCuit.get(kCuit) ?? 0) + 1);
      if (!idxByZonaCuitSingle.has(kCuit)) idxByZonaCuitSingle.set(kCuit, l);

      // DNI si CUIT 11
      if (c.length === 11) {
        const dni = c.slice(2, 10);
        const kDni = `${zona}|${dni}`;
        if (!idxByZonaDni.has(kDni)) idxByZonaDni.set(kDni, l);
      }

      // DNI directo
      if (c.length <= 8) {
        const kDni = `${zona}|${c}`;
        if (!idxByZonaDni.has(kDni)) idxByZonaDni.set(kDni, l);
      }
    });

    // invalidamos CUIT con más de 1 terreno
    for (const [k, cnt] of countByZonaCuit.entries()) {
      if (cnt > 1) idxByZonaCuitSingle.delete(k);
    }

    // Completar terreno (solo si falta) cuando hay multi-lote
    const clientesFix = detalleClientes.map((c) => {
      const zona = String(c.zona ?? "PIT").trim().toUpperCase();

      const yaTieneDatos =
        !esVacio(c.fraccion) ||
        !esVacio(c.manzana) ||
        !esVacio(c.lote) ||
        !esVacio(c.parcela);

      if (yaTieneDatos) return c;

      const cuil = normDigits(c.cuil_cuit);
      const keyCuit = `${zona}|${cuil}`;

      // 1) por CUIT (solo si es único)
      let loteReal = idxByZonaCuitSingle.get(keyCuit);

      // 2) por DNI (fallback)
      if (!loteReal) {
        const dni = cuil.length === 11 ? cuil.slice(2, 10) : cuil;
        loteReal = idxByZonaDni.get(`${zona}|${dni}`);
      }

      // 3) por NOMBRE (último recurso; puede traer falsos positivos si hay homónimos)
      if (!loteReal) {
        const nombre = normNombre(`${c.nombre ?? ""} ${c.apellido ?? ""}`);
        loteReal = idxByZonaNombre.get(`${zona}|${nombre}`);
      }

      if (!loteReal) return c;

      return {
        ...c,
        fraccion: esVacio(c.fraccion) ? loteReal.fraccion : c.fraccion,
        manzana: esVacio(c.manzana) ? loteReal.manzana : c.manzana,
        parcela: esVacio(c.parcela) ? loteReal.parcela : c.parcela,
        lote: esVacio(c.lote) ? loteReal.lote : c.lote,
      };
    });

    setClientes(clientesFix);
    setFiltered(clientesFix);
    setResumen(resumenGeneral);
    setLoading(false);
  };

 
  const handleSearch = (e) => {
    const raw = e.target.value;
    setSearch(raw);

    const qText = normalizeText(raw);
    const qDigits = onlyDigits(raw);
    const tokens = qText.split(" ").filter(Boolean);

    const filteredData = clientes.filter((c) => {
      const cuilDigits = onlyDigits(c.cuil_cuit);
      const nombreCompleto = normalizeText(`${c.nombre} ${c.apellido}`);

      if (qDigits.length > 0) return cuilDigits.includes(qDigits);
      if (tokens.length === 0) return true;

      // exige que todas las palabras estén
      return tokens.every((t) => nombreCompleto.includes(t));
    });

    setFiltered(filteredData);
    setPage(0);
  };

  const handleOpenDetalle = (cliente) => {
    setDetalleCliente(cliente);
    setOpenDetalle(true);
  };

  const handleCloseDetalle = () => {
    setOpenDetalle(false);
    setDetalleCliente(null);
  };

  const getDetalleCliente = async (cuil) => {
    return await servicioClientes.detalle(cuil);
  };

  if (loading) return <CargaDeTabla />;

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
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
              <PeopleRoundedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Estado de cuotas - Zona PIT
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Deudores y cuotas pagadas por cliente
              </Typography>
            </Box>
          </Box>

          {resumen && (
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
              <Chip
                variant="outlined"
                label={`Debe: ${resumen.debe}`}
                sx={{ fontWeight: 600, color: COLOR_ERROR, borderColor: COLOR_ERROR }}
              />
              <Chip
                variant="outlined"
                label={`Pagadas: ${resumen.pagadas}`}
                sx={{ fontWeight: 600, color: COLOR_OK, borderColor: COLOR_OK }}
              />
              <Chip variant="outlined" label={`Total: ${resumen.total}`} sx={{ fontWeight: 600 }} />
            </Box>
          )}
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <TextField
            placeholder="Buscar por CUIL o nombre"
            size="small"
            value={search}
            onChange={handleSearch}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: COLOR_MUTED, fontSize: 20 }} />
                  </InputAdornment>
                ),
              },
            }}
            sx={{ width: { xs: "100%", md: 420 }, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
          />
        </Box>

        <Divider sx={{ borderColor: COLOR_BORDER }} />

        <TableContainer sx={{ maxHeight: "65vh" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                {[
                  "CUIL/CUIT",
                  "NOMBRE",
                  "LIQUIDADAS",
                  "DEBE",
                  "PAGADAS",
                  "TOTAL DEVENGADO",
                  "TOTAL PAGADO",
                  "DEUDA",
                  "DETALLE",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={sxTh}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((c) => {
                  const rowKey = `${normDigits(c.cuil_cuit)}|${c.fraccion ?? ""}|${c.manzana ?? ""}|${c.parcela ?? ""}|${c.lote ?? ""}|${c.total_devengado ?? ""}|${c.pagado ?? ""}`;

                  return (
                    <TableRow
                      key={rowKey}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell
                        sx={{ ...sxTd, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}
                        onClick={() => navigate(`/usuario2/detallecliente/${c.cuil_cuit}`)}
                      >
                        {c.cuil_cuit}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, fontWeight: 600 }}>
                        {c.nombre} {c.apellido}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, fontWeight: 600 }}>
                        {c.liquidadas}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, color: COLOR_ERROR, fontWeight: 600 }}>
                        {c.debe}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, color: COLOR_OK, fontWeight: 600 }}>
                        {c.pagadas}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>
                        {Number(c.total_devengado).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>
                        {Number(c.pagado).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>

                      <TableCell sx={{ ...sxTd, fontWeight: 700, whiteSpace: "nowrap" }}>
                        {(Number(c.total_devengado) - Number(c.pagado)).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                        })}
                      </TableCell>

                      <TableCell sx={sxTd}>
                        <Tooltip title="Ver cuotas adeudadas">
                          <IconButton size="small" onClick={() => handleOpenDetalle(c)} sx={{ color: COLOR_ACCENT }}>
                            <ReceiptLongRoundedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filtered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, n) => setPage(n)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
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

   
      <ModalDetalleDeudor
        open={openDetalle}
        onClose={handleCloseDetalle}
        clienteBase={detalleCliente}
        getDetalleCliente={getDetalleCliente}
      />
    </Box>
  );
};

export default Deudores;
