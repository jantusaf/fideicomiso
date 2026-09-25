import * as React from "react";
import {
  Paper,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  NativeSelect,
  DialogTitle,
  Box,
  CircularProgress,
  Tooltip,
  Typography,
  Chip,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useParams } from "react-router-dom";

import BackupIcon from "@mui/icons-material/Backup";
import servicioLegajo from "../../../services/legajos";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_OK, sxBtnPrimary, sxBtnOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "../detalleclienteIngresos/estilos";

export default function FormDialog(props) {
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [open, setOpen] = useState(false);
  const [file, setFile] = useState();
  const [enviarr, setEnviarr] = useState();
  const [completado, setCompletado] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [legform, setLegform] = useState({
    id: props.id,
  });

  const selecthandler = (e) => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    setFileUpload(acceptedFiles);
    formData.append("file", acceptedFiles[0]);
    setEnviarr(formData);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: "application/pdf",
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const enviar = async () => {
    setCargando(true);
    if (enviarr) {
      enviarr.append("id", legform.id);

      try {
        const response = await servicioLegajo.actualizarpagoic3(enviarr);
        props.getData();
      } catch (error) {
        console.error("Error subiendo archivo:", error);
      }
    } else {
      alert("No hay archivo para subir");
    }
    setCargando(false);
    setOpen(false);
  };

  const handleChange = (e) => {
    setLegform({ ...legform, [e.target.name]: e.target.value });
    setCompletado(true);
    console.log(legform);
  };

  const handleClickOpen = () => {
    setOpen(true);
    setCompletado(false);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box sx={{ display: "inline-flex", alignItems: "center" }}>
      <Tooltip title="Actualizar comprobante" arrow>
        <Button
          onClick={handleClickOpen}
          startIcon={<UploadFileRoundedIcon />}
          size="small"
          variant="outlined"
          sx={{ ...sxBtnOutlined, px: 1.5, whiteSpace: "nowrap" }}
        >
          Actualizar comprobante
        </Button>
      </Tooltip>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm" slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 17, color: COLOR_TEXT }}>
                Actualizar comprobante
              </Typography>
              <Typography sx={{ mt: 0.25, fontSize: 13, fontWeight: 500, color: COLOR_MUTED }}>
                Subí el PDF actualizado para reemplazar el comprobante.
              </Typography>
            </Box>

            <Chip variant="outlined" size="small" label={`ID: ${legform?.id ?? props.id}`} sx={{ fontWeight: 600 }} />
          </Box>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
              <Button
                size="small"
                startIcon={<CloudDownloadRoundedIcon />}
                variant="outlined"
                sx={{ ...sxBtnOutlined, px: 1.5 }}
              >
                Descargar modelo
              </Button>
            </Box>

            {/* DROPZONE */}
            <Box
              sx={{
                borderRadius: 2,
                border: "1px dashed #b7c2c9",
                backgroundColor: "#f9fafb",
                transition: "border-color .15s ease, background-color .15s ease",
                cursor: "pointer",
                "&:hover": { borderColor: COLOR_ACCENT, backgroundColor: "#f4f7f8" },
              }}
            >
              <Box {...getRootProps()} sx={{ p: 2.5, textAlign: "center" }}>
                <input {...getInputProps()} />

                <Typography sx={{ fontWeight: 600, fontSize: 14, color: COLOR_TEXT }}>
                  {isDragActive ? "Soltá el PDF aquí" : "Arrastrá tu PDF o hacé clic para seleccionarlo"}
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 13, color: COLOR_MUTED }}>
                  (Solo se acepta formato PDF • 1 archivo)
                </Typography>
              </Box>

              <Box sx={{ px: 2.5, pb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5, color: COLOR_MUTED }}>
                  <Typography sx={{ fontWeight: 600, fontSize: 13, color: COLOR_TEXT }}>
                    Archivos aceptados
                  </Typography>
                  <BackupIcon sx={{ fontSize: 18 }} />
                </Box>

                {acceptedFiles?.length ? (
                  <Box component="ul" sx={{ m: 0, pl: 2, fontSize: 13.5, color: COLOR_OK }}>
                    {acceptedFileItems}
                  </Box>
                ) : (
                  <Typography sx={{ fontSize: 13, color: COLOR_MUTED }}>
                    Todavía no seleccionaste ningún archivo.
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={handleClose} variant="outlined" sx={sxBtnOutlined}>
            Cancelar
          </Button>

          {cargando ? (
            <Button variant="contained" disableElevation sx={sxBtnPrimary}>
              <CircularProgress size={16} sx={{ color: "#fff" }} />
              <Box sx={{ ml: 1 }}>Guardando...</Box>
            </Button>
          ) : (
            <Button onClick={enviar} variant="contained" disableElevation sx={sxBtnPrimary}>
              Guardar
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
}
