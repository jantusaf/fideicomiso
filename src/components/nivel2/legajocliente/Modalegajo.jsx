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
  const params = useParams();
  const cuil_cuit = params.cuil_cuit;

  const [open, setOpen] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [enviarr, setEnviarr] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const [legform, setLegform] = useState({
    cuil_cuit: cuil_cuit,
    tipo: "",
    descripcion: ""
  });

  /*
    IMPORTANTE:
    Cada objeto tiene:
    - value: valor que se guarda en la base de datos.
    - label: texto que ve el usuario.
  */
  const documentosPersona = [
    { value: "Dni", label: "1.a - DNI Frente" },
    { value: "Dni dorso", label: "1.b - DNI Dorso" },
    { value: "Constancia CUIL/CUIT", label: "2 - Constancia CUIL/CUIT" },
    { value: "Acreditacion Domicilio", label: "3 - Acreditación de domicilio" },
    { value: "Acreditacion de ingresos", label: "4.1 - Certificación de ingresos" },
    { value: "Recibo de sueldo", label: "4.a - Recibo de sueldo" },
    { value: "Pago Monotributo", label: "4.b - Pago de Monotributo" },
    { value: "Constancia de Afip", label: "4.c - Constancia de AFIP" },
    { value: "Pago autonomo", label: "4.c - Pago de autónomo" },
    { value: "DDJJ IIBB", label: "4.d - DDJJ IIBB" },
    { value: "Dj CalidadPerso", label: "DJ Calidad de Persona" },
    { value: "Dj Datospers", label: "5 - DJ Datos personales" },
    { value: "Dj OrigenFondos", label: "7 - DJ Origen de fondos" },
    { value: "Cbu personal", label: "8 - CBU personal" },
    { value: "Cbu familiar", label: "8 - CBU familiar" },
    { value: "Constancia RePET", label: "9.1 - Constancia RePET" },
    { value: "Anticipo", label: "Anticipo" },
    { value: "Boleto comparaventa", label: "Boleto compraventa" }
  ];

  const documentosEmpresa = [
    { value: "Dni", label: "1.a - DNI Frente" },
    { value: "Dni dorso", label: "1.b - DNI Dorso" },
    { value: "Constancia de Afip", label: "2 - Constancia de AFIP" },
    { value: "Acreditacion Domicilio", label: "3 - Acreditación de domicilio" },
    {
      value: "Ultimos balances CPCE",
      label: "4.1 - Últimos balances certificados en CPCE"
    },
    { value: "DjIva", label: "4.2 - DJ IVA" },
    { value: "Pagos Previsionales", label: "4.3 - Pagos previsionales" },
    {
      value: "Referencias comerciales",
      label: "4.4 - Referencias comerciales"
    },
    { value: "DDJJ IIBB", label: "4.5 - DDJJ IIBB" },
    { value: "Dj Datospers", label: "5 - DJ Datos personales" },
    { value: "Dj OrigenFondos", label: "7 - DJ Origen de fondos" },
    { value: "Cbu personal", label: "8 - CBU personal" },
    { value: "Cbu familiar", label: "8 - CBU familiar" },
    { value: "Estatuto Social", label: "9 - Estatuto social" },
    {
      value: "Acta del organo decisorio",
      label: "10 - Acta de órgano decisorio asignado"
    },
    { value: "Constancia RePET", label: "11 - Constancia RePET" },
    { value: "Poder General", label: "Poder general" },
    { value: "Acta de Entrega", label: "Acta de entrega" },
    { value: "Anticipo", label: "Anticipo" },
    { value: "Boleto comparaventa", label: "Boleto compraventa" }
  ];

  // Si razon es "Persona", muestra categorías de persona física.
  // Cualquier otro valor muestra categorías de empresa.
  const documentosAMostrar =
    props.razon === "Persona" ? documentosPersona : documentosEmpresa;

  const tiposExistentes = props.tiposExistentes || [];

  const esTipoExistente = (tipo) => {
    return tiposExistentes.includes(tipo);
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const archivo = acceptedFiles[0];
      const formData = new FormData();

      formData.append("file", archivo);

      setFileUpload(archivo);
      setEnviarr(formData);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false
  });

  const handleChange = (e) => {
    setLegform({
      ...legform,
      [e.target.name]: e.target.value
    });
  };

  const cerrarModal = () => {
    setOpen(false);
    setFileUpload(null);
    setEnviarr(null);

    setLegform({
      cuil_cuit: cuil_cuit,
      tipo: "",
      descripcion: ""
    });
  };

  const abrirModal = () => {
    setOpen(true);
  };

  const enviar = async () => {
    if (!legform.tipo) {
      alert("Seleccioná un tipo de documento");
      return;
    }

    if (!enviarr) {
      alert("Subí un archivo primero");
      return;
    }

    setLoadingPdf(true);
    setCargando(true);

    try {
      // append se hace sólo una vez, justo antes de enviar.
      enviarr.append("cuil_cuit", legform.cuil_cuit);
      enviarr.append("tipo", legform.tipo);
      enviarr.append("descripcion", legform.descripcion);

      const data = await servicioLegajo.subirlegajode(enviarr);

      alert(data);

      if (props.getData) {
        props.getData();
      }

      if (props.getData2) {
        props.getData2();
      }

      cerrarModal();
    } catch (error) {
      console.error("Error al subir legajo:", error);
      alert("Ocurrió un error al subir el archivo");
    } finally {
      setCargando(false);
      setLoadingPdf(false);
    }
  };

  return (
    <>
      <Backdrop open={loadingPdf} sx={{ color: "#fff", zIndex: 1301 }}>
        <Box textAlign="center">
          <CircularProgress color="inherit" />
          <p>Subiendo archivo...</p>
        </Box>
      </Backdrop>

      <Button
        variant="contained"
        onClick={abrirModal}
        sx={{
          borderRadius: "20px",
          background: "#1f7a8c",
          textTransform: "none",
          fontWeight: "bold"
        }}
      >
        + Agregar Legajo
      </Button>

      <Dialog open={open} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold" }}>
          📄 Nuevo Legajo
        </DialogTitle>

        <DialogContent>
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

              {documentosAMostrar.map((documento) => (
                <MenuItem
                  key={documento.value}
                  value={documento.value}
                  sx={{
                    color: esTipoExistente(documento.value) ? "blue" : "red"
                  }}
                >
                  {documento.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
                  Archivo seleccionado: {fileUpload.name}
                </p>
              )}
            </Paper>
          )}

          {fileUpload && (
            <TextField
              margin="dense"
              label="Descripción"
              name="descripcion"
              value={legform.descripcion}
              onChange={handleChange}
              fullWidth
              sx={{ mt: 3 }}
            />
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={cerrarModal} disabled={cargando}>
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