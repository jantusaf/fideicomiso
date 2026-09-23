import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import servicioCliente from "../../../services/clientes";
import { Box, Chip, Collapse, LinearProgress, Paper, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./profile.css";
import Ingreso from "./Ingresos";
import Agregarbenefciarios from "./agregarbeneficiarios";
import Divider from "@mui/material/Divider";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../../Assets/marcas.jpg";
import {
  COLOR_TEXT,
  COLOR_MUTED,
  COLOR_BORDER,
  sxCard,
  sxBtnPrimary,
  sxBtnOutlined,
} from "./estilos";

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

// Dato de solo lectura: etiqueta chica arriba, valor abajo (no parece un campo editable)
const Dato = ({ label, value }) => {
  const texto = value === undefined || value === null ? "" : String(value).trim();
  return (
    <Box>
      <Typography variant="caption" sx={{ color: COLOR_MUTED, fontWeight: 600, display: "block", mb: 0.25 }}>
        {label}
      </Typography>
      <Typography sx={{ color: COLOR_TEXT, fontWeight: 600, wordBreak: "break-word" }}>
        {texto || "—"}
      </Typography>
    </Box>
  );
};

const Seccion = ({ children }) => (
  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: COLOR_TEXT, mb: 1.75 }}>
    {children}
  </Typography>
);

const nivelDeRiesgo = (riesgo) => {
  const r = Number(riesgo) || 0;
  if (r <= 58) return { texto: "Riesgo bajo", color: "success" };
  if (r <= 70) return { texto: "Riesgo medio", color: "warning" };
  return { texto: "Riesgo alto", color: "error" };
};

// Beneficiario válido: tiene valor y no es el marcador "No"
const hayBeneficiario = (valor) => !!valor && String(valor).trim() !== "" && valor !== "No";

const FichaAxios = (props) => {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState([]);
  const [verMas, setVerMas] = useState(false);

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const cliente = await servicioCliente.cliente(props.cuil_cuit);
    setCliente(cliente);
  };

  const recargar = async () => {
    const cliente = await servicioCliente.cliente(props.cuil_cuit);
    setCliente(cliente);
  };

  return (
    <>
      {cliente.map((client) => {
        const riesgo = nivelDeRiesgo(client?.riesgo);
        const beneficiarios = [1, 2, 3]
          .map((n) => ({
            n,
            nombre: client[`beneficiario${n}`],
            cuil: client[`cuilbeneficiario${n}`],
            porcentaje: client[`porcentaje${n}`],
          }))
          .filter((b) => hayBeneficiario(b.nombre));

        return (
          <Paper
            key={client?.id ?? client?.cuil_cuit}
            elevation={0}
            sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}
          >
            {/* Título + riesgo */}
            <Stack
              direction={{ xs: "column", sm: "row" }}
             
             
              spacing={2}
              sx={{ alignItems: { sm: "center" }, justifyContent: "space-between", mb: 2.5 }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                  Datos del cliente
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap", mt: 0.75 }}>
                  {client?.razon === "Persona" && client?.edad ? (
                    <Chip size="small" variant="outlined" label={`Edad: ${client.edad}`} />
                  ) : null}
                  {client?.pep_extranjero === "Si" && (
                    <Chip size="small" color="error" variant="outlined" label="PEP extranjero" />
                  )}
                  {client?.categoria_especial === "Si" && (
                    <Chip size="small" color="error" variant="outlined" label="Categoría especial" />
                  )}
                </Stack>
              </Box>

              <Box sx={{ minWidth: { sm: 220 } }}>
                <Stack direction="row" sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                  <Chip size="small" color={riesgo.color} variant="outlined" label={riesgo.texto} sx={{ fontWeight: 600 }} />
                  <Typography variant="body2" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                    {client?.riesgo ?? 0}%
                  </Typography>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  color={riesgo.color}
                  value={Math.min(Number(client?.riesgo) || 0, 100)}
                  sx={{ height: 6, borderRadius: 99, backgroundColor: "#eef1f3" }}
                />
              </Box>
            </Stack>

            {/* Datos principales */}
            <Grid container spacing={2.5}>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Dato label="Nombre y apellido" value={client.Nombre} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Dato label="CUIT" value={client.cuil_cuit} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                <Dato label="Tipo de cliente" value={client.razon} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, md: 12, lg: 4 }}>
                <Dato label="Actividad económica" value={client.actividadEconomica} />
              </Grid>
            </Grid>

            <Button
              onClick={() => setVerMas(!verMas)}
              endIcon={
                <ExpandMoreRoundedIcon
                  sx={{ transition: "transform .2s", transform: verMas ? "rotate(180deg)" : "none" }}
                />
              }
              sx={{ textTransform: "none", fontWeight: 600, color: COLOR_TEXT, mt: 1.5, ml: -1 }}
            >
              {verMas ? "Ver menos" : "Ver más"}
            </Button>

            <Collapse in={verMas} unmountOnExit>
              <Divider sx={{ my: 2, borderColor: COLOR_BORDER }} />

              <Seccion>Información adicional</Seccion>
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <Dato label="Código postal" value={client.cp} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  {client.razon === "Persona" ? (
                    <Dato label="Fecha de nacimiento" value={client.FechaNacimiento} />
                  ) : (
                    <Dato label="Antigüedad" value={client.antiguedad} />
                  )}
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                  <Dato label="Teléfono" value={client.telefono} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <Dato label="ID" value={client.id} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }}>
                  <Dato label="Volumen transaccional" value={client.volumenTransaccional} />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2.5, borderColor: COLOR_BORDER }} />

              <Seccion>Beneficiarios</Seccion>
              {beneficiarios.length > 0 ? (
                <Grid container spacing={2.5}>
                  {beneficiarios.map((b) => (
                    <React.Fragment key={b.n}>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Dato label={`Beneficiario ${b.n}`} value={b.nombre} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Dato label={`CUIL beneficiario ${b.n}`} value={b.cuil} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <Dato label={`Porcentaje ${b.n}`} value={b.porcentaje !== undefined && b.porcentaje !== null ? `${b.porcentaje}%` : ""} />
                      </Grid>
                    </React.Fragment>
                  ))}
                </Grid>
              ) : (
                <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                  Sin beneficiarios cargados.
                </Typography>
              )}

              <Box sx={{ mt: 2 }}>
                <Agregarbenefciarios id={client.id} traer={recargar} />
              </Box>
            </Collapse>

            {/* Acciones */}
            <Divider sx={{ mt: 3, mb: 2.5, borderColor: COLOR_BORDER }} />
            <Stack direction="row" spacing={1.25} useFlexGap sx={{ justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={sxBtnPrimary}
                onClick={() => navigate("/usuario2/asignarloteausuario/" + props.cuil_cuit)}
              >
                Asignar lote
              </Button>
              <Button
                variant="outlined"
                sx={sxBtnOutlined}
                onClick={() => navigate("/usuario2/legajoscliente/" + props.cuil_cuit)}
              >
                Ir a legajos
              </Button>
              <Button
                variant="outlined"
                sx={sxBtnOutlined}
                onClick={() => navigate("/usuario2/modificarcliente/" + props.cuil_cuit)}
              >
                Modificar cliente
              </Button>
              <Button variant="outlined" sx={sxBtnOutlined} onClick={() => descargarComprobante(client)}>
                Descargar comprobante Repet
              </Button>
              <Ingreso traer={recargar} />
            </Stack>
          </Paper>
        );
      })}
    </>
  );
};

export default FichaAxios;
