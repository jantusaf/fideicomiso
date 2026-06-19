import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import servicioCliente from "../../../services/clientes";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Ingreso from "./Ingresos";
import LinearProgress from "@mui/material/LinearProgress";
import Agregarbenefciarios from "./agregarbeneficiarios";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../Assets/marcas.jpg";

const descargarComprobante = (client) => {
  const doc = new jsPDF();

  // Logo
  try {
    doc.addImage(logo, "JPEG", 15, 10, 40, 18);
  } catch (e) {
    console.log(e);
  }

  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("COMPROBANTE DE VERIFICACIÓN RePET", 105, 20, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  doc.text(
    `Fecha de emisión: ${new Date().toLocaleString("es-AR")}`,
    15,
    38
  );

  autoTable(doc, {
    startY: 48,
    theme: "grid",
    head: [["Campo", "Valor"]],
    body: [
      ["Nombre / Razón Social", client.Nombre || ""],
      ["CUIT / CUIL", client.cuil_cuit || ""],
      ["Tipo de Cliente", client.razon || ""],
      ["Actividad Económica", client.actividadEconomica || ""],
      [
        "Resultado de la consulta",
        client.repet === "Si"
          ? "Se registran coincidencias"
          : "No se registran coincidencias",
      ],
      [
        "Fecha de coincidencia",
        client.fecha_repet || "Sin información",
      ],
    ],
  });

  const finalY = doc.lastAutoTable.finalY + 12;

  doc.setFontSize(10);
  doc.text(
    "La presente constancia deja registro de la verificación efectuada",
    15,
    finalY
  );
  doc.text(
    "sobre el Registro Público de Personas y Entidades vinculadas",
    15,
    finalY + 6
  );
  doc.text(
    "a actos de Terrorismo y su Financiamiento.",
    15,
    finalY + 12
  );

  doc.text(
    "Este comprobante refleja el resultado obtenido al momento de la consulta.",
    15,
    finalY + 24
  );

  doc.save(`Comprobante_${client.cuil_cuit}.pdf`);
};
const FichaAxios = (props) => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState([]);
  const [verMas, setVerMas] = useState(false);
  const [editMode, setEditMode] = useState(false);

  function submitFormHandler(event) {
    event.preventDefault();
  }

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const cliente = await servicioCliente.cliente(props.cuil_cuit);
    console.log(cliente);
    setCliente(cliente);
  };

  return (
    <>
      {cliente.map((client) => (
        <Box
          key={client?.id ?? client?.cuil_cuit ?? Math.random()}
          sx={{ width: "100%" }}
        >
          {/* ✅ SIN MAXWIDTH + SIN PADDING LATERAL (quita espacios blancos) */}
          <Container
            maxWidth={false}
            disableGutters
            sx={{
              width: "100%",
              px: 0,
              py: 1,
            }}
          >
            {/* ✅ PAPER A TODO EL ANCHO */}
            <Paper
              elevation={0}
              sx={{
                width: "100%",
                borderRadius: 3,
                border: "1px solid #e8eef5",
                backgroundColor: "#ffffff",
                p: { xs: 2, md: 2.5 },
              }}
            >
              {/* Barra de riesgo */}
              <Box sx={{ width: "100%", mb: 1.5 }}>
                <LinearProgress
                  variant="determinate"
                  value={cliente[0]?.riesgo ?? 0}
                  sx={{
                    width: "100%",
                    height: 10,
                    borderRadius: 99,
                    backgroundColor: "#f3f5f5",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor:
                        (cliente[0]?.riesgo ?? 0) <= 58
                          ? "green"
                          : (cliente[0]?.riesgo ?? 0) <= 70
                            ? "orange"
                            : "red",
                      borderRadius: 99,
                    },
                  }}
                />

                <Typography
                  variant="body2"
                  sx={{
                    mt: 1,
                    fontWeight: 900,
                    color:
                      (cliente[0]?.riesgo ?? 0) <= 58
                        ? "green"
                        : (cliente[0]?.riesgo ?? 0) <= 70
                          ? "orange"
                          : "red",
                    textTransform: "uppercase",
                  }}
                >
                  RIESGO
                  {(cliente[0]?.riesgo ?? 0) <= 58
                    ? " BAJO"
                    : (cliente[0]?.riesgo ?? 0) <= 70
                      ? " MEDIO"
                      : " ALTO"}{" "}
                  ( {cliente[0]?.riesgo}% )
                </Typography>

                {cliente[0]?.razon === "Persona" && (
                  <Typography sx={{ fontWeight: 800, mt: 0.2 }}>
                    Edad:{" "}
                    <span style={{ fontWeight: 600 }}>
                      {cliente[0]?.edad}
                    </span>
                  </Typography>
                )}

                {cliente[0]?.pep_extranjero === "Si" && (
                  <Typography sx={{ color: "crimson", fontWeight: 900, mt: 0.6 }}>
                    PEP Extranjero
                  </Typography>
                )}

                {cliente[0]?.categoria_especial === "Si" && (
                  <Typography sx={{ color: "crimson", fontWeight: 900, mt: 0.2 }}>
                    Categoría Especial
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 1.5 }} />

              <Typography sx={{ fontWeight: 950, color: "#1f2a33", mb: 1.4 }}>
                Datos personales del cliente
              </Typography>

              {/* ✅ INPUTS MÁS CORTOS: 3 POR FILA EN md, 4 POR FILA EN lg */}
              <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
                <Grid item xs={12} md={4} lg={3}>
                  <TextField
                    label="Nombre y apellido"
                    fullWidth
                    defaultValue={client.Nombre || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4} lg={2}>
                  <TextField
                    label="CUIT"
                    fullWidth
                    defaultValue={client.cuil_cuit || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                <Grid item xs={12} md={4} lg={1}>
                  <TextField
                    label="Tipo de Cliente"
                    fullWidth
                    defaultValue={client.razon || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Si querés que Actividad Económica sea más ancha, la dejo en lg=6 */}
                <Grid item xs={12} md={12} lg={6}>
                  <TextField
                    label="Actividad Económica"
                    fullWidth
                    defaultValue={client.actividadEconomica || ""}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 1.2, display: "flex", justifyContent: "flex-start" }}>
                <Button
                  sx={{
                    textTransform: "none",
                    fontWeight: 900,
                    color: "#01567c",
                    borderRadius: 2,
                  }}
                  onClick={() => setVerMas(!verMas)}
                >
                  {verMas ? "Ver menos" : "Ver más"}
                </Button>
              </Box>

              {verMas && (
                <>
                  <Divider sx={{ my: 2 }} />

                  <Typography sx={{ fontWeight: 950, color: "#1f2a33", mb: 1.4 }}>
                    Información adicional
                  </Typography>

                  {/* ✅ también más compactos */}
                  <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
                    <Grid item xs={12} md={4} lg={3}>
                      <TextField
                        label="Código Postal"
                        fullWidth
                        defaultValue={client.cp || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4} lg={2}>
                      {client.razon === "Persona" ? (
                        <TextField
                          label="Fecha de nacimiento"
                          fullWidth
                          defaultValue={client.FechaNacimiento || ""}
                          InputProps={{ readOnly: true }}
                        />
                      ) : (
                        <TextField
                          label="Antigüedad"
                          fullWidth
                          defaultValue={client.antiguedad || ""}
                          InputProps={{ readOnly: true }}
                        />
                      )}
                    </Grid>

                    <Grid item xs={12} md={4} lg={3}>
                      <TextField
                        label="Teléfono"
                        fullWidth
                        defaultValue={client.telefono || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={12} md={4} lg={2}>
                      <TextField
                        label="ID"
                        fullWidth
                        defaultValue={client.id || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>

                    <Grid item xs={2}>
                      <TextField
                        label="Volumen Transaccional"
                        fullWidth
                        defaultValue={client.volumenTransaccional || ""}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography sx={{ fontWeight: 950, color: "#1f2a33", mb: 1.4 }}>
                    Beneficiarios
                  </Typography>

                  {client.beneficiarios !== "No" && (
                    <Grid container spacing={2} sx={{ width: "100%", m: 0 }}>
                      <Grid item xs={12} md={4} lg={3}>
                        <TextField
                          label="Beneficiario 1"
                          fullWidth
                          value={client.beneficiario1}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4} lg={3}>
                        <TextField
                          label="CUIL Beneficiario 1"
                          fullWidth
                          value={client.cuilbeneficiario1}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      <Grid item xs={12} md={4} lg={3}>
                        <TextField
                          label="Porcentaje 1"
                          fullWidth
                          value={client.porcentaje1 + "%"}
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>

                      {client.beneficiario2 !== "No" && (
                        <>
                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="Beneficiario 2"
                              fullWidth
                              value={client.beneficiario2}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="CUIL Beneficiario 2"
                              fullWidth
                              value={client.cuilbeneficiario2}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="Porcentaje 2"
                              fullWidth
                              value={client.porcentaje2 + "%"}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </>
                      )}

                      {client.beneficiario3 && client.beneficiario3 !== "No" && (
                        <>
                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="Beneficiario 3"
                              fullWidth
                              value={client.beneficiario3}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="CUIL Beneficiario 3"
                              fullWidth
                              value={client.cuilbeneficiario3}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>

                          <Grid item xs={12} md={4} lg={3}>
                            <TextField
                              label="Porcentaje 3"
                              fullWidth
                              value={client.porcentaje3 + "%"}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                        </>
                      )}
                    </Grid>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Agregarbenefciarios
                      id={client.id}
                      traer={async () => {
                        const cliente = await servicioCliente.cliente(props.cuil_cuit);
                        setCliente(cliente);
                      }}
                    />
                  </Box>
                </>
              )}

              {/* botones */}
              <Box sx={{ mt: 3 }}>
                {editMode ? (
                  <Box sx={{ display: "flex", gap: 1.2, justifyContent: "flex-end" }}>
                    <Button
                      variant="outlined"
                      sx={{ borderRadius: 2, textTransform: "none", fontWeight: 900 }}
                      onClick={() => setEditMode(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="contained"
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 900,
                        backgroundColor: "#148d8d",
                        "&:hover": { backgroundColor: "#0f7a7a" },
                      }}
                    >
                      Enviar
                    </Button>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end", // ✅ derecha
                      alignItems: "center",
                      gap: 1.2,
                      flexWrap: "wrap",
                      width: "100%", // ✅ ocupa todo el ancho para poder alinear
                    }}
                  >
                    <Button
                       variant="contained"
                      sx={{
                        mb: 2,
                        px: 2.2,
                        py: 1.1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        backgroundColor: "#01567c",
                        boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
                        "&:hover": { backgroundColor: "#014a6b" },
                      }}  onClick={() =>
                        navigate("/usuario2/asignarloteausuario/" + props.cuil_cuit)
                      }
                    >
                      Asignar lote
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        px: 2.2,
                        py: 1.1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        backgroundColor: "#01567c",
                        boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
                        "&:hover": { backgroundColor: "#014a6b" },
                      }}
                      onClick={() => navigate("/usuario2/legajoscliente/" + props.cuil_cuit)}
                    >
                      Ir a legajos
                    </Button>

                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        px: 2.2,
                        py: 1.1,
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 700,
                        backgroundColor: "#01567c",
                        boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
                        "&:hover": { backgroundColor: "#014a6b" },
                      }}
                      onClick={() => navigate("/usuario2/modificarcliente/" + props.cuil_cuit)}
                    >
                      Modificar cliente
                    </Button>
<Button
  variant="contained"
  sx={{
    mb: 2,
    px: 2.2,
    py: 1.1,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 700,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.25)",
    "&:hover": { backgroundColor: "#014a6b" },
  }}
  onClick={() => descargarComprobante(client)}
>
  Descargar comprobante Repet
</Button>
                    <Ingreso
                      traer={async () => {
                        const cliente = await servicioCliente.cliente(props.cuil_cuit);
                        setCliente(cliente);
                      }}
                    />
                  </Box>
                )
                }
              </Box>
            </Paper>
          </Container>
        </Box>
      ))}
    </>
  );
};

export default FichaAxios;
