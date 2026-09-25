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
  Grid,
  Chip
} from '@mui/material';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, sxCard, sxBtnPrimary } from '../detalleclienteIngresos/estilos';

const Campo = ({ label, children, ayuda }) => (
  <Box>
    <InputLabel sx={{ mb: 0.5, fontSize: 13, fontWeight: 600, color: COLOR_TEXT }}>{label}</InputLabel>
    {children}
    {ayuda && (
      <Typography sx={{ fontSize: 12, mt: 0.5, color: COLOR_MUTED }}>{ayuda}</Typography>
    )}
  </Box>
);


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

  // Solo estilos (frontend): mismo sistema visual que el resto de Nivel 2
  const sxInput = { "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      {/* ENCABEZADO */}
      <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "rgba(13,58,73,0.08)",
              flexShrink: 0,
            }}
          >
            <PersonAddAlt1Icon sx={{ color: COLOR_ACCENT }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
            >
              Alta de cliente
            </Typography>
            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
              Complete la siguiente información para registrar un nuevo cliente en el sistema
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* FORMULARIO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
        <form onSubmit={handleSubmit}>
          <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15 }}>Datos del cliente</Typography>
          <Divider sx={{ mt: 1, mb: 2.5, borderColor: COLOR_BORDER }} />

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Campo label="Nombre / Razón social">
                <TextField
                  name="Nombre"
                  value={form.Nombre || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  sx={sxInput}
                />
              </Campo>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Campo label="CUIL / CUIT">
                <TextField
                  name="cuil_cuit"
                  value={form.cuil_cuit || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  sx={sxInput}
                />
              </Campo>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Campo label="Tipo de cliente" ayuda="Elija si corresponde a empresa o persona">
                <Box
                  sx={{
                    border: "1px solid #c9d2d8",
                    borderRadius: 1.5,
                    px: 1.5,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    "&:hover": { borderColor: COLOR_ACCENT },
                    "&:focus-within": { borderColor: COLOR_ACCENT, boxShadow: `0 0 0 1px ${COLOR_ACCENT}` },
                  }}
                >
                  <NativeSelect
                    name="razon"
                    value={form.razon || ''}
                    onChange={handleChange}
                    fullWidth
                    disableUnderline
                    sx={{ fontSize: 15, color: COLOR_TEXT }}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Empresa">Empresa</option>
                    <option value="Persona">Persona</option>
                  </NativeSelect>
                </Box>
              </Campo>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Campo label="Teléfono">
                <TextField
                  name="telefono"
                  value={form.telefono || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  sx={sxInput}
                />
              </Campo>
            </Grid>

            <Grid size={12}>
              <Campo label="Domicilio">
                <TextField
                  name="domicilio"
                  value={form.domicilio || ''}
                  onChange={handleChange}
                  fullWidth
                  required
                  size="small"
                  sx={sxInput}
                />
              </Campo>
            </Grid>
          </Grid>

          <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15, mt: 3.5 }}>Observaciones</Typography>
          <Divider sx={{ mt: 1, mb: 2, borderColor: COLOR_BORDER }} />

          <TextField
            name="observaciones"
            value={form.observaciones || ''}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            placeholder="Ingrese cualquier observación relevante"
            sx={sxInput}
          />

          {/* ACCIÓN */}
          <Box
            sx={{
              mt: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <Chip
              variant="outlined"
              label={formCompleto ? "Formulario completo" : "Complete todos los campos"}
              sx={{
                fontWeight: 600,
                color: formCompleto ? COLOR_OK : COLOR_MUTED,
                borderColor: formCompleto ? COLOR_OK : COLOR_BORDER,
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={!formCompleto || loading}
              sx={{ ...sxBtnPrimary, minWidth: 200, py: 1 }}
            >
              Registrar cliente
            </Button>
          </Box>
        </form>
      </Paper>

      {/* LOADING */}
      <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={loading}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CircularProgress color="inherit" />
          <Box>
            <Typography sx={{ fontWeight: 700 }}>Guardando información...</Typography>
            <Typography sx={{ opacity: 0.9, fontSize: 13 }}>Por favor espere</Typography>
          </Box>
        </Box>
      </Backdrop>
    </Box>
  );
}
