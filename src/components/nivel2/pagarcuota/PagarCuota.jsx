import { Button, CircularProgress } from '@mui/material';
import { useCallback, useEffect, useState, Fragment } from "react";
import servicioPagos from '../../../services/pagos'
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom";
import { Toolbar } from '@mui/material';
import { Stack } from '@mui/material';
import { Divider } from '@mui/material';
import { Typography } from '@mui/material';
import { Alert } from '@mui/material';
import { Chip } from '@mui/material';
import { InputAdornment } from '@mui/material';
import servicioUsuario1 from '../../../services/usuario1'
import servicioCuotas from '../../../services/cuotas'
import * as React from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PaymentsIcon from '@mui/icons-material/Payments';


const COLOR_TEXT = '#1a303e';
const COLOR_ACCENT = '#0d3a49';

// Label fijo arriba de cada campo, consistente para todos (evita el
// desalineado entre campos con label flotante y campos sin él)
function CampoConLabel({ label, children }) {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="caption"
        sx={{ display: 'block', mb: 0.5, ml: 0.25, fontWeight: 600, color: 'text.secondary' }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export default function PagarCuota() {

  const navigate = useNavigate();
  let params = useParams()
  let id = params.id

  const [pago, setPagos] = useState({

  })

  const [eleccion, setEleccion] = useState({ tipo: '1' })
  const [cuotas, setCuotas] = useState([])
  const [pagosVarios, setpagosVarios] = useState(null)
  const [enviarr, setEnviarr] = useState();
  const [fileUpload, setFileUpload] = useState(null);
  const [loading, setLoading] = useState(false)
  const [fileError, setFileError] = useState(null)

  const onDrop = useCallback((files, fileRejections) => {
    setLoading(true)

    if (files.length === 0) {
      setFileError('Archivo no admitido. Solo se aceptan .pdf, .doc, .docx, .jpeg, .jpg y .png')
      setLoading(false)
      return
    }

    setFileError(null)
    const formData = new FormData();
    setFileUpload(files);
    formData.append('file', files[0]);
    setEnviarr(formData)
    setLoading(false)



  }, []);
  const { getRootProps, getInputProps, isDragActive, isDragAccept, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },

  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <Chip
      key={file.path}
      size="medium"
      icon={<InsertDriveFileIcon />}
      label={`${file.path} · ${(file.size / 1024).toFixed(0)} KB`}
      color="success"
      variant="outlined"
    />
  ));

  const dropzoneBorderColor = fileError
    ? '#d32f2f'
    : isDragActive
      ? COLOR_ACCENT
      : acceptedFiles.length > 0
        ? '#2e7d32'
        : '#d5dbe0';



  const designar = async (event) => {
    event.preventDefault()


    const rta = await servicioPagos.pagarnivel2(pago)
    alert(rta[1])
    navigate('/usuario2/detallecliente/' + rta[0])

  }


  useEffect(() => {

    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setPagos({
        cuil_cuit: user.cuil_cuit,
        id: params.id
      })
      traer()

    }

  }, [])
  const traer = async () => {


    const cuot = await servicioCuotas.traercuotasdisponibles(params.id)
    setCuotas(cuot)


  }

  const enviar = async () => {

    if (!enviarr) {
      alert('Debe subir un comprobante antes de enviar')
      return
    }

    setLoading(true)
    try {
      // El backend (pagonivel2) lee estos campos por separado desde req.body.
      // Se usa set() para que un reintento no duplique los campos.
      enviarr.set('cuil_cuit', pago.cuil_cuit)
      enviarr.set('id_cuota', pago.id)
      enviarr.set('pago', pago.monto)
      enviarr.set('fecha', pago.fecha)

      const rta = await servicioUsuario1.pagarnivel2(enviarr)
      console.log(rta)
      alert(rta[0])
      navigate('/usuario2/detallecliente/' + rta[1])
    } catch (error) {
      console.error(error)
      alert('No se pudo enviar el pago. Puede ser un problema de conexión con el servidor — probá de nuevo en unos segundos.')
    } finally {
      setLoading(false)
    }

    //window.location.reload(true);
  }

  const enviar2 = async () => {

    if (!enviarr) {
      alert('Debe subir un comprobante antes de enviar')
      return
    }

    setLoading(true)
    try {
      enviarr.append('datos', [pago.cuil_cuit, pago.fecha,pago.id, JSON.stringify(pagosVarios)]);///// aca en forma de array se envian datos del dormulario

      const rta = await servicioUsuario1.pagarnivel2varios(enviarr)
      console.log(rta)
      alert(rta[0])
      navigate('/usuario2/detallecliente/' + rta[1])
    } catch (error) {
      console.error(error)
      alert('No se pudo enviar el pago. Puede ser un problema de conexión con el servidor — probá de nuevo en unos segundos.')
    } finally {
      setLoading(false)
    }

    //window.location.reload(true);
  }
  const handleChange = (e) => {
    console.log(pago)
    setPagos({ ...pago, [e.target.name]: e.target.value })
  }
  const handleChangee = (e) => {
    console.log(eleccion)
    setEleccion({ ...eleccion, [e.target.name]: e.target.value })
  }

  const handleChangeVarios = (e) => {
    console.log(pagosVarios)
    setpagosVarios({ ...pagosVarios, [e.target.name]: e.target.value })
  }

  const puedeEnviarUna = eleccion.tipo === '1' && pago.monto > 0 && pago.fecha
  const puedeEnviarVarias = eleccion.tipo === 'varias' && pago.fecha

  return (

    <Fragment>
      <Toolbar />
      <Box sx={{ px: 2, pt: { xs: 2, sm: 3 }, pb: 6 }}>
        <Paper
          elevation={0}
          sx={{
            maxWidth: 680,
            mx: 'auto',
            borderRadius: 2.5,
            border: '1px solid #e2e6e9',
            boxShadow: '0 24px 50px rgba(15, 34, 48, 0.18)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ height: 4, background: `linear-gradient(90deg, ${COLOR_TEXT}, ${COLOR_ACCENT})` }} />
          <Box sx={{ p: { xs: 3, sm: 5 } }}>

            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 0.5 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(13,58,73,0.08)',
                  flexShrink: 0,
                }}
              >
                <PaymentsIcon sx={{ fontSize: 22, color: COLOR_ACCENT }} />
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                Pagar cuota
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Completá los datos del pago y adjuntá el comprobante
            </Typography>

            <form>
              <Stack spacing={3}>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5}>
                  <CampoConLabel label="Cantidad de cuotas">
                    <TextField
                      select
                      size="medium"
                      fullWidth
                      name="tipo"
                      value={eleccion.tipo}
                      onChange={handleChangee}
                    >
                      <MenuItem value="1">Una cuota</MenuItem>
                      <MenuItem value="varias">Varias cuotas</MenuItem>
                    </TextField>
                  </CampoConLabel>

                  <CampoConLabel label="Fecha de pago">
                    <TextField
                      size="medium"
                      fullWidth
                      onChange={handleChange}
                      name="fecha"
                      id="date"
                      type="date"
                    />
                  </CampoConLabel>

                  {eleccion.tipo === '1' && (
                    <CampoConLabel label="Monto">
                      <TextField
                        size="medium"
                        fullWidth
                        id="name"
                        name="monto"
                        onChange={handleChange}
                        type="number"
                        helperText={
                          pago.monto
                            ? new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(pago.monto)
                            : 'Usá punto solo para decimales, sin separador de miles'
                        }
                        slotProps={{
                          input: {
                            startAdornment: <InputAdornment position="start">$</InputAdornment>,
                          },
                        }}
                        sx={{
                          '& input[type=number]': { MozAppearance: 'textfield' },
                          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                            WebkitAppearance: 'none',
                            margin: 0,
                          },
                        }}
                      />
                    </CampoConLabel>
                  )}
                </Stack>

                {eleccion.tipo === 'varias' && cuotas && cuotas.length > 0 && (
                  <Stack spacing={1.5}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLOR_TEXT }}>
                      Cuotas a pagar
                    </Typography>
                    {cuotas.map((option) => (
                      <CampoConLabel key={option.id} label={"Cuota " + option.nro_cuota}>
                        <TextField
                          size="medium"
                          fullWidth
                          id="name"
                          name={option.id}
                          onChange={handleChangeVarios}
                          type="number"
                          sx={{
                            '& input[type=number]': { MozAppearance: 'textfield' },
                            '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                              WebkitAppearance: 'none',
                              margin: 0,
                            },
                          }}
                        />
                      </CampoConLabel>
                    ))}
                  </Stack>
                )}

                <Divider sx={{ my: 0.5 }} />

                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: COLOR_TEXT, mb: 1 }}>
                    Comprobante de pago
                  </Typography>

                  <Box
                    {...getRootProps()}
                    sx={{
                      cursor: 'pointer',
                      textAlign: 'center',
                      borderRadius: 1.5,
                      border: '1px dashed',
                      borderColor: dropzoneBorderColor,
                      backgroundColor: isDragActive ? 'rgba(13,58,73,0.04)' : '#fafbfc',
                      py: 4,
                      px: 2,
                      transition: 'border-color .15s ease',
                      '&:hover': { borderColor: COLOR_ACCENT },
                    }}
                  >
                    <input {...getInputProps()} />
                    <CloudUploadIcon fontSize="small" sx={{ color: '#9aa7b0', mb: 0.5 }} />
                    <Typography variant="body2" sx={{ color: COLOR_TEXT }}>
                      {isDragActive
                        ? 'Soltá aquí el documento'
                        : 'Arrastrá el comprobante o hacé clic para seleccionarlo'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      PDF, DOC, DOCX, JPG o PNG
                    </Typography>
                  </Box>

                  {fileError && (
                    <Alert severity="error" sx={{ mt: 1.5, borderRadius: 1.5 }}>
                      {fileError}
                    </Alert>
                  )}

                  {acceptedFiles.length > 0 && (
                    <Box sx={{ mt: 1.5 }}>
                      {acceptedFileItems}
                    </Box>
                  )}
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
                  <Button
                    variant="contained"
                    onClick={puedeEnviarUna ? enviar : enviar2}
                    disabled={loading || !enviarr || !(puedeEnviarUna || puedeEnviarVarias)}
                    sx={{
                      textTransform: 'none',
                      fontWeight: 600,
                      borderRadius: 1.5,
                      px: 3,
                      backgroundColor: COLOR_TEXT,
                      boxShadow: 'none',
                      '&:hover': { backgroundColor: COLOR_ACCENT, boxShadow: 'none' },
                      '&.Mui-disabled': { backgroundColor: '#e2e6e9', color: '#9aa7b0' },
                    }}
                  >
                    {loading ? <CircularProgress color="inherit" size={20} /> : 'Guardar'}
                  </Button>
                </Box>

              </Stack>
            </form>

          </Box>
        </Paper>
      </Box>
    </Fragment>

  );
}
