import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Alert,
  Button,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import Cargadetabla from "../../CargaDeTabla";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, sxCard, sxBtnOutlined } from "../detalleclienteIngresos/estilos";

import LotesCliente from "../../LotesCliente";
import InfoCliente from "../detalleclienteIngresos/FichaAxios";
import servicioCliente from "../../../services/clientes";
import Ingreso from "../detalleclienteIngresos/Ingresos";
import PEP from "../detalleclienteIngresos/DeterminarPep";
import Cuotas from "../cuotasic3/tabla";

const DetalleCliente = () => {
  const navigate = useNavigate();
  const { cuil_cuit } = useParams();

  const [cliente, setCliente] = useState();
  const [idd, setIdd] = useState();
  const [habilitado, setHabilitado] = useState(false);
  const [carga, setCarga] = useState(true);
  const [expuesta, setExpuesta] = useState(false);

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const clientee = await servicioCliente.clientehabilitadoic3(cuil_cuit);

    setIdd(clientee[0][clientee[0].length - 1]);
    setCliente(clientee[1]);

    if (clientee[0][0].habilitado === "Si") setHabilitado(true);
    if (clientee[0][0].expuesta === "SI") setExpuesta(true);

    setCarga(false);
  };

  if (carga) return <Cargadetabla />;

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
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
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
                <PersonOutlineRoundedIcon sx={{ color: COLOR_ACCENT }} />
              </Box>

              <Box>
                <Stack direction="row" spacing={1.25} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}>
                    Cliente IC3
                  </Typography>
                  <Chip
                    size="small"
                    variant="outlined"
                    color={habilitado ? "success" : "error"}
                    label={habilitado ? "Habilitado" : "No habilitado"}
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip
                    size="small"
                    variant="outlined"
                    color={expuesta ? "warning" : "default"}
                    label={expuesta ? "Persona PEP" : "Persona no PEP"}
                    sx={{ fontWeight: 600 }}
                  />
                </Stack>
                <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                  CUIT/CUIL <b style={{ color: COLOR_TEXT }}>{cuil_cuit}</b>
                  {cliente?.cuil_cuit ? (
                    <>
                      {" · "}
                      {habilitado ? "Habilitado" : "Revisado"} por {cliente.cuil_cuit}
                      {cliente?.fecha ? `, el día ${cliente.fecha}` : ""}
                    </>
                  ) : null}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
              <PEP cuil_cuit={cuil_cuit} />

              {idd && (
                <Button
                  variant="outlined"
                  onClick={() => navigate("/usuario2/actualizarcomporbantes/" + cuil_cuit)}
                  sx={sxBtnOutlined}
                >
                  Actualizar comprobantes
                </Button>
              )}
            </Stack>
          </Stack>

          {!habilitado && (
            <Alert severity="error" sx={{ mt: 2, borderRadius: 1.5 }}>
              Cliente no habilitado por <b>{cliente.cuil_cuit}</b>, el día {cliente.fecha}. No se puede asignar lote.
            </Alert>
          )}
        </Paper>

        {habilitado && (
          <>
            <Alert severity="success" sx={{ borderRadius: 1.5 }}>
              Cliente habilitado por <b>{cliente.cuil_cuit}</b>, el día {cliente.fecha}
            </Alert>

            <Box>
              <Ingreso />
            </Box>

            <LotesCliente cuil_cuit={cuil_cuit} />
          </>
        )}

        {/* DATOS DEL CLIENTE */}
        <InfoCliente cuil_cuit={cuil_cuit} />

        {/* CUOTAS */}
        {cuil_cuit && (
          <Paper elevation={0} sx={{ ...sxCard, p: { xs: 1, md: 2 }, overflow: "hidden", width: 0, minWidth: "100%" }}>
            <Box sx={{ width: "100%", overflowX: "auto" }}>
              <Box sx={{ minWidth: 1100 }}>
                <Cuotas cuil_cuit={cuil_cuit} />
              </Box>
            </Box>
          </Paper>
        )}
      </Stack>
    </Box>
  );
};

export default DetalleCliente;
