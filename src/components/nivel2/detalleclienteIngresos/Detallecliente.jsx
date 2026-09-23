import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LotesCliente from "../../LotesCliente";
import InfoCliente from "./FichaAxios";
import servicioCliente from "../../../services/clientes";
import PEP from "./DeterminarPep";
import Cargadetabla from "../../CargaDeTabla";

import { Alert, Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, sxCard, sxBtnOutlined, sxBtnPrimary } from "./estilos";

const DetalleCliente = () => {
  const navigate = useNavigate();
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [cliente, setCliente] = useState({});
  const [habilitado, sethabilitado] = useState(false);
  const [carga, setCarga] = useState(true);
  const [expuesta, setExpuesta] = useState(false);

  useEffect(() => {
    traer();
  }, []);

  const traer = async () => {
    const clientee = await servicioCliente.clientehabilitado(cuil_cuit);
    setCliente(clientee[1]);

    if (clientee[0][0].habilitado == "Si") sethabilitado(true);
    else sethabilitado(false);

    if (clientee[0][0].expuesta == "SI") setExpuesta(true);
    else setExpuesta(false);

    setCarga(false);
  };

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      {!carga ? (
        <Stack spacing={2.5}>
          {/* ENCABEZADO */}
          <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={2} sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                      Cliente
                    </Typography>
                    <Chip
                      size="small"
                      variant="outlined"
                      color={habilitado ? "success" : "error"}
                      label={habilitado ? "Habilitado" : "No habilitado"}
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
                <PEP
                  cuil_cuit={cuil_cuit}
                  getData={async () => {
                    const clientee = await servicioCliente.clientehabilitado(cuil_cuit);
                    setCliente(clientee[1]);

                    if (clientee[0][0].habilitado == "Si") sethabilitado(true);
                    else sethabilitado(false);

                    if (clientee[0][0].expuesta == "SI") setExpuesta(true);
                    else setExpuesta(false);

                    setCarga(false);
                  }}
                />

                <Button
                  variant="outlined"
                  onClick={() => navigate("/usuario2/actualizarcomporbantes/" + cuil_cuit)}
                  sx={sxBtnOutlined}
                >
                  Actualizar comprobantes
                </Button>

                {!habilitado ? (
                  <Button
                    variant="contained"
                    onClick={() => navigate("/usuario2/legajoscliente/" + cuil_cuit)}
                    sx={sxBtnPrimary}
                  >
                    Ir a legajos
                  </Button>
                ) : null}
              </Stack>
            </Stack>

            {!habilitado ? (
              <Alert severity="warning" sx={{ mt: 2, borderRadius: 1.5 }}>
                No se puede asignar lote a un cliente no habilitado. Andá a <b>Legajos</b> para habilitarlo.
              </Alert>
            ) : null}
          </Paper>

          {/* DATOS DEL CLIENTE */}
          <InfoCliente cuil_cuit={cuil_cuit} />

          {/* LOTE Y CUADRO DE CUOTAS (solo si está habilitado) */}
          {habilitado ? <LotesCliente cuil_cuit={cuil_cuit} /> : null}
        </Stack>
      ) : (
        <Cargadetabla />
      )}
    </Box>
  );
};

export default DetalleCliente;
