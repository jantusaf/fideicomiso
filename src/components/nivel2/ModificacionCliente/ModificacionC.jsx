import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useParams } from "react-router-dom";
import actividades from "./actividades.json";
import servicioCliente from "../../../services/clientes";
import codigosp from "./codigop.json";
import nacionalidadjson from "./nacionalidad.json";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Empresaocliente from "./EmpresaoCliente";
import jsPDF from "jspdf";
import logo from "../../../Assets/marcas.jpg";
import autoTable from "jspdf-autotable";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { COLOR_TEXT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary, sxBtnOutlined } from "../detalleclienteIngresos/estilos";

// Etiqueta fija arriba de cada campo (mismo patrón que "Pagar cuota")
const Campo = ({ label, children }) => (
  <Box sx={{ width: "100%" }}>
    <Typography
      variant="caption"
      sx={{ display: "block", mb: 0.5, ml: 0.25, fontWeight: 600, color: "text.secondary" }}
    >
      {label}
    </Typography>
    {children}
  </Box>
);

// Valor de solo lectura (no parece un campo editable)
const DatoLectura = ({ label, value }) => (
  <Box sx={{ width: "100%" }}>
    <Typography variant="caption" sx={{ display: "block", mb: 0.5, ml: 0.25, fontWeight: 600, color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography sx={{ color: COLOR_TEXT, fontWeight: 600, py: 0.9, px: 0.25 }}>
      {value === undefined || value === null || value === "" ? "—" : value}
    </Typography>
  </Box>
);

const Seccion = ({ children }) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLOR_TEXT, mb: 2 }}>
    {children}
  </Typography>
);

// Tipos de empresa con su nivel de riesgo. Son los mismos que usa el cálculo de
// riesgo del backend (routes/funciones/riesgo.js); antes el desplegable solo
// ofrecía 3 y los clientes con otro tipo (ej. S.R.L.) quedaban con el campo vacío.
const TIPOS_EMPRESA = [
  ["Consorcios de Propietarios", 3],
  ["Sociedad Anónima", 3],
  ["Sociedad de Hecho", 3],
  ["Sociedad de Responsabilidad Limitada", 3],
  ["Sociedad en comandita por acciones", 3],
  ["Sociedad en comandita Simple", 3],
  ["Sociedad Irregular", 3],
  ["Sociedad Unipersonal", 3],
  ["Sociedades cooperativas de trabajo", 3],
  ["Sociedades de garantía recíproca (SGR)", 3],
  ["Asociaciones Civiles", 5],
  ["Cooperativas", 5],
  ["Embajadas", 5],
  ["Entidades sindicales", 5],
  ["Fideicomisos", 5],
  ["Fundación", 5],
  ["Mutuales", 5],
  ["Organizaciones sin fines de lucro - Otros", 5],
  ["Sociedad Anónima Simplificada", 5],
  ["Entes Autarquicos", 5],
  ["La Iglesia Católica", 5],
  ["SAPEM (participación estatal mayoritaria)", 5],
  ["Sector Público Nacional, Provincial o Municipal", 5],
];

const TIPOS_PERSONA = [
  ["Persona Humana", 1],
  ["Persona Humana con Actividad Comercial", 3],
];

// Mismos valores que ya ofrecía esta pantalla. Si un cliente tiene guardado otro valor
// (dato heredado, ej. "Mayor a 21 años."), conActual lo muestra tal cual sin modificarlo.
const ANTIGUEDADES = [
  "Mayor a 21 años",
  "Entre 11 y 20 años",
  "Entre 6 y 10 años",
  "Entre 2 y 5 años",
  "Menor o igual a 1 año",
];

// Si el cliente tiene guardado un valor que no está en la lista (dato heredado),
// se agrega como opción para no perderlo ni mostrar el campo vacío.
const conActual = (valores, actual) =>
  actual && !valores.includes(actual) ? [...valores, actual] : valores;

