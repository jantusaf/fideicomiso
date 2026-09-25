import * as React from "react";
import { useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Divider,
  FormControl,
  InputLabel,
  Paper,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import servicioUsuario1 from "../../../services/usuario1";
import { useParams } from "react-router-dom";
import Modalveronline from "../pagarcuota/verpdfcbu";
import { COLOR_TEXT, COLOR_MUTED, COLOR_BORDER, COLOR_ERROR, sxBtnPrimary, sxBtnOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions } from "../detalleclienteIngresos/estilos";

export default function CancelarLoteCompleto(props) {
  let params = useParams();
  let id = params.id;

  const [descripcionCBU, setDescripcionCBU] = useState("");
  const [open, setOpen] = useState(false);
  const [paso, setPaso] = useState(1);
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1);
  const [anioSeleccionado, setAnioSeleccionado] = useState(new Date().getFullYear());
  const [password, setPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);
  const [pago, setPago] = useState({});
  const [fileUpload, setFileUpload] = useState(null);
  const [enviarr, setEnviarr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cbus, setCbus] = useState([""]);

  const calcularTotales = () => {
    const cuotas = props.cuotas || [];
    const fechaSeleccionada = new Date(anioSeleccionado, mesSeleccionado - 1);
    let sumatoriaPagos = 0;
    let totalDevengado = 0;
    let totalFuturo = 0;
    let cuotaBase = null;
    let mesesRestantes = 0;
    let existeFecha = false;

    cuotas.forEach((cuota) => {
      const cuotaFecha = new Date(cuota.anio, cuota.mes - 1);
      const cuotaConAjuste = parseFloat(cuota.cuota_con_ajuste || 0);
      const pago = parseFloat(cuota.pago || 0);

      if (cuotaFecha < fechaSeleccionada) {
        sumatoriaPagos += pago;
        totalDevengado += cuotaConAjuste;
      } else if (cuotaFecha >= fechaSeleccionada) {
        if (!cuotaBase) cuotaBase = cuotaConAjuste;
        mesesRestantes++;
        existeFecha = true;
      }
    });

    totalFuturo = cuotaBase ? cuotaBase * mesesRestantes : 0;
    return {
      totalHastaFecha: totalDevengado - sumatoriaPagos,
      totalDesdeFecha: totalFuturo,
      cuotaBase,
      existeFecha,
      mesesRestantes,
    };
  };

  const traercbu = async () => {
    const cuot = await servicioUsuario1.listacbus(params.cuil_cuit);
    setCbus(cuot);
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(value);

  const { totalHastaFecha, totalDesdeFecha, cuotaBase, existeFecha, mesesRestantes } =
    calcularTotales();

  const onDrop = useCallback((files) => {
    const formData = new FormData();
    formData.append("file", files[0]);
    setFileUpload(files[0]);
    setEnviarr(formData);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: "application/pdf, image/*",
  });

  const handleConfirm = () => {
    if (password !== "1234") {
      setErrorPassword(true);
      return;
    }
    setErrorPassword(false);
    traercbu();
    setPaso(2);
  };

  const enviarFinal = async () => {
    setLoading(true);
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const usuario = JSON.parse(loggedUserJSON);
      console.log(usuario.cuil_cuit);
      console.log(mesSeleccionado, anioSeleccionado);

      const formData = enviarr || new FormData();
      formData.append("mes", mesSeleccionado);
      formData.append("anio", anioSeleccionado);
      formData.append("id_lote", props.id_lote);
      formData.append("cuil_cuit", pago.cuil_cuit);
      formData.append("cuil_cuit_administrador", usuario.cuil_cuit);

      formData.append("pago", pago.monto);
      formData.append("fecha", pago.fecha);
      formData.append("cbu", pago.cbu);

      try {
        const pagoRes = await servicioUsuario1.cancelarloteic3(formData);
        alert(pagoRes);
        setOpen(false);
        setPaso(1);
        setPassword("");
        setPago({});
        setFileUpload(null);
        props.traer(props.id_lote);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e) => {
    const selectedCBU = cbus.find((cbu) => cbu.id === e.target.value);
    setPago({ ...pago, [e.target.name]: e.target.value });
    setDescripcionCBU(selectedCBU ? selectedCBU.descripcion : "");
  };

  // estilos reutilizables (solo frontend)
  const inputSx = { "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };

  return (
    <>
      <Button
        variant="outlined"
        sx={{ ...sxBtnOutlined, mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Cancelar lote
      </Button>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setPaso(1);
          setPassword("");
        }}
        maxWidth="sm"
        fullWidth
        slotProps={slotPropsDialog}
      >
        <DialogTitle sx={sxDialogTitle}>
          Cancelar lote
          <Typography sx={{ mt: 0.5, fontWeight: 400, fontSize: 13, color: COLOR_MUTED }}>
            Seleccioná el mes/año de referencia y confirmá con contraseña.
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pt: 3, pb: 2.5 }}>
          {paso == 1 ? (
            <>
              <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT, mb: 1 }}>
                Período
              </Typography>

              <Box sx={{ display: "grid", gap: 1.6 }}>
                <FormControl fullWidth size="small" sx={inputSx}>
                  <InputLabel id="mes-label">Mes</InputLabel>
                  <Select
                    labelId="mes-label"
                    label="Mes"
                    value={mesSeleccionado}
                    onChange={(e) => setMesSeleccionado(parseInt(e.target.value))}
                  >
                    {[...Array(12).keys()].map((m) => (
                      <MenuItem key={m + 1} value={m + 1}>{`Mes ${m + 1}`}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth size="small" sx={inputSx}>
                  <InputLabel id="anio-label">Año</InputLabel>
                  <Select
                    labelId="anio-label"
                    label="Año"
                    value={anioSeleccionado}
                    onChange={(e) => setAnioSeleccionado(parseInt(e.target.value))}
                  >
                    {[...Array(5).keys()].map((a) => (
                      <MenuItem key={anioSeleccionado - 2 + a} value={anioSeleccionado - 2 + a}>
                        {anioSeleccionado - 2 + a}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Divider sx={{ my: 2, borderColor: COLOR_BORDER }} />

              <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT, mb: 1 }}>
                Resumen
              </Typography>

              {!existeFecha ? (
                <Typography sx={{ color: COLOR_ERROR, fontWeight: 600 }}>
                  No existen cuotas registradas para {mesSeleccionado}/{anioSeleccionado}
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gap: 0.9 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 500, color: COLOR_TEXT }}>Cuota base</Typography>
                    <Typography sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                      {formatCurrency(cuotaBase)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 500, color: COLOR_TEXT }}>
                      Total hasta la fecha
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                      {formatCurrency(totalHastaFecha)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 500, color: COLOR_TEXT }}>
                      Total desde la fecha
                    </Typography>
                    <Typography sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                      {formatCurrency(totalDesdeFecha)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 500, color: COLOR_TEXT }}>
                      Meses restantes
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        color: mesesRestantes >= 30 ? COLOR_ERROR : COLOR_TEXT,
                      }}
                    >
                      {mesesRestantes}
                    </Typography>
                  </Box>

                  {mesesRestantes >= 30 ? (
                    <Typography sx={{ mt: 0.5, color: COLOR_ERROR, fontWeight: 600, fontSize: 12.5 }}>
                      Aviso: la cantidad de meses restantes es alta.
                    </Typography>
                  ) : null}
                </Box>
              )}

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  p: 1.6,
                  borderRadius: 2,
                  border: `1px solid ${COLOR_BORDER}`,
                  background: "#f9fafb",
                }}
              >
                <TextField
                  type="password"
                  label="Contraseña"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errorPassword}
                  helperText={errorPassword ? "Contraseña incorrecta" : ""}
                  size="small"
                  sx={inputSx}
                />
              </Paper>
            </>
          ) : (
            <>
              <FormControl fullWidth size="small" sx={{ ...inputSx, mt: 1 }}>
                <InputLabel id="cbu-label">Elegir CBU</InputLabel>
                <Select
                  labelId="cbu-label"
                  label="Elegir CBU"
                  name="cbu"
                  onChange={handleChange}
                  value={pago.cbu || ""}
                >
                  {cbus.map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.lazo}- {option.numero}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ mt: 1.5 }}>
                {pago.cbu ? <Modalveronline id={pago.cbu} /> : <></>}
              </Box>

              {descripcionCBU && (
                <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 600, color: COLOR_TEXT }}>
                  Ultimos numeros: {descripcionCBU}
                </Typography>
              )}

              <TextField
                fullWidth
                type="date"
                label="Fecha"
                slotProps={{ inputLabel: { shrink: true } }}
                onChange={(e) => setPago({ ...pago, fecha: e.target.value })}
                size="small"
                sx={{ ...inputSx, mt: 2 }}
              />

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: "1px dashed #b7c2c9",
                  boxShadow: "none",
                  background: "#f9fafb",
                }}
              >
                <Box
                  {...getRootProps()}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { background: "#f4f7f8" },
                  }}
                >
                  <input {...getInputProps()} />
                  {fileUpload ? (
                    <Typography sx={{ fontWeight: 600, color: COLOR_TEXT }}>
                      Archivo: {fileUpload.name}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontWeight: 500, fontSize: 14, color: COLOR_MUTED }}>
                      Arrastrá un PDF o imagen aquí o hacé clic para seleccionar
                    </Typography>
                  )}
                </Box>
              </Paper>
            </>
          )}
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button
            onClick={() => {
              setOpen(false);
              setPaso(1);
              setPassword("");
            }}
            variant="outlined"
            sx={sxBtnOutlined}
          >
            Cancelar
          </Button>

          {paso === 1 ? (
            <Button
              onClick={handleConfirm}
              disabled={!existeFecha}
              variant="contained"
              sx={sxBtnPrimary}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={enviarFinal}
              disabled={loading}
              variant="contained"
              sx={sxBtnPrimary}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Enviar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
