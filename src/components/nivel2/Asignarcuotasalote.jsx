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
        variant="outlined"
        sx={{
          px: 2.25,
          borderRadius: 1.5,
          textTransform: 'none',
          fontWeight: 600,
          color: '#1a303e',
          borderColor: '#c9d2d8',
          '&:hover': { borderColor: '#0d3a49', backgroundColor: 'rgba(13, 58, 73, 0.04)' },
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
        slotProps={{
          paper: { sx: { borderRadius: fullScreen ? 0 : 3, overflow: 'hidden' } },
          backdrop: { sx: { backgroundColor: 'rgba(15, 34, 48, 0.45)' } },
        }}
      >
        <DialogTitle
          id="responsive-dialog-title"
          sx={{
            px: 3,
            py: 2,
            fontWeight: 700,
            color: '#1a303e',
            borderBottom: '1px solid #e2e6e9',
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
                  fontWeight: 700,
                  color: '#1a303e',
                  mb: 1,
                  '&.Mui-focused': { color: '#1a303e' },
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
                            color: '#9aa7b0',
                            '&.Mui-checked': { color: '#1a303e' },
                          }}
                        />
                      }
                      sx={{
                        width: '100%',
                        mx: 0,
                        mb: 1.2,
                        px: 1.6,
                        py: 1.2,
                        borderRadius: 1.5,
                        border: '1px solid #e2e6e9',
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#f6f8f9',
                        },
                        // opción marcada
                        ...(String(selectedLote) === String(item.id) && {
                          backgroundColor: 'rgba(13,58,73,0.05)',
                          borderColor: '#1a303e',
                        }),
                      }}
                      label={
                        <span style={{ fontWeight: 600, color: '#1a303e' }}>
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
            borderTop: '1px solid #e2e6e9',
            gap: 1,
          }}
        >
          <Button
            autoFocus
            onClick={handleClose}
            variant="outlined"
            sx={{
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              px: 2.25,
              borderColor: '#c9d2d8',
              color: '#1a303e',
              '&:hover': {
                borderColor: '#0d3a49',
                backgroundColor: 'rgba(13, 58, 73, 0.04)',
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
              borderRadius: 1.5,
              textTransform: 'none',
              fontWeight: 600,
              px: 2.25,
              backgroundColor: '#1a303e',
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#0d3a49', boxShadow: 'none' },
              '&.Mui-disabled': {
                backgroundColor: '#e2e6e9',
                color: '#9aa7b0',
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
