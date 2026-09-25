import { Paper, Button, Typography } from '@mui/material';
import { useDropzone } from 'react-dropzone'
import Box from '@mui/material/Box';
import {useCallback, useState} from 'react';
import axios from 'axios';
import BackupIcon from '@mui/icons-material/Backup';
import servicioLegajos from '../../../services/legajos'
import { COLOR_TEXT, COLOR_MUTED, COLOR_OK, sxCard, sxBtnPrimary } from '../detalleclienteIngresos/estilos'


const SubirLegajo = (props) => {
  
    const [fileUpload, setFileUpload] = useState(null);

    const onDrop = useCallback((files, acceptedFiles) => {
        const formData = new FormData();
        setFileUpload(acceptedFiles);
        formData.append('file', files[0]);
        formData.append('datos', [props.cuil_cuit,'Dni']);
        servicioLegajos.subirlegajode(formData)
          
   
        });
    
    
    const { getRootProps, getInputProps, isDragActive, isDragAccept, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: "image/*,application/pdf,.doc,.docx,.xls,.xlsx,.csv,.tsv,.ppt,.pptx,.pages,.odt,.rtf",
    
      });
      const acceptedFileItems = acceptedFiles.map(file => (
        <li key={file.path}>
          {file.path} - {file.size} bytes
        </li>
      ));  
  
    return (
        <Box sx={{ maxWidth: 720, mx: "auto", pt: { xs: 1, md: 2 }, pb: 6 }}>
          <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
            <Typography sx={{ fontWeight: 700, fontSize: 17, color: COLOR_TEXT }}>Subir legajo</Typography>
            <Typography sx={{ fontSize: 13, color: COLOR_MUTED, mt: 0.25, mb: 2.5 }}>
              Descargá el modelo, completalo y subilo acá.
            </Typography>

            <Button size="small" variant="contained" sx={sxBtnPrimary}>
              Descargar modelo
            </Button>

            <Box
              sx={{
                mt: 2.5,
                cursor: 'pointer',
                background: '#f9fafb',
                border: '1px dashed #b7c2c9',
                borderRadius: 2,
                textAlign: 'center',
                transition: 'border-color .15s ease, background-color .15s ease',
                '&:hover': { borderColor: '#0d3a49', background: '#f4f7f8' },
              }}
            >
              <div style={{ padding: '28px 16px' }} {...getRootProps()}>
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p style={{ color: COLOR_OK, margin: 0, fontWeight: 600 }}>Suelta aqui el documento</p>
                ) : (
                  <p style={{ color: COLOR_TEXT, margin: 0, fontWeight: 600 }}>
                    Arrastra hasta aqui el archivo descargado con tus datos personales
                  </p>
                )}
                <em style={{ display: 'block', marginTop: 8, fontSize: 12.5, color: COLOR_MUTED }}>
                  (Documentos .*pdf, .*doc, *.jpeg, *.png, *.jpg extenciones aceptadas)
                </em>
              </div>
            </Box>

            <Box sx={{ mt: 2, color: COLOR_OK, fontSize: 14, display: 'flex', alignItems: 'center', gap: 0.75 }}>
              Archivos aceptados <BackupIcon fontSize="small" />
            </Box>
            <ul style={{ margin: '6px 0 0', color: COLOR_OK, fontSize: 13.5 }}>{acceptedFileItems}</ul>
          </Paper>
        </Box>
    );
  };


  export default SubirLegajo;
