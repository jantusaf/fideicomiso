import React, { useCallback, useState, Fragment } from "react";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, sxBtnPrimary as sxBtnPrimaryBase, sxBtnOutlined as sxBtnOutlinedBase, slotPropsDialog } from "../detalleclienteIngresos/estilos";
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
  const sxDialogPaper = { borderRadius: 3 };

  const sxHeader = {
    px: { xs: 2, md: 3 },
    py: 2,
    borderBottom: `1px solid ${COLOR_BORDER}`,
    color: COLOR_TEXT,
  };

  const sxBody = {
    px: { xs: 2, md: 3 },
    py: 2.5,
  };

  const sxCard = {
    borderRadius: 2,
    border: `1px solid ${COLOR_BORDER}`,
    background: "#fff",
    overflow: "hidden",
  };

  const sxField = {
    "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
    "& .MuiFilledInput-root": { borderRadius: 1.5 },
  };

  const sxBtnPrimary = { ...sxBtnOutlinedBase };

  const sxBtnAccent = { ...sxBtnPrimaryBase };

  const sxDropzone = (isActive) => ({
    cursor: "pointer",
    borderRadius: 2,
    boxShadow: "none",
    border: `1px dashed ${isActive ? COLOR_ACCENT : "#b7c2c9"}`,
    background: isActive ? "#f4f7f8" : "#f9fafb",
    color: COLOR_MUTED,
    transition: "border-color .15s ease, background-color .15s ease",
    "&:hover": { borderColor: COLOR_ACCENT, background: "#f4f7f8" },
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
          sx={{ ...sxBtnPrimaryBase, px: 1.1, py: 0.35, minHeight: 26, fontSize: "0.72rem" }}
          onClick={handleClickOpen}
        >
          Pagar
        </Button>
      </Tooltip>

      <Dialog
        open={open}
        onClose={handleClose}
        slotProps={slotPropsDialog}
        maxWidth="sm"
        fullWidth
      >
        {/* ENCABEZADO */}
        <Box sx={sxHeader}>
          <Typography sx={{ fontWeight: 700, fontSize: 17, color: COLOR_TEXT }}>
            Pagar cuota(s)
          </Typography>
          <Typography sx={{ mt: 0.25, fontWeight: 400, fontSize: 13, color: COLOR_MUTED }}>
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
                    fontWeight: 600,
                    color: COLOR_TEXT,
                    border: `1px solid ${COLOR_BORDER}`,
                    px: 1.25,
                    py: 0.6,
                    borderRadius: 999,
                  }}
                >
                  Últimos números: {descripcionCBU}
                </Typography>
              ) : null}
            </Box>

            <Divider sx={{ borderColor: COLOR_BORDER }} />

            {/* FECHA + MONTO */}
            <Grid container spacing={2} sx={{ alignItems: "stretch", mt: 1.5 }}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  onChange={handleChangefecha}
                  name="fecha"
                  id="date"
                  label="Fecha de pago"
                  type="date"
                  defaultValue="2020-01"
                  fullWidth
                  variant="outlined"
                  slotProps={{ inputLabel: { shrink: true } }}
                  sx={sxField}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
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
                    slotProps={{ inputLabel: { shrink: true } }}
                    sx={{
                      ...sxField,
                      "& input[type=number]": { MozAppearance: "textfield" },
                      "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
                        { WebkitAppearance: "none", margin: 0 },
                    }}
                  />
                ) : null}
              </Grid>

              {/* WARNING: tiene que estar ADENTRO del container */}
              {warning ? (
                <Grid size={12}>
                  <Typography
                    color="error"
                    sx={{
                      mt: 0.2,
                      fontWeight: 600,
                      background: "transparent",
                      border: "1px solid #e3b5b5",
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
                  borderRadius: 2,
                  p: { xs: 2, md: 2.25 },
                  border: `1px solid ${COLOR_BORDER}`,
                  background: "#fff",
                }}
              >
                <Stack spacing={1.2}>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT }}>
                    Subir comprobante
                  </Typography>

                  <Paper elevation={0} sx={{ ...sxDropzone(isDragActive), borderRadius: 2 }}>
                    <Box sx={{ p: { xs: 2.2, md: 2.6 } }} {...getRootProps()}>
                      <input {...getInputProps()} />

                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: 14,
                          color: COLOR_TEXT,
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
                          color: COLOR_MUTED,
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
                  borderRadius: 2,
                  p: 1.6,
                  border: `1px solid ${COLOR_BORDER}`,
                  background: "#f9fafb",
                  mt: 1.6,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 14,
                    color: COLOR_OK,
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
                    color: COLOR_TEXT,
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {acceptedFileItems}
                </Box>

                <Stack direction="row" spacing={1.2} useFlexGap sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Button variant="outlined" sx={sxBtnPrimary} onClick={handleClose}>
                    Cancelar
                  </Button>

                  <Button variant="contained" sx={sxBtnAccent} onClick={enviar}>
                    {loading ? <CircularProgress color="inherit" size={22} /> : "Enviar"}
                  </Button>
                </Stack>
              </Box>
            ) : (
              <Typography sx={{ fontSize: 12.5, color: COLOR_MUTED, mt: 2 }}>
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
            <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT, mb: 1 }}>
              Cargar montos por cuota
            </Typography>

            <Divider sx={{ mb: 1.5, borderColor: COLOR_BORDER }} />

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
                    fontWeight: 600,
                    fontSize: 14,
                    color: COLOR_OK,
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
                    color: COLOR_TEXT,
                    fontWeight: 500,
                    fontSize: 13,
                  }}
                >
                  {acceptedFileItems}
                </Box>

                <Stack direction="row" spacing={1.2} useFlexGap sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
                  <Button variant="outlined" sx={sxBtnPrimary} onClick={handleClose}>
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
