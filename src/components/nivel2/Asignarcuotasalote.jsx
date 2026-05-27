import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import servicioCuotas from '../../services/cuotas';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

export default function Borrarcuotas(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedLote, setSelectedLote] = React.useState('');
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRadioChange = (event) => {
    setSelectedLote(event.target.value);
    console.log("Lote seleccionado:", event.target.value);
  };

  const asignar = async () => {
    if (!selectedLote) return;
    console.log(selectedLote);
    const datos = { id: selectedLote, id_origen: props.id_origen };
    const cuotas = await servicioCuotas.asignarloteacuotas(datos);
    console.log(cuotas);
    handleClose();
  };

  return (
    <div>
      {/* Botón principal (tu estilo) */}
      <Button
        variant="contained"
        sx={{
          mb: 2,
          px: 2.2,
          py: 1.1,
          borderRadius: 2,
          textTransform: 'none',
          fontWeight: 800,
          backgroundColor: '#01567c',
          boxShadow: '0 10px 25px rgba(1,86,124,0.25)',
          '&:hover': { backgroundColor: '#014a6b' },
        }}
        onClick={handleClickOpen}
      >
        Añadir a cuadro de cuotas
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="Estas seguro"
        PaperProps={{
          sx: {
            borderRadius: fullScreen ? 0 : 3,
            overflow: 'hidden',
            border: '1px solid #e8eef5',
            boxShadow: '0 18px 45px rgba(10,59,79,0.18)',
          },
        }}
      >
        {/* Header con tu paleta */}
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            px: 3,
            py: 2,
            fontWeight: 950,
            color: '#fff',
            background: 'linear-gradient(135deg, #071f2b 0%, #0b2a3a 35%, #01567c 70%, #148D8D 100%)',
          }}
        >
          {"¿Estás seguro?"}
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5, backgroundColor: '#ffffff' }}>
          <DialogContentText sx={{ m: 0 }}>
            <FormControl
              component="fieldset"
              sx={{
                width: '100%',
                mt: 1,
              }}
            >
              <FormLabel
                component="legend"
                sx={{
                  fontWeight: 900,
                  color: '#0a3b4f',
                  mb: 1,
                  '&.Mui-focused': { color: '#0a3b4f' },
                }}
              >
                Seleccioná un lote
              </FormLabel>

              <RadioGroup value={selectedLote} onChange={handleRadioChange}>
                {props.lotes
                  ?.filter((item) => item.tiene_cuotas === 'Si')
                  .map((item) => (
                    <FormControlLabel
                      key={item.id_lote}
                      value={item.id}
                      control={
                        <Radio
                          sx={{
                            color: '#01567c',
                            '&.Mui-checked': { color: '#148D8D' },
                          }}
                        />
                      }
                      sx={{
                        width: '100%',
                        mb: 1.2,
                        px: 1.6,
                        py: 1.2,
                        borderRadius: 2,
                        border: '1px solid #e8eef5',
                        backgroundColor: '#f7fbfd',
                        '&:hover': {
                          backgroundColor: '#e6f4f8',
                          borderColor: '#cfe3ef',
                        },
                        // “tarjetita” marcada
                        ...(String(selectedLote) === String(item.id) && {
                          backgroundColor: 'rgba(20,141,141,0.08)',
                          borderColor: 'rgba(20,141,141,0.28)',
                        }),
                      }}
                      label={
                        <span style={{ fontWeight: 750, color: '#0a3b4f' }}>
                          {`Zona: ${item.zona}, Manzana: ${item.manzana}${item.zona === 'PIT' ? `, Parcela: ${item.parcela}` : ''
                            } - Tiene cuotas`}
                        </span>
                      }
                    />
                  ))}
              </RadioGroup>

              {!props.lotes?.some((x) => x.tiene_cuotas === 'Si') && (
                <div
                  style={{
                    marginTop: 10,
                    padding: '12px 14px',
                    borderRadius: 12,
                    background: 'rgba(211,47,47,0.06)',
                    border: '1px solid rgba(211,47,47,0.18)',
                    color: '#7a1c1c',
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  No hay lotes con cuotas disponibles para asignar.
                </div>
              )}
            </FormControl>
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            backgroundColor: '#ffffff',
            borderTop: '1px solid #e8eef5',
            gap: 1,
          }}
        >
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 800,
              borderColor: '#cfe3ef',
              color: '#0a3b4f',
              '&:hover': {
                borderColor: '#b9d6e8',
                backgroundColor: '#f5fbff',
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={asignar}
            autoFocus
            disabled={!selectedLote}
            variant="contained"
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 900,
              px: 2.2,
              backgroundColor: '#01567c',
              boxShadow: '0 10px 25px rgba(1,86,124,0.20)',
              '&:hover': { backgroundColor: '#014a6b' },
              '&.Mui-disabled': {
                backgroundColor: '#d7e6f0',
                color: '#6c8796',
                boxShadow: 'none',
              },
            }}
          >
            Asignar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
