import { useParams } from "react-router-dom";
import servicioLotes from "../services/lotes";
import servicioCuotas from "../services/cuotas";
import servicioAdmin from "../services/Administracion";
import servicio360 from "../services/pagos360";
import AgregarIcc from "./nivel2/Icc_cuota/AgregarICCCuota";
import AgregaraCuotas from "./nivel2/Asignarcuotasalote";
import BorrarCuotas from "./nivel2/borrarcuotas/BorrarCuotas";
import CancelarLote from "./pagarloteparque";
import Tooltip from "@mui/material/Tooltip";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Pagointeres from "./nivel2/pagarcuota/modalpagointeres";
import React, { useEffect, useState, Fragment } from "react";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SearchIcon from "@mui/icons-material/Search";
import DeleteIcon from "@mui/icons-material/Delete";
import Button from "@mui/material/Button";

import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import Skeleton from "@mui/material/Skeleton";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { MenuItem, InputLabel } from "@mui/material";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import { alpha } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Pagorapido from "./nivel2/pagarcuota/modalpagorapido";
import Adelantar from "./nivel2/pagarcuota/adelantarcuotaparque";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import * as XLSX from "xlsx";
import { COLOR_TEXT, COLOR_MUTED, COLOR_BORDER, COLOR_OK, COLOR_ERROR, sxCard, sxBtnPrimary, sxBtnOutlined, slotPropsDialog, sxDialogTitle, sxDialogActions, moneda } from "./nivel2/detalleclienteIngresos/estilos";
import { saveAs } from "file-saver";

