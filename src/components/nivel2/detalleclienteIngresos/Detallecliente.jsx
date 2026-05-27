import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import LotesCliente from "../../LotesCliente";
import InfoCliente from "./FichaAxios";
import servicioCliente from "../../../services/clientes";
import PEP from "./DeterminarPep";
import Cargadetabla from "../../CargaDeTabla";

import {
  Box,
  Paper,
  Typography,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import Alert from "@mui/material/Alert";

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
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        backgroundColor: "#f4f8fb",
        px: { xs: 1.5, md: 3 },
        py: { xs: 2, md: 3 },
      }}
    >
      {!carga ? (
        <>
          {/* HEADER */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #e8eef5",
              background:
                "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
              mb: 2,
            }}
          >
            <Box sx={{ p: { xs: 2, md: 2.5 }, color: "#fff" }}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                alignItems={{ md: "center" }}
                justifyContent="space-between"
              >
                <Box>
                  <Typography sx={{ fontWeight: 950, letterSpacing: 0.2 }}>
                  Cliente
                  </Typography>
                  <Typography
                    sx={{
                      opacity: 0.92,
                      fontWeight: 700,
                      fontSize: 13,
                      mt: 0.2,
                    }}
                  >
                    CUIT/CUIL: <b>{cuil_cuit}</b>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {/* NO CAMBIO PEP, solo lo ubico */}
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
                    variant="contained"
                    onClick={() =>
                      navigate("/usuario2/actualizarcomporbantes/" + cuil_cuit)
                    }
                    sx={{
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: 900,
                      px: 2,
                      backgroundColor: "rgba(255,255,255,0.16)",
                      color: "#fff",
                      border: "1px solid rgba(255,255,255,0.25)",
                      "&:hover": { backgroundColor: "rgba(255,255,255,0.24)" },
                    }}
                  >
                    ACTUALIZAR COMPROBANTES
                  </Button>

                  {!habilitado ? (
                    <Button
                      variant="contained"
                      onClick={() =>
                        navigate("/usuario2/legajoscliente/" + cuil_cuit)
                      }
                      sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 950,
                        px: 2,
                        backgroundColor: "#d32f2f",
                        "&:hover": { backgroundColor: "#b71c1c" },
                      }}
                    >
                      Ir a legajos
                    </Button>
                  ) : null}
                </Stack>
              </Stack>
            </Box>
          </Paper>

          {/* ESTADO / ALERTA */}
         
           
            {habilitado ? (<>
              <Alert
                severity="success"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-message": { fontWeight: 800 },
                }}
              >
                <b>Cliente habilitado</b> por {cliente.cuil_cuit}, el día{" "}
                {cliente.fecha}

             
              </Alert>
               </>
            ) : (
              <Alert
                severity="error"
                sx={{
                  borderRadius: 2,
                  "& .MuiAlert-message": { fontWeight: 800 },
                }}
              >
                <b>Cliente no habilitado</b> por {cliente.cuil_cuit} el día{" "}
                {cliente.fecha}. (No se puede asignar lote a un cliente no
                habilitado). Ir a LEGAJOS para habilitar.
              </Alert>
            )}
              
          {/* CARD: DATOS */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              border: "1px solid #e8eef5",
              backgroundColor: "#ffffff",
              p: { xs: 1.8, md: 2.2 },
              mb: 2,
            }}
          >

            {/* No toco el componente, solo wrapper */}
            <Box>
              <InfoCliente cuil_cuit={cuil_cuit} />
            </Box>
          </Paper>

          {/* CARD: LOTES (solo si habilitado) */}
          {habilitado ? (
            <Paper
              elevation={0}
              sx={{
                borderRadius: 3,
                border: "1px solid #e8eef5",
                backgroundColor: "#ffffff",
                p: { xs: 1.8, md: 2.2 },
              }}
            >
              <Typography sx={{ fontWeight: 950, color: "#1f2a33", mb: 1.2 }}>
                Lote
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box>
                <LotesCliente cuil_cuit={cuil_cuit} />
              </Box>
            </Paper>
          ) : null}
        </>
      ) : (
        <Cargadetabla />
      )}
    </Box>
  );
};

export default DetalleCliente;
