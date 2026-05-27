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
    mb: 2,
    px: 2.2,
    py: 1.1,
    borderRadius: 2,
    textTransform: 'none',
    fontWeight: 900,
    backgroundColor: '#01567c',
    boxShadow: '0 10px 25px rgba(1,86,124,0.25)',
    '&:hover': { backgroundColor: '#014a6b' }
  };

  const sxDialogPaper = {
    borderRadius: 3,
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(10,59,79,0.22)',
    
  };

  const sxDialogHeader = {
    px: 2.4,
    py: 1.8,
    color: '#fff',
    background: 'linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)',
  };

  const sxDropzone = {
    cursor: 'pointer',
    borderRadius: 2,
    p: 2,
    background: isDragActive ? 'rgba(20,141,141,0.10)' : '#fbfdff',
    border: isDragActive ? '2px dashed #148D8D' : '1px dashed rgba(1,86,124,0.25)',
    transition: '0.18s ease',
    '&:hover': {
      borderColor: 'rgba(1,86,124,0.45)',
      background: 'rgba(1,86,124,0.04)'
    }
  };

  const sxChip = {
    fontWeight: 800,
    borderRadius: 2,
    backgroundColor: 'rgba(1,86,124,0.08)',
    border: '1px solid rgba(1,86,124,0.14)',
  };

  return (
    <div>
      <Button
        variant="contained"
        sx={sxPrimaryBtn}
        onClick={handleClickOpen}
      >
        Determinar ingresos
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: sxDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        {/* Header moderno */}
        <Box sx={sxDialogHeader}>
          <Typography sx={{ fontWeight: 900, letterSpacing: 0.2, fontSize: 16 }}>
            Ingresos
          </Typography>
          <Typography sx={{ opacity: 0.92, mt: 0.4, fontSize: 13, fontWeight: 700 }}>
            Cargar documentación válida para los ingresos
          </Typography>

          <Box sx={{ mt: 1 }}>
            <Chip
              label={`CUIT/CUIL: ${cuil_cuit}`}
              size="small"
              sx={{
                ...sxChip,
                color: '#fff',
                backgroundColor: 'rgba(255,255,255,0.14)',
                border: '1px solid rgba(255,255,255,0.22)',
              }}
            />
          </Box>
        </Box>

        <DialogContent sx={{ p: 2.4 }}>
          <Box sx={{ mb: 1.2 }}>
            <Typography sx={{ fontWeight: 900, color: '#0a3b4f' }}>
              Documentación
            </Typography>
            <Typography sx={{ fontSize: 13, color: 'rgba(10,59,79,0.75)', mt: 0.4 }}>
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
                  borderRadius: 2,
                  display: 'grid',
                  placeItems: 'center',
                  backgroundColor: 'rgba(20,141,141,0.12)',
                  border: '1px solid rgba(20,141,141,0.22)',
                }}
              >
                <BackupIcon fontSize="small" />
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontWeight: 900, color: '#0a3b4f', fontSize: 14 }}>
                  {isDragActive ? 'Suelta aquí el documento' : 'Arrastrá el archivo o tocá para subir'}
                </Typography>
                <Typography sx={{ fontSize: 12.5, color: 'rgba(10,59,79,0.70)', mt: 0.2 }}>
                  Extensiones aceptadas: pdf, doc, docx, jpg, png (pero se valida PDF).
                </Typography>
              </Box>
            </Box>

            {acceptedFiles?.length > 0 && (
              <>
                <Divider sx={{ my: 1.4, borderColor: 'rgba(1,86,124,0.10)' }} />
                <Typography sx={{ fontWeight: 900, color: '#0f7a7a', fontSize: 13, mb: 0.8 }}>
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
                borderRadius: 2,
                backgroundColor: '#fbfdff'
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(1,86,124,0.20)'
              },
              '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(1,86,124,0.40)'
              },
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#01567c',
                boxShadow: '0 0 0 3px rgba(1,86,124,0.12)',
              },
              '& .MuiInputLabel-root': {
                fontWeight: 800,
                color: '#2b3a42'
              }
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            px: 2.4,
            py: 1.6,
            borderTop: '1px solid rgba(1,86,124,0.10)',
            backgroundColor: '#ffffff',
          }}
        >
          <Button
            onClick={handleClose}
            sx={{
              textTransform: 'none',
              fontWeight: 900,
              borderRadius: 2,
              px: 2,
              color: '#ffffffff',
              backgroundColor: '#01567c',
          boxShadow: '0 10px 25px rgba(1,86,124,0.25)',
          '&:hover': { backgroundColor: '#014a6b' }
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
              fontWeight: 900,
              borderRadius: 2,
              px: 2.2,
              backgroundColor: '#148D8D',
              boxShadow: '0 10px 25px rgba(20,141,141,0.25)',
              '&:hover': { backgroundColor: '#0f7a7a' }
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
