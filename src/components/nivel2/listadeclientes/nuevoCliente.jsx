import * as React from 'react';
import { useParams } from "react-router-dom";
import { useState } from "react";
import servicioCliente from '../../../services/clientes';
import {
  Button,
  TextField,
  NativeSelect,
  InputLabel,
  Paper,
  Backdrop,
  CircularProgress,
  Typography,
  Box,
  Divider,
  Grid
} from '@mui/material';

export default function ClienteNuevo({ getClients }) {
  let { cuil_cuit } = useParams();

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formCompleto =
    form.Nombre &&
    form.razon &&
    form.cuil_cuit &&
    form.domicilio &&
    form.telefono &&
    form.observaciones;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formCompleto) return;

    setLoading(true);
    try {
      const resultado = await servicioCliente.crear(form);
      alert(resultado);
      getClients();
      setForm({});
    } catch (error) {
      console.error(error);
    
    }
    setLoading(false);
  };

  // ✅ solo estilos (frontend)
  const sxInput = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fbfdff",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#cfd8e3",
    },
    "& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "rgba(1,86,124,0.55)",
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#01567c",
      boxShadow: "0 0 0 3px rgba(1,86,124,0.12)",
    },
    "& .MuiInputLabel-root": {
      fontWeight: 800,
      color: "#2b3a42",
    },
  };

  return (
    <Box
      sx={{
        py: 3,
        px: { xs: 1.5, sm: 2 },
        background:
          "radial-gradient(1000px 450px at 10% 0%, rgba(1,86,124,0.14), transparent 55%), radial-gradient(900px 420px at 90% 10%, rgba(20,141,141,0.10), transparent 45%), #f4f8fb",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 980,
          mx: 'auto',
          borderRadius: 4,
          overflow: "hidden",
          border: "1px solid rgba(1,86,124,0.12)",
          backgroundColor: "#ffffff",
          boxShadow: "0 18px 45px rgba(10,59,79,0.10)",
        }}
      >
        {/* HEADER (tipo banner, estilo tu modelo) */}
        <Box
          sx={{
            px: { xs: 2.2, md: 3 },
            py: { xs: 2, md: 2.4 },
            color: "#fff",
            background: "linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)",
          }}
        >
          <Typography sx={{ fontWeight: 900, letterSpacing: 0.4, lineHeight: 1.1, fontSize: 20 }}>
            Solicitud de Alta de Cliente
          </Typography>

          <Typography sx={{ opacity: 0.9, mt: 0.7, fontSize: 13.5 }}>
            Complete la siguiente información para registrar un nuevo cliente en el sistema.
          </Typography>
        </Box>

        {/* BODY */}
        <Box sx={{ backgroundColor: "#f4f8fb", p: { xs: 2, md: 2.4 } }}>
          <Paper
            elevation={0}
            sx={{
              backgroundColor: "#ffffff",
              borderRadius: 3,
              border: "1px solid #e8eef5",
              p: { xs: 2, md: 2.4 },
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* DATOS */}
              <Box sx={{ mb: 1.8 }}>
                <Typography sx={{ fontWeight: 900, color: "#0a3b4f", mb: 0.6 }}>
                  Datos del Cliente
                </Typography>
                <Divider sx={{ borderColor: "rgba(1,86,124,0.10)" }} />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                   
                  <TextField
                    label="Nombre / Razón Social"
                    name="Nombre"
                    value={form.Nombre || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="dense"
                    sx={sxInput}
                  />
                </Grid>
                  <Grid item xs={12} md={6}>
                  <TextField
                    label="CUIL / CUIT"
                    name="cuil_cuit"
                    value={form.cuil_cuit || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="dense"
                    sx={sxInput}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <InputLabel
                    sx={{ mb: 0.5, fontWeight: 900, color: "#2b3a42" }}
                  >
                    Tipo de Cliente
                  </InputLabel>

                  <Box
                    sx={{
                      border: "1px solid #cfd8e3",
                      borderRadius: 2,
                      backgroundColor: "#fbfdff",
                      px: 1.2,
                      py: 1.3,
                      "&:focus-within": {
                        borderColor: "#01567c",
                        boxShadow: "0 0 0 3px rgba(1,86,124,0.12)",
                      },
                    }}
                  >
                    <NativeSelect
                      name="razon"
                      value={form.razon || ''}
                      onChange={handleChange}
                      fullWidth
                      disableUnderline
                      sx={{
                        width: "100%",
                        fontSize: 16,
                        color: "#1f2a33",
                      }}
                    >
                      <option value="">Seleccionar</option>
                      <option value="Empresa">Empresa</option>
                      <option value="Persona">Persona</option>
                    </NativeSelect>
                  </Box>

                  <Typography sx={{ fontSize: 12, mt: 0.6, color: "rgba(31,42,51,0.65)", fontWeight: 600 }}>
                    Elija si corresponde a empresa o persona
                  </Typography>
                </Grid>

              

                <Grid item xs={12} md={6}>
                   <InputLabel
                    sx={{ fontWeight: 900, color: "#2b3a42" }}
                  >Telefono
                  </InputLabel>
                  <TextField
                    label="Teléfono"
                    name="telefono"
                    value={form.telefono || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="dense"
                    sx={sxInput}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Domicilio"
                    name="domicilio"
                    value={form.domicilio || ''}
                    onChange={handleChange}
                    fullWidth
                    required
                    margin="dense"
                    sx={sxInput}
                  />
                </Grid>
              </Grid>

              {/* OBSERVACIONES */}
              <Box sx={{ mt: 2.2 }}>
                <Typography sx={{ fontWeight: 900, color: "#0a3b4f", mb: 0.6 }}>
                  Observaciones
                </Typography>
                <Divider sx={{ mb: 1.3, borderColor: "rgba(1,86,124,0.10)" }} />

                <TextField
                  name="observaciones"
                  value={form.observaciones || ''}
                  onChange={handleChange}
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Ingrese cualquier observación relevante"
                  margin="dense"
                  sx={sxInput}
                />
              </Box>

              {/* FOOTER ACCIÓN */}
              <Box
                sx={{
                  mt: 2.4,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                {/* estado visual (solo UI) */}
                <Box
                  sx={{
                    px: 1.2,
                    py: 0.75,
                    borderRadius: 2,
                    backgroundColor: formCompleto ? "rgba(20,141,141,0.10)" : "rgba(211,47,47,0.08)",
                    border: formCompleto ? "1px solid rgba(20,141,141,0.22)" : "1px solid rgba(211,47,47,0.18)",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: 800,
                      color: formCompleto ? "#0f7a7a" : "#b71c1c",
                    }}
                  >
                    {formCompleto ? "Formulario completo" : "Complete todos los campos"}
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  disabled={!formCompleto || loading}
                  sx={{
                    minWidth: 220,
                    px: 2.2,
                    py: 1.05,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 900,
                    backgroundColor: formCompleto ? "#01567c" : "rgba(1,86,124,0.30)",
                    boxShadow: formCompleto ? "0 10px 25px rgba(1,86,124,0.25)" : "none",
                    "&:hover": {
                      backgroundColor: formCompleto ? "#014a6b" : "rgba(1,86,124,0.30)",
                    },
                  }}
                >
                  Registrar Cliente
                </Button>
              </Box>
            </form>
          </Paper>
        </Box>

        {/* LOADING */}
        <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={loading}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress color="inherit" />
            <Box>
              <Typography sx={{ fontWeight: 900 }}>Guardando información...</Typography>
              <Typography sx={{ opacity: 0.9, fontSize: 13 }}>Por favor espere</Typography>
            </Box>
          </Box>
        </Backdrop>
      </Paper>
    </Box>
  );
}
