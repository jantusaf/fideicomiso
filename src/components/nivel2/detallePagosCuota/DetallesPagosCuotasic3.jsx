import * as React from "react";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import servicioPagos from "../../../services/pagos";
import Borrar from "./modalborraric3";
import Button from "@mui/material/Button";
import Modif from "./modalactcompic3";
import Borrarcomp from "./modalborrarcomprobanteic3";

import {
  Box,
  Paper,
  Typography,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Tooltip from "@mui/material/Tooltip";
import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_ERROR,
  sxCard,
  sxBtnOutlined,
} from "../detalleclienteIngresos/estilos";

export default function DetallesPagoic3s(props) {
  let params = useParams();
  let id = params.id;

  useEffect(() => {
    traer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pagos, setPagos] = useState([]);

  const traer = async () => {
    const aux = { id: id };
    const pag = await servicioPagos.detallesPagoic3(aux);
    setPagos(pag);
  };

  const recargar = async () => {
    const aux = { id: id };
    const pag = await servicioPagos.detallesPagoic3(aux);
    setPagos(pag);
  };

  async function download(index) {
    try {
      const pdfBlob = await servicioPagos.traerPdfConstanciadepagoic3(pagos[index].id);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
      alert("Error al cargar el PDF");
    }
  }

  const sinComprobante = (texto) => (
    <Tooltip title={texto}>
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: "#ed6c02" }}>
        <ErrorOutlineRoundedIcon sx={{ fontSize: 18 }} />
        <Typography sx={{ fontWeight: 600, fontSize: 12.5, whiteSpace: "nowrap", color: "inherit" }}>
          Sin comprobante
        </Typography>
      </Box>
    </Tooltip>
  );

  function modifa(index) {
    return <Modif id={pagos[index].id} getData={recargar} />;
  }

  function borrarcomp(index) {
    return pagos[index].ubicacion == null ? (
      sinComprobante("Pago sin comprobante")
    ) : (
      <Borrarcomp id={pagos[index].id} getData={recargar} />
    );
  }

  function monto(index) {
    const v = pagos[index]?.monto;

    const montoFormateado = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Number(v) || 0);

    const esDistinto = pagos[index]?.monto_distinto == "Si";

    return (
      <Box
        sx={{
          fontWeight: 600,
          textAlign: "right",
          whiteSpace: "nowrap",
          width: "100%",
          color: esDistinto ? COLOR_ERROR : COLOR_TEXT,
        }}
      >
        {montoFormateado}
      </Box>
    );
  }

  function downloadFile(index) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Button
          size="small"
          variant="outlined"
          startIcon={<VisibilityRoundedIcon />}
          onClick={() => download(index)}
          sx={{ ...sxBtnOutlined, px: 1.5, whiteSpace: "nowrap" }}
        >
          Ver online
        </Button>

        <Borrar id={pagos[index].id} />
      </Box>
    );
  }

  const generarPDFIC3 = async (index) => {
    try {
      const pdfBlob = await servicioPagos.traerPdfConstanciadepagoic3(pagos[index].id);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
      alert("Error al cargar el PDF");
    }
  };

  function comprobantePDF(index) {
    const sinPdf = pagos[index]?.ubicacion == null;

    return sinPdf ? (
      sinComprobante("Pago sin comprobante PDF")
    ) : (
      <Button
        size="small"
        variant="outlined"
        startIcon={<PictureAsPdfRoundedIcon />}
        onClick={() => generarPDFIC3(index)}
        sx={{ ...sxBtnOutlined, px: 1.5, whiteSpace: "nowrap" }}
      >
        PDF
      </Button>
    );
  }

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

  const columnas = [
    "ID",
    "MES",
    "AÑO",
    "MONTO",
    "CUIL ADMINISTRADOR",
    "BORRAR COMPROBANTE",
    "MODIFICAR",
    "COMPROBANTE (PDF)",
    "VER / BORRAR",
  ];

  return (
    <Box sx={{ width: "100%", maxWidth: 1320, mx: "auto", minWidth: 0 }}>
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
              <ReceiptLongRoundedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>

            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Lista de pagos IC3
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Detalle, comprobantes y acciones sobre cada pago
              </Typography>
            </Box>
          </Box>

          <Chip variant="outlined" label={`Registros: ${pagos.length}`} sx={{ fontWeight: 600 }} />
        </Box>
      </Paper>

      {/* LISTADO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columnas.map((h) => (
                  <TableCell key={h} sx={{ ...sxTh, ...(h === "MONTO" ? { textAlign: "right" } : {}) }}>
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {pagos.map((p, index) => (
                <TableRow key={p.id ?? index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                  <TableCell sx={sxTd}>{p.id}</TableCell>
                  <TableCell sx={sxTd}>{p.mes}</TableCell>
                  <TableCell sx={sxTd}>{p.anio}</TableCell>
                  <TableCell sx={sxTd}>{monto(index)}</TableCell>
                  <TableCell sx={sxTd}>{p.cuil_cuit_administrador}</TableCell>
                  <TableCell sx={sxTd}>{borrarcomp(index)}</TableCell>
                  <TableCell sx={sxTd}>{modifa(index)}</TableCell>
                  <TableCell sx={sxTd}>{comprobantePDF(index)}</TableCell>
                  <TableCell sx={sxTd}>{downloadFile(index)}</TableCell>
                </TableRow>
              ))}

              {pagos.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columnas.length} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                    No se encontraron registros.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
