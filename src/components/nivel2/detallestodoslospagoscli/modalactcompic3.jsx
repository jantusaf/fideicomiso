import * as React from 'react';
import { Paper, Button, TextField, Dialog, DialogActions, DialogContent, NativeSelect, DialogTitle, Box, CircularProgress } from '@mui/material';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useParams } from "react-router-dom";

import BackupIcon from '@mui/icons-material/Backup';
import servicioLegajo from '../../../services/legajos'
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
        const response = await servicioLegajo.actualizarpagoic3(enviarr) 
        alert(response);
        setFile()
    
      } catch (error) {
        console.error('Error subiendo archivo:', error);
      }
    } else {
      alert('No hay archivo para subir');
    }
    setCargando(false);
    setOpen(false);
    props.traer();
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
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
    Actualizar comprobante
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Completar</DialogTitle>
        <DialogContent>
        

        
            <div>
              <Box sx={{ m: 1 }}>
                <Button size="small" variant="contained">
                  Descargar modelo
                </Button>
              </Box>
              <Paper
                sx={{
                  cursor: 'pointer',
                  background: '#fafafa',
                  color: '#bdbdbd',
                  border: '1px dashed #ccc',
                  '&:hover': { border: '1px solid #ccc' },
                }}
              >
                <div style={{ padding: '16px' }} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p style={{ color: 'green' }}>Suelta aquí el documento</p>
                  ) : (
                    <p>Arrastra hasta aquí el archivo descargado con tus datos personales</p>
                  )}
                  <em>(Solo se aceptan documentos en formato PDF)</em>
                </div>
                <Box sx={{ m: 1, color: 'green', fontSize: '1rem' }}>
                  Archivos Aceptados <BackupIcon fontSize="small" />
                  <ul>{acceptedFileItems}</ul>
                </Box>
              </Paper>

          
            </div>
   
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          {cargando ? (
            <Box sx={{ display: 'flex' }}>
              <Button><CircularProgress /></Button>
            </Box>
          ) : (
            <Button onClick={enviar}>Guardar</Button>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
