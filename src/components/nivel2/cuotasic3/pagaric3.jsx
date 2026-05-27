import React, { useCallback, useState, useEffect, Fragment } from "react";
import Box from "@mui/material/Box";
import {
  Button,
  CircularProgress,
  Paper,
  TextField,
  Toolbar,
  Dialog,
  DialogContent,
  Typography,
  Divider,
  Stack,
  Card,
  Grid,
  MenuItem,
} from "@mui/material";

import servicioPagos from "../../../services/pagos";
import servicioCuotas from "../../../services/cuotas";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import Tooltip from "@mui/material/Tooltip";
import BackupIcon from "@mui/icons-material/Backup";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import servicioUsuario1 from "../../../services/usuario1";
import { alpha } from "@mui/material/styles";

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // =========================
  // ESTILOS (mismo lenguaje visual que venís usando)
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

    textTransform: "none",
    fontWeight: 900,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
    "&:hover": { backgroundColor: "#014a6b" },
  };

  const sxBtnAccent = {
    borderRadius: 2,
    px: 2.2,
    py: 1.05,
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

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      multiple: false,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".gif"],
        "application/pdf": [".pdf"],
        "application/msword": [".doc"],
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
          [".docx"],
      },
    });

  const acceptedFileItems = acceptedFiles.map((file) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  // =========================
  // TU LÓGICA (NO TOCADA)
  // =========================
  const designar = async (event) => {
    event.preventDefault();

    const rta = await servicioPagos.pagarnivel2(pago);
    alert(rta[1]);
    navigate("/usuario2/detallecliente/" + rta[0]);
  };

  const traercbu = async () => {
    const cuot = await servicioUsuario1.listacbus(params.cuil_cuit);
    setCbus(cuot);
  };

  const enviar = async () => {
    setLoading(true);
    if (enviarr) {
      enviarr.append("cuil_cuit", pago.cuil_cuit);
      enviarr.append("id_cuota", props.id_cuota);
      enviarr.append("pago", pago.monto);
      enviarr.append("fecha", pago.fecha);
      enviarr.append("cbu", pago.cbu);
      console.log(enviarr);
      try {
        const response = await servicioUsuario1.pagarnivel2ic3(enviarr);
        alert(response);
        console.log("getData");
        props.traer(response[2]);
        setLoading(false);
        handleClose();
      } catch (error) {
        console.error("Error subiendo archivo:", error);
      }
    } else {
      alert("No hay archivo para subir");
    }
  };

  const enviar2 = async () => {
    setLoading(true);
    enviarr.append("datos", [
      pago.cuil_cuit,
      pago.fecha,
      pago.id,
      JSON.stringify(pagosVarios),
    ]);

    const rta = await servicioUsuario1.pagarrapidoic3(enviarr);
    console.log(rta);
    alert(rta[0]);
    navigate("/usuario2/detallecliente/" + rta[1]);
  };

  const handleChange = (e) => {
    console.log(pago);
    setPagos({ ...pago, [e.target.name]: e.target.value });
  };

  const handleChangee = (e) => {
    console.log(eleccion);
    setEleccion({ ...eleccion, [e.target.name]: e.target.value });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setPagos({
        cuil_cuit: user.cuil_cuit,
        id: params.id,
        monto: props.cuota_con_ajuste,
      });
      traercbu();
    }
  };

  const handleChangeVarios = (e) => {
    console.log(pagosVarios);
    setpagosVarios({ ...pagosVarios, [e.target.name]: e.target.value });
  };

  // =========================
  // UI (moderno, consistente)
  // =========================
  return (
    <Box
      component="form" sx={{ display: "inline-flex", alignItems: "center" }} noValidate autoComplete="off"
    >
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
                  <Stack >
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
                        mb: 1.6, // 👈 MÁS aire debajo del helper
                        "& .MuiFormHelperText-root": {
                          mt: 0.6,
                          mb: 0.2,
                        },
                      }}
                    >
                      {cbus.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.lazo}- {option.numero}
                        </MenuItem>
                      ))}
                    </TextField>

                    <Divider sx={{ borderColor: alpha("#0b4f6c", 0.12) }} />

                    {/* FECHA + MONTO */}
                    <Grid container spacing={2} alignItems="stretch">
                      <Grid item xs={12} md={6}>
                        <TextField
                          onChange={handleChange}
                          name="fecha"
                          id="date"
                          label="Fecha de pago"
                          type="date"
                          fullWidth
                          variant="outlined"
                          InputLabelProps={{ shrink: true }}
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              height: 56,
                              borderRadius: 2,
                              background: "rgba(255,255,255,0.92)",
                              boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                              alignItems: "center",
                              "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
                              "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
                              "&.Mui-focused fieldset": { borderColor: "#148D8D", borderWidth: 2 },
                            },
                            "& input": {
                              padding: "16.5px 14px",
                              fontWeight: 800,
                              color: "#0b2b3a",
                            },
                            "& .MuiInputLabel-root": {
                              fontWeight: 800,
                              color: alpha("#0b4f6c", 0.85),
                            },
                          }}
                        />


                      </Grid>

                      <Grid item xs={12} md={6}>
                        {eleccion.tipo === "1" ? (
                          <TextField
                            autoFocus
                            id="name"
                            label="Monto"
                            name="monto"
                            onChange={handleChange}
                            defaultValue={props.cuota_con_ajuste}
                            type="number"
                            variant="outlined"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                height: 56,
                                borderRadius: 2,
                                background: "rgba(255,255,255,0.92)",
                                boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                                alignItems: "center",
                                "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
                                "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
                                "&.Mui-focused fieldset": { borderColor: "#148D8D", borderWidth: 2 },
                              },
                              "& input": {
                                padding: "16.5px 14px",
                                fontWeight: 800,
                                color: "#0b2b3a",
                              },
                              "& .MuiInputLabel-root": {
                                fontWeight: 800,
                                color: alpha("#0b4f6c", 0.85),
                              },
                            }}
                          />

                        ) : null}
                      </Grid>
                    </Grid>


                    {/* COMPROBANTE */}
                    <Box sx={{ mt: 1.5 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          p: { xs: 2, md: 2.25 },
                          border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                          background: "linear-gradient(180deg, rgba(20,141,141,0.05) 0%, #fff 55%)",
                        }}
                      >
                        <Stack spacing={1.2}>
                          <Box>
                            <Typography sx={{ fontWeight: 950, color: "#0a3b4f" }}>
                              SUBIR COMPROBANTE
                            </Typography>
                            <Typography
                              sx={{
                                mt: 0.25,
                                fontWeight: 650,
                                color: alpha("#0b4f6c", 0.78),
                                fontSize: 13,
                              }}
                            >
                            </Typography>
                          </Box>

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
                                (Extensiones aceptadas: .pdf, .doc, .docx, .jpeg, .png, .jpg)
                              </Typography>
                            </Box>
                          </Paper>

                          {/* Mensaje de ayuda con más aire */}
                          <Box
                            sx={{
                              pt: 0.5,
                              fontSize: 12.5,
                              color: alpha("#0b4f6c", 0.75),
                            }}
                          >

                          </Box>
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
                            {loading ? (
                              <CircularProgress color="inherit" size={22} />
                            ) : (
                              "Enviar"
                            )}
                          </Button>
                        </Stack>
                      </Box>
                    ) : (
                      <Typography sx={{ fontSize: 12.5, color: alpha("#0b4f6c", 0.7), mt: 2,}}>
                        Completá <b>CBU</b>, <b>Fecha</b> y <b>Monto</b> para habilitar el envío.
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Card>

              {/* VARIAS CUOTAS (misma lógica, solo estética) */}
              {eleccion.tipo === "varias" ? (
                <Box sx={{ mt: 2 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      ...sxCard,
                      p: 2,
                      background: "#fff",
                    }}
                  >
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
                            {loading ? (
                              <CircularProgress color="inherit" size={22} />
                            ) : (
                              "Enviar varias"
                            )}
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
      </Dialog>
    </Box>
  );
}
