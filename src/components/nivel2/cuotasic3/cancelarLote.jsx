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
  const inputSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: "rgba(255,255,255,0.92)",
      "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
      "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.30) },
      "&.Mui-focused fieldset": { borderColor: "#148D8D", borderWidth: 2 },
    },
    "& .MuiInputLabel-root": { fontWeight: 800, color: alpha("#0b4f6c", 0.9) },
  };

  return (
    <>
      <Button
        variant="contained"
        sx={{
          mb: 2,
          px: 2.2,
          py: 1.1,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 900,
          backgroundColor: "#0b4f6c",
          boxShadow: "0 10px 25px rgba(11,79,108,0.25)",
          "&:hover": { backgroundColor: "#0a3b4f" },
        }}
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
        PaperProps={{
          sx: {
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 24px 70px rgba(0,0,0,0.22)",
           
          },
        }}
      >
        {/* HEADER teal como la imagen */}
        <Box
          sx={{
            px: 3,
            py: 2,
            background: "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
            color: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 900, fontSize: 18, lineHeight: 1.1 }}>
            Cancelar lote
          </Typography>
          <Typography sx={{ mt: 0.4, opacity: 0.92, fontWeight: 650, fontSize: 13.5 }}>
            Seleccioná el mes/año de referencia y confirmá con contraseña.
          </Typography>
        </Box>

        <DialogContent sx={{ pt: 2.5, pb: 2.5, background: "linear-gradient(180deg, rgba(20,141,141,0.06) 0%, rgba(255,255,255,0.95) 55%, #fff 100%)" }}>
          {paso == 1 ? (
            <>
              <Typography sx={{ fontWeight: 900, color: "#0b2b3a", mb: 1 }}>
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
                <Typography sx={{ color: "crimson", fontWeight: 800 }}>
                  No existen cuotas registradas para {mesSeleccionado}/{anioSeleccionado}
                </Typography>
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
            sx={{
              borderRadius: 2,
              px: 2.2,
              py: 1,
              textTransform: "none",
              fontWeight: 900,
              background: alpha("#0b4f6c", 0.10),
              color: "#0b4f6c",
              "&:hover": { background: alpha("#0b4f6c", 0.14) },
            }}
          >
            Cancelar
          </Button>

          {paso === 1 ? (
            <Button
              onClick={handleConfirm}
              disabled={!existeFecha}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 2.2,
                py: 1,
                textTransform: "none",
                fontWeight: 900,
                background: "#0b4f6c",
                boxShadow: "0 12px 26px rgba(11,79,108,0.22)",
                "&:hover": { background: "#0a3b4f" },
                "&.Mui-disabled": {
                  background: alpha("#0b4f6c", 0.18),
                  color: alpha("#0b2b3a", 0.45),
                },
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              onClick={enviarFinal}
              disabled={loading}
              variant="contained"
              sx={{
                borderRadius: 2,
                px: 2.2,
                py: 1,
                textTransform: "none",
                fontWeight: 900,
                background: "#148D8D",
                boxShadow: "0 12px 26px rgba(20,141,141,0.22)",
                "&:hover": { background: "#0f7f86" },
                "&.Mui-disabled": {
                  background: alpha("#148D8D", 0.18),
                  color: alpha("#0b2b3a", 0.45),
                },
              }}
            >
              {loading ? <CircularProgress size={24} /> : "Enviar"}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}
