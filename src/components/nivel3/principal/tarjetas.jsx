import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Divider,
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import servicionivel3 from "../../../services/nivel3";
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_OK,
  COLOR_ERROR,
  sxCard,
  sxBtnPrimary,
  sxDialogTitle,
  sxDialogActions,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
  COLOR_BRAND_WARM,
} from "../../nivel2/detalleclienteIngresos/estilos";

const COLOR_WARN = "#ed6c02";

const MainMenu = () => {
  const [open, setOpen] = useState(false);
  const [datos, setDatos] = useState();
  const [form, setForm] = useState({});

  const fecha = new Date();
  const anio = fecha.getFullYear();
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  const mesNombre = meses[fecha.getMonth()];

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const historial = await servicionivel3.traerdatosdetarjetas();
    console.log(historial);
    setDatos(historial);
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSubmit = async () => {
    const historial = await servicionivel3.enviardatosnuevosalario(form);
    alert(historial);
    traer();
    setOpen(false);
  };

  const handleSubmitfalso = () => {
    alert("Completa los campos");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const formatNumber = (num) => new Intl.NumberFormat("es-ES").format(num);

  const salarioActual = datos?.[0]?.[0]?.valor;
  const fechaCarga = datos?.[0]?.[0]?.fecha;
  const iccActual = datos?.[1]?.length > 0 ? datos[1][0].ICC : null;
  const riesgos = datos?.[2] || [];

  const obtenerNivelRiesgo = (tipo = "") => {
    const texto = String(tipo).toLowerCase();

    if (texto.includes("alto") || texto.includes("muy alto") || texto.includes("critico") || texto.includes("crítico")) {
      return "alto";
    }
    if (texto.includes("medio") || texto.includes("moderado") || texto.includes("intermedio")) {
      return "medio";
    }
    return "bajo";
  };

  const colorRiesgo = (tipo = "") => {
    const nivel = obtenerNivelRiesgo(tipo);
    if (nivel === "alto") return COLOR_ERROR;
    if (nivel === "medio") return COLOR_WARN;
    return COLOR_OK;
  };

  const riesgosPersona = riesgos.filter((item) => String(item.tipo).toLowerCase().includes("persona"));
  const riesgosEmpresa = riesgos.filter((item) => String(item.tipo).toLowerCase().includes("empresa"));

  const sxTh = {
    backgroundColor: COLOR_BRAND_SOFT,
    color: COLOR_BRAND,
    fontWeight: 700,
    fontSize: 11.5,
    letterSpacing: 0.4,
    borderBottom: `1px solid ${COLOR_BORDER}`,
    py: 1.25,
  };
  const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.4 };

  const iconCircle = (icon) => (
    <Box
      sx={{
        width: 44,
        height: 44,
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "rgba(13,58,73,0.08)",
        flexShrink: 0,
      }}
    >
      {icon}
    </Box>
  );

  const renderTablaRiesgo = (titulo, lista) => (
    <Box sx={{ border: `1px solid ${COLOR_BORDER}`, borderRadius: 2, overflow: "hidden" }}>
      <Box sx={{ px: 2, py: 1.25, backgroundColor: "#f6f8f9", borderBottom: `1px solid ${COLOR_BORDER}` }}>
        <Typography sx={{ fontWeight: 700, fontSize: 14, color: COLOR_TEXT }}>{titulo}</Typography>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={sxTh}>Categoría</TableCell>
              <TableCell sx={sxTh}>Cantidad</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {datos && lista.length > 0 ? (
              lista.map((pago, index) => {
                const color = colorRiesgo(pago.tipo);
                return (
                  <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{pago.tipo}</TableCell>

                    <TableCell sx={sxTd}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, flexWrap: "wrap" }}>
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${pago.valor} salarios mínimos`}
                          sx={{ fontWeight: 600, color, borderColor: color }}
                        />
                        <Typography sx={{ fontWeight: 600, fontSize: 13.5, color: COLOR_TEXT }}>
                          ({formatNumber(pago.valor * datos[0][0]["valor"])} pesos)
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={2} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                  Sin valores
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      <Box sx={{ mb: 2.5, display: "flex", justifyContent: "flex-end" }}>
        <Chip
          variant="outlined"
          icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18 }} />}
          label={`${mesNombre} ${anio}`}
          sx={{ fontWeight: 600, color: COLOR_TEXT, borderColor: COLOR_BORDER }}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1.1fr 0.9fr" }, gap: 2.5, alignItems: "stretch" }}>
        {/* SALARIO */}
        <Card elevation={0} sx={sxCard}>
          <Box
            sx={{
              px: { xs: 2.5, md: 3 },
              py: 2.5,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 1.5,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {iconCircle(<PaidRoundedIcon sx={{ color: COLOR_ACCENT }} />)}
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                  Salario mínimo, vital y móvil
                </Typography>
                <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                  Valor base configurado actualmente en el sistema
                </Typography>
              </Box>
            </Box>

            <Button variant="contained" onClick={handleOpen} startIcon={<EditRoundedIcon />} sx={sxBtnPrimary}>
              Modificar
            </Button>
          </Box>

          <Divider sx={{ borderColor: COLOR_BORDER }} />

          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
              <Box sx={{ p: 2.25, borderRadius: 2, backgroundColor: "#f6f8f9", border: `1px solid ${COLOR_BORDER}` }}>
                <Typography variant="body2" sx={{ color: COLOR_MUTED, fontWeight: 600 }}>Valor actual</Typography>
                <Typography sx={{ mt: 0.75, fontSize: { xs: "1.7rem", md: "2rem" }, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.1 }}>
                  ${salarioActual ? formatNumber(salarioActual) : "0"}
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: COLOR_MUTED }}>ARS</Typography>
              </Box>

              <Box sx={{ p: 2.25, borderRadius: 2, backgroundColor: "#f6f8f9", border: `1px solid ${COLOR_BORDER}` }}>
                <Typography variant="body2" sx={{ color: COLOR_MUTED, fontWeight: 600 }}>Fecha de carga</Typography>
                <Typography sx={{ mt: 1, fontSize: "1.25rem", fontWeight: 700, color: COLOR_TEXT }}>
                  {fechaCarga || "Sin fecha"}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* ICC */}
        <Card elevation={0} sx={{ ...sxCard, height: "100%" }}>
          <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            {iconCircle(<TrendingUpRoundedIcon sx={{ color: COLOR_ACCENT }} />)}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>ICC</Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                Índice correspondiente al mes actual
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: COLOR_BORDER }} />

          <CardContent sx={{ p: { xs: 2.5, md: 3 }, display: "flex", flexDirection: "column", height: "calc(100% - 90px)" }}>
            <Box
              sx={{
                p: 2.25,
                borderRadius: 2,
                backgroundColor: "#f6f8f9",
                border: `1px solid ${COLOR_BORDER}`,
                flexGrow: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="body2" sx={{ color: COLOR_MUTED, fontWeight: 600 }}>Valor ICC</Typography>
                <Typography sx={{ mt: 1, fontSize: { xs: "1.9rem", md: "2.25rem" }, fontWeight: 700, color: COLOR_TEXT, lineHeight: 1.05 }}>
                  {iccActual ? iccActual : "Sin ICC en este mes"}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Divider sx={{ mb: 2, borderColor: COLOR_BORDER }} />
                <Chip variant="outlined" label={`Mes: ${mesNombre} ${anio}`} sx={{ fontWeight: 600, color: COLOR_TEXT, borderColor: COLOR_BORDER }} />
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* RIESGO — ocupa todo el ancho */}
        <Card elevation={0} sx={{ ...sxCard, gridColumn: { xs: "auto", lg: "1 / -1" } }}>
          <Box sx={{ px: { xs: 2.5, md: 3 }, py: 2.5, display: "flex", alignItems: "center", gap: 2 }}>
            {iconCircle(<WarningAmberRoundedIcon sx={{ color: COLOR_ACCENT }} />)}
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>Criterios de riesgo</Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                Separado por persona y empresa, con colores por nivel de riesgo
              </Typography>
            </Box>
          </Box>

          <Divider sx={{ borderColor: COLOR_BORDER }} />

          <CardContent sx={{ p: { xs: 2, md: 3 } }}>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" }, gap: 2.25, alignItems: "start" }}>
              {renderTablaRiesgo("Persona", riesgosPersona)}
              {renderTablaRiesgo("Empresa", riesgosEmpresa)}
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            ...sxCard,
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "92%", sm: 460 },
            outline: "none",
          }}
        >
          <Box sx={sxDialogTitle}>
            <Typography sx={{ fontSize: 17, fontWeight: 700, color: COLOR_TEXT }}>Modificar salario</Typography>
            <Typography sx={{ mt: 0.5, fontSize: 13, color: COLOR_MUTED }}>
              Actualizá el valor y la fecha de carga
            </Typography>
          </Box>

          <Box sx={{ p: 3 }}>
            <Typography sx={{ mb: 0.75, fontWeight: 600, color: COLOR_TEXT, fontSize: 14 }}>
              Nuevo salario
            </Typography>
            <TextField
              type="number"
              fullWidth
              size="small"
              name="valor"
              onChange={handleChange}
              placeholder="Ingrese el nuevo valor"
              sx={{ mb: 2.25, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />

            <Typography sx={{ mb: 0.75, fontWeight: 600, color: COLOR_TEXT, fontSize: 14 }}>
              Fecha
            </Typography>
            <TextField
              type="text"
              fullWidth
              size="small"
              name="fecha"
              onChange={handleChange}
              placeholder="17/02/2024"
              sx={{ mb: 1, "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
            />
          </Box>

          <Box sx={sxDialogActions}>
            {form.valor && form.fecha ? (
              <Button variant="contained" fullWidth onClick={handleSubmit} sx={sxBtnPrimary}>
                Guardar
              </Button>
            ) : (
              <Button variant="contained" fullWidth disabled onClick={handleSubmitfalso} sx={sxBtnPrimary}>
                Completar los datos
              </Button>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default MainMenu;
