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

              {props.tiposExistentes?.map((t, i) => (
                <MenuItem key={i} value={t} sx={{ color: "#1976d2" }}>
                  {t}
                </MenuItem>
              ))}

              {/* nuevos tipos */}
              <MenuItem value="Dni" sx={{ color: esTipoExistente("Dni") ? "blue" : "red" }}>DNI</MenuItem>
              <MenuItem value="Dni dorso" sx={{ color: esTipoExistente("Dni dorso") ? "blue" : "red" }}>DNI Dorso</MenuItem>
              <MenuItem value="Constancia de Afip">Constancia AFIP</MenuItem>

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