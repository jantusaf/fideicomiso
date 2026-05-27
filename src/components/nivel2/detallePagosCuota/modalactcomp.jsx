import * as React from 'react';
import { Paper, Button, TextField, Dialog, DialogActions, DialogContent, NativeSelect, DialogTitle, Box, CircularProgress } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from "react-router-dom";

import BackupIcon from "@mui/icons-material/Backup";
import servicioLegajo from '../../../services/legajos'
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { alpha } from "@mui/material/styles";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DescriptionRoundedIcon from "@mui/icons-material/DescriptionRounded";
import CloudDownloadRoundedIcon from "@mui/icons-material/CloudDownloadRounded";


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
id:props.id
  });

  const selecthandler = e => {
    setFile(e.target.files[0]);
    console.log(file);
  };

  const onDrop = useCallback((acceptedFiles) => {
      const formData = new FormData();
      setFileUpload(acceptedFiles);
      formData.append('file', acceptedFiles[0]);
      setEnviarr(formData);

  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'application/pdf'
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const enviar = async () => {
    setCargando(true);
    if (enviarr) {
      enviarr.append('id', legform.id);

      
      try {
        const response = await servicioLegajo.actualizarpago(enviarr) 
        
        props.getData();
      } catch (error) {
        console.error('Error subiendo archivo:', error);
      }
    } else {
      alert('No hay archivo para subir');
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
        startIcon={<UploadFileRoundedIcon style={{ color: "#fff" }} />}
        size="small"
        variant="contained"
        disableElevation
        sx={{
          textTransform: "none",
          fontWeight: 900,
          borderRadius: 999,
          px: 1.8,
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
        Actualizar comprobante
      </Button>
    </Tooltip>

    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
         
          background: "rgba(255,255,255,0.94)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 60px rgba(15, 127, 134, 0.18)",
        },
      }}
    >
      {/* HEADER (GRADIENT) */}
      <DialogTitle
        sx={{
          px: 3,
          py: 2.25,
          color: "#fff",
          fontWeight: 900,
          background:
            "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
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
            <DescriptionRoundedIcon sx={{ color: "#fff" }} />
          </Box>

          <Box sx={{ lineHeight: 1.1 }}>
            <Typography sx={{ fontWeight: 900, fontSize: { xs: 17, md: 19 } }}>
              Actualizar comprobante
            </Typography>
            <Typography sx={{ mt: 0.35, fontWeight: 650, opacity: 0.9, fontSize: 13 }}>
              Subí el PDF actualizado para reemplazar el comprobante.
            </Typography>
          </Box>
        </Box>

        <Chip
          label={`ID: ${legform?.id ?? props.id}`}
          sx={{
            color: "#fff",
            fontWeight: 900,
            borderRadius: 999,
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.35)",
          }}
        />
      </DialogTitle>

      <DialogContent
        sx={{
          p: 0,
          background:
            "linear-gradient(180deg, rgba(10,59,79,0.04) 0%, rgba(20,141,141,0.04) 55%, rgba(255,255,255,0.92) 100%)",
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* BOTÓN MODELO */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1.5 }}>
            <Button
              size="small"
              startIcon={<CloudDownloadRoundedIcon />}
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: 900,
                borderRadius: 999,
                px: 2,
                borderColor: alpha("#01567c", 0.35),
                color: "#01567c",
                "&:hover": {
                  borderColor: alpha("#148D8D", 0.7),
                  backgroundColor: alpha("#148D8D", 0.06),
                },
              }}
            >
              Descargar modelo
            </Button>
          </Box>

          {/* DROPZONE “CARD” */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              border: `2px dashed ${alpha("#01567c", 0.35)}`,
              background:
                "linear-gradient(180deg, rgba(1,86,124,0.06) 0%, rgba(20,141,141,0.05) 55%, rgba(255,255,255,0.85) 100%)",
              boxShadow: "0 14px 34px rgba(15,127,134,0.10)",
              transition: "0.2s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-1px)",
                borderColor: alpha("#148D8D", 0.7),
                boxShadow: "0 18px 44px rgba(15,127,134,0.16)",
              },
            }}
          >
            <Box
              {...getRootProps()}
              sx={{
                p: 2.2,
                textAlign: "center",
              }}
            >
              <input {...getInputProps()} />

              <Typography sx={{ fontWeight: 900, color: "#01567c" }}>
                {isDragActive ? "Soltá el PDF aquí" : "Arrastrá tu PDF o hacé clic para seleccionarlo"}
              </Typography>

              <Typography sx={{ mt: 0.6, fontWeight: 700, color: alpha("#0b2b3a", 0.78) }}>
                (Solo se acepta formato PDF • 1 archivo)
              </Typography>
            </Box>

            {/* LISTA ACEPTADOS */}
            <Box
              sx={{
                px: 2.2,
                pb: 2,
                pt: 0,
                color: alpha("#0b2b3a", 0.78),
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.75 }}>
                <Typography sx={{ fontWeight: 900, color: "#148D8D" }}>
                  Archivos aceptados
                </Typography>
                <BackupIcon fontSize="small" />
              </Box>

              {acceptedFiles?.length ? (
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 2,
                    fontWeight: 700,
                    color: alpha("#0b2b3a", 0.8),
                  }}
                >
                  {acceptedFileItems}
                </Box>
              ) : (
                <Typography sx={{ fontWeight: 700, color: alpha("#0b2b3a", 0.62) }}>
                  Todavía no seleccionaste ningún archivo.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.25, pt: 1 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: "none",
            fontWeight: 900,
            borderRadius: 999,
            px: 2.2,
            borderColor: alpha("#01567c", 0.35),
            color: "#01567c",
            "&:hover": {
              borderColor: alpha("#148D8D", 0.7),
              backgroundColor: alpha("#148D8D", 0.06),
            },
          }}
        >
          Cancelar
        </Button>

        {cargando ? (
          <Button
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 999,
              px: 2.6,
              color: "#fff",
              background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
              boxShadow: "0 10px 22px rgba(20,141,141,0.18)",
            }}
          >
            <CircularProgress size={18} sx={{ color: "#fff" }} />
            <Box sx={{ ml: 1 }}>Guardando...</Box>
          </Button>
        ) : (
          <Button
            onClick={enviar}
            variant="contained"
            disableElevation
            sx={{
              textTransform: "none",
              fontWeight: 900,
              borderRadius: 999,
              px: 2.6,
              color: "#fff",
              background: "linear-gradient(90deg, #01567c 0%, #148D8D 100%)",
              boxShadow: "0 10px 22px rgba(20,141,141,0.22)",
              "&:hover": {
                transform: "translateY(-1px)",
                boxShadow: "0 14px 30px rgba(20,141,141,0.30)",
              },
              transition: "0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            Guardar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  </Box>
);

}
