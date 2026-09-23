import * as React from 'react';
import { Paper, Button, CircularProgress, Chip, Divider } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useCallback, useState } from "react";
import servicioLegajo from '../../../services/legajos'
import BackupIcon from "@mui/icons-material/Backup";
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useParams } from "react-router-dom"

export default function FormDialog(props) {
  let params = useParams()
  let cuil_cuit = params.cuil_cuit
  const [open, setOpen] = React.useState(false);
  const [file, setFile] = useState();
  const [enviarr, setEnviarr] = useState()
  const [completado, setCompletado] = useState(false);
  const [fileUpload, setFileUpload] = useState(null);
  const [legform, setLegform] = useState({
    cuil_cuit: cuil_cuit
  })
  const [cargando, setCargando] = useState(false);

  const selecthandler = e => {
    setFile(e.target.files[0])
    console.log(file)
  }

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0 && acceptedFiles[0].type === 'application/pdf') {
      const formData = new FormData();
      setFileUpload(acceptedFiles);
      formData.append('file', acceptedFiles[0]);
      setEnviarr(formData);
    } else {
      alert('Solo se aceptan archivos PDF');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: 'image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf',
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const enviar = async () => {
    setCargando(true);

    if (enviarr) {
      enviarr.append('cuil_cuit', legform.cuil_cuit);
      enviarr.append('descripcion', legform.descripcion);

      try {
        const response = await servicioLegajo.determinarIngreso(enviarr)
        alert(response.data);
        console.log("getData");
        props.getData();
      } catch (error) {
        console.error('Error subiendo archivo:', error);
      }
    } else {
      alert('No hay archivo para subir');
    }

    setCargando(false);
    setOpen(false);
    props.traer()
  }

  const handleChange = (e) => {
    setLegform({ ...legform, [e.target.name]: e.target.value })
    setCompletado(true)
    console.log(legform)
  }

  const handleClickOpen = () => {
    setOpen(true);
    setCompletado(false)
  };

  const handleClose = () => {
    setOpen(false);
  };

  // ====== estilos (solo frontend) ======
  const sxPrimaryBtn = {
    textTransform: 'none',
    fontWeight: 600,
    borderRadius: 1.5,
    px: 2.25,
    color: '#1a303e',
    borderColor: '#c9d2d8',
    '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' }
  };

  const sxDialogPaper = {
    borderRadius: 3,
    overflow: 'hidden',
  };

  const sxDialogHeader = {
    px: 3,
    py: 2,
    color: '#1a303e',
    borderBottom: '1px solid #e2e6e9',
  };

  const sxDropzone = {
    cursor: 'pointer',
    borderRadius: 2,
    p: 2,
    background: isDragActive ? 'rgba(13,58,73,0.04)' : '#fafbfc',
    border: '1px dashed',
    borderColor: isDragActive ? '#0d3a49' : '#d5dbe0',
    transition: 'border-color .15s ease',
    '&:hover': {
      borderColor: '#0d3a49',
    }
  };

  const sxChip = {
    fontWeight: 600,
    borderRadius: 2,
    backgroundColor: 'rgba(13,58,73,0.06)',
    border: '1px solid #e2e6e9',
  };

  return (
    <div>
      <Button
        variant="outlined"
        sx={sxPrimaryBtn}
        onClick={handleClickOpen}
      >
        Determinar ingresos
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: { sx: sxDialogPaper },
          backdrop: { sx: { backgroundColor: 'rgba(15, 34, 48, 0.45)' } },
        }}
        maxWidth="sm"
        fullWidth
      >
        {/* Encabezado */}
        <Box sx={sxDialogHeader}>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            Ingresos
          </Typography>
          <Typography sx={{ color: '#6b7a86', mt: 0.4, fontSize: 13 }}>
            Cargar documentación válida para los ingresos
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Chip
              label={`CUIT/CUIL: ${cuil_cuit}`}
              size="small"
              sx={sxChip}
            />
          </Box>
        </Box>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 1.5 }}>
            <Typography sx={{ fontWeight: 700, color: '#1a303e' }}>
              Documentación
            </Typography>
            <Typography sx={{ fontSize: 13, color: '#6b7a86', mt: 0.4 }}>
              Solo PDF. Arrastrá y soltá el archivo o hacé click para seleccionar.
            </Typography>
          </Box>

          <Paper elevation={0} sx={sxDropzone} {...getRootProps()}>
            <input {...getInputProps()} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'rgba(13,58,73,0.08)',
                }}
              >
                <BackupIcon fontSize="small" sx={{ color: '#0d3a49' }} />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 600, color: '#1a303e', fontSize: 14 }}>
                  {isDragActive ? 'Suelta aquí el documento' : 'Arrastrá el archivo o tocá para subir'}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: '#6b7a86', mt: 0.2 }}>
                  Extensiones aceptadas: pdf, doc, docx, jpg, png (pero se valida PDF).
                </Typography>
              </Box>
            </Box>

            {acceptedFiles?.length > 0 && (
              <>
                <Divider sx={{ my: 1.4, borderColor: '#e2e6e9' }} />
                <Typography sx={{ fontWeight: 700, color: '#2e7d32', fontSize: 13, mb: 0.8 }}>
                  Archivo seleccionado
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {acceptedFiles.map((f) => (
                    <Chip
                      key={f.path}
                      label={`${f.path} (${Math.round(f.size / 1024)} KB)`}
                      size="small"
                      sx={sxChip}
                    />
                  ))}
                </Box>

                {/* Mantengo tu lista también (por si la usás) */}
                <Box sx={{ mt: 1, color: 'rgba(10,59,79,0.70)', fontSize: 12.5 }}>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {acceptedFileItems}
                  </ul>
                </Box>
              </>
            )}
          </Paper>

          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Descripcion"
            name="descripcion"
            onChange={handleChange}
            fullWidth
            variant="outlined"
            sx={{
              mt: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 1.5,
              },
              '& .MuiInputLabel-root': {
                fontWeight: 600,
              }
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid #e2e6e9',
            backgroundColor: '#ffffff',
          }}
        >
          <Button
            onClick={handleClose}
            variant="outlined"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2.25,
              color: '#1a303e',
              borderColor: '#c9d2d8',
              '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' }
            }}
            disabled={cargando}
          >
            Cancelar
          </Button>

          <Button
            onClick={enviar}
            variant="contained"
            disabled={cargando}
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: 1.5,
              px: 2.25,
              boxShadow: 'none',
              backgroundColor: '#1a303e',
              '&:hover': { backgroundColor: '#0d3a49', boxShadow: 'none' }
            }}
          >
            {cargando ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CircularProgress size={18} />
                Enviando...
              </Box>
            ) : (
              'Enviar'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
