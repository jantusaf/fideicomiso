import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import servicioCuotas from '../../../services/cuotas';
import { parsearCuadroExcel } from './parsearExcel';
import { sxBtnOutlined, sxBtnPrimary } from '../detalleclienteIngresos/estilos';

const moneda = (v) =>
  Number(v || 0).toLocaleString('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 2 });

const fechaCorta = (iso) => (iso ? iso.split('-').reverse().join('/') : '');

// Importa los pagos de un cuadro de cuotas desde un Excel. Primero muestra una
// vista previa (no guarda nada); recién al confirmar se guardan los pagos.
export default function ImportarPagosExcel({ id_lote, cuotas, descripcion, onListo }) {
  const [open, setOpen] = React.useState(false);
  const [cargando, setCargando] = React.useState(false);
  const [archivo, setArchivo] = React.useState(null); // { nombre, filas }
  const [vista, setVista] = React.useState(null); // respuesta del backend
  const [error, setError] = React.useState('');
  const [repartir, setRepartir] = React.useState(true);
  const [forzar, setForzar] = React.useState(false);
  const [resultado, setResultado] = React.useState(null); // importación hecha
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  const hayCuotas = Array.isArray(cuotas) && cuotas.some((c) => c && typeof c === 'object' && c.id);
  if (!hayCuotas) return null;

  const reiniciar = () => {
    setArchivo(null);
    setVista(null);
    setError('');
    setForzar(false);
    setResultado(null);
  };

  const cerrar = async () => {
    if (cargando) return;
    const hubo = !!resultado;
    setOpen(false);
    reiniciar();
    if (hubo && onListo) await onListo();
  };

  const pedirVista = async (filas, repartirExcedente) => {
    setCargando(true);
    setError('');
    try {
      const rta = await servicioCuotas.importarPagosVista({
        id_lote,
        filas,
        opciones: { distribuirExcedente: repartirExcedente },
      });
      if (rta && rta.ok) {
        setVista(rta);
      } else {
        setVista(null);
        setError((rta && rta.mensaje) || 'No se pudo armar la vista previa.');
      }
    } catch (e) {
      console.error(e);
      setVista(null);
      setError('No se pudo armar la vista previa. Verificá la conexión con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  const elegirArchivo = async (event) => {
    const file = event.target.files && event.target.files[0];
    event.target.value = '';
    if (!file) return;

    reiniciar();
    setCargando(true);
    try {
      const leido = parsearCuadroExcel(await file.arrayBuffer());
      if (leido.filas.length === 0) {
        setError('El Excel no tiene cobranzas cargadas (la columna "Cobranza" está vacía).');
        setCargando(false);
        return;
      }
      setArchivo({ nombre: file.name, filas: leido.filas, total: leido.totalCobranza });
      await pedirVista(leido.filas, repartir);
    } catch (e) {
      setError(e.message || 'No se pudo leer el archivo.');
      setCargando(false);
    }
  };

  const cambiarReparto = async (valor) => {
    setRepartir(valor);
    if (archivo) await pedirVista(archivo.filas, valor);
  };

  const confirmar = async () => {
    setCargando(true);
    setError('');
    try {
      const usuario = JSON.parse(window.localStorage.getItem('loggedNoteAppUser') || '{}');
      const rta = await servicioCuotas.importarPagosConfirmar({
        id_lote,
        filas: archivo.filas,
        opciones: { distribuirExcedente: repartir },
        forzar,
        cuil_cuit_administrador: usuario.cuil_cuit,
        archivo: archivo.nombre,
      });
      if (rta && rta.ok) setResultado(rta);
      else setError((rta && rta.mensaje) || 'No se pudo importar.');
    } catch (e) {
      console.error(e);
      const dato = e && e.response && e.response.data;
      setError((dato && dato.mensaje) || 'No se pudo importar. No se guardó ningún pago.');
    } finally {
      setCargando(false);
    }
  };

  const deshacer = async () => {
    setCargando(true);
    setError('');
    try {
      const usuario = JSON.parse(window.localStorage.getItem('loggedNoteAppUser') || '{}');
      const rta = await servicioCuotas.importarPagosDeshacer({
        id_lote,
        importacion: resultado.importacion,
        cuil_cuit_administrador: usuario.cuil_cuit,
      });
      if (rta && rta.ok) {
        setResultado(null);
        setVista(null);
        setArchivo(null);
        setError('');
        setOpen(false);
        if (onListo) await onListo();
      } else {
        setError((rta && rta.mensaje) || 'No se pudo deshacer la importación.');
      }
    } catch (e) {
      console.error(e);
      setError('No se pudo deshacer la importación.');
    } finally {
      setCargando(false);
    }
  };

  const plan = vista && vista.plan;
  const advertenciasValor = plan ? plan.advertencias.filter((a) => a.tipo === 'valor') : [];
  const otrasAdvertencias = plan ? plan.advertencias.filter((a) => a.tipo !== 'valor') : [];
  const hayErrores = !!plan && plan.errores.length > 0;
  const nada = !!plan && plan.pagos.length === 0;
  const puedeConfirmar =
    !!plan && !hayErrores && !nada && !cargando && (advertenciasValor.length === 0 || forzar);

  const sxTh = { fontWeight: 700, fontSize: 12, color: '#0d3a49', backgroundColor: '#eef3f6', whiteSpace: 'nowrap', py: 0.75 };
  const sxTd = { fontSize: 13, py: 0.6, whiteSpace: 'nowrap' };

  return (
    <div>
      <Button variant="outlined" sx={sxBtnOutlined} onClick={() => setOpen(true)}>
        Importar pagos (Excel)
      </Button>

      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={cerrar}
        maxWidth="md"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, overflow: 'hidden' } },
          backdrop: { sx: { backgroundColor: 'rgba(15, 34, 48, 0.45)' } },
        }}
      >
        <DialogTitle sx={{ px: 3, py: 2, color: '#1a303e', borderBottom: '1px solid #e2e6e9', fontWeight: 700 }}>
          Importar pagos desde Excel
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5, backgroundColor: '#ffffff' }}>
          <Typography sx={{ fontWeight: 600, color: '#1a303e', mt: 1, mb: 0.5 }}>{descripcion || 'Lote seleccionado'}</Typography>

          {resultado ? (
            <Box sx={{ mt: 1.5 }}>
              <Alert severity="success" sx={{ borderRadius: 1.5 }}>
                Se importaron <b>{resultado.pagos}</b> pagos por <b>{moneda(resultado.total)}</b>. Deuda restante estimada de las cuotas
                calculadas: <b>{moneda(resultado.deudaRestante)}</b>.
              </Alert>
              <Typography variant="body2" sx={{ mt: 1.5, color: '#41525e' }}>
                Los pagos ya figuran en el cuadro de cuotas. Si hubo un error en el archivo, podés deshacer esta importación.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: '#41525e', mb: 1.5 }}>
                Subí el cuadro de cuotas en Excel (con las columnas <b>Mes</b>, <b>Cuota</b>, <b>Fecha de cobro</b> y <b>Cobranza</b>). Vas a ver
                una vista previa y los pagos recién se guardan al confirmar. No hace falta comprobante.
              </Typography>

              <Button component="label" variant="contained" sx={sxBtnPrimary} disabled={cargando}>
                {archivo ? 'Elegir otro archivo' : 'Elegir archivo Excel'}
                <input type="file" hidden accept=".xlsx,.xls" onChange={elegirArchivo} />
              </Button>
              {archivo && (
                <Chip size="small" variant="outlined" label={archivo.nombre} sx={{ ml: 1.5, fontWeight: 600 }} />
              )}

              {cargando && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 2, color: '#41525e' }}>
                  <CircularProgress size={18} /> Procesando…
                </Box>
              )}

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
                  {error}
                </Alert>
              )}

              {plan && (
                <Box sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1.5 }}>
                    <Chip label={`Filas con cobranza: ${plan.resumen.filasLeidas}`} variant="outlined" />
                    <Chip label={`Pagos a guardar: ${plan.resumen.pagosAGuardar}`} variant="outlined" />
                    <Chip label={`Total a importar: ${moneda(plan.resumen.totalAImportar)}`} variant="outlined" sx={{ fontWeight: 700 }} />
                    <Chip
                      label={`Deuda restante estimada: ${moneda(plan.resumen.deudaRestante)}`}
                      variant="outlined"
                      sx={{ fontWeight: 700, color: '#c9791a', borderColor: '#c9791a' }}
                    />
                  </Box>

                  {vista.pagosImportadosAntes > 0 && (
                    <Alert severity="info" sx={{ mb: 1.5, borderRadius: 1.5 }}>
                      Este lote ya tiene {vista.pagosImportadosAntes} pagos importados desde Excel. Las filas ya importadas se saltean para no duplicar.
                    </Alert>
                  )}
                  {plan.filasSaltadas.length > 0 && (
                    <Alert severity="info" sx={{ mb: 1.5, borderRadius: 1.5 }}>
                      {plan.filasSaltadas.length} fila(s) ya habían sido importadas y no se vuelven a cargar.
                    </Alert>
                  )}

                  {plan.errores.map((e, i) => (
                    <Alert key={'e' + i} severity="error" sx={{ mb: 1, borderRadius: 1.5 }}>
                      {e.mensaje}
                    </Alert>
                  ))}

                  {advertenciasValor.length > 0 && (
                    <Alert severity="warning" sx={{ mb: 1.5, borderRadius: 1.5 }}>
                      <b>Los valores de {advertenciasValor.length} cuota(s) no coinciden con los del sistema</b> (puede ser que el cuadro cargado
                      sea otro). Ejemplo: {advertenciasValor[0].mensaje}
                      <Box>
                        <FormControlLabel
                          control={<Checkbox size="small" checked={forzar} onChange={(e) => setForzar(e.target.checked)} />}
                          label="Entiendo la diferencia y quiero importar igual"
                        />
                      </Box>
                    </Alert>
                  )}

                  {otrasAdvertencias.map((a, i) => (
                    <Alert key={'a' + i} severity="info" sx={{ mb: 1, borderRadius: 1.5 }}>
                      {a.mensaje}
                    </Alert>
                  ))}

                  <FormControlLabel
                    control={<Checkbox size="small" checked={repartir} onChange={(e) => cambiarReparto(e.target.checked)} disabled={cargando} />}
                    label="Repartir los montos mayores a una cuota entre las cuotas anteriores impagas (de la más vieja a la más nueva)"
                    sx={{ mb: 1 }}
                  />

                  {nada && !hayErrores && (
                    <Alert severity="warning" sx={{ borderRadius: 1.5 }}>
                      No hay pagos nuevos para importar.
                    </Alert>
                  )}

                  {plan.pagos.length > 0 && (
                    <TableContainer sx={{ maxHeight: 320, border: '1px solid #e2e6e9', borderRadius: 1.5 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell sx={sxTh}>CUOTA</TableCell>
                            <TableCell sx={sxTh}>FECHA DE PAGO</TableCell>
                            <TableCell sx={sxTh} align="right">MONTO</TableCell>
                            <TableCell sx={sxTh}>DETALLE</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {plan.pagos.map((p, i) => (
                            <TableRow key={i} hover>
                              <TableCell sx={{ ...sxTd, fontWeight: 600 }}>
                                {p.nro_cuota ? `N° ${p.nro_cuota} · ` : ''}
                                {String(p.mes).padStart(2, '0')}/{p.anio}
                              </TableCell>
                              <TableCell sx={sxTd}>
                                {fechaCorta(p.fecha)}
                                {p.fechaAsumida ? <span style={{ color: '#c9791a' }}> (asumida)</span> : null}
                              </TableCell>
                              <TableCell sx={sxTd} align="right">{moneda(p.monto)}</TableCell>
                              <TableCell sx={{ ...sxTd, color: '#6b7a86' }}>
                                {p.tipo === 'directo' ? 'Pago de la cuota' : p.nota}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Box>
              )}
            </>
          )}

          {resultado && error && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              {error}
            </Alert>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid #e2e6e9', backgroundColor: '#fafbfc' }}>
          {resultado ? (
            <>
              <Button onClick={deshacer} disabled={cargando} sx={{ ...sxBtnOutlined, color: '#c62828', borderColor: '#c62828' }}>
                Deshacer esta importación
              </Button>
              <Button onClick={cerrar} variant="contained" sx={sxBtnPrimary}>
                Listo
              </Button>
            </>
          ) : (
            <>
              <Button onClick={cerrar} disabled={cargando} sx={sxBtnOutlined}>
                Cancelar
              </Button>
              <Button onClick={confirmar} disabled={!puedeConfirmar} variant="contained" sx={sxBtnPrimary}>
                {cargando && plan ? 'Importando…' : plan ? `Confirmar e importar ${plan.pagos.length} pagos` : 'Confirmar'}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
