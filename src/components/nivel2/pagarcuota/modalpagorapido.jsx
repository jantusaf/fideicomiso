import React, { useCallback, useState, Fragment } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Paper,
  Grid,
  TextField,
  Toolbar,
  Dialog,
  DialogContent,
  Tooltip,
  Card,
  MenuItem,
  Typography,
  Divider,
  Stack,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

import Modalveronline from "./verpdfcbu";
import BackupIcon from "@mui/icons-material/Backup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import servicioUsuario1 from "../../../services/usuario1";

export default function SelectTextFields(props) {
  const navigate = useNavigate();
  let params = useParams();
  let id = params.id;

  const [pago, setPagos] = useState({});
  const [cbus, setCbus] = useState([""]);
  const [eleccion, setEleccion] = useState({ tipo: "1" });
  const [cuotas, setCuotas] = useState([]);
  const [pagosVarios, setpagosVarios] = useState(null);
  const [enviarr, setEnviarr] = useState();
  const [fileUpload, setFileUpload] = useState(null);
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [descripcionCBU, setDescripcionCBU] = useState("");

  // =========================
  // ESTILOS (copiados de la versión elegida)
  // =========================
  const sxDialogPaper = {
    borderRadius: 4,
    overflow: "hidden",
    background: "rgba(255,255,255,0.96)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 22px 55px rgba(15, 127, 134, 0.16)",
  };

  const sxHeader = {
    px: { xs: 2, md: 2.5 },
    py: { xs: 1.6, md: 2 },
    background: "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
    color: "#fff",
  };

  const sxBody = {
    px: { xs: 2, md: 2.5 },
    py: 2,
    background:
      "linear-gradient(180deg, rgba(20,141,141,0.06) 0%, rgba(255,255,255,0.96) 50%, #fff 100%)",
  };

  const sxCard = {
    borderRadius: 3,
    border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
    background: "#fff",
    overflow: "hidden",
    boxShadow: "0 18px 45px rgba(10,59,79,0.08)",
  };

  const sxField = {
    "& .MuiInputLabel-root": { fontWeight: 800 },
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      background: "rgba(255,255,255,0.92)",
      "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
      "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
      "&.Mui-focused fieldset": {
        borderColor: "#148D8D",
        borderWidth: 2,
        boxShadow: "0 0 0 3px rgba(20,141,141,0.12)",
      },
    },
    "& .MuiFilledInput-root": {
      borderRadius: 2,
      background: alpha("#0f7f86", 0.06),
    },
  };

  const sxBtnPrimary = {
    borderRadius: 2,
    px: 2.2,
    py: 1.05,
    textTransform: "none",
    fontWeight: 900,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
    "&:hover": { backgroundColor: "#014a6b" },
  };

  const sxBtnAccent = {
    borderRadius: 2,
   
    textTransform: "none",
    fontWeight: 900,
    backgroundColor: "#148D8D",
    boxShadow: "0 10px 25px rgba(20,141,141,0.22)",
    "&:hover": { backgroundColor: "#0f7a7a" },
  };

  const sxDropzone = (isActive) => ({
    cursor: "pointer",
    borderRadius: 3,
    border: `1px dashed ${isActive ? "#148D8D" : alpha("#0b4f6c", 0.25)}`,
    background: isActive
      ? "linear-gradient(180deg, rgba(20,141,141,0.10) 0%, rgba(255,255,255,0.92) 100%)"
      : "rgba(250,250,250,0.9)",
    color: alpha("#0b4f6c", 0.75),
    boxShadow: isActive ? "0 14px 30px rgba(20,141,141,0.12)" : "none",
    transition: "all 180ms ease",
    "&:hover": {
      borderColor: alpha("#0b4f6c", 0.45),
      boxShadow: "0 14px 30px rgba(11,79,108,0.10)",
    },
  });

  // =========================
  // DROPZONE (sin tocar lógica)
  // =========================
  const onDrop = useCallback((files, acceptedFiles) => {
    setLoading(true);
    const formData = new FormData();
    setFileUpload(acceptedFiles);
    formData.append("file", files[0]);
    setEnviarr(formData);
    setLoading(false);
  }, []);

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop,
    multiple: false,
    accept: "document/*",
  });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // =========================
  // TU LÓGICA (NO TOCADA)
  // =========================
  const traercbu = async () => {
    const cuot = await servicioUsuario1.listacbus(params.cuil_cuit);
    setCbus(cuot);
  };

  const enviar = async () => {
    setLoading(true);

    if (!enviarr) {
      const continuarSinArchivo = window.confirm(
        "Atención: No hay archivo de comprobante adjunto. ¿Desea continuar?"
      );
      if (!continuarSinArchivo) {
        setLoading(false);
        return;
      }
    }

    const formData = enviarr || new FormData();

    formData.append("cuil_cuit", pago.cuil_cuit);
    formData.append("id_cuota", props.id_cuota);
    formData.append("pago", pago.monto);
    formData.append("fecha", pago.fecha);
    formData.append("cbu", pago.cbu);

    console.log(formData);

    try {
      const response = await servicioUsuario1.pagarnivel2(formData);
      alert(response[0]);

      props.traer(props.id_lote);
      setLoading(false);
      handleClose();
    } catch (error) {
      console.error("Error subiendo archivo:", error);
    }
  };

  const enviar2 = async () => {
    setLoading(true);
    enviarr.append("datos", [pago.cuil_cuit, pago.fecha, pago.id, JSON.stringify(pagosVarios)]);

    const rta = await servicioUsuario1.pagarnivel2varios(enviarr);
    console.log(rta);
    alert(rta);

    props.traer(props.id_lote);
  };

  const handleChangefecha = (event) => {
    const selectedDate = new Date(event.target.value);
    const currentDate = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(currentDate.getFullYear() - 1);

    if (selectedDate > currentDate) {
      setWarning("La fecha seleccionada es en el futuro.");
    } else if (selectedDate < oneYearAgo) {
      setWarning("La fecha seleccionada es de hace más de un año.");
    } else {
      setWarning("");
    }
    handleChange(event);
  };

  const handleChange = (e) => {
    const selectedCBU = cbus.find((cbu) => cbu.id === e.target.value);
    setPagos({ ...pago, [e.target.name]: e.target.value });
    setDescripcionCBU(selectedCBU ? selectedCBU.descripcion : "");
  };

  const handleClose = () => setOpen(false);

  const handleClickOpen = () => {
    setOpen(true);
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setPagos({
        cuil_cuit: user.cuil_cuit,
        id: id,
        monto: props.cuota_con_ajuste,
      });
    }
    traercbu();
  };

  const handleChangeVarios = (e) => {
    console.log(pagosVarios);
    setpagosVarios({ ...pagosVarios, [e.target.name]: e.target.value });
  };

  // =========================
  // UI (misma estética, sin tocar lógica/nombres)
  // =========================
  return (
    <Box component="form" sx={{ display: "inline-flex", alignItems: "center" }} noValidate autoComplete="off">
      <Tooltip title="Pago rapido (Nuevo)">
        <Button
          variant="contained"
          size="small"
          sx={{
            ...sxBtnAccent,
            backgroundColor: "#0799B6",
            "&:hover": { backgroundColor: "#014a6b" },
          }}
          onClick={handleClickOpen}
        >
          Pagar
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{ sx: sxDialogPaper }}
        maxWidth="sm"
        fullWidth
      >
        {/* HEADER GRADIENT */}
        <Box sx={sxHeader}>
          <Typography sx={{ fontWeight: 950, letterSpacing: 0.2, fontSize: 18 }}>
            Pagar cuota(s)
          </Typography>
          <Typography sx={{ mt: 0.4, opacity: 0.92, fontWeight: 700, fontSize: 13 }}>
            Cargá los datos del pago y subí el comprobante.
          </Typography>
        </Box>

        <DialogContent sx={{ p: 0 }}>
  <Fragment>
    <Toolbar sx={{ display: "none" }} />

    <Box sx={sxBody}>
      <Card variant="outlined" sx={sxCard}>
        <Box sx={{ p: 2 }}>
          <Stack>
            {/* SELECT CBU */}
            <TextField
              id="outlined-select-currency"
              select
              label="Elegir CBU"
              name="cbu"
              onChange={handleChange}
              helperText="Por favor ingrese su CBU"
              fullWidth
              sx={{
                ...sxField,
                mb: 1.6,
                "& .MuiFormHelperText-root": { mt: 0.6, mb: 0.2 },
              }}
            >
              {cbus.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.lazo}- {option.numero}
                </MenuItem>
              ))}
            </TextField>

            {/* ver online + descripción */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1.2,
                flexWrap: "wrap",
              }}
            >
              {pago.cbu ? <Modalveronline id={pago.cbu} /> : null}

              {descripcionCBU ? (
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 900,
                    color: alpha("#0b4f6c", 0.9),
                    background: alpha("#0f7f86", 0.08),
                    border: `1px solid ${alpha("#0f7f86", 0.16)}`,
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 999,
                  }}
                >
                  Últimos números: {descripcionCBU}
                </Typography>
              ) : null}
            </Box>

            <Divider sx={{ borderColor: alpha("#0b4f6c", 0.12) }} />

            {/* FECHA + MONTO */}
            <Grid container spacing={2} alignItems="stretch" sx={{ mt: 0.5 }}>
              <Grid item xs={12} md={6}>
                <TextField
                  onChange={handleChangefecha}
                  name="fecha"
                  id="date"
                  label="Fecha de pago"
                  type="date"
                  defaultValue="2020-01"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    ...sxField,
                    "& .MuiOutlinedInput-root": {
                      height: 56,
                      alignItems: "center",
                      borderRadius: 2,
                      background: "rgba(255,255,255,0.92)",
                      boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                      "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
                      "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
                      "&.Mui-focused fieldset": {
                        borderColor: "#148D8D",
                        borderWidth: 2,
                      },
                    },
                    "& .MuiInputLabel-root": {
                      fontWeight: 800,
                      color: alpha("#0b4f6c", 0.85),
                    },
                    "& input": {
                      padding: "16.5px 14px",
                      fontWeight: 800,
                      color: "#0b2b3a",
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                {eleccion.tipo === "1" ? (
                  <TextField
                    defaultValue={props.cuota_con_ajuste}
                    margin="dense"
                    id="name"
                    label="Monto"
                    name="monto"
                    onChange={handleChange}
                    fullWidth
                    type="number"
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      ...sxField,
                      "& .MuiOutlinedInput-root": {
                        height: 56,
                        alignItems: "center",
                        borderRadius: 2,
                        background: "rgba(255,255,255,0.92)",
                        boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                        "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
                        "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
                        "&.Mui-focused fieldset": {
                          borderColor: "#148D8D",
                          borderWidth: 2,
                        },
                      },
                      "& .MuiInputLabel-root": {
                        fontWeight: 800,
                        color: alpha("#0b4f6c", 0.85),
                      },
                      "& input": {
                        padding: "16.5px 14px",
                        fontWeight: 800,
                        color: "#0b2b3a",
                      },
                      "& input[type=number]": { MozAppearance: "textfield" },
                      "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                        { WebkitAppearance: "none", margin: 0 },
                    }}
                  />
                ) : null}
              </Grid>

              {/* WARNING: tiene que estar ADENTRO del container */}
              {warning ? (
                <Grid item xs={12}>
                  <Typography
                    color="error"
                    sx={{
                      mt: 0.2,
                      fontWeight: 800,
                      background: alpha("#d32f2f", 0.06),
                      border: `1px solid ${alpha("#d32f2f", 0.18)}`,
                      borderRadius: 2,
                      px: 1.2,
                      py: 0.8,
                    }}
                  >
                    {warning}
                  </Typography>
                </Grid>
              ) : null}
            </Grid>

            {/* COMPROBANTE */}
            <Box sx={{ mt: 1.5 }}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  p: { xs: 2, md: 2.25 },
                  border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                  background:
                    "linear-gradient(180deg, rgba(20,141,141,0.05) 0%, #fff 55%)",
                }}
              >
                <Stack spacing={1.2}>
                  <Typography sx={{ fontWeight: 950, color: "#0a3b4f" }}>
                    SUBIR COMPROBANTE
                  </Typography>

                  <Paper sx={{ ...sxDropzone(isDragActive), borderRadius: 3 }}>
                    <Box sx={{ p: { xs: 2.2, md: 2.6 } }} {...getRootProps()}>
                      <input {...getInputProps()} />

                      <Typography
                        sx={{
                          fontWeight: 900,
                          fontSize: 14.5,
                          color: isDragActive ? "#148D8D" : alpha("#0b4f6c", 0.85),
                        }}
                      >
                        {isDragActive
                          ? "Suelta aquí el documento"
                          : "Arrastre el archivo aquí o haga click para seleccionar."}
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.8,
                          fontSize: 12.5,
                          color: alpha("#0b4f6c", 0.65),
                          lineHeight: 1.35,
                        }}
                      >
                        (Documentos aceptados según configuración actual)
                      </Typography>
                    </Box>
                  </Paper>
                </Stack>
              </Paper>
            </Box>

            {/* ACCIONES */}
            {pago.monto > 0 && pago.fecha ? (
              <Box
                sx={{
                  borderRadius: 3,
                  p: 1.6,
                  border: `1px solid ${alpha("#148D8D", 0.22)}`,
                  background: alpha("#148D8D", 0.06),
                  mt: 1.6,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 950,
                    color: "#0f7a7a",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Archivos aceptados <BackupIcon fontSize="small" />
                </Typography>

                <Box
                  component="ul"
                  sx={{
                    mt: 0.8,
                    mb: 1.2,
                    pl: 2.2,
                    color: alpha("#0b4f6c", 0.85),
                    fontWeight: 650,
                    fontSize: 13,
                  }}
                >
                  {acceptedFileItems}
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={1.2} flexWrap="wrap">
                  <Button variant="contained" sx={sxBtnPrimary} onClick={handleClose}>
                    Cancelar
                  </Button>

                  <Button variant="contained" sx={sxBtnAccent} onClick={enviar}>
                    {loading ? <CircularProgress color="inherit" size={22} /> : "Enviar"}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12.5, color: alpha("#0b4f6c", 0.7), mt: 2 }}>
                Completá <b>CBU</b>, <b>Fecha</b> y <b>Monto</b> para habilitar el envío.
              </Typography>
            )}
          </Stack>
        </Box>
      </Card>

      {/* VARIAS CUOTAS: queda igual, va afuera del Card */}
      {eleccion.tipo === "varias" ? (
        <Box sx={{ mt: 2 }}>
          <Paper elevation={0} sx={{ ...sxCard, p: 2, background: "#fff" }}>
            <Typography sx={{ fontWeight: 950, color: "#0a3b4f", mb: 1 }}>
              Cargar montos por cuota
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: alpha("#0b4f6c", 0.12) }} />

            {cuotas ? (
              <Stack spacing={1.2}>
                {cuotas.map((option) => (
                  <TextField
                    key={option.id}
                    autoFocus
                    margin="dense"
                    id="name"
                    label={"Cuota " + option.nro_cuota}
                    name={option.id}
                    onChange={handleChangeVarios}
                    fullWidth
                    variant="filled"
                    type={"Number"}
                    sx={sxField}
                  />
                ))}
              </Stack>
            ) : null}

            {pago.fecha ? (
              <Box sx={{ mt: 2 }}>
                <Typography
                  sx={{
                    fontWeight: 900,
                    color: "#0f7a7a",
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  Archivos aceptados <BackupIcon fontSize="small" />
                </Typography>

                <Box
                  component="ul"
                  sx={{
                    mt: 0.8,
                    mb: 1.2,
                    pl: 2.2,
                    color: alpha("#0b4f6c", 0.85),
                    fontWeight: 650,
                    fontSize: 13,
                  }}
                >
                  {acceptedFileItems}
                </Box>

                <Stack direction="row" justifyContent="flex-end" spacing={1.2} flexWrap="wrap">
                  <Button variant="contained" sx={sxBtnPrimary} onClick={handleClose}>
                    Cancelar
                  </Button>

                  <Button variant="contained" sx={sxBtnAccent} onClick={enviar2}>
                    {loading ? <CircularProgress color="inherit" size={22} /> : "Enviar varias"}
                  </Button>
                </Stack>
              </Box>
            ) : null}
          </Paper>
        </Box>
      ) : null}
    </Box>
  </Fragment>
</DialogContent>

      </Dialog >
    </Box >
  );
}