const ModificacionC = () => {
  const [cliente, setCliente] = useState([]);
  const [modificaciones, setModificaciones] = useState({});
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [search, setSearch] = useState("");
  const [cpManual, setCpManual] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const { cuil_cuit } = useParams();

  const opcionesSMVM = [
    { rango: "0 A 15 SMVM", valor: 1 },
    { rango: "MAYOR DE 15 A 30 SMVM", valor: 2 },
    { rango: "MAYOR DE 30 A 45 SMVM", valor: 3 },
    { rango: "MAYOR DE 45 A 60 SMVM", valor: 4 },
    { rango: "MAYOR DE 60 SMVM", valor: 5 },
  ];
  const SMVM = 296832;

  const calcularRiesgo = (valor) => {
    const vecesSMVM = valor / SMVM;

    if (cliente[0].razon === "Persona") {
      if (vecesSMVM <= 15) return 1;
      if (vecesSMVM <= 30) return 2;
      if (vecesSMVM <= 45) return 3;
      if (vecesSMVM <= 60) return 4;
      return 5;
    } else if (cliente[0].razon === "Empresa") {
      if (vecesSMVM <= 30) return 1;
      if (vecesSMVM <= 60) return 2;
      if (vecesSMVM <= 90) return 3;
      if (vecesSMVM <= 120) return 4;
      return 5;
    }
  };
const descargarPDF = async () => {
  const doc = new jsPDF();
  const datos = cliente[0];
  const logoBase64 = await getBase64Image(logo);

  // ===== Paleta =====
  const BRAND = [1, 86, 124];      // azul institucional
  const INK = [33, 43, 54];        // texto principal
  const MUTED = [120, 132, 144];   // texto secundario
  const LINE = [228, 234, 240];    // líneas / bordes suaves
  const SOFT = [246, 249, 252];    // fondos suaves

  const pageW = 210;
  const margin = 14;
  const contentW = pageW - margin * 2;

  let nivelRiesgo = "BAJO";
  let colorRiesgo = [22, 163, 74];   // verde
  if (datos.riesgo > 58 && datos.riesgo <= 70) {
    nivelRiesgo = "MEDIO";
    colorRiesgo = [234, 151, 0];     // ámbar
  } else if (datos.riesgo > 70) {
    nivelRiesgo = "ALTO";
    colorRiesgo = [220, 38, 38];     // rojo
  }

  // ===== Helpers =====
  const sectionTitle = (text, y) => {
    doc.setFillColor(...BRAND);
    doc.roundedRect(margin, y - 3.6, 3, 4.6, 1, 1, "F");
    doc.setFont(undefined, "bold");
    doc.setFontSize(12);
    doc.setTextColor(...INK);
    doc.text(text, margin + 6, y);
  };

  const infoTable = (startY, body) =>
    autoTable(doc, {
      startY,
      theme: "grid",
      styles: {
        fontSize: 9.5,
        cellPadding: 2.8,
        lineColor: LINE,
        lineWidth: 0.1,
        textColor: INK,
        valign: "middle",
      },
      columnStyles: {
        0: {
          cellWidth: 58,
          fontStyle: "bold",
          textColor: BRAND,
          fillColor: SOFT,
        },
        1: { textColor: INK },
      },
      body,
    });

  // ===== CABECERA (logo sobre fondo blanco) =====
  doc.addImage(logoBase64, "JPEG", pageW - margin - 44, 11, 44, 18);

  doc.setFont(undefined, "bold");
  doc.setFontSize(22);
  doc.setTextColor(...BRAND);
  doc.text("Perfil del Cliente", margin, 22);

  doc.setFont(undefined, "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(...MUTED);
  doc.text(`Emitido: ${new Date().toLocaleDateString("es-AR")}`, margin, 28);

  // línea de acento bajo la cabecera
  doc.setDrawColor(...BRAND);
  doc.setLineWidth(0.8);
  doc.line(margin, 33, pageW - margin, 33);
  doc.setLineWidth(0.1);

  let y = 44;

  // ===== DATOS GENERALES =====
  sectionTitle("DATOS GENERALES", y);
  y += 5;

  infoTable(y, [
    ["Nombre", datos.Nombre || ""],
    ["CUIT/CUIL", datos.cuil_cuit || ""],
    ["Tipo Cliente", datos.razon || ""],
    ...(datos.razon === "Persona"
      ? [
          ["Edad", datos.edad || ""],
          ["Tipo Cliente", datos.tipoCliente || ""],
        ]
      : [
          ["Antigüedad", datos.antiguedad || ""],
          ["Tipo Cliente Empresa", datos.tipoClienteEmpresa || ""],
        ]),
    ["Domicilio", datos.domicilio || ""],
    ["Email", datos.email || ""],
    ["Teléfono", datos.telefono || ""],
  ]);

  y = doc.lastAutoTable.finalY + 12;

  // ===== INFORMACIÓN COMPLEMENTARIA =====
  sectionTitle("INFORMACIÓN COMPLEMENTARIA", y);
  y += 5;

  infoTable(y, [
    ["Nacionalidad", datos.nacionalidad || ""],
    ["Actividad Económica", datos.actividadEconomica || ""],
    ["Código Postal", datos.cp || ""],
    ["Volumen Transaccional", datos.volumenTransaccional || ""],
    ["PEP Extranjero", datos.pep_extranjero || ""],
    ["Categoría Especial", datos.categoria_especial || ""],
  ]);

  y = doc.lastAutoTable.finalY + 14;

  // ===== EVALUACIÓN DE RIESGO =====
  sectionTitle("EVALUACIÓN DE RIESGO", y);
  y += 6;

  const cardH = 32;
  doc.setFillColor(...SOFT);
  doc.setDrawColor(...LINE);
  doc.roundedRect(margin, y, contentW, cardH, 3, 3, "FD");

  const inner = margin + 7;

  // etiqueta
  doc.setFont(undefined, "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("NIVEL DE RIESGO", inner, y + 9);

  // nivel (color)
  doc.setFont(undefined, "bold");
  doc.setFontSize(15);
  doc.setTextColor(...colorRiesgo);
  doc.text(nivelRiesgo, inner, y + 18);

  // porcentaje grande a la derecha
  doc.setFontSize(22);
  doc.text(`${datos.riesgo}%`, pageW - margin - 7, y + 16, { align: "right" });

  // barra de progreso proporcional
  const barX = inner;
  const barY = y + 24;
  const barW = contentW - 14;
  const barH = 3.6;
  doc.setFillColor(...LINE);
  doc.roundedRect(barX, barY, barW, barH, 1.8, 1.8, "F");

  const pct = Math.max(0, Math.min(100, Number(datos.riesgo) || 0)) / 100;
  doc.setFillColor(...colorRiesgo);
  doc.roundedRect(barX, barY, Math.max(barW * pct, barH), barH, 1.8, 1.8, "F");

  y += cardH + 14;

  // ===== PIE =====
  doc.setDrawColor(...LINE);
  doc.line(margin, y, pageW - margin, y);
  y += 6;

  doc.setFont(undefined, "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(
    "Documento generado automáticamente por el Sistema de Gestión de Clientes.",
    margin,
    y
  );

  doc.save(`Ficha_${datos.Nombre || datos.cuil_cuit}.pdf`);
};

const getBase64Image = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      resolve(canvas.toDataURL("image/jpeg"));
    };

    img.onerror = reject;
    img.src = url;
  });
};


  const filteredOptions = actividades.filter((opcion) =>
    opcion.actividad.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOptions2 = codigosp.filter((opcion) =>
    opcion.codigo.toLowerCase().includes(search.toLowerCase())
  );
  const filteredOptions3 = nacionalidadjson.filter((opcion) =>
    opcion.NACIONALIDAD.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    traerCliente();
  }, []);

  const traerCliente = async () => {
    const clienteResponse = await servicioCliente.cliente(cuil_cuit);
    const client = clienteResponse[0];
    setCliente(clienteResponse);
    // Los datos se conservan tal cual están en la base: guardar desde esta pantalla
    // no debe modificar valores que el usuario no tocó (afectan el cálculo de riesgo).
    setModificaciones({ ...client });
    // La base devuelve la fecha con hora (1969-03-01T03:00:00.000Z); el campo de
    // fecha solo entiende AAAA-MM-DD.
    setFechaNacimiento(String(client.fechaNacimiento || "").slice(0, 10));
  };

  const calcularEdad = (fecha) => {
    const hoy = new Date();
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleFechaNacimientoChange = (newValue) => {
    setFechaNacimiento(newValue);
    if (newValue) {
      const fecha = new Date(newValue);
      setModificaciones({
        ...modificaciones,
        fechaNacimiento: newValue,
        edad: calcularEdad(fecha),
      });
    }
  };

  const handleChange = (e) => {
    console.log(modificaciones);
    setModificaciones({ ...modificaciones, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setAviso(null);
    try {
      if (modificaciones.cp === "OTRAS_ZONAS" && cpManual.trim()) {
        modificaciones.cp = cpManual;
      }
      await servicioCliente.modificarCliente(modificaciones);
      await traerCliente();
      setAviso({ tipo: "success", texto: "Datos actualizados correctamente." });
    } catch (error) {
      console.error("Error al guardar los datos:", error);
      setAviso({
        tipo: "error",
        texto: "No se pudieron guardar los cambios. Revisá los datos e intentá de nuevo.",
      });
    } finally {
      setGuardando(false);
    }
  };

  // ===== Presentación (sistema visual compartido con el resto de la vista de cliente) =====
  const riesgoActual = Number(cliente[0]?.riesgo) || 0;
  const nivelRiesgo =
    riesgoActual <= 58
      ? { texto: "Riesgo bajo", color: "success" }
      : riesgoActual <= 70
        ? { texto: "Riesgo medio", color: "warning" }
        : { texto: "Riesgo alto", color: "error" };

  const sxInput = { "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };
  const grid3 = { xs: 12, sm: 6, lg: 4 };
  const selectProps = { select: { displayEmpty: true } };
  const volumen = Number(modificaciones.volumenTransaccional);

  const opcionSeleccionar = (
    <MenuItem value="" disabled>
      Seleccionar
    </MenuItem>
  );

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      <Stack spacing={2.5}>
        {/* ENCABEZADO */}
        <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
          >
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: COLOR_TEXT, m: 0, pt: 0 }}>
                Modificar cliente
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                CUIT/CUIL <b style={{ color: COLOR_TEXT }}>{cuil_cuit}</b>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", alignItems: "center" }}>
              <Empresaocliente onListo={traerCliente} razonActual={cliente[0]?.razon} />
            </Stack>
          </Stack>
        </Paper>

        {/* RIESGO */}
        {cliente.length > 0 && (
          <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={3}
              sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
            >
              <Box sx={{ flex: 1, maxWidth: 560 }}>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap", mb: 1 }} useFlexGap>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                    Riesgo
                  </Typography>
                  <Chip size="small" variant="outlined" color={nivelRiesgo.color} label={nivelRiesgo.texto} sx={{ fontWeight: 600 }} />
                  {cliente[0].razon === "Persona" && cliente[0].edad ? (
                    <Chip size="small" variant="outlined" label={`Edad: ${cliente[0].edad}`} />
                  ) : null}
                  {cliente[0].pep_extranjero === "Si" && (
                    <Chip size="small" color="error" variant="outlined" label="PEP extranjero" />
                  )}
                  {cliente[0].categoria_especial === "Si" && (
                    <Chip size="small" color="error" variant="outlined" label="Categoría especial" />
                  )}
                  <Typography variant="body2" sx={{ fontWeight: 700, color: COLOR_TEXT, ml: "auto !important" }}>
                    {riesgoActual}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  color={nivelRiesgo.color}
                  value={Math.min(riesgoActual, 100)}
                  sx={{ height: 6, borderRadius: 99, backgroundColor: "#eef1f3" }}
                />
              </Box>

              {/* Referencia de la clasificación */}
              <Stack direction="row" spacing={2.5} useFlexGap sx={{ flexWrap: "wrap" }}>
                {[
                  ["success.main", "Bajo", "1–58 %"],
                  ["warning.main", "Medio", "59–70 %"],
                  ["error.main", "Alto", "71–100 %"],
                ].map(([color, nombre, rango]) => (
                  <Stack key={nombre} direction="row" spacing={0.75} sx={{ alignItems: "center" }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: color }} />
                    <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                      <b style={{ color: COLOR_TEXT }}>{nombre}</b> {rango}
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Paper>
        )}

        {/* FORMULARIO */}
        <form onSubmit={handleGuardar}>
          {modificaciones &&
            cliente.map((client) => (
              <Paper key={client.id} elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
                <Seccion>{client.razon === "Persona" ? "Datos personales" : "Datos de la empresa"}</Seccion>

                <Grid container spacing={2.5}>
                  {/* Nombre y CUIT son de solo lectura: el backend no los actualiza en esta
                      pantalla (el CUIT es además la clave con la que se guarda el resto). */}
                  <Grid size={grid3}>
                    <DatoLectura label="Nombre y apellido" value={String(modificaciones.Nombre ?? "").trim()} />
                  </Grid>

                  <Grid size={grid3}>
                    <DatoLectura label="CUIT" value={modificaciones.cuil_cuit} />
                  </Grid>

                  {client.razon === "Persona" ? (
                    <>
                      <Grid size={grid3}>
                        <Campo label="Fecha de nacimiento">
                          <TextField
                            name="fechaNacimiento"
                            type="date"
                            value={fechaNacimiento || ""}
                            onChange={(e) => handleFechaNacimientoChange(e.target.value)}
                            fullWidth
                            size="small"
                            sx={sxInput}
                          />
                        </Campo>
                      </Grid>

                      <Grid size={grid3}>
                        <DatoLectura label="Edad" value={modificaciones.edad} />
                      </Grid>

                      <Grid size={grid3}>
                        <Campo label="Tipo de cliente">
                          <TextField
                            select
                            name="tipoCliente"
                            value={modificaciones.tipoCliente || ""}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            sx={sxInput}
                            slotProps={selectProps}
                          >
                            {opcionSeleccionar}
                            {conActual(TIPOS_PERSONA.map((t) => t[0]), modificaciones.tipoCliente).map((valor) => {
                              const t = TIPOS_PERSONA.find((x) => x[0] === valor);
                              return (
                                <MenuItem key={valor} value={valor}>
                                  {t ? `${valor} (Riesgo ${t[1]})` : valor}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </Campo>
                      </Grid>
                    </>
                  ) : (
                    <>
                      <Grid size={grid3}>
                        <Campo label="Tipo de cliente empresa">
                          <TextField
                            select
                            name="tipoClienteEmpresa"
                            value={modificaciones.tipoClienteEmpresa || ""}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            sx={sxInput}
                            slotProps={selectProps}
                          >
                            {opcionSeleccionar}
                            {conActual(TIPOS_EMPRESA.map((t) => t[0]), modificaciones.tipoClienteEmpresa).map((valor) => {
                              const t = TIPOS_EMPRESA.find((x) => x[0] === valor);
                              return (
                                <MenuItem key={valor} value={valor}>
                                  {t ? `${valor} (Riesgo ${t[1]})` : valor}
                                </MenuItem>
                              );
                            })}
                          </TextField>
                        </Campo>
                      </Grid>

                      <Grid size={grid3}>
                        <Campo label="Antigüedad">
                          <TextField
                            select
                            name="antiguedad"
                            value={modificaciones.antiguedad || ""}
                            onChange={handleChange}
                            fullWidth
                            size="small"
                            sx={sxInput}
                            slotProps={selectProps}
                          >
                            {opcionSeleccionar}
                            {conActual(ANTIGUEDADES, modificaciones.antiguedad).map((valor) => (
                              <MenuItem key={valor} value={valor}>
                                {valor}
                              </MenuItem>
                            ))}
                          </TextField>
                        </Campo>
                      </Grid>
                    </>
                  )}

                  <Grid size={grid3}>
                    <Campo label="Domicilio">
                      <TextField
                        name="domicilio"
                        value={modificaciones.domicilio ?? ""}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        sx={sxInput}
                      />
                    </Campo>
                  </Grid>

                  <Grid size={grid3}>
                    <Campo label="Correo">
                      <TextField
                        name="email"
                        value={modificaciones.email ?? ""}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        sx={sxInput}
                      />
                    </Campo>
                  </Grid>

                  <Grid size={grid3}>
                    <Campo label="Teléfono">
                      <TextField
                        name="telefono"
                        value={modificaciones.telefono ?? ""}
                        onChange={handleChange}
                        fullWidth
                        size="small"
                        sx={sxInput}
                      />
                    </Campo>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: COLOR_BORDER }} />

                <Seccion>Información complementaria</Seccion>

                <Grid container spacing={2.5}>
                  <Grid size={grid3}>
                    <Campo label="Código postal">
                      <TextField
                        select
                        name="cp"
                        value={modificaciones.cp || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={sxInput}
                        slotProps={selectProps}
                      >
                        {opcionSeleccionar}
                        {codigosp.map((opcion, index) => (
                          <MenuItem key={index} value={opcion.codigo}>
                            {opcion.codigo} (Riesgo: {opcion.riesgo})
                          </MenuItem>
                        ))}
                        <MenuItem value="OTRAS_ZONAS">OTRAS ZONAS RIESGO BAJO - LOCALIDAD RIESGO BAJO</MenuItem>
                      </TextField>
                    </Campo>
                  </Grid>

                  <Grid size={grid3}>
                    <Campo label="Categoría especial">
                      <TextField
                        select
                        name="categoria_especial"
                        value={modificaciones.categoria_especial || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={sxInput}
                        slotProps={selectProps}
                      >
                        {opcionSeleccionar}
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                    </Campo>
                  </Grid>

                  <Grid size={grid3}>
                    <Campo label="PEP extranjero">
                      <TextField
                        select
                        name="pep_extranjero"
                        value={modificaciones.pep_extranjero || ""}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        sx={sxInput}
                        slotProps={selectProps}
                      >
                        {opcionSeleccionar}
                        <MenuItem value="Si">Sí</MenuItem>
                        <MenuItem value="No">No</MenuItem>
                      </TextField>
                    </Campo>
                  </Grid>

                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Campo label="Nacionalidad">
                      <TextField
                        select
                        fullWidth
                        name="nacionalidad"
                        value={modificaciones.nacionalidad || ""}
                        onChange={(e) =>
                          setModificaciones({
                            ...modificaciones,
                            nacionalidad: e.target.value,
                          })
                        }
                        size="small"
                        sx={sxInput}
                        slotProps={selectProps}
                      >
                        {opcionSeleccionar}
                        {filteredOptions3.map((opcion, index) => (
                          <MenuItem key={index} value={opcion.NACIONALIDAD}>
                            {opcion.NACIONALIDAD} (Riesgo: {opcion["NIVEL DE RIESGO"]})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Campo>
                  </Grid>

                  <Grid size={{ xs: 12, lg: 6 }}>
                    <Campo label="Actividad económica">
                      <TextField
                        select
                        fullWidth
                        name="actividadEconomica"
                        value={modificaciones.actividadEconomica || ""}
                        onChange={(e) =>
                          setModificaciones({
                            ...modificaciones,
                            actividadEconomica: e.target.value,
                          })
                        }
                        size="small"
                        sx={sxInput}
                        slotProps={selectProps}
                      >
                        {opcionSeleccionar}
                        {filteredOptions.map((opcion, index) => (
                          <MenuItem key={index} value={opcion.actividad}>
                            {opcion.actividad} (Riesgo: {opcion.riesgo})
                          </MenuItem>
                        ))}
                      </TextField>
                    </Campo>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3, borderColor: COLOR_BORDER }} />

                <Seccion>Volumen transaccional</Seccion>

                <Grid container spacing={2.5} sx={{ alignItems: "flex-start" }}>
                  <Grid size={grid3}>
                    <Campo label="Volumen transaccional">
                      <TextField
                        name="volumenTransaccional"
                        value={modificaciones.volumenTransaccional ?? ""}
                        onChange={(e) => {
                          handleChange(e);
                          const nuevoValor = e.target.value;
                          if (!isNaN(nuevoValor) && nuevoValor !== "") {
                            const riesgoCalculado = calcularRiesgo(Number(nuevoValor));
                            setModificaciones((prev) => ({
                              ...prev,
                              riesgoCalculado: riesgoCalculado,
                            }));
                          }
                        }}
                        fullWidth
                        size="small"
                        sx={sxInput}
                        helperText={
                          modificaciones.volumenTransaccional && Number.isFinite(volumen)
                            ? `Equivale a ${(volumen / SMVM).toFixed(2)} SMVM`
                            : "Monto en pesos, sin puntos ni comas."
                        }
                        slotProps={{
                          input: { startAdornment: <Typography sx={{ mr: 1, color: "text.secondary" }}>$</Typography> },
                          htmlInput: { inputMode: "numeric" },
                        }}
                      />
                    </Campo>
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6, lg: 8 }}>
                    <Stack direction="row" spacing={1.5} useFlexGap sx={{ flexWrap: "wrap", pt: { sm: 2.6 } }}>
                      <Chip
                        variant="outlined"
                        label={`Salario mínimo (SMVM): $ ${SMVM.toLocaleString("es-AR")}`}
                        sx={{ fontWeight: 600 }}
                      />
                      {modificaciones.riesgoCalculado && (
                        <Chip
                          variant="outlined"
                          color="primary"
                          label={`Riesgo calculado: ${modificaciones.riesgoCalculado}`}
                          sx={{ fontWeight: 600 }}
                        />
                      )}
                    </Stack>
                  </Grid>
                </Grid>

                <Divider sx={{ mt: 3, mb: 2.5, borderColor: COLOR_BORDER }} />

                {aviso && (
                  <Alert severity={aviso.tipo} sx={{ mb: 2, borderRadius: 1.5 }} onClose={() => setAviso(null)}>
                    {aviso.texto}
                  </Alert>
                )}

                <Stack direction="row" spacing={1.25} sx={{ justifyContent: "flex-end", flexWrap: "wrap" }} useFlexGap>
                  <Button variant="outlined" onClick={descargarPDF} sx={sxBtnOutlined}>
                    Descargar PDF
                  </Button>
                  <Button type="submit" variant="contained" disabled={guardando} sx={sxBtnPrimary}>
                    {guardando ? <CircularProgress size={20} color="inherit" /> : "Guardar"}
                  </Button>
                </Stack>
              </Paper>
            ))}
        </form>
      </Stack>
    </Box>
  );
};

export default ModificacionC;
