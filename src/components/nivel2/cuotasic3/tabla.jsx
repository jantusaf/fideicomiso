import { useState, useEffect } from "react";
import * as React from "react";
import servicioCuotas from "../../../services/cuotas";
import CancelarLote from "./cancelarLote";
import Pagorapido from "./pagaric3";

import { useNavigate } from "react-router-dom";

import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { Paper, Button, Box, Typography, Divider } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Skeleton from "@mui/material/Skeleton";
import { styled, alpha } from "@mui/material/styles";

import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#064B63",
    color: "#fff",
    fontWeight: 900,
    fontSize: 12,
    letterSpacing: 0.25,
    borderBottom: "0px",
    whiteSpace: "nowrap",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 13,
    fontWeight: 650,
    color: "#0b2b3a",
    borderBottom: `1px solid ${alpha("#01567c", 0.10)}`,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,

    // ✅ para que se vean más datos sin scroll
    minWidth: 0,
    maxWidth: 9999,
    overflow: "visible",
    textOverflow: "clip",
    whiteSpace: "normal",
    wordBreak: "break-word",
    lineHeight: 1.25,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(even)": {
    backgroundColor: alpha("#148D8D", 0.04),
  },
  "&:hover td": {
    backgroundColor: `${alpha("#148D8D", 0.08)} !important`,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MoneyCell = ({ value }) => (
  <Box
    sx={{
      display: "block",
      width: "100%",
      whiteSpace: "normal",
      wordBreak: "break-word",
      lineHeight: 1.25,
    }}
  >
    $ <b>{new Intl.NumberFormat("de-DE").format(value)}</b>
  </Box>
);

const Lotes = (props) => {
  const [clients, setClients] = useState();
  const [loading, setLoading] = useState(true);
  const [cuotas, setCuotas] = useState();
  const [filteredCuotas, setFilteredCuotas] = useState([]);
  const [uniqueClients, setUniqueClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showCuotas, setShowCuotas] = useState(false);
  const [openCompensar, setOpenCompensar] = useState(false);
  const [cuotaOrigen, setCuotaOrigen] = useState(null);
  const [cuotaCompensada, setCuotaCompensada] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getClients();
  }, []);

  const getClients = async () => {
    const response = await servicioCuotas.traercuotasic3(props.cuil_cuit);
    console.log(response);
    setCuotas(response);
    setFilteredCuotas(response);
    const clients = [...new Set(response.map((cuota) => cuota.id_cliente))];
    setUniqueClients(clients);
    setLoading(false);
  };

  const abrirCompensar = (id_cuota) => {
    setCuotaOrigen(id_cuota);
    setCuotaCompensada("");
    setOpenCompensar(true);
  };

  const cerrarCompensar = () => {
    setOpenCompensar(false);
  };

  const confirmarCompensar = async () => {
    if (!cuotaCompensada) return alert("Seleccione una cuota");

    const rta = await servicioCuotas.compensaric3({
      id_compensada: cuotaCompensada,
      id_dedonde: cuotaOrigen,
    });

    alert(rta);

    // 🔄 refrescar tabla
    const response = await servicioCuotas.traercuotasic3(props.cuil_cuit);
    setCuotas(response);

    if (selectedClient === null) {
      setFilteredCuotas(response);
    } else {
      const nuevas = response.filter((c) => c.id_cliente === selectedClient);
      setFilteredCuotas(nuevas);
    }

    setOpenCompensar(false);
  };

  const obtenerCuotaCompensadora = (idCompensada) => {
    if (!idCompensada || idCompensada === "No") return null;
    return cuotas?.find((c) => c.id === Number(idCompensada));
  };

  const handleClientFilter = (id_cliente) => {
    setShowCuotas(true);
    setSelectedClient(id_cliente);

    if (id_cliente === null) {
      setFilteredCuotas(cuotas);
    } else {
      const nuevasCuotas = cuotas.filter(
        (cuota) => cuota.id_cliente === id_cliente
      );
      setFilteredCuotas(nuevasCuotas);
    }
  };

  const calcularResumenFinanciero = () => {
    const totalPagado = filteredCuotas.reduce(
      (acc, cuota) => acc + (parseFloat(cuota.pago) || 0),
      0
    );
    const totalCuotas = filteredCuotas.reduce(
      (acc, cuota) => acc + (parseFloat(cuota.cuota_con_ajuste) || 0),
      0
    );
    const diferencia = totalCuotas - totalPagado;
    const cuotasCalculadas = filteredCuotas.filter((fila) => !isNaN(fila.ajuste))
      .length;
    const cuotasNoCalculadas = filteredCuotas.filter((fila) => isNaN(fila.ajuste))
      .length;

    return {
      totalPagado: totalPagado.toFixed(2),
      totalCuotas: totalCuotas,
      diferencia: diferencia.toFixed(2),
      cuotasCalculadas: cuotasCalculadas,
      cuotasNoCalculadas: cuotasNoCalculadas,
    };
  };

  return (
    <Box
      sx={{
        p: { xs: 1.5, md: 3 },
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        overflowX: "hidden",
        "& *": { minWidth: 0 },
      }}
    >
      {/* ===== HEADER CARD ===== */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${alpha("#0b4f6c", 0.14)}`,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 55px rgba(15, 127, 134, 0.10)",
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: { xs: 2, md: 2.5 },
            background:
              "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
            color: "#fff",
            display: "flex",
            alignItems: { xs: "flex-start", md: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              sx={{
                fontWeight: 900,
                fontSize: { xs: 18, md: 22 },
                lineHeight: 1.1,
                textShadow: "0 2px 10px rgba(0,0,0,0.35)",
              }}
            >
              CUADRO DE CUOTAS
            </Typography>

            <Typography
              sx={{
                mt: 0.35,
                fontWeight: 650,
                opacity: 0.9,
                fontSize: 14,
                textShadow: "0 1px 6px rgba(0,0,0,0.25)",
              }}
            >
              Seleccioná un cliente para ver sus cuotas.
            </Typography>
          </Box>
        </Box>

        {/* FILTRO */}
        <Box sx={{ px: { xs: 2, md: 3 }, py: 2 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              flexWrap: "wrap",
            }}
          >
            <FormControl
              size="small"
              sx={{
                width: 260,
                maxWidth: "100%",
                flexShrink: 0,
                minWidth: 0,
                "& .MuiInputLabel-root": {
                  color: alpha("#0b4f6c", 0.85),
                  fontWeight: 800,
                },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  background: "rgba(255,255,255,0.92)",
                  boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                  "& fieldset": {
                    borderColor: alpha("#0b4f6c", 0.18),
                  },
                  "&:hover fieldset": {
                    borderColor: alpha("#0b4f6c", 0.35),
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#148D8D",
                    borderWidth: 2,
                  },
                },
              }}
            >
              <InputLabel id="cliente-select-label">Cliente</InputLabel>

              <Select
                labelId="cliente-select-label"
                label="Cliente"
                value={selectedClient === null ? "ALL" : selectedClient}
                onChange={(e) => {
                  const v = e.target.value;
                  handleClientFilter(v === "ALL" ? null : v);
                }}
                renderValue={(val) => {
                  const label = val === "ALL" ? "Todos" : `Cliente ${val}`;
                  return (
                    <Box sx={{ display: "flex", alignItems: "center", minWidth: 0 }}>
                      <Box
                        component="span"
                        sx={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "block",
                        }}
                      >
                        {label}
                      </Box>
                    </Box>
                  );
                }}
                sx={{
                  width: "100%",
                  "& .MuiSelect-select": {
                    minWidth: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      borderRadius: 2,
                      mt: 1,
                      border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                      boxShadow: "0 18px 40px rgba(0,0,0,0.12)",
                      maxWidth: 360,
                      overflowX: "hidden",
                    },
                  },
                }}
              >
                <MenuItem value="ALL" sx={{ fontWeight: 800 }}>
                  Todos
                </MenuItem>

                {uniqueClients.map((id_cliente) => (
                  <MenuItem key={id_cliente} value={id_cliente} sx={{ fontWeight: 750 }}>
                    Cliente {id_cliente}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Box
                sx={{
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 999,
                  fontWeight: 900,
                  fontSize: 12.5,
                  color: "#0b4f6c",
                  background: alpha("#0f7f86", 0.10),
                  border: `1px solid ${alpha("#0f7f86", 0.16)}`,
                }}
              >
                Registros: {filteredCuotas?.length || 0}
              </Box>
            </Box>
          </Box>

          <Divider sx={{ mt: 2, borderColor: alpha("#0b4f6c", 0.12) }} />
        </Box>
      </Paper>

      {/* ===== CONTENIDO ===== */}
      <Paper
        elevation={0}
        sx={{
          mt: { xs: 2, md: 3 },
          borderRadius: 4,
          overflow: "hidden",
          border: `1px solid ${alpha("#01567c", 0.12)}`,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 22px 55px rgba(20, 141, 141, 0.10)",
        }}
      >
        {!cuotas ? (
          <Box sx={{ p: 2 }}>
            <Skeleton height={42} />
            <Skeleton height={42} />
            <Skeleton height={42} />
          </Box>
        ) : (
          <>
            {showCuotas ? (
              <>
                {/* RESUMEN */}
                <Box sx={{ px: { xs: 2, md: 3 }, pt: 2 }}>
                  {(() => {
                    const resumen = calcularResumenFinanciero();
                    return (
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          overflow: "hidden",
                          border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                          background: "#fff",
                          boxShadow: "0 18px 45px rgba(0,0,0,0.06)",
                        }}
                      >
                        <Box
                          sx={{
                            px: 2.2,
                            py: 1.3,
                            backgroundColor: "#064B63",
                            color: "#fff",
                          }}
                        >
                          <Typography sx={{ fontWeight: 900 }}>
                            Estado Financiero del Cliente {selectedClient}
                          </Typography>
                        </Box>

                        <Box sx={{ p: 2, display: "grid", gap: 1.1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                              Cuotas calculadas
                            </Typography>
                            <Typography sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                              {resumen.cuotasCalculadas}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                              Cuotas no calculadas
                            </Typography>
                            <Typography sx={{ fontWeight: 900, color: "#0b4f6c" }}>
                              {resumen.cuotasNoCalculadas}
                            </Typography>
                          </Box>

                          <Divider sx={{ borderColor: alpha("#01567c", 0.12) }} />

                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                              Total Pagado
                            </Typography>
                            <Typography sx={{ fontWeight: 900, color: "#148D8D" }}>
                              ${resumen.totalPagado}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Typography sx={{ fontWeight: 700, color: "#0b2b3a" }}>
                              Total Cuotas con Ajuste
                            </Typography>
                            <Typography sx={{ fontWeight: 900, color: "#148D8D" }}>
                              ${new Intl.NumberFormat("de-DE").format(resumen.totalCuotas)}
                            </Typography>
                          </Box>

                          <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                            <Typography sx={{ fontWeight: 800, color: "#0b2b3a" }}>
                              Diferencia
                            </Typography>
                            <Typography
                              sx={{
                                fontWeight: 900,
                                color: parseFloat(resumen.diferencia) < 0 ? "crimson" : "#148D8D",
                              }}
                            >
                              ${resumen.diferencia}
                            </Typography>
                          </Box>
                        </Box>
                      </Paper>
                    );
                  })()}

                  <Box
                    sx={{
                      pt: 2,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <CancelarLote id_cliente={selectedClient} cuotas={filteredCuotas} />
                  </Box>
                </Box>

                {/* TABLA */}
                <Box sx={{ px: { xs: 1.5, md: 2 }, pt: 2, pb: 2 }}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha("#01567c", 0.10)}`,
                      overflow: "hidden",
                      background: "#fff",
                    }}
                  >
                    <Box
                      sx={{
                        maxHeight: "56vh",
                        overflowY: "auto",
                        overflowX: "hidden", // ✅ sin scroll horizontal
                        "&::-webkit-scrollbar": { width: 10 },
                        "&::-webkit-scrollbar-thumb": {
                          background: alpha("#0b4f6c", 0.28),
                          borderRadius: 999,
                        },
                      }}
                    >
                      <Table stickyHeader sx={{ tableLayout: "fixed", width: "100%" }}>
                        <TableHead>
                          <TableRow>
                            {/* ✅ OCULTO ID (se elimina columna entera) */}
                            {/* <StyledTableCell><b>ID</b></StyledTableCell> */}

                            <StyledTableCell sx={{ width: "6%" }}><b>CUOTA</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "7%" }}><b>FECHA</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "11%" }}><b>SALDO INICIAL</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "7%" }}><b>ICC</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "7%" }}><b>AJUSTE</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "12%" }}><b>CUOTA AJUSTE</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>PAGO</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>SALDO FINAL</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>SALDO REAL</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>DIFERENCIA</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>PAGAR</b></StyledTableCell>
                            <StyledTableCell sx={{ width: "10%" }}><b>DETALLE</b></StyledTableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {filteredCuotas.map((row) => (
                            <StyledTableRow key={row.id}>
                              {/* ✅ OCULTO ID (celda) */}
                              {/* <StyledTableCell>{row.id_cliente}</StyledTableCell> */}

                              <StyledTableCell>{row.cuota}</StyledTableCell>

                              <StyledTableCell>
                                {row.mes < 10 ? <>0{row.mes}</> : <>{row.mes}</>}/{row.anio}
                              </StyledTableCell>

                              <StyledTableCell>
                                <MoneyCell value={row.saldo_inicial} />
                              </StyledTableCell>

                              <StyledTableCell>{parseFloat(row.ajuste_icc).toFixed(3)}</StyledTableCell>
                              <StyledTableCell>{row.ajuste}</StyledTableCell>

                              <StyledTableCell>
                                <MoneyCell value={row.cuota_con_ajuste} />
                              </StyledTableCell>

                              <StyledTableCell>
                                <MoneyCell value={row.pago} />
                              </StyledTableCell>

                              <StyledTableCell>
                                <MoneyCell value={row.saldo_final} />
                              </StyledTableCell>

                              <StyledTableCell>
                                <MoneyCell value={row.saldo_real} />
                              </StyledTableCell>

                              <StyledTableCell>
                                {row.excedente < 0 ? (
                                  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.2 }}>
                                    <Typography sx={{ fontWeight: 900, color: "crimson" }}>
                                      {new Intl.NumberFormat("de-DE").format(row.excedente)}
                                    </Typography>

                                    {row.compensada && row.compensada !== "No" && (() => {
                                      const cuotaOrigen2 = obtenerCuotaCompensadora(row.compensada);
                                      return (
                                        <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#555" }}>
                                          Pagada {cuotaOrigen2
                                            ? `${String(cuotaOrigen2.mes).padStart(2, "0")}/${cuotaOrigen2.anio}`
                                            : ""}
                                        </Typography>
                                      );
                                    })()}
                                  </Box>
                                ) : (
                                  <Typography sx={{ fontWeight: 900, color: "#148D8D" }}>
                                    {new Intl.NumberFormat("de-DE").format(row.excedente)}
                                  </Typography>
                                )}
                              </StyledTableCell>

                              {/* ✅ PAGAR (botones más chicos) */}
                              <StyledTableCell align="center">
                                <Box
                                  sx={{
                                    display: "flex",
                                    gap: 0.75,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                  }}
                                >
                                  <Box
                                    sx={{
                                      "& .MuiButtonBase-root": {
                                        borderRadius: 2,
                                        px: 1.1,
                                        py: 0.35,
                                        minHeight: 26,
                                        fontSize: "0.72rem",
                                        fontWeight: 900,
                                        textTransform: "none",
                                        boxShadow: "0 8px 14px rgba(0,0,0,0.08)",
                                        whiteSpace: "nowrap",
                                      },
                                    }}
                                  >
                                    <Pagorapido
                                      id_cuota={row.id}
                                      cuota_con_ajuste={row.cuota_con_ajuste}
                                      traer={async () => {
                                        const clients2 = await servicioCuotas.traercuotasic3(
                                          props.cuil_cuit
                                        );
                                        setCuotas(clients2);
                                        setLoading(false);
                                        if (selectedClient === null) setFilteredCuotas(clients2);
                                        else
                                          setFilteredCuotas(
                                            clients2.filter(
                                              (cuota) => cuota.id_cliente === selectedClient
                                            )
                                          );
                                      }}
                                    />
                                  </Box>

                                  <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                      px: 1.1,
                                      py: 0.35,
                                      minHeight: 26,
                                      borderRadius: 2,
                                      textTransform: "none",
                                      fontWeight: 900,
                                      fontSize: "0.72rem",
                                      backgroundColor: "#0f7f86",
                                      boxShadow: "0 8px 14px rgba(20,141,141,0.16)",
                                      "&:hover": { backgroundColor: "#0c6b71" },
                                      whiteSpace: "nowrap",
                                    }}
                                    onClick={() => abrirCompensar(row.id)}
                                  >
                                    Comp.
                                  </Button>
                                </Box>
                              </StyledTableCell>

                              {/* ✅ DETALLE (botón más chico) */}
                              <StyledTableCell align="center">
                                <Button
                                  variant="contained"
                                  size="small"
                                  onClick={() => navigate("/usuario2/pagoscuotasic3/" + row.id)}
                                  sx={{
                                    px: 1.1,
                                    py: 0.35,
                                    minHeight: 26,
                                    borderRadius: 2,
                                    textTransform: "none",
                                    fontWeight: 900,
                                    fontSize: "0.72rem",
                                    background: "#0b4f6c",
                                    boxShadow: "0 8px 14px rgba(11,79,108,0.14)",
                                    whiteSpace: "nowrap",
                                    "&:hover": { background: "#0a3b4f" },
                                  }}
                                >
                                  Ver
                                </Button>
                              </StyledTableCell>
                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ p: 3 }}>
                Debes seleccionar el cliente, para poder acceder a su cuadro de cuotas correspondiente.
              </Box>
            )}
          </>
        )}
      </Paper>

      {/* DIALOG COMPENSAR (no cambio lógica) */}
      <Dialog
        open={openCompensar}
        onClose={cerrarCompensar}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255,255,255,0.94)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 28px 80px rgba(0,0,0,0.28)",
          },
        }}
        BackdropProps={{
          sx: {
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(6px)",
          },
        }}
      >
        <DialogTitle
          sx={{
            px: 3,
            py: 2.2,
            color: "#fff",
            fontWeight: 900,
            letterSpacing: 0.2,
            background:
              "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
            textShadow: "0 2px 10px rgba(0,0,0,0.35)",
          }}
        >
          Compensar cuota IC3
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            px: 3,
            py: 2.5,
            background:
              "linear-gradient(180deg, rgba(20,141,141,0.06) 0%, rgba(255,255,255,0.96) 55%, #fff 100%)",
            borderColor: alpha("#0b4f6c", 0.10),
          }}
        >
          <FormControl
            fullWidth
            size="small"
            sx={{
              "& .MuiInputLabel-root": {
                color: alpha("#0b4f6c", 0.85),
                fontWeight: 900,
              },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 12px 22px rgba(11,79,108,0.10)",
                "& fieldset": { borderColor: alpha("#0b4f6c", 0.18) },
                "&:hover fieldset": { borderColor: alpha("#0b4f6c", 0.35) },
                "&.Mui-focused fieldset": {
                  borderColor: "#148D8D",
                  borderWidth: 2,
                },
              },
            }}
          >
            <InputLabel>Seleccione cuota destino</InputLabel>

            <Select
              label="Seleccione cuota destino"
              value={cuotaCompensada}
              onChange={(e) => setCuotaCompensada(e.target.value)}
              MenuProps={{
                PaperProps: {
                  sx: {
                    borderRadius: 2,
                    mt: 1,
                    border: `1px solid ${alpha("#0b4f6c", 0.12)}`,
                    boxShadow: "0 18px 45px rgba(0,0,0,0.14)",
                    overflow: "hidden",
                    maxWidth: "100%",
                  },
                },
              }}
              sx={{
                "& .MuiSelect-select": {
                  minWidth: 0,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                },
              }}
            >
              {Array.isArray(filteredCuotas) &&
                filteredCuotas
                  .filter((c) => c && c.id !== cuotaOrigen)
                  .map((c) => (
                    <MenuItem
                      key={c.id}
                      value={c.id}
                      sx={{
                        fontWeight: 850,
                        color: "#0b2b3a",
                        "&.Mui-selected": {
                          backgroundColor: alpha("#148D8D", 0.12),
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: alpha("#148D8D", 0.16),
                        },
                      }}
                    >
                      {`${String(c.mes).padStart(2, "0")}/${c.anio} - Diferencia: ${new Intl.NumberFormat(
                        "de-DE"
                      ).format(c.excedente)}`}
                    </MenuItem>
                  ))}
            </Select>

            <Typography
              sx={{
                mt: 1.2,
                fontSize: 12.5,
                fontWeight: 750,
                color: alpha("#0b4f6c", 0.75),
              }}
            >
              Elegí la cuota destino para compensar la cuota seleccionada.
            </Typography>
          </FormControl>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            backgroundColor: "rgba(255,255,255,0.92)",
            borderTop: `1px solid ${alpha("#0b4f6c", 0.10)}`,
            gap: 1,
          }}
        >
          <Button
            onClick={cerrarCompensar}
            variant="outlined"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              py: 1.05,
              borderColor: alpha("#0b4f6c", 0.35),
              color: "#0b4f6c",
              "&:hover": {
                borderColor: alpha("#0b4f6c", 0.55),
                backgroundColor: alpha("#0b4f6c", 0.06),
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="contained"
            onClick={confirmarCompensar}
            sx={{
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 900,
              px: 2.2,
              py: 1.05,
              background: "linear-gradient(135deg, #148D8D 0%, #01567c 100%)",
              boxShadow: "0 12px 26px rgba(1,86,124,0.22)",
              "&:hover": {
                background: "linear-gradient(135deg, #0f7a7a 0%, #014a6b 100%)",
              },
            }}
          >
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Lotes;