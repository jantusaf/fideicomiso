import * as React from "react";
import { useState, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Paper,
  FormControl,
  InputLabel,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import serviciocuotas from "../services/cuotas";
import servicioUsuario1 from "../services/usuario1";
import { useParams } from "react-router-dom";
import Modalveronline from "./nivel2/pagarcuota/verpdfcbu";

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
        const pagoRes = await servicioUsuario1.cancelarlote(formData);
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

  // ======== Estilos (idénticos al otro modal) ========
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 1.5,
    },
    "& .MuiInputLabel-root": { fontWeight: 600 },
  };

  // Acción delicada: contorno rojo, sin sombras
  const sxBtnOpen = {
    px: 2.25,
    borderRadius: 1.5,
    textTransform: "none",
    fontWeight: 600,
    color: "#c62828",
    borderColor: "#e3b5b5",
    "&:hover": { borderColor: "#c62828", backgroundColor: "rgba(198, 40, 40, 0.04)" },
  };

  const sxBtnCancel = {
    borderRadius: 1.5,
    px: 2.25,
    textTransform: "none",
    fontWeight: 600,
    color: "#1a303e",
    borderColor: "#c9d2d8",
    "&:hover": { borderColor: "#0d3a49", backgroundColor: "rgba(13, 58, 73, 0.04)" },
  };

  const sxBtnNext = {
    borderRadius: 1.5,
    px: 2.25,
    textTransform: "none",
    fontWeight: 600,
    backgroundColor: "#1a303e",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#0d3a49", boxShadow: "none" },
    "&.Mui-disabled": {
      backgroundColor: "#e2e6e9",
      color: "#9aa7b0",
    },
  };

  const sxBtnEnviar = {
    borderRadius: 1.5,
    px: 2.25,
    textTransform: "none",
    fontWeight: 600,
    backgroundColor: "#c62828",
    boxShadow: "none",
    "&:hover": { backgroundColor: "#a81f1f", boxShadow: "none" },
    "&.Mui-disabled": {
      backgroundColor: "#e2e6e9",
      color: "#9aa7b0",
    },
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" sx={sxBtnOpen} onClick={() => setOpen(true)}>
          Cancelar lote
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
          setPaso(1);
          setPassword("");
        }}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: { sx: { borderRadius: 3, overflow: "hidden" } },
          backdrop: { sx: { backgroundColor: "rgba(15, 34, 48, 0.45)" } },
        }}
      >
        {/* Encabezado */}
        <DialogTitle sx={{ p: 0 }}>
          <Box
            sx={{
              px: 3,
              py: 2,
              color: "#1a303e",
              borderBottom: "1px solid #e2e6e9",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: 18, lineHeight: 1.2 }}>
              Cancelar lote
            </Typography>
            <Typography sx={{ mt: 0.4, color: "#6b7a86", fontWeight: 400, fontSize: 13.5 }}>
              {paso === 1
                ? "Seleccioná el mes/año de referencia y confirmá con contraseña."
                : "Seleccioná CBU, fecha y adjuntá documentación (PDF/imagen)."}
            </Typography>
          </Box>
        </DialogTitle>

        <DialogContent
          sx={{
            pt: 2.5,
            pb: 2.5,
            px: 3,
          }}
        >
          {paso == 1 ? (
            <>
              <Typography sx={{ fontWeight: 700, color: "#1a303e", mb: 1 }}>
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

              <Divider sx={{ my: 2, borderColor: alpha("#0b4f6c", 0.12) }} />

              <Typography sx={{ fontWeight: 900, color: "#0b2b3a", mb: 1 }}>
                Resumen
              </Typography>

              {!existeFecha ? (
                <Box
                  sx={{
                    borderRadius: 2,
                    p: 1.2,
                    backgroundColor: "rgba(211,47,47,0.06)",
                    border: "1px solid rgba(211,47,47,0.18)",
                  }}
                >
                  <Typography sx={{ fontWeight: 900, color: "#b71c1c", fontSize: 13.5 }}>
                    No existen cuotas registradas
                  </Typography>
                  <Typography sx={{ mt: 0.4, color: "rgba(130,0,0,0.80)", fontSize: 13 }}>
                    No existen cuotas registradas para {mesSeleccionado}/{anioSeleccionado}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "grid", gap: 0.9 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>Cuota base</Typography>
                    <Typography sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                      {formatCurrency(cuotaBase)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                      Total hasta la fecha
                    </Typography>
                    <Typography sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                      {formatCurrency(totalHastaFecha)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                      Total desde la fecha
                    </Typography>
                    <Typography sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                      {formatCurrency(totalDesdeFecha)}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                      Meses restantes
                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: 900,
                        color: mesesRestantes >= 30 ? "crimson" : "#0b4f6c",
                      }}
                    >
                      {mesesRestantes}
                    </Typography>
                  </Box>

                  {mesesRestantes >= 30 ? (
                    <Typography sx={{ mt: 0.5, color: "crimson", fontWeight: 800, fontSize: 12.5 }}>
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
                  border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                  background: "rgba(255,255,255,0.9)",
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
              <Typography sx={{ fontWeight: 900, color: "#0b2b3a", mb: 1 }}>
                Datos de cancelación
              </Typography>

              <FormControl fullWidth size="small" sx={inputSx}>
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
                <Typography variant="body2" sx={{ mt: 1.5, fontWeight: 800, color: "#0b2b3a" }}>
                  Ultimos numeros: {descripcionCBU}
                </Typography>
              )}

              <TextField
                fullWidth
                type="date"
                label="Fecha"
                InputLabelProps={{ shrink: true }}
                onChange={(e) => setPago({ ...pago, fecha: e.target.value })}
                size="small"
                sx={{ ...inputSx, mt: 2 }}
              />

              <Paper
                elevation={0}
                sx={{
                  mt: 2,
                  borderRadius: 2,
                  border: `1px dashed ${alpha("#0b4f6c", 0.35)}`,
                  background: "rgba(255,255,255,0.85)",
                }}
              >
                <Box
                  {...getRootProps()}
                  sx={{
                    p: 2,
                    textAlign: "center",
                    cursor: "pointer",
                    "&:hover": { background: alpha("#148D8D", 0.06) },
                  }}
                >
                  <input {...getInputProps()} />
                  {fileUpload ? (
                    <Typography sx={{ fontWeight: 800, color: "#0b2b3a" }}>
                      Archivo: {fileUpload.name}
                    </Typography>
                  ) : (
                    <Typography sx={{ fontWeight: 750, color: alpha("#0b2b3a", 0.9) }}>
                      Arrastrá un PDF o imagen aquí o hacé clic para seleccionar
                    </Typography>
                  )}
                </Box>
              </Paper>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: `1px solid ${alpha("#0b4f6c", 0.10)}`,
            background: "#fff",
            justifyContent: "flex-end",
            gap: 1.2,
          }}
        >
          <Button
            onClick={() => {
              setOpen(false);
              setPaso(1);
              setPassword("");
            }}
            variant="outlined"
            sx={sxBtnCancel}
          >
            Cancelar
          </Button>

          {paso === 1 ? (
            <Button onClick={handleConfirm} disabled={!existeFecha} variant="contained" sx={sxBtnNext}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={enviarFinal} disabled={loading} variant="contained" sx={sxBtnEnviar}>
              {loading ? <CircularProgress size={24} /> : "Enviar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
