import * as React from "react";
import { useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import servicioPagos from "../../../services/pagos";
import serviciousuario1 from "../../../services/usuario1"; // (no lo uso, lo dejo como estaba)
import Borrar from "./modalborraric3";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Modif from "./modalactcompic3";
import Borrarcomp from "./modalborrarcomprobanteic3";

import { Box, Paper, Typography, Chip } from "@mui/material";
import { alpha } from "@mui/material/styles";

import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import TableRowsRoundedIcon from "@mui/icons-material/TableRowsRounded";

import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";
import Tooltip from "@mui/material/Tooltip";

import PictureAsPdfRoundedIcon from "@mui/icons-material/PictureAsPdfRounded";


export default function DetallesPagoic3s(props) {
  let params = useParams();
  let id = params.id;
  const navigate = useNavigate();

  useEffect(() => {
    console.log(id);
    traer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pagos, setPagos] = useState([]);

  const traer = async () => {
    const aux = { id: id };
    const pag = await servicioPagos.detallesPagoic3(aux);
    setPagos(pag);
  };

  async function download(index, rowIndex, data) {
    try {
      const pdfBlob = await servicioPagos.traerPdfConstanciadepagoic3(pagos[index].id);
      const url = URL.createObjectURL(pdfBlob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al obtener el PDF:", error);
      alert("Error al cargar el PDF");
    }
  }

  function modifa(index, rowIndex, data) {
    return (
      <>
        <Modif
          id={pagos[index].id}
          getData={async () => {
            const aux = { id: id };
            const pag = await servicioPagos.detallesPagoic3(aux);
            setPagos(pag);
          }}
        />
      </>
    );
  }

 function borrarcomp(index, rowIndex, data) {
  return (
    <>
      {pagos[index].ubicacion == null ? (
        <Tooltip title="Pago sin comprobante">
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            <ErrorOutlineRoundedIcon style={{ color: "#f9a825" }} />
            <Typography
              sx={{
                fontWeight: 800,
                color: "#f9a825",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
              Sin comprobante
            </Typography>
          </Box>
        </Tooltip>
      ) : (
        <Borrarcomp
          id={pagos[index].id}
          getData={async () => {
            const aux = { id: id };
            const pag = await servicioPagos.detallesPagoic3(aux);
            setPagos(pag);
          }}
        />
      )}
    </>
  );
}

  function monto(index, rowIndex, data) {
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
          fontWeight: 900,
          textAlign: "right",
          whiteSpace: "nowrap",
          width: "100%",
          color: esDistinto ? "crimson" : "#0b2b3a",
        }}
      >
        {montoFormateado}
      </Box>
    );
  }

  function downloadFile(index, rowIndex, data) {
    return (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Button
          size="small"
          variant="contained"
          startIcon={<VisibilityRoundedIcon style={{ color: "#fff" }} />}
          onClick={() => download(index)}
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 999,
            px: 1.6,
            color: "#fff",
            background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
            boxShadow: "0 10px 22px rgba(20,141,141,0.18)",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 14px 30px rgba(20,141,141,0.28)",
            },
            transition: "0.2s ease",
            whiteSpace: "nowrap",
          }}
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
    <Tooltip title="Pago sin comprobante PDF">
      <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.6 }}>
        <ErrorOutlineRoundedIcon style={{ color: "#f9a825" }} />
      
          <Typography
              sx={{
                fontWeight: 800,
                color: "#f9a825",
                fontSize: 13,
                whiteSpace: "nowrap",
              }}
            >
          Sin comprobante
        </Typography>
      </Box>
    </Tooltip>
  ) : (
    <Button
      size="small"
      startIcon={<PictureAsPdfRoundedIcon style={{ color: "#fff" }} />}
      onClick={() => generarPDFIC3(index)}
      sx={{
        textTransform: "none",
        fontWeight: 900,
        borderRadius: 999,
        px: 1.6,
        color: "#fff",
        background: "linear-gradient(90deg, #b71c1c 0%, #ef5350 100%)",
        boxShadow: "0 10px 22px rgba(239,83,80,0.20)",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 14px 30px rgba(239,83,80,0.28)",
        },
        transition: "0.2s ease",
        whiteSpace: "nowrap",
      }}
    >
      PDF
    </Button>
  );
}


  const columns = [
  { name: "id", label: "Id" },
  { name: "mes", label: "Mes" },
  { name: "anio", label: "Año" },
  {
    name: "Monto",
    options: {
      setCellHeaderProps: () => ({ style: { textAlign: "right" } }),
      customBodyRenderLite: (dataIndex, rowIndex) => monto(dataIndex, rowIndex),
    },
  },
  { name: "cuil_cuit_administrador", label: "Cuil Administrador" },
  {
    name: "Borrar comprobante",
    options: {
      customBodyRenderLite: (dataIndex, rowIndex) => borrarcomp(dataIndex, rowIndex),
    },
  },
  {
    name: "Modificar",
    options: {
      customBodyRenderLite: (dataIndex, rowIndex) => modifa(dataIndex, rowIndex),
    },
  },

  // ✅ NUEVA COLUMNA PDF
  {
    name: "Comprobante (PDF)",
    options: {
      customBodyRenderLite: (dataIndex) => comprobantePDF(dataIndex),
    },
  },

  {
    name: "Ver/borrar",
    options: {
      customBodyRenderLite: (dataIndex, rowIndex) => downloadFile(dataIndex, rowIndex),
    },
  },
];

  const options = {
    selectableRows: "none",
    responsive: "standard",
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 15],
    downloadOptions: { filename: "tableDownload.csv", separator: "," },
    print: true,
    filter: true,
    viewColumns: true,
    search: true,
    pagination: true,
    textLabels: {
      body: { noMatch: "No se encontraron registros", toolTip: "Ordenar" },
      pagination: {
        next: "Siguiente",
        previous: "Anterior",
        rowsPerPage: "Filas por página:",
        displayRows: "de",
      },
      toolbar: {
        search: "Buscar",
        downloadCsv: "Descargar CSV",
        print: "Imprimir",
        viewColumns: "Ver columnas",
        filterTable: "Filtrar tabla",
      },
      filter: { all: "Todos", title: "FILTROS", reset: "RESETEAR" },
      viewColumns: { title: "Mostrar columnas", titleAria: "Mostrar/ocultar columnas de la tabla" },
      selectedRows: {
        text: "fila(s) seleccionada(s)",
        delete: "Eliminar",
        deleteAria: "Eliminar filas seleccionadas",
      },
    },
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%", flex: 1, minWidth: 0 }}>
      {/* CARD PRINCIPAL */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 55px rgba(15, 127, 134, 0.10)",
        }}
      >
        {/* HEADER (GRADIENT) */}
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            background: "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
            color: "#fff",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: "14px",
                display: "grid",
                placeItems: "center",
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.35)",
                flexShrink: 0,
              }}
            >
              <ReceiptLongRoundedIcon sx={{ color: "#fff" }} />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 }, lineHeight: 1.1 }}>
                Lista de pagos IC3
              </Typography>
              <Typography sx={{ mt: 0.35, fontWeight: 650, opacity: 0.9, fontSize: 14 }}>
                Detalle, comprobantes y acciones sobre cada pago.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<TableRowsRoundedIcon />}
            label={`Registros: ${pagos.length}`}
            sx={{
              color: "#fff",
              fontWeight: 900,
              borderRadius: 999,
              background: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.35)",
              "& .MuiChip-icon": { color: "#fff" },
            }}
          />
        </Box>

        {/* CONTENEDOR TABLA */}
        <Box
          sx={{
            p: { xs: 1.5, md: 2 },

            /* ===== HEADER TABLE ===== */
            "& .MuiTableHead-root .MuiTableCell-root": {
              borderBottom: "0px",
              color: "#01567c",
              fontWeight: 900,
              background: "transparent",
            },

            /* ===== BODY ===== */
            "& .MuiTableBody-root .MuiTableCell-root": {
              borderBottom: `1px solid ${alpha("#01567c", 0.08)}`,
              fontWeight: 650,
              color: "#0b2b3a",
            },

            /* ===== TOOLBAR ===== */
            "& .MuiToolbar-root": {
              px: 2,
              color: "#01567c",
            },
            "& .MuiToolbar-root .MuiInputBase-input": {
              color: "#0b2b3a",
              fontWeight: 700,
            },

            /* ===== ICONOS ===== */
            "& .MuiIconButton-root, & svg": {
              color: alpha("#01567c", 0.75),
              transition: "all 0.2s ease",
            },
            "& .MuiIconButton-root:hover, & svg:hover": {
              color: "#148D8D",
              transform: "translateY(-1px)",
            },

            /* ===== HOVER FILAS ===== */
            "& .MuiTableRow-root:hover td": {
              backgroundColor: `${alpha("#148D8D", 0.06)} !important`,
            },

            /* ===== PAGINACIÓN ===== */
            "& .MuiTablePagination-root, & .MuiTablePagination-root *": {
              color: "#01567c",
              fontWeight: 700,
            },

            /* ===== “Paper” interno de MUIDataTable ===== */
            "& .MuiPaper-root": { boxShadow: "none" },
          }}
        >
       {/*    <MUIDataTable title={""} data={pagos} columns={columns} options={options} /> */}
        </Box>
      </Paper>
    </Box>
  );
}
