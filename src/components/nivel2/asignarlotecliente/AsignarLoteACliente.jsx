import React, { useState } from "react";
import servicioClientes from "../../../services/clientes";
import { useParams, useNavigate } from "react-router-dom";

import {
  Box,
  Grid,
  TextField,
  Button,
  FormControl,
  Select,
  MenuItem,
  Typography,
  Paper,
  InputLabel,
  Chip,
  Divider,
} from "@mui/material";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary } from "../detalleclienteIngresos/estilos";

import ModalLote from "./ModalSeguro";

const AsignarLoteACliente = () => {
  const navigate = useNavigate();
  const { cuil_cuit } = useParams();

  const [lotes, setLotes] = useState({
    cuil_cuit: cuil_cuit,
    zona: "IC3",
    fraccion: "IC3",
    estado: "VENDIDO",
    manzana: "",
    parcela: "",
    lote: "",
  });

  const [parque, setParque] = useState(false);

  const designar = async () => {
    console.log(lotes);
    await servicioClientes.ventaLote(lotes);
    navigate("/usuario2/detallecliente/" + cuil_cuit);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setLotes({ ...lotes, [name]: value });
    if (value === "PIT") setParque(true);
    else setParque(false);
  };

  // =========================
  // ESTÉTICA (sin degradés; mismo sistema visual que el resto de Nivel 2)
  // =========================
  const sxField = {
    "& .MuiOutlinedInput-root": { borderRadius: 1.5 },
    "& input[type=number]": { MozAppearance: "textfield" },
    "& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button":
      { WebkitAppearance: "none", margin: 0 },
  };

  return (
    <Box sx={{ maxWidth: 980, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      {/* ENCABEZADO */}
      <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
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
              <MapOutlinedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Asignar lote
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Seleccioná el lote correspondiente a la persona
              </Typography>
            </Box>
          </Box>

          <Chip variant="outlined" label={`CUIT/CUIL: ${cuil_cuit}`} sx={{ fontWeight: 600 }} />
        </Box>
      </Paper>

      {/* FORMULARIO */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
        <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15 }}>Datos del lote</Typography>
        <Typography sx={{ mt: 0.25, fontSize: 13, color: COLOR_MUTED }}>
          Completá la zona, manzana y lote/parcela. Luego elegí fracción y estado.
        </Typography>

        <Divider sx={{ my: 2.5, borderColor: COLOR_BORDER }} />

        <Grid container spacing={2.5}>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Zona</InputLabel>
              <Select name="zona" value={lotes.zona} onChange={handleChange} label="Zona" sx={{ borderRadius: 1.5 }}>
                <MenuItem value="PIT">Parque Industrial</MenuItem>
                <MenuItem value="IC3">IC3</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Estado</InputLabel>
              <Select name="estado" value={lotes.estado} onChange={handleChange} label="Estado" sx={{ borderRadius: 1.5 }}>
                <MenuItem value="VENDIDO">Venta</MenuItem>
                <MenuItem value="RESERVADO">Reservado</MenuItem>
                <MenuItem value="CANJE">Canje</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              size="small"
              variant="outlined"
              type="number"
              label="Manzana"
              name="manzana"
              value={lotes.manzana}
              onChange={handleChange}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              sx={sxField}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            {lotes.zona == "PIT" ? (
              <TextField
                size="small"
                type="number"
                label="Parcela"
                name="parcela"
                value={lotes.parcela}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={sxField}
              />
            ) : (
              <TextField
                size="small"
                label="Lote"
                name="lote"
                value={lotes.lote}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { shrink: true } }}
                sx={sxField}
              />
            )}
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Fracción</InputLabel>
              <Select name="fraccion" value={lotes.fraccion} onChange={handleChange} label="Fracción" sx={{ borderRadius: 1.5 }}>
                <MenuItem value={"ID/4"}>ID/4 (Parque Industrial)</MenuItem>
                <MenuItem value={"A"}>A</MenuItem>
                <MenuItem value={"B"}>B</MenuItem>
                <MenuItem value={"C"}>C</MenuItem>
                <MenuItem value={"D"}>D</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button variant="contained" sx={sxBtnPrimary} onClick={designar}>
            Designar
          </Button>
        </Box>

        <Divider sx={{ my: 3, borderColor: COLOR_BORDER }} />

        {/* Opciones / Seguro */}
        <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, mb: 1.25, fontSize: 14 }}>
          Opciones / Seguro
        </Typography>

        <ModalLote datos={lotes} cuil_cuit={cuil_cuit} />
      </Paper>
    </Box>
  );
};

export default AsignarLoteACliente;
