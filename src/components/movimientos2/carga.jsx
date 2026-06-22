import React, { useState } from "react";
import servicionivel3 from "../../services/nivel3";
import SubirExcelMovimientos from "./subierexce";
//import Tabla from "./tablamovimientos";

import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Card,
  CardContent,
  Collapse,
  Modal,
} from "@mui/material";

export default function FormMovimiento() {
  const [mostrarForm, setMostrarForm] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const [tipo, setTipo] = useState("EGRESO");
  const [concepto, setConcepto] = useState("");
  const [monto, setMonto] = useState("");
  const [medio, setMedio] = useState("");
  const [detalle, setDetalle] = useState("");
  const [loading, setLoading] = useState(false);

  const mediosPago = [
    "Efectivo",
    "Transferencia",
    "Banco",
    "Tarjeta",
    "Cheque",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!concepto || !monto || !medio) {
      alert("Complete los campos obligatorios");
      return;
    }

    setLoading(true);

    const data = {
      tipo_operacion: tipo,
      concepto: concepto,
      monto: Number(monto),
      medio_pago: medio,
      descripcion: detalle,
    };

    try {
      await servicionivel3.enviarmovimiento(data);

      alert("Movimiento registrado");

      setConcepto("");
      setMonto("");
      setMedio("");
      setDetalle("");
      setMostrarForm(false);
    } catch (err) {
      console.error(err);
      alert("Error al registrar el movimiento");
    }

    setLoading(false);
  };

  return (
    <>
     {/* HEADER PREMIUM */}
<Box
  sx={{
    borderRadius: "22px",
    overflow: "hidden",
    mb: 2,
    background:
      "linear-gradient(90deg,#083b5c 0%, #0b5c76 55%, #148a8f 100%)",
    boxShadow: "0 10px 28px rgba(0,0,0,0.10)",
  }}
>
  <Box
    sx={{
      px: 2.5,
      py: 2,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
      flexWrap: "wrap",
    }}
  >
    {/* IZQUIERDA */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.8,
      }}
    >
      {/* ICONO */}
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: "18px",
          background: "rgba(255,255,255,0.12)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid rgba(255,255,255,0.15)",
        }}
      >
        <Typography sx={{ fontSize: 26 }}>
          💳
        </Typography>
      </Box>

      {/* TITULOS */}
      <Box>
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 24,
            lineHeight: 1,
          }}
        >
          Movimientos
        </Typography>

        <Typography
          sx={{
            color: "rgba(255,255,255,0.82)",
            fontSize: 13,
            mt: 0.6,
          }}
        >
          Gestión y control de ingresos y egresos
        </Typography>
      </Box>
    </Box>

    {/* DERECHA */}
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        ml: "auto",
        flexWrap: "wrap",
      }}
    >
      {/* CANTIDAD */}
    

      {/* BOTON EXCEL */}
      <Button
        onClick={() => setOpenExcel(true)}
        variant="contained"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 900,
          px: 2,
          height: 42,
          fontSize: 14,

          backgroundColor: "rgba(255,255,255,0.16)",
          color: "#fff",

          border: "1px solid rgba(255,255,255,0.25)",

          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",

          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.24)",
          },
        }}
      >
        📊 Cargar Excel
      </Button>

      {/* BOTON MOVIMIENTO */}
     <Button
  onClick={() => setMostrarForm(true)}
        variant="contained"
        sx={{
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 900,
          px: 2,
          height: 42,
          fontSize: 14,

          backgroundColor: "rgba(255,255,255,0.16)",
          color: "#fff",

          border: "1px solid rgba(255,255,255,0.25)",

          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",

          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.24)",
          },
        }}
      >
        ➕ Registrar movimiento
      </Button>
    </Box>
  </Box>
</Box>

      {/* MODAL EXCEL */}
{/* MODAL EXCEL */}
<Modal
  open={openExcel}
  onClose={() => setOpenExcel(false)}
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      maxWidth: 700,
      px: 2,
    }}
  >
    <Card
      sx={{
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          background:
            "linear-gradient(90deg,#083b5c 0%, #0b5c76 55%, #148a8f 100%)",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          Cargar Excel
        </Typography>

        <Button
          onClick={() => setOpenExcel(false)}
          sx={{
            minWidth: "auto",
            color: "#fff",
            fontSize: 18,
          }}
        >
          ✕
        </Button>
      </Box>

      {/* BODY */}
      <Box
        sx={{
          p: 3,
          background: "#fff",
        }}
      >
        <SubirExcelMovimientos />
      </Box>
    </Card>
  </Box>
</Modal>

      {/* FORMULARIO */}
      {/* MODAL REGISTRAR MOVIMIENTO */}
<Modal
  open={mostrarForm}
  onClose={() => setMostrarForm(false)}
>
  <Box
    sx={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "100%",
      maxWidth: 520,
      px: 2,
    }}
  >
    <Card
      sx={{
        borderRadius: "22px",
        overflow: "hidden",
        boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
      
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          background:
            "linear-gradient(90deg,#083b5c 0%, #0b5c76 55%, #148a8f 100%)",
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            fontWeight: 800,
            fontSize: 20,
          }}
        >
          Registrar Movimiento
        </Typography>

        <Button
          onClick={() => setMostrarForm(false)}
          sx={{
            minWidth: "auto",
            color: "#fff",
            fontSize: 18,
          }}
        >
          ✕
        </Button>
      </Box>

      <CardContent sx={{ p: 3 }}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <TextField
            select
            label="Tipo"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            size="small"
          >
            <MenuItem value="EGRESO">Egreso</MenuItem>
            <MenuItem value="INGRESO">Ingreso</MenuItem>
          </TextField>

          <TextField
            label="Concepto"
            value={concepto}
            onChange={(e) => setConcepto(e.target.value)}
            size="small"
          />

          <TextField
            label="Monto"
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            size="small"
          />

          <TextField
            select
            label="Medio de pago"
            value={medio}
            onChange={(e) => setMedio(e.target.value)}
            size="small"
          >
            <MenuItem value="">Seleccionar</MenuItem>

            {mediosPago.map((m, i) => (
              <MenuItem key={i} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Detalle"
            value={detalle}
            onChange={(e) => setDetalle(e.target.value)}
            size="small"
          />

       <Button
  type="submit"
  disabled={loading}
  variant="contained"
  sx={{
     mt: 1,
  background: "#14919B",
  color: "#fff",
  borderRadius: "10px",
  textTransform: "none",
  fontWeight: 700,
  fontSize: "13px",

  minWidth: 140,
  width: "fit-content",
  height: 34,

  px: 2,

  alignSelf: "center",

  boxShadow: "none",

  "&:hover": {
    background: "#117C85",
    boxShadow: "none",
    },
  }}
>
  {loading ? "Guardando..." : "Guardar movimiento"}
</Button>
        </Box>
      </CardContent>
    </Card>
  </Box>
</Modal>

      {/* TABLA */}
      {/* <Tabla /> */}
    </>
  );
}