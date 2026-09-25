import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";

import servicioCliente from "../../../services/clientes";
import serviciousuario1 from "../../../services/usuario1";
import serviciousuarios from "../../../services/usuarios";
import "../detalleclienteIngresos/profile.css";
import Modalveronline from "./Modalveronline";
import Modalveronlinecbu from "../pagarcuota/verpdfcbu";
import ModalLegajo from "./Modalegajo";
import { useNavigate, useParams } from "react-router-dom";
import Habilitar from "./ModalHabiulitar";
import Deshabilitar from "./ModalDeshabilitar";
import Estadisticas from "./Estadisticas";
import ModalSeguro from "./Modalseguroborrar";
import ModalEditarDescripcion from "./modaleditarc";
import { Box, Paper, Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import FolderOpenOutlinedIcon from "@mui/icons-material/FolderOpenOutlined";
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, COLOR_ERROR, sxCard, sxBtnOutlined } from "../detalleclienteIngresos/estilos";
const thStyle = {
  padding: "12px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
  fontWeight: "bold",
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #eee",
};
const LegajoCliente = (props) => {
  const navigate = useNavigate();
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;

  const [products, setProducts] = useState();
  const [user, setUser] = useState(null);
  const [refreshStats, setRefreshStats] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedData, setSelectedData] = useState(null);

  const actualizarEstadisticas = () => {
    setRefreshStats((prev) => !prev);
  };

  const traer = async () => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteAppUser");
    const user = JSON.parse(loggedUserJSON);
    const notis = await serviciousuarios.traerusuario(user.cuil_cuit);
    setUser(notis[0]);
  };

  const getData = async () => {
    const data = await servicioCliente.traerLejagos(cuil_cuit);
    setProducts(data);
  };

  useEffect(() => {
    getData();
    traer();
  }, []);

  const handleOpenModal = (data) => {
    setSelectedData(data);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedData(null);
  };

  const volver = () => {
    navigate("/usuario2/detallecliente/" + cuil_cuit);
  };

  const verFile = (index) => {
    return (
      <>
        {[
          "Cbu personal",
          "Cbu familiar",
          "Socio/Gerente/Apoderado",
          "Propio",
        ].includes(products[0][index]?.tipo) ? (
          <Modalveronlinecbu id={products[0][index].id} />
        ) : (
          <Modalveronline id={products[0][index].id} />
        )}
      </>
    );
  };

  const columns = [
    { name: "tipo", label: "Tipo" },
    { name: "descripcion", label: "Descripción" },
    { name: "fecha", label: "Fecha" },
    {
      name: "estado",
      label: "Estado",
      options: {
        customBodyRender: (value) => {
          const activo = value === "Activo";
          return (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "bold",
               
                color:  "#2e7d32" ,
              }}
            >
              {value}
            </span>
          );
        },
      },
    },
    {
      name: "Editar",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const rowData = products[0][dataIndex];
          return (
            <Button
              onClick={() => handleOpenModal(rowData)}
              style={{
                background: "#1f7a8c",
                color: "white",
                borderRadius: "20px",
                padding: "6px 16px",
                textTransform: "none",
              }}
            >
              Editar
            </Button>
          );
        },
      },
    },
    {
      name: "Ver",
      options: {
        customBodyRenderLite: (dataIndex) => verFile(dataIndex),
      },
    },
    {
      name: "Borrar",
      options: {
        customBodyRenderLite: (dataIndex) => {
          const item = products[0][dataIndex];
          return (
            <div style={{ display: "flex", gap: "8px" }}>
              <ModalSeguro
                id={item.id}
                getData={getData}
              />
              {item.comprobanteok === "No" && (
                <span
                  style={{
                    background: "#ffebee",
                    color: "#c62828",
                    padding: "4px 8px",
                    borderRadius: "50%",
                    fontWeight: "bold",
                  }}
                >
                  !
                </span>
              )}
            </div>
          );
        },
      },
    },
  ];

  const optionss = {
    selectableRows: false,
    elevation: 0,
    rowsPerPage: 5,
    responsive: "standard",

    setTableProps: () => ({
      style: {
        borderRadius: "16px",
        overflow: "hidden",
        border: "1px solid #e5e7eb",
      },
    }),

    setRowProps: (row, dataIndex) => ({
      style: {
        background: dataIndex % 2 === 0 ? "#fff" : "#f8fafc",
      },
    }),

    textLabels: {
      body: {
        noMatch: "No hay documentación cargada",
      },
    },
  };

  const sxTh = {
    backgroundColor: "#f6f8f9",
    color: COLOR_TEXT,
    fontWeight: 700,
    fontSize: 11.5,
    letterSpacing: 0.4,
    borderBottom: `1px solid ${COLOR_BORDER}`,
    whiteSpace: "nowrap",
    py: 1.25,
  };
  const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };

  const habilitado = products ? products[1][0].habilitado === "Si" : false;

  return (
    <Box sx={{ maxWidth: 1320, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
      <ModalEditarDescripcion
        open={openModal}
        handleClose={handleCloseModal}
        data={selectedData}
        getData={getData}
      />

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
              <FolderOpenOutlinedIcon sx={{ color: COLOR_ACCENT }} />
            </Box>
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
              >
                Legajo del cliente
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                Gestión y administración de documentación
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
            <Chip variant="outlined" label={`Documentos: ${products ? products[0].length : 0}`} sx={{ fontWeight: 600 }} />
            {products && (
              <Chip
                variant="outlined"
                label={habilitado ? "Habilitado" : "Deshabilitado"}
                sx={{
                  fontWeight: 600,
                  color: habilitado ? COLOR_OK : COLOR_ERROR,
                  borderColor: habilitado ? COLOR_OK : COLOR_ERROR,
                }}
              />
            )}
          </Box>
        </Box>
      </Paper>

      {/* ACCIONES */}
      <Box
        sx={{
          mt: 2.5,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 1.25, flexWrap: "wrap", alignItems: "center" }}>
          <Button onClick={volver} startIcon={<ArrowBackIcon />} variant="outlined" sx={sxBtnOutlined}>
            Volver
          </Button>

          {products && (
            <ModalLegajo
              razon={products[1][0].razon}
              tiposExistentes={products[0].map((l) => l.tipo)}
              getData={getData}
              getData2={actualizarEstadisticas}
            />
          )}
        </Box>

        {products && (
          <Box sx={{ display: "flex", gap: 1.25, alignItems: "center" }}>
            {habilitado ? (
              <Deshabilitar cuil_cuit_user={props.cuil_cuit_user} getData={getData} />
            ) : (
              <Habilitar cuil_cuit_user={props.cuil_cuit_user} getData={getData} />
            )}
          </Box>
        )}
      </Box>

      {/* TABLA */}
      <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, overflow: "hidden", width: 0, minWidth: "100%" }}>
        {products && (
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {["TIPO", "DESCRIPCIÓN", "FECHA", "ESTADO", "EDITAR", "VER", "BORRAR"].map((h) => (
                    <TableCell key={h} sx={sxTh}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {products[0].map((item) => (
                  <TableRow key={item.id} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                    <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{item.tipo}</TableCell>
                    <TableCell sx={sxTd}>{item.descripcion}</TableCell>
                    <TableCell sx={{ ...sxTd, whiteSpace: "nowrap" }}>{item.fecha}</TableCell>
                    <TableCell sx={{ ...sxTd, color: COLOR_OK, fontWeight: 600 }}>{item.estado}</TableCell>

                    <TableCell sx={sxTd}>
                      <Button
                        onClick={() => handleOpenModal(item)}
                        variant="outlined"
                        size="small"
                        sx={{ ...sxBtnOutlined, px: 1.75 }}
                      >
                        Editar
                      </Button>
                    </TableCell>

                    <TableCell sx={sxTd}>
                      {["Cbu personal", "Cbu familiar", "Socio/Gerente/Apoderado", "Propio"].includes(item.tipo) ? (
                        <Modalveronlinecbu id={item.id} />
                      ) : (
                        <Modalveronline id={item.id} />
                      )}
                    </TableCell>

                    <TableCell sx={sxTd}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <ModalSeguro id={item.id} getData={getData} />

                        {item.comprobanteok === "No" && (
                          <Box
                            component="span"
                            title="Comprobante pendiente"
                            sx={{
                              width: 22,
                              height: 22,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 700,
                              fontSize: 13,
                              color: COLOR_ERROR,
                              border: `1px solid ${COLOR_ERROR}`,
                            }}
                          >
                            !
                          </Box>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}

                {products[0].length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                      No hay documentación cargada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
};

export default LegajoCliente;
