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
const ModificacionC = () => {
  const [cliente, setCliente] = useState([]);
  const [modificaciones, setModificaciones] = useState({});
  const [fechaNacimiento, setFechaNacimiento] = useState(null);
  const [search, setSearch] = useState("");
  const [cpManual, setCpManual] = useState("");
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


  let nivelRiesgo = "BAJO";
  let colorRiesgo = [34, 139, 34];

  if (datos.riesgo > 58 && datos.riesgo <= 70) {
    nivelRiesgo = "MEDIO";
    colorRiesgo = [255, 140, 0];
  } else if (datos.riesgo > 70) {
    nivelRiesgo = "ALTO";
    colorRiesgo = [220, 20, 60];
  }

  // CABECERA
  doc.setFillColor(1, 86, 124);
  doc.rect(0, 0, 210, 28, "F");
doc.addImage(
  logoBase64,
  "JPEG",
  160, // izquierda-derecha
  4,   // arriba-abajo
  45,  // ancho
  18   // alto
);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text("Perfil del Cliente", 14, 18);

  doc.setFontSize(10);
  doc.text(
    `Emitido: ${new Date().toLocaleDateString("es-AR")}`,
    14,
    25
  );

  doc.setTextColor(0, 0, 0);

  let y = 40;

  doc.setFontSize(13);
  doc.setFont(undefined, "bold");
  doc.text("DATOS GENERALES", 14, y);

  y += 6;

  autoTable(doc, {
    startY: y,
    theme: "grid",
    styles: {
      fontSize: 10,
    },
    body: [
      ["Nombre", datos.Nombre || ""],
      ["CUIT/CUIL", datos.cuil_cuit || ""],
      ["Tipo Cliente", datos.razon || ""],
      ["Domicilio", datos.domicilio || ""],
      ["Email", datos.email || ""],
      ["Teléfono", datos.telefono || ""],
    ],
  });

  y = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(13);
  doc.text("INFORMACIÓN COMPLEMENTARIA", 14, y);

  autoTable(doc, {
    startY: y + 4,
    theme: "striped",
    body: [
      ["Nacionalidad", datos.nacionalidad || ""],
      ["Actividad Económica", datos.actividadEconomica || ""],
      ["Código Postal", datos.cp || ""],
      ["Volumen Transaccional", datos.volumenTransaccional || ""],
      ["PEP Extranjero", datos.pep_extranjero || ""],
      ["Categoría Especial", datos.categoria_especial || ""],
    ],
  });

  y = doc.lastAutoTable.finalY + 15;

  doc.setFontSize(13);
  doc.text("EVALUACIÓN DE RIESGO", 14, y);

  y += 10;

  doc.setFillColor(...colorRiesgo);
  doc.roundedRect(14, y, 180, 18, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);

  doc.text(
    `Nivel de Riesgo: ${nivelRiesgo} (${datos.riesgo}%)`,
    20,
    y + 12
  );

  doc.setTextColor(0, 0, 0);

  y += 35;

  doc.setDrawColor(180);
  doc.line(14, y, 195, y);

  y += 10;

  doc.setFontSize(9);
  doc.setTextColor(100);

  doc.text(
    "Documento generado automáticamente por el Sistema de Gestión de Clientes.",
    14,
    y
  );

  doc.save(
    `Ficha_${datos.Nombre || datos.cuil_cuit}.pdf`
  );
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
    setModificaciones({ ...client });
    setFechaNacimiento(client.fechaNacimiento || "1990-01-01");
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
    try {
      if (modificaciones.cp === "OTRAS_ZONAS" && cpManual.trim()) {
        modificaciones.cp = cpManual;
      }
      await servicioCliente.modificarCliente(modificaciones);
      traerCliente();
      alert("Datos actualizados correctamente");
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  // ✅ estilos unificados (solo frontend)
  const sxPage = {
    py: 3,
    background:
      "radial-gradient(1100px 520px at 10% 0%, rgba(1,86,124,0.14), transparent 55%), radial-gradient(900px 420px at 90% 10%, rgba(20,141,141,0.10), transparent 45%), #f4f8fb",
    minHeight: "100vh",
  };

  const sxHeader = {
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid rgba(1,86,124,0.12)",
    boxShadow: "0 18px 45px rgba(10,59,79,0.10)",
    background: "linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)",
    color: "#fff",
    px: 3,
    py: 2.4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 2,
  };

  const sxCard = {
    borderRadius: 3,
    border: "1px solid #e8eef5",
    boxShadow: "0 18px 45px rgba(10,59,79,0.08)",
    overflow: "hidden",
  };

  const sxSection = {
    borderRadius: 3,
    border: "1px solid #e8eef5",
    backgroundColor: "#fff",
    p: 2.5,
  };

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

  const sxPrimaryBtn = {
    px: 2.2,
    py: 1.05,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 900,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.22)",
    "&:hover": { backgroundColor: "#014a6b" },
  };

  // ✅ helper para 3 columnas en pantallas grandes
  const grid3 = { xs: 12, sm: 6, lg: 4 }; // 1 col (xs) / 2 col (sm-md) / 3 col (lg+)

  return (
    <Box sx={sxPage}>
      <Container maxWidth="xl">
        <Box sx={sxHeader}>
          <Box>
            <Typography sx={{ fontWeight: 900, letterSpacing: 0.4, fontSize: 18 }}>
              Cliente
            </Typography>
            <Typography sx={{ opacity: 0.92, mt: 0.4, fontSize: 13.5, fontWeight: 700 }}>
              CUIT/CUIL: {cuil_cuit}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Empresaocliente />
          </Box>
        </Box>

        {/* CARD RIESGO */}
        {cliente.length > 0 && (
          <Card sx={{ ...sxCard, mt: 2, p: 2, backgroundColor: "#ffffff", width: "100%" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box sx={{ minWidth: 260, flex: 1 }}>
                <Typography sx={{ fontWeight: 900, color: "#0a3b4f", mb: 1 }}>
                  Riesgo
                </Typography>

                <LinearProgress
                  variant="determinate"
                  value={cliente[0].riesgo}
                  sx={{
                    height: 10,
                    borderRadius: 999,
                    backgroundColor: "#eef3f7",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      backgroundColor:
                        cliente[0].riesgo <= 58
                          ? "green"
                          : cliente[0].riesgo <= 70
                          ? "orange"
                          : "red",
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: 900,
                    textTransform: "uppercase",
                    color:
                      cliente[0].riesgo <= 58
                        ? "green"
                        : cliente[0].riesgo <= 70
                        ? "orange"
                        : "red",
                  }}
                >
                  {cliente[0].riesgo <= 58
                    ? "Riesgo Bajo"
                    : cliente[0].riesgo <= 70
                    ? "Riesgo Medio"
                    : "Riesgo Alto"}{" "}
                  ( {cliente[0].riesgo}% )
                </Typography>

                {cliente[0].razon === "Persona" && (
                  <Typography sx={{ mt: 0.6, fontWeight: 800, color: "#0a3b4f" }}>
                    Edad:{" "}
                    <span style={{ fontWeight: 700, color: "rgba(10,59,79,0.75)" }}>
                      {cliente[0].edad}
                    </span>
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "flex-end" }}>
                {cliente[0].pep_extranjero === "Si" && (
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.7,
                      borderRadius: 2,
                      backgroundColor: "rgba(211,47,47,0.08)",
                      border: "1px solid rgba(211,47,47,0.18)",
                      color: "crimson",
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    PEP Extranjero
                  </Box>
                )}

                {cliente[0].categoria_especial === "Si" && (
                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.7,
                      borderRadius: 2,
                      backgroundColor: "rgba(211,47,47,0.08)",
                      border: "1px solid rgba(211,47,47,0.18)",
                      color: "crimson",
                      fontWeight: 900,
                      fontSize: 13,
                    }}
                  >
                    Categoría Especial
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        )}

        {/* FORM */}
        <form onSubmit={handleGuardar}>
          {modificaciones &&
            cliente.map((client) => (
              // ✅ MISMO ANCHO QUE RIESGO
              <Container key={client.id} maxWidth={false} disableGutters sx={{ mt: 2, mb: 4 }}>
                <Card sx={{ ...sxCard, backgroundColor: "#ffffff", width: "100%" }}>
                  <CardContent sx={{ p: { xs: 2, md: 2.6 } }}>
                    <Box sx={{ mb: 2 }}>
                      <Typography sx={{ fontWeight: 900, color: "#0a3b4f", fontSize: 16 }}>
                        Datos personales del cliente
                      </Typography>
                      <Divider sx={{ mt: 1.2, borderColor: "rgba(1,86,124,0.10)" }} />
                    </Box>

                    <Grid container spacing={2}>
                      {/* ✅ Izquierda inputs más ancha / Derecha más angosta */}
                      <Grid item xs={12} lg={9}>
                        <Box sx={sxSection}>
                          <Grid container spacing={2}>
                            <Grid item {...grid3}>
                              <TextField
                                label="Nombre y apellido"
                                name="Nombre"
                                defaultValue={client.Nombre || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                label="Cuit"
                                name="cuil_cuit"
                                defaultValue={client.cuil_cuit || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />
                            </Grid>

                       {client.razon === "Persona" ? (
  <>
    <Grid item {...grid3}>
      <TextField
        label="Fecha nacimiento"
        name="fechaNacimiento"
        type="date"
        value={fechaNacimiento || "1990-01-01"}
        onChange={(e) => handleFechaNacimientoChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth
        size="small"
        sx={sxInput}
      />
    </Grid>

    <Grid item {...grid3}>
      <TextField
        label="Edad"
        value={modificaciones.edad || ""}
        InputProps={{
          readOnly: true,
        }}
        fullWidth
        size="small"
        sx={sxInput}
      />
    </Grid>

    <Grid item {...grid3}>
      <TextField
        select
        label="Tipo de Cliente"
        name="tipoCliente"
        value={modificaciones.tipoCliente || ""}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={sxInput}
      >
        <MenuItem value="Persona Humana">
          Persona Humana (Riesgo 1)
        </MenuItem>

        <MenuItem value="Persona Humana con Actividad Comercial">
          Persona Humana con Actividad Comercial (Riesgo 3)
        </MenuItem>
      </TextField>
    </Grid>
  </>
) : (
  <>
    <Grid item {...grid3}>
      <TextField
        select
        label="Tipo de Cliente Empresa"
        name="tipoClienteEmpresa"
        value={modificaciones.tipoClienteEmpresa || ""}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={sxInput}
      >
        <MenuItem value="Consorcios de Propietarios">
          Consorcios de Propietarios
        </MenuItem>

        <MenuItem value="Sociedad Anónima">
          Sociedad Anónima
        </MenuItem>

        <MenuItem value="Sociedad de Hecho">
          Sociedad de Hecho
        </MenuItem>

        {/* resto de opciones */}
      </TextField>
    </Grid>

    <Grid item {...grid3}>
      <TextField
        select
        label="Antigüedad"
        name="antiguedad"
        value={modificaciones.antiguedad || ""}
        onChange={handleChange}
        fullWidth
        size="small"
        sx={sxInput}
      >
        <MenuItem value="Mayor a 21 años">
          Mayor a 21 años
        </MenuItem>

        <MenuItem value="Entre 11 y 20 años">
          Entre 11 y 20 años
        </MenuItem>

        <MenuItem value="Entre 6 y 10 años">
          Entre 6 y 10 años
        </MenuItem>

        <MenuItem value="Entre 2 y 5 años">
          Entre 2 y 5 años
        </MenuItem>

        <MenuItem value="Menor o igual a 1 año">
          Menor o igual a 1 año
        </MenuItem>
      </TextField>
    </Grid>
  </>
)}

                            <Grid item {...grid3}>
                              <TextField
                                label="Domicilio"
                                name="domicilio"
                                defaultValue={client.domicilio || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                label="Correo"
                                name="email"
                                defaultValue={client.email || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                label="Teléfono"
                                name="telefono"
                                defaultValue={client.telefono || ""}
                                onChange={handleChange}
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />
                            </Grid>

                            {/* CP + flags (3 columnas en lg) */}
                            <Grid item {...grid3}>
                              <TextField
                                select
                                label="Código Postal"
                                name="cp"
                                value={modificaciones.cp || ""}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={sxInput}
                              >
                                {codigosp.map((opcion, index) => (
                                  <MenuItem key={index} value={opcion.codigo}>
                                    {opcion.codigo} (Riesgo: {opcion.riesgo})
                                  </MenuItem>
                                ))}
                                <MenuItem value="OTRAS_ZONAS">
                                  OTRAS ZONAS RIESGO BAJO - LOCALIDAD RIESGO BAJO
                                </MenuItem>
                              </TextField>
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                select
                                label="Categoría especial"
                                name="categoria_especial"
                                value={modificaciones.categoria_especial || ""}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={sxInput}
                              >
                                <MenuItem value="Si">Si</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                select
                                label="Pep Extranjero"
                                name="pep_extranjero"
                                value={modificaciones.pep_extranjero || ""}
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                sx={sxInput}
                              >
                                <MenuItem value="Si">Si</MenuItem>
                                <MenuItem value="No">No</MenuItem>
                              </TextField>
                            </Grid>

                            {/* Estos ocupan todo el ancho */}
                            <Grid item xs={12}>
                              <TextField
                                select
                                fullWidth
                                label="Nacionalidad"
                                name="nacionalidad"
                                value={modificaciones.nacionalidad || ""}
                                onChange={(e) =>
                                  setModificaciones({
                                    ...modificaciones,
                                    nacionalidad: e.target.value,
                                  })
                                }
                                variant="outlined"
                                margin="normal"
                                size="small"
                                sx={{ ...sxInput, mt: 0 }}
                              >
                                {filteredOptions3.map((opcion, index) => (
                                  <MenuItem key={index} value={opcion.NACIONALIDAD}>
                                    {opcion.NACIONALIDAD} (Riesgo: {opcion["NIVEL DE RIESGO"]})
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            <Grid item xs={12}>
                              <TextField
                                select
                                fullWidth
                                label="Seleccionar actividad"
                                name="actividadEconomica"
                                value={modificaciones.actividadEconomica || ""}
                                onChange={(e) =>
                                  setModificaciones({
                                    ...modificaciones,
                                    actividadEconomica: e.target.value,
                                  })
                                }
                                variant="outlined"
                                margin="normal"
                                size="small"
                                sx={{ ...sxInput, mt: 0 }}
                              >
                                {filteredOptions.map((opcion, index) => (
                                  <MenuItem key={index} value={opcion.actividad}>
                                    {opcion.actividad} (Riesgo: {opcion.riesgo})
                                  </MenuItem>
                                ))}
                              </TextField>
                            </Grid>

                            <Grid item xs={12}>
                              <Box
                                sx={{
                                  px: 1.2,
                                  py: 1,
                                  borderRadius: 2,
                                  backgroundColor: "rgba(1,86,124,0.06)",
                                  border: "1px solid rgba(1,86,124,0.10)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                <Typography sx={{ fontWeight: 900, color: "#0a3b4f" }}>
                                  SALARIO MINIMO:
                                </Typography>
                                <Typography sx={{ fontWeight: 900, color: "#01567c" }}>
                                  {SMVM.toLocaleString("es-AR")}
                                </Typography>
                              </Box>
                            </Grid>

                            <Grid item {...grid3}>
                              <TextField
                                label="Volumen Transaccional"
                                name="volumenTransaccional"
                                value={modificaciones.volumenTransaccional || ""}
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
                                variant="outlined"
                                fullWidth
                                size="small"
                                sx={sxInput}
                              />

                              {modificaciones.volumenTransaccional && (
                                <Typography
                                  sx={{
                                    mt: 0.7,
                                    fontWeight: 800,
                                    color: "rgba(10,59,79,0.75)",
                                    fontSize: 13,
                                  }}
                                >
                                  Equivale a {(modificaciones.volumenTransaccional / SMVM).toFixed(2)}{" "}
                                  SMVM
                                </Typography>
                              )}
                            </Grid>

                            {modificaciones.riesgoCalculado && (
                              <Grid item {...grid3}>
                                <Box
                                  sx={{
                                    height: "100%",
                                    borderRadius: 2,
                                    border: "1px solid rgba(1,86,124,0.10)",
                                    backgroundColor: "#fbfdff",
                                    p: 1.4,
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography sx={{ fontWeight: 900, color: "#0a3b4f" }}>
                                    Riesgo Calculado:&nbsp;
                                    <span style={{ color: "#01567c" }}>
                                      Riesgo {modificaciones.riesgoCalculado}
                                    </span>
                                  </Typography>
                                </Box>
                              </Grid>
                            )}
                          </Grid>
                        </Box>
                      </Grid>

                      {/* Derecha - Clasificación */}
                      <Grid item xs={12} lg={3}>
                        <Box sx={{ ...sxSection, height: "100%" }}>
                          <Typography sx={{ fontWeight: 900, color: "#0a3b4f", mb: 1 }}>
                            CLASIFICACIÓN DE RIESGO
                          </Typography>
                          <Divider sx={{ mb: 1.4, borderColor: "rgba(1,86,124,0.10)" }} />

                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box width={12} height={12} borderRadius={999} bgcolor="green" />
                            <Typography fontSize={14} sx={{ fontWeight: 800, color: "rgba(10,59,79,0.85)" }}>
                              Bajo <small>(1–58) %</small>
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box width={12} height={12} borderRadius={999} bgcolor="orange" />
                            <Typography fontSize={14} sx={{ fontWeight: 800, color: "rgba(10,59,79,0.85)" }}>
                              Medio <small>(59–70) %</small>
                            </Typography>
                          </Box>

                          <Box display="flex" alignItems="center" gap={1}>
                            <Box width={12} height={12} borderRadius={999} bgcolor="red" />
                            <Typography fontSize={14} sx={{ fontWeight: 800, color: "rgba(10,59,79,0.85)" }}>
                              Alto <small>(71–100) %</small>
                            </Typography>
                          </Box>

                          <Box
                            sx={{
                              mt: 2,
                              px: 1.2,
                              py: 1,
                              borderRadius: 2,
                              backgroundColor: "rgba(20,141,141,0.10)",
                              border: "1px solid rgba(20,141,141,0.22)",
                            }}
                          >
                            <Typography sx={{ fontWeight: 900, color: "#0f7a7a", fontSize: 13 }}>
                              Consejo: mantener datos y comprobantes actualizados.
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      {/* GUARDAR */}
                      <Grid item xs={12}>
                        <Box display="flex" justifyContent="flex-end" sx={{ mt: 1 }}>
                          <Button type="submit" variant="contained" sx={sxPrimaryBtn}>
                            GUARDAR
                          </Button>
                          <Button
  variant="contained"
  color="success"
  onClick={descargarPDF}
  sx={{
    ml: 1,
    borderRadius: 2,
    fontWeight: 900,
    textTransform: "none",
  }}
>
  DESCARGAR PDF
</Button>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Container>
            ))}
        </form>
      </Container>
    </Box>
  );
};

export default ModificacionC;