const LotesCliente = (props) => {
  let params = useParams();
  let cuil_cuit = params.cuil_cuit;
  const navigate = useNavigate();

  useEffect(() => {
    traer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
const [loteSeleccionado, setLoteSeleccionado] = useState(null);
  const [lotes, setLotes] = useState([""]);
  const [cuotas, setCuotas] = useState([""]);
  const [open, setOpen] = React.useState(false);
  const [deudaExigible, setDeudaExigible] = useState([""]);
  const [detallePendiente, setDetallePendiente] = useState([""]);
  const [idlote, setIdlote] = useState(null);
  const [selectedValue, setSelectedValue] = useState();
  const [act, setAct] = useState(false);
  const [act2, setAct2] = useState(false);
  const [vista1, setVista1] = useState(false);
  const [cargalink, setCargalink] = useState(false);
  const [verDetalles, setVerDetalles] = useState(false);
  const [openCompensar, setOpenCompensar] = useState(false);
  const [cuotaOrigen, setCuotaOrigen] = useState(null);
  const [cuotaCompensada, setCuotaCompensada] = useState("");
  const toggleDetalles = () => setVerDetalles(!verDetalles);

const vercuotas = async (index) => {
  const cuotas = await servicioCuotas.vercuotas(index);
  setCuotas(cuotas);
  setIdlote(index);
  setAct(true);
  const lote = lotes.find((l) => l.id == index);
  setLoteSeleccionado(lote);

  verief(index);
  setOpen(false);
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

    const rta = await servicioCuotas.compensar({
      id_compensada: cuotaCompensada,
      id_dedonde: cuotaOrigen
    });

    alert(rta);

    // refresca tabla
    const cuotasActualizadas = await servicioCuotas.vercuotas(idlote);
    setCuotas(cuotasActualizadas);
    verief(idlote);

    setOpenCompensar(false);
  };
  const handleChangeratio = (event) => setSelectedValue(event.target.value);

  const verief = async (index) => {
    const dde = await servicioCuotas.verief(index);
    setDeudaExigible(dde[0]);
    setDetallePendiente(dde[1]);
    setAct2(true);
    setOpen(false);
  };

  const traer = async () => {
    const lotes = await servicioLotes.lotesCliente(props.cuil_cuit);
    console.log(lotes);
    setLotes(lotes);
  };

  const borrar = async (id) => {
    const rta = await servicioCuotas.borrarcuota(id);
    alert(rta);
  };
const obtenerCuotaQueCancelo = (idCuotaCancelada) => {
  if (
    !idCuotaCancelada ||
    idCuotaCancelada === "No" ||
    idCuotaCancelada === "0"
  ) {
    return null;
  }

  return cuotas.find(
    (cuota) => String(cuota.id) === String(idCuotaCancelada)
  );
};
  const traerlink = async (index) => {
    const dde = await servicioAdmin.traerlinkcuota(index);
    window.open(dde);
  };

  const traerlink360 = async (index) => {
    setCargalink(true);
    const dde = await servicio360.traerlink360(index);
    window.open(dde);
    setCargalink(false);
  };

  const crearsolicituddebito = async (index) => {
    const dde = await servicio360.crearsolicituddebito({ id_cuota: index });
    alert(dde);
  };
  const obtenerCuotaCompensadora = (idCompensada) => {
    if (!idCompensada || idCompensada === "No") return null;
    return cuotas?.find((c) => c.id === Number(idCompensada));
  };
const obtenerCuotaCompensada = (idCompensada) => {
  if (
    !idCompensada ||
    idCompensada === "No" ||
    idCompensada === "0"
  ) {
    return null;
  }

  return cuotas.find(
    (cuota) => String(cuota.id) === String(idCompensada)
  );
};
  function saldoReal(dataIndex) {
    return (
      <>
        {cuotas[dataIndex].parcialidad === "Final" ? (
          "$ " +
          new Intl.NumberFormat("de-DE").format(cuotas[dataIndex].Saldo_real)
        ) : (
          <div>No Calculado</div>
        )}
      </>
    );
  }

  function pago(dataIndex) {
    return (
      <>
        {cuotas[dataIndex].parcialidad === "Final" ? (
          "$ " + new Intl.NumberFormat("de-DE").format(cuotas[dataIndex].pago)
        ) : (
          <div>No Calculado</div>
        )}
      </>
    );
  }

  function saldoInicial(dataIndex) {
    return (
      <>
        {cuotas[dataIndex].parcialidad === "Final" ? (
          "$ " +
          new Intl.NumberFormat("de-DE").format(cuotas[dataIndex].saldo_inicial)
        ) : (
          <div>No Calculado</div>
        )}
      </>
    );
  }

  function cuotaConAjuste(dataIndex) {
    return (
      <>
        {cuotas[dataIndex].parcialidad === "Final" ? (
          "$ " +
          new Intl.NumberFormat("de-DE").format(
            cuotas[dataIndex].cuota_con_ajuste
          )
        ) : (
          <div>No Calculado</div>
        )}
      </>
    );
  }

  function fecha(dataIndex) {
    return <>{cuotas[dataIndex].mes + "/" + cuotas[dataIndex].anio}</>;
  }

  function diferencia(dataIndex) {
    return (
      <>
        {cuotas[dataIndex].diferencia >= 0 ? (
          <p style={{ color: "#148D8D", fontWeight: 900, margin: 0 }}>
            {new Intl.NumberFormat("de-DE").format(cuotas[dataIndex].diferencia)}
          </p>
        ) : (
          <p style={{ color: "#d32f2f", fontWeight: 900, margin: 0 }}>
            {new Intl.NumberFormat("de-DE").format(cuotas[dataIndex].diferencia)}
          </p>
        )}
      </>
    );
  }

  function PagomercadoP(dataIndex) {
    return (
      <>
        <Button onClick={() => traerlink(cuotas[dataIndex].id)}>
          Pagar mercado Pago
        </Button>
      </>
    );
  }

  function Pago360(dataIndex) {
    return (
      <>
        <Button onClick={() => traerlink360(cuotas[dataIndex].id)}>
          Pagar 360
        </Button>
      </>
    );
  }

  function Pagodebito360(dataIndex) {
    return (
      <>
        <Button onClick={() => crearsolicituddebito(cuotas[dataIndex].id)}>
          debito en 360
        </Button>
      </>
    );
  }

  function CutomButtonsRenderer(dataIndex) {
    return (
      <>
        <CurrencyExchangeIcon
          onClick={() => navigate("/usuario2/pagarcuota/" + cuotas[dataIndex].id)}
          style={{ marginRight: "10px", cursor: "pointer" }}
        />
        <SearchIcon
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/usuario2/pagoscuotas/" + cuotas[dataIndex].id)}
        />
        <DeleteIcon
          style={{ cursor: "pointer" }}
          onClick={() => borrar(cuotas[dataIndex].id)}
        />
        <AgregarIcc
          id={cuotas[dataIndex].id}
          traer={async () => {
            const lotes = await servicioLotes.lotesCliente(props.cuil_cuit);
            setLotes(lotes);
          }}
        />
      </>
    );
  }

const exportarExcel = () => {
  if (!cuotas || cuotas.length === 0) {
    alert("No hay cuotas para exportar");
    return;
  }

  // Transformamos los datos (podés agregar/quitar campos)
  const data = cuotas.map((c) => ({
    Fecha: `${String(c.mes).padStart(2, "0")}/${c.anio}`,
    "Saldo Inicial": c.saldo_inicial,
    Amortizacion: c.Amortizacion,
    ICC: c.ICC,
    "Ajuste ICC": c.Ajuste_ICC,
    "Cuota con ajuste": c.cuota_con_ajuste,
    "Saldo Cierre": c.saldo_cierre,
    Pago: c.pago,
    "Saldo Real": c.Saldo_real,
    Diferencia: c.diferencia,
    Interes: c.interes,
    "Pago Interes": c.pago_interes,
    "ID Cuota": c.id,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Cuotas");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const file = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(file, `Cuotas_Lote_${idlote}.xlsx`);
};

  // ===== Presentación (sistema visual compartido con el resto de la vista) =====
  const lotesValidos = Array.isArray(lotes) ? lotes.filter((l) => l && typeof l === "object") : [];
  const cargandoLotes = Array.isArray(lotes) && lotes.length === 1 && lotes[0] === "";
  const cantidadRegistros =
    Array.isArray(cuotas) && cuotas.length > 0 && cuotas[0] !== "" ? cuotas.length : 0;
  const fmt = (n) => new Intl.NumberFormat("de-DE").format(n);

  const sxTh = {
    backgroundColor: "#f6f8f9",
    color: COLOR_TEXT,
    fontWeight: 700,
    fontSize: 11.5,
    letterSpacing: 0.4,
    borderBottom: `1px solid ${COLOR_BORDER}`,
    whiteSpace: "nowrap",
    py: 1.5,
  };

  const sxTd = {
    fontSize: 13.5,
    color: COLOR_TEXT,
    borderBottom: "1px solid #eef1f3",
    py: 1.4,
    whiteSpace: "nowrap",
    fontVariantNumeric: "tabular-nums",
  };

  const sxLabelCampo = {
    display: "block",
    mb: 0.5,
    ml: 0.25,
    fontWeight: 600,
    color: "text.secondary",
  };

  const renderResumen = (titulo, filas) => (
    <Box sx={{ border: `1px solid ${COLOR_BORDER}`, borderRadius: 2, overflow: "hidden", height: "100%" }}>
      <Box sx={{ px: 2.25, py: 1.4, backgroundColor: "#f6f8f9", borderBottom: `1px solid ${COLOR_BORDER}` }}>
        <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 14 }}>{titulo}</Typography>
      </Box>
      <Table size="small">
        <TableBody>
          {(Array.isArray(filas) ? filas : []).map((row, index) => (
            <TableRow key={row.name || index} sx={{ "&:last-child td": { borderBottom: 0 } }}>
              <TableCell sx={{ color: COLOR_MUTED, py: 1.4, fontSize: 13.5, borderColor: "#eef1f3" }}>
                {row.datoa}
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontWeight: 700,
                  color: COLOR_TEXT,
                  py: 1.4,
                  fontSize: 13.5,
                  whiteSpace: "nowrap",
                  borderColor: "#eef1f3",
                }}
              >
                {index > 0 ? `$ ${fmt(row.datob)}` : fmt(row.datob)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );

  return (
    <Fragment>
      <Stack spacing={2.5} sx={{ width: "100%", maxWidth: "100%", minWidth: 0 }}>
        {/* =========================
            CUADRO DE CUOTAS + SELECTOR DE LOTE
        ========================== */}
        <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
           
           
            spacing={2} sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
                Cuadro de cuotas
              </Typography>
              <Typography variant="body2" sx={{ color: COLOR_MUTED }}>
                Seleccioná un lote para ver sus cuotas.
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.25} useFlexGap sx={{ alignItems: "center", flexWrap: "wrap" }}>
              {loteSeleccionado && (
                <Chip
                  variant="outlined"
                  label={`Valor del lote: $ ${fmt(loteSeleccionado.valor_total)}`}
                  sx={{ fontWeight: 600 }}
                />
              )}
              <Chip variant="outlined" label={`Registros: ${cantidadRegistros}`} sx={{ fontWeight: 600 }} />
              <Button variant="outlined" sx={sxBtnOutlined} onClick={exportarExcel}>
                Descargar Excel
              </Button>
            </Stack>
          </Stack>

          {cargandoLotes ? null : lotesValidos.length > 0 ? (
            <Box sx={{ mt: 2.5, maxWidth: 560 }}>
              <Typography variant="caption" sx={sxLabelCampo}>
                Lote
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  displayEmpty
                  value={selectedValue || ""}
                  onChange={handleChangeratio}
                  renderValue={(v) =>
                    v ? v : <span style={{ color: COLOR_MUTED }}>Seleccioná un lote</span>
                  }
                  sx={{ borderRadius: 1.5 }}
                >
                  {lotesValidos.map((item, index) => (
                    <MenuItem
                      key={item.id ?? index}
                      value={`Fraccion: ${item.fraccion} - Manzana: ${item.manzana} - Parcela: ${item.parcela}${
                        item.tiene_cuotas === "Si" ? " - Cuotas" : ""
                      }`}
                      onClick={() => vercuotas(item.id)}
                    >
                      Fraccion: {item.fraccion} - Manzana: {item.manzana} - Parcela: {item.parcela}
                      {item.tiene_cuotas === "Si" ? " - Cuotas" : ""}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 2 }}>
              Este cliente todavía no tiene lotes asignados.
            </Typography>
          )}
        </Paper>

        {/* =========================
            RESUMEN Y ACCIONES
        ========================== */}
        {act ? (
          <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: COLOR_TEXT }}>
              Resumen y acciones
            </Typography>
            <Typography variant="body2" sx={{ color: COLOR_MUTED, mb: 2.5 }}>
              {selectedValue ? selectedValue : "Seleccioná un lote para ver datos."}
            </Typography>

            {act2 && cuotas !== "" ? (
              <Grid container spacing={2.5}>
                <Grid size={{ xs: 12, md: 6 }}>{renderResumen("Detalles de deuda exigible", deudaExigible)}</Grid>
                <Grid size={{ xs: 12, md: 6 }}>{renderResumen("Detalle de cuotas pendientes", detallePendiente)}</Grid>
              </Grid>
            ) : null}

            <Divider sx={{ my: 2.5, borderColor: COLOR_BORDER }} />

            <Stack direction="row" spacing={1.25} useFlexGap sx={{ alignItems: "center", justifyContent: "flex-end", flexWrap: "wrap" }}>
              <Button
                variant="contained"
                sx={sxBtnPrimary}
                onClick={() => navigate("/usuario2/agregarcuotas/" + idlote)}
              >
                Agregar cuotas al lote
              </Button>

              {/* Estos componentes ya existen: no se cambia su lógica */}
              <AgregaraCuotas id_origen={idlote} lotes={lotes} />
              <BorrarCuotas id={idlote} />
              <CancelarLote id_lote={idlote} cuotas={cuotas} />

              {cuotas && (
                <Adelantar
                  id_lote={idlote}
                  cuotas={cuotas}
                  traerr={async () => {
                    const cuotas = await servicioCuotas.vercuotas(idlote);
                    setCuotas(cuotas);
                    setAct(true);
                    verief(idlote);
                    setOpen(false);
                  }}
                />
              )}

              <Button
                variant="outlined"
                sx={sxBtnOutlined}
                onClick={() => {
                  window.open("/usuario2/comprobanteief/" + idlote);
                }}
              >
                Imprimir comprobante
              </Button>

              <Button variant="outlined" sx={sxBtnOutlined} onClick={toggleDetalles}>
                {verDetalles ? "Restaurar" : "Ver interés"}
              </Button>
            </Stack>
          </Paper>
        ) : null}

        {/* =========================
            TABLA DE CUOTAS
        ========================== */}
        {act ? (
          <Paper elevation={0} sx={{ ...sxCard, overflow: "hidden" }}>
            <TableContainer
              sx={{
                maxHeight: "72vh",
                "&::-webkit-scrollbar": { height: 10, width: 10 },
                "&::-webkit-scrollbar-thumb": { background: "#c9d2d8", borderRadius: 999 },
              }}
            >
              {!cuotas ? (
                <Skeleton />
              ) : (
                <Table stickyHeader size="small" sx={{ minWidth: 1100 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={sxTh}>FECHA</TableCell>
                      {verDetalles && (
                        <TableCell align="right" sx={sxTh}>SALDO INICIAL</TableCell>
                      )}
                      <TableCell align="right" sx={sxTh}>AMORTIZACIÓN</TableCell>
                      <TableCell align="right" sx={sxTh}>ICC</TableCell>
                      <TableCell align="right" sx={sxTh}>AJUSTE ICC</TableCell>
                      <TableCell align="right" sx={sxTh}>CUOTA AJUSTADA</TableCell>
                      {verDetalles && (
                        <TableCell align="right" sx={sxTh}>SALDO CIERRE</TableCell>
                      )}
                      <TableCell align="right" sx={sxTh}>PAGO</TableCell>
                      <TableCell align="right" sx={sxTh}>DIFERENCIA</TableCell>
                      <TableCell align="right" sx={sxTh}>SALDO REAL</TableCell>
                      <TableCell align="right" sx={sxTh}>ACCIONES</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {Array.isArray(cuotas) &&
                      cuotas.map((row) => {
                        const cancelada = row.cuota_cancelada && row.cuota_cancelada !== "No";
                        const cuotaCompensada = obtenerCuotaCompensada(row.compensada);
                        const cuotaQueCancelo = cancelada ? obtenerCuotaQueCancelo(row.cuota_cancelada) : null;

                        return (
                          <TableRow
                            key={row.id}
                            hover
                            sx={{
                              opacity: cancelada ? 0.6 : 1,
                              "&:hover td": { backgroundColor: "rgba(13, 58, 73, 0.03)" },
                              "&:last-child td": { borderBottom: 0 },
                            }}
                          >
                            <TableCell sx={{ ...sxTd, fontWeight: 600 }}>
                              {String(row.mes).padStart(2, "0")}/{row.anio}
                            </TableCell>

                            {verDetalles && (
                              <TableCell align="right" sx={sxTd}>{moneda(row.saldo_inicial)}</TableCell>
                            )}

                            <TableCell align="right" sx={sxTd}>{moneda(row.Amortizacion)}</TableCell>
                            <TableCell align="right" sx={sxTd}>{row.ICC}</TableCell>
                            <TableCell align="right" sx={sxTd}>{row.Ajuste_ICC}</TableCell>
                            <TableCell align="right" sx={{ ...sxTd, fontWeight: 600 }}>{moneda(row.cuota_con_ajuste)}</TableCell>

                            {verDetalles && (
                              <TableCell align="right" sx={sxTd}>{moneda(row.saldo_cierre)}</TableCell>
                            )}

                            <TableCell align="right" sx={sxTd}>{moneda(row.pago)}</TableCell>

                            <TableCell align="right" sx={sxTd}>
                              <Typography
                                component="span"
                                sx={{
                                  fontWeight: 700,
                                  fontSize: "inherit",
                                  color: row.diferencia >= 0 ? COLOR_OK : COLOR_ERROR,
                                }}
                              >
                                {moneda(row.diferencia)}
                              </Typography>
                              {cuotaCompensada && (
                                <Typography variant="caption" sx={{ display: "block", color: COLOR_MUTED }}>
                                  Compensada {String(cuotaCompensada.mes).padStart(2, "0")}/{cuotaCompensada.anio}
                                </Typography>
                              )}
                            </TableCell>

                            <TableCell align="right" sx={sxTd}>
                              {cancelada ? (
                                cuotaQueCancelo ? (
                                  <Box sx={{ textAlign: "right", whiteSpace: "normal", minWidth: 160 }}>
                                    Cuota cancelada por la de{" "}
                                    <strong>
                                      {cuotaQueCancelo.mes}/{cuotaQueCancelo.anio}
                                    </strong>
                                    <Typography variant="caption" sx={{ display: "block", color: COLOR_MUTED }}>
                                      ID cuota: {cuotaQueCancelo.id}
                                    </Typography>
                                  </Box>
                                ) : (
                                  <Box sx={{ textAlign: "right" }}>
                                    Cuota cancelada
                                    <Typography variant="caption" sx={{ display: "block", color: COLOR_MUTED }}>
                                      ID: {row.cuota_cancelada}
                                    </Typography>
                                  </Box>
                                )
                              ) : (
                                moneda(row.Saldo_real)
                              )}
                            </TableCell>

                            <TableCell align="right" sx={sxTd}>
                              <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
                                <Button
                                  size="small"
                                  variant="contained"
                                  sx={{ ...sxBtnPrimary, px: 1.75 }}
                                  onClick={() => navigate("/usuario2/pagarcuota/" + row.id)}
                                >
                                  Pagar
                                </Button>

                                <Button
                                  size="small"
                                  variant="outlined"
                                  sx={{ ...sxBtnOutlined, px: 1.75 }}
                                  onClick={() => navigate("/usuario2/pagoscuotas/" + row.id)}
                                >
                                  Ver pagos
                                </Button>

                                {row.diferencia < 0 && (
                                  <Button
                                    size="small"
                                    variant="outlined"
                                    color="warning"
                                    sx={{ textTransform: "none", fontWeight: 600, borderRadius: 1.5, px: 1.75 }}
                                    onClick={() => abrirCompensar(row.id)}
                                  >
                                    Compensar
                                  </Button>
                                )}
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              )}
            </TableContainer>
          </Paper>
        ) : null}
      </Stack>

      {/* =========================
          DIÁLOGO: COMPENSAR CUOTA
      ========================== */}
      <Dialog open={openCompensar} onClose={cerrarCompensar} maxWidth="sm" fullWidth slotProps={slotPropsDialog}>
        <DialogTitle sx={sxDialogTitle}>Compensar cuota</DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          <Box sx={{ mt: 1 }}>
            <Typography variant="caption" sx={sxLabelCampo}>
              Cuota destino
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                displayEmpty
                value={cuotaCompensada}
                onChange={(e) => setCuotaCompensada(e.target.value)}
                renderValue={(v) => {
                  if (!v) return <span style={{ color: COLOR_MUTED }}>Seleccione cuota destino</span>;
                  const c = Array.isArray(cuotas) ? cuotas.find((x) => x.id === v) : null;
                  return c
                    ? `${String(c.mes).padStart(2, "0")}/${c.anio}  -  Diferencia: ${fmt(c.diferencia)}`
                    : v;
                }}
                sx={{ borderRadius: 1.5 }}
                MenuProps={{ slotProps: { paper: { sx: { borderRadius: 2, mt: 0.5 } } } }}
              >
                {Array.isArray(cuotas) &&
                  cuotas
                    .filter((c) => c && c.id && c.id !== cuotaOrigen)
                    .map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        {`${String(c.mes).padStart(2, "0")}/${c.anio}  -  Diferencia: ${fmt(c.diferencia)}`}
                      </MenuItem>
                    ))}
              </Select>
            </FormControl>
            <Typography variant="body2" sx={{ mt: 1.25, color: COLOR_MUTED }}>
              Seleccioná la cuota destino para compensar la cuota elegida.
            </Typography>
          </Box>
        </DialogContent>

        <DialogActions sx={sxDialogActions}>
          <Button onClick={cerrarCompensar} variant="outlined" sx={sxBtnOutlined}>
            Cancelar
          </Button>
          <Button variant="contained" sx={sxBtnPrimary} onClick={confirmarCompensar}>
            Aceptar
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};
export default LotesCliente;
