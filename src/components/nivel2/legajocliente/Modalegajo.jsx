import * as React from "react";
import {
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  CircularProgress,
  Backdrop,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from "@mui/material";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import servicioLegajo from "../../../services/legajos";

export default function FormDialog(props) {
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [open, setOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [enviarr, setEnviarr] = useState();
  const [cargando, setCargando] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [legform, setLegform] = useState({
    cuil_cuit: cuil_cuit,
    tipo: "",
    descripcion: ""
  });

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const formData = new FormData();
      setFileUpload(acceptedFiles[0]);
      formData.append("file", acceptedFiles[0]);
      setEnviarr(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const enviar = async () => {
    setLoadingPdf(true);
    setCargando(true);

    if (enviarr) {
      enviarr.append("cuil_cuit", legform.cuil_cuit);
      enviarr.append("tipo", legform.tipo);
      enviarr.append("descripcion", legform.descripcion);

      try {
        const data = await servicioLegajo.subirlegajode(enviarr);
        alert(data);
        props.getData();
        props.getData2();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert("Subí un archivo primero");
    }

    setCargando(false);
    setLoadingPdf(false);
    setOpen(false);
  };

  const handleChange = (e) => {
    setLegform({ ...legform, [e.target.name]: e.target.value });
  };

  const tiposExistentes = props.tiposExistentes || [];
  const esTipoExistente = (tipo) => tiposExistentes.includes(tipo);

  return (
    <>
      {/* LOADER */}
      <Backdrop open={loadingPdf} sx={{ color: "#fff", zIndex: 1301 }}>
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <p>Subiendo archivo...</p>
        </Box>
      </Backdrop>

      {/* BOTON */}
      <Button
        variant="contained"
        onClick={() => setOpen(true)}
        sx={{
          borderRadius: "20px",
          background: "#1f7a8c",
          textTransform: "none",
          fontWeight: "bold"
        }}
      >
        + Agregar Legajo
      </Button>

      {/* MODAL */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📄 Nuevo Legajo
        </DialogTitle>

        <DialogContent>

          {/* SELECT */}
     <FormControl fullWidth sx={{ mt: 2 }}>
  <InputLabel>Tipo de documento</InputLabel>

  <Select
    name="tipo"
    value={legform.tipo}
    onChange={handleChange}
    label="Tipo de documento"
    sx={{ borderRadius: "12px" }}
  >
    <MenuItem value="">Elegir</MenuItem>

    {/* 
      Tipos que ya existen en la base.
      Sirve para no perder documentos viejos o tipos agregados manualmente.
    */}

    {/* ================= PERSONA FÍSICA ================= */}
    {props.razon === "Persona" ? (
      <>
        <MenuItem
          value="Dni"
          sx={{ color: esTipoExistente("Dni") ? "blue" : "red" }}
        >
          1.a - DNI Frente
        </MenuItem>

        <MenuItem
          value="Dni dorso"
          sx={{ color: esTipoExistente("Dni dorso") ? "blue" : "red" }}
        >
          1.b - DNI Dorso
        </MenuItem>

        <MenuItem
          value="Constancia CUIL/CUIT"
          sx={{
            color: esTipoExistente("Constancia CUIL/CUIT")
              ? "blue"
              : "red"
          }}
        >
          2 - Constancia CUIL/CUIT
        </MenuItem>

        <MenuItem
          value="Acreditacion Domicilio"
          sx={{
            color: esTipoExistente("Acreditacion Domicilio")
              ? "blue"
              : "red"
          }}
        >
          3 - Acreditación de domicilio
        </MenuItem>

        <MenuItem
          value="Acreditacion de ingresos"
          sx={{
            color: esTipoExistente("Acreditacion de ingresos")
              ? "blue"
              : "red"
          }}
        >
          4.1 - Certificación de ingresos
        </MenuItem>

        <MenuItem
          value="Recibo de sueldo"
          sx={{
            color: esTipoExistente("Recibo de sueldo") ? "blue" : "red"
          }}
        >
          4.a - Recibo de sueldo
        </MenuItem>

        <MenuItem
          value="Pago Monotributo"
          sx={{
            color: esTipoExistente("Pago Monotributo") ? "blue" : "red"
          }}
        >
          4.b - Pago de Monotributo
        </MenuItem>

        <MenuItem
          value="Constancia de Afip"
          sx={{
            color: esTipoExistente("Constancia de Afip") ? "blue" : "red"
          }}
        >
          4.c - Constancia de AFIP
        </MenuItem>

        <MenuItem
          value="Pago autonomo"
          sx={{
            color: esTipoExistente("Pago autonomo") ? "blue" : "red"
          }}
        >
          4.c - Pago de autónomo
        </MenuItem>

        <MenuItem
          value="DDJJ IIBB"
          sx={{ color: esTipoExistente("DDJJ IIBB") ? "blue" : "red" }}
        >
          4.d - DDJJ IIBB
        </MenuItem>

        <MenuItem
          value="Dj CalidadPerso"
          sx={{
            color: esTipoExistente("Dj CalidadPerso") ? "blue" : "red"
          }}
        >
          DJ Calidad de Persona
        </MenuItem>

        <MenuItem
          value="Dj Datospers"
          sx={{ color: esTipoExistente("Dj Datospers") ? "blue" : "red" }}
        >
          5 - DJ Datos personales
        </MenuItem>

        <MenuItem
          value="Dj OrigenFondos"
          sx={{
            color: esTipoExistente("Dj OrigenFondos") ? "blue" : "red"
          }}
        >
          7 - DJ Origen de fondos
        </MenuItem>

        <MenuItem
          value="Cbu personal"
          sx={{
            color: esTipoExistente("Cbu personal") ? "blue" : "red"
          }}
        >
          8 - CBU personal
        </MenuItem>

        <MenuItem
          value="Cbu familiar"
          sx={{
            color: esTipoExistente("Cbu familiar") ? "blue" : "red"
          }}
        >
          8 - CBU familiar
        </MenuItem>

        <MenuItem
          value="Constancia RePET"
          sx={{
            color: esTipoExistente("Constancia RePET") ? "blue" : "red"
          }}
        >
          9.1 - Constancia RePET
        </MenuItem>

        <MenuItem
          value="Anticipo"
          sx={{ color: esTipoExistente("Anticipo") ? "blue" : "red" }}
        >
          Anticipo
        </MenuItem>

        <MenuItem
          value="Boleto comparaventa"
          sx={{
            color: esTipoExistente("Boleto comparaventa") ? "blue" : "red"
          }}
        >
          Boleto compraventa
        </MenuItem>
      </>
    ) : (
      <>
        {/* ================= EMPRESA / PERSONA JURÍDICA ================= */}

        <MenuItem
          value="Dni"
          sx={{ color: esTipoExistente("Dni") ? "blue" : "red" }}
        >
          1.a - DNI Frente
        </MenuItem>

        <MenuItem
          value="Dni dorso"
          sx={{ color: esTipoExistente("Dni dorso") ? "blue" : "red" }}
        >
          1.b - DNI Dorso
        </MenuItem>

        <MenuItem
          value="Constancia de Afip"
          sx={{
            color: esTipoExistente("Constancia de Afip") ? "blue" : "red"
          }}
        >
          2 - Constancia de AFIP
        </MenuItem>

        <MenuItem
          value="Acreditacion Domicilio"
          sx={{
            color: esTipoExistente("Acreditacion Domicilio")
              ? "blue"
              : "red"
          }}
        >
          3 - Acreditación de domicilio
        </MenuItem>

        <MenuItem
          value="Ultimos balances CPCE"
          sx={{
            color: esTipoExistente("Ultimos balances CPCE") ? "blue" : "red"
          }}
        >
          4.1 - Últimos balances certificados en CPCE
        </MenuItem>

        <MenuItem
          value="DjIva"
          sx={{ color: esTipoExistente("DjIva") ? "blue" : "red" }}
        >
          4.2 - DJ IVA
        </MenuItem>

        <MenuItem
          value="Pagos Previsionales"
          sx={{
            color: esTipoExistente("Pagos Previsionales") ? "blue" : "red"
          }}
        >
          4.3 - Pagos previsionales
        </MenuItem>

        <MenuItem
          value="Referencias comerciales"
          sx={{
            color: esTipoExistente("Referencias comerciales")
              ? "blue"
              : "red"
          }}
        >
          4.4 - Referencias comerciales
        </MenuItem>

        <MenuItem
          value="DDJJ IIBB"
          sx={{ color: esTipoExistente("DDJJ IIBB") ? "blue" : "red" }}
        >
          4.5 - DDJJ IIBB
        </MenuItem>

        <MenuItem
          value="Dj Datospers"
          sx={{ color: esTipoExistente("Dj Datospers") ? "blue" : "red" }}
        >
          5 - DJ Datos personales
        </MenuItem>

        <MenuItem
          value="Dj OrigenFondos"
          sx={{
            color: esTipoExistente("Dj OrigenFondos") ? "blue" : "red"
          }}
        >
          7 - DJ Origen de fondos
        </MenuItem>

        <MenuItem
          value="Cbu personal"
          sx={{
            color: esTipoExistente("Cbu personal") ? "blue" : "red"
          }}
        >
          8 - CBU personal
        </MenuItem>

        <MenuItem
          value="Cbu familiar"
          sx={{
            color: esTipoExistente("Cbu familiar") ? "blue" : "red"
          }}
        >
          8 - CBU familiar
        </MenuItem>

        <MenuItem
          value="Estatuto Social"
          sx={{
            color: esTipoExistente("Estatuto Social") ? "blue" : "red"
          }}
        >
          9 - Estatuto social
        </MenuItem>

        <MenuItem
          value="Acta del organo decisorio"
          sx={{
            color: esTipoExistente("Acta del organo decisorio")
              ? "blue"
              : "red"
          }}
        >
          10 - Acta de órgano decisorio asignado
        </MenuItem>

        <MenuItem
          value="Constancia RePET"
          sx={{
            color: esTipoExistente("Constancia RePET") ? "blue" : "red"
          }}
        >
          11 - Constancia RePET
        </MenuItem>

        <MenuItem
          value="Poder General"
          sx={{
            color: esTipoExistente("Poder General") ? "blue" : "red"
          }}
        >
          Poder general
        </MenuItem>

        <MenuItem
          value="Acta de Entrega"
          sx={{
            color: esTipoExistente("Acta de Entrega") ? "blue" : "red"
          }}
        >
          Acta de entrega
        </MenuItem>

        <MenuItem
          value="Anticipo"
          sx={{ color: esTipoExistente("Anticipo") ? "blue" : "red" }}
        >
          Anticipo
        </MenuItem>

        <MenuItem
          value="Boleto comparaventa"
          sx={{
            color: esTipoExistente("Boleto comparaventa") ? "blue" : "red"
          }}
        >
          Boleto compraventa
        </MenuItem>
      </>
    )}
  </Select>
</FormControl>

          {/* DROPZONE */}
          {legform.tipo && (
            <Paper
              {...getRootProps()}
              sx={{
                mt: 3,
                p: 4,
                textAlign: "center",
                borderRadius: "16px",
                border: "2px dashed #1f7a8c",
                background: "#f8fafc",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  background: "#eef6f8"
                }
              }}
            >
              <input {...getInputProps()} />

              <CloudUploadIcon sx={{ fontSize: 40, color: "#1f7a8c" }} />

              <p style={{ marginTop: 10 }}>
                {isDragActive
                  ? "Soltá el archivo acá"
                  : "Arrastrá o hacé click para subir"}
              </p>

              {fileUpload && (
                <p style={{ color: "green", fontWeight: "bold" }}>
                  {fileUpload.name}
                </p>
              )}
            </Paper>
          )}

          {/* DESCRIPCION */}
          {fileUpload && (
            <TextField
              margin="dense"
              label="Descripción"
              name="descripcion"
              onChange={handleChange}
              fullWidth
              sx={{ mt: 3 }}
            />
          )}
        </DialogContent>

        {/* ACCIONES */}
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>
            Cancelar
          </Button>

          {cargando ? (
            <CircularProgress size={24} />
          ) : (
            <Button
              onClick={enviar}
              variant="contained"
              sx={{
                borderRadius: "20px",
                background: "#1f7a8c",
                textTransform: "none"
              }}
            >
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}