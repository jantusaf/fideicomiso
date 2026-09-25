import React, { useCallback, useState, useEffect, Fragment } from "react";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, sxBtnPrimary as sxBtnPrimaryBase, sxBtnOutlined as sxBtnOutlinedBase, slotPropsDialog } from "../detalleclienteIngresos/estilos";
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

                    <Divider sx={{ borderColor: COLOR_BORDER }} />

                    {/* FECHA + MONTO */}
                    <Grid container spacing={2} sx={{ alignItems: "stretch", mt: 1.5 }}>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          onChange={handleChange}
                          name="fecha"
                          id="date"
                          label="Fecha de pago"
                          type="date"
                          fullWidth
                          variant="outlined"
                          slotProps={{ inputLabel: { shrink: true } }}
                          sx={sxField}
                        />


                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
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
                            slotProps={{ inputLabel: { shrink: true } }}
                            sx={sxField}
                          />

                        ) : null}
                      </Grid>
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
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT }}>
                              Subir comprobante
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
                          borderRadius: 2,
                          p: 1.6,
                          border: `1px solid ${COLOR_BORDER}`,
                          background: "#f9fafb",
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
                            {loading ? (
                              <CircularProgress color="inherit" size={22} />
                            ) : (
                              "Enviar"
                            )}
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
