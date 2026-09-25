import * as React from 'react';
import { useParams, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Alert, Checkbox, FormControlLabel, Typography, Chip } from '@mui/material';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary } from '../../../components/nivel2/detalleclienteIngresos/estilos';

import { useEffect, useState } from "react";
import servicioCuotas from '../../../services/cuotas';
import servicioUsuario from '../../../services/usuarios';
import MenuIzq2 from '../../../components/nivel2/MenuIzq2';

const drawerWidth = 240;

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default function MenuUsuario2() {
  const params = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [estadoCuotas, setestadoCuotas] = useState({ id: params.id });
  const [logueado, setLogueado] = useState(false);
  const [isValorLoteEnabled, setIsValorLoteEnabled] = useState(false);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      if (user.nivel !== 2) {
        window.localStorage.removeItem('loggedNoteAppUser');
      } else {
        setLogueado(true);
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setestadoCuotas({ ...estadoCuotas, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setIsValorLoteEnabled(e.target.checked);
  };

  const agregarCuotas = async (event) => {
    try {
      const respuesta = await servicioCuotas.agregarCuotas(estadoCuotas);
      alert(respuesta[1]);
      navigate('/usuario2/detallecliente/' + respuesta[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // ===== SOLO ESTILO (no lógica): mismo sistema visual que el resto de Nivel 2 =====
  const sxPage = { maxWidth: 980, mx: "auto", px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 };

  const sxSectionTitle = {
    fontWeight: 700,
    color: COLOR_TEXT,
    fontSize: 15,
  };

  const sxSelectWrap = {
    width: "100%",
    borderRadius: 1.5,
    border: "1px solid #c9d2d8",
    backgroundColor: "#fff",
    px: 1.5,
    height: 40,
    display: "flex",
    alignItems: "center",
    "&:hover": { borderColor: COLOR_ACCENT },
    "&:focus-within": { borderColor: COLOR_ACCENT, boxShadow: `0 0 0 1px ${COLOR_ACCENT}` },
  };

  const sxNativeSelect = {
    width: "100%",
    color: COLOR_TEXT,
    fontSize: 15,
  };

  const sxLabelMini = { fontWeight: 600, fontSize: 13, color: COLOR_TEXT, mb: 0.6 };

  const sxInput = { "& .MuiOutlinedInput-root": { borderRadius: 1.5 } };

  const sxPrimaryBtn = { ...sxBtnPrimary, py: 1, px: 3 };

  const sxDisabledHint = {
    px: 1.5,
    py: 0.75,
    borderRadius: 999,
    border: `1px solid ${COLOR_BORDER}`,
    color: COLOR_MUTED,
    fontWeight: 600,
    fontSize: 13,
  };

  return (
    <div>
      {logueado ? (
        <div> 
          <MenuIzq2>
            <Box sx={sxPage}>
              {/* Encabezado */}
              <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 }, mb: 2.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
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
                      <PlaylistAddOutlinedIcon sx={{ color: COLOR_ACCENT }} />
                    </Box>
                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: 700, fontSize: 20, textTransform: "none", color: COLOR_TEXT, m: 0, pt: 0 }}
                      >
                        Agregar cuotas
                      </Typography>
                      <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                        Configurá anticipo, fecha de inicio y parámetros del lote
                      </Typography>
                    </Box>
                  </Box>

                  <Chip variant="outlined" label={`ID: ${params.id}`} sx={{ fontWeight: 600 }} />
                </Box>
              </Paper>

              {/* Form Card */}
              <Paper elevation={0} sx={sxCard}>
                <Box sx={{ p: { xs: 2.5, md: 3 } }}>
                  <form onSubmit={agregarCuotas}>
                    <Grid container spacing={2}>
                      {/* Fecha Anticipo */}
                      <Grid size={12}>
                        <Box sx={sxSectionTitle}>Fecha Anticipo</Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={sxLabelMini}>
                          Mes
                        </Box>

                        <Box sx={sxSelectWrap}>
                          <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{ name: 'mesanticipo', id: 'uncontrolled-native' }}
                            sx={sxNativeSelect}
                          >
                            <option value={''}>Elegir</option>
                            <option value={'1'}>Enero</option>
                            <option value={'2'}>Febrero</option>
                            <option value={'3'}>Marzo</option>
                            <option value={'4'}>Abril</option>
                            <option value={'5'}>Mayo</option>
                            <option value={'6'}>Junio</option>
                            <option value={'7'}>Julio</option>
                            <option value={'8'}>Agosto</option>
                            <option value={'9'}>Septiembre</option>
                            <option value={'10'}>Octubre</option>
                            <option value={'11'}>Noviembre</option>
                            <option value={'12'}>Diciembre</option>
                          </NativeSelect>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={sxLabelMini}>
                          Año
                        </Box>

                        <Box sx={sxSelectWrap}>
                          <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{ name: 'anioanticipo', id: 'uncontrolled-native' }}
                            sx={sxNativeSelect}

                           >
                            <option value={''}>Elegir</option>
                            <option value={'2015'}>2015</option>
                            <option value={'2016'}>2016</option>
                            <option value={'2017'}>2017</option>
                            <option value={'2018'}>2018</option>
                            <option value={'2019'}>2019</option>
                            <option value={'2020'}>2020</option>
                            <option value={'2021'}>2021</option>
                            <option value={'2022'}>2022</option>
                            <option value={'2023'}>2023</option>
                            <option value={'2024'}>2024</option>
                            <option value={'2025'}>2025</option>
                              <option value={'2026'}>2026</option>
                          </NativeSelect>
                        </Box>
                      </Grid>

                      {/* Fecha inicio */}
                      <Grid size={12} sx={{ mt: 0.5 }}>
                        <Box sx={sxSectionTitle}>Fecha inicio de las cuotas</Box>
                      </Grid>


                      <Grid size={{ xs: 12, md: 6 }}>
                        <Box sx={sxLabelMini}>
                          Mes
                        </Box>

                        <Box sx={sxSelectWrap}>
                          <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{ name: 'mes', id: 'uncontrolled-native' }}
                            sx={sxNativeSelect}
                          >
                            <option value={''}>Elegir</option>
                            <option value={'1'}>Enero</option>
                            <option value={'2'}>Febrero</option>
                            <option value={'3'}>Marzo</option>
                            <option value={'4'}>Abril</option>
                            <option value={'5'}>Mayo</option>
                            <option value={'6'}>Junio</option>
                            <option value={'7'}>Julio</option>
                            <option value={'8'}>Agosto</option>
                            <option value={'9'}>Septiembre</option>
                            <option value={'10'}>Octubre</option>
                            <option value={'11'}>Noviembre</option>
                            <option value={'12'}>Diciembre</option>
                          </NativeSelect>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}><Box sx={sxLabelMini}>
                        Año
                      </Box>

                        <Box sx={sxSelectWrap}>
                          <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{ name: 'anio', id: 'uncontrolled-native' }}
                            sx={sxNativeSelect}
                          >
                            <option value={''}>Elegir</option>
                            <option value={'2015'}>2015</option>
                            <option value={'2016'}>2016</option>
                            <option value={'2017'}>2017</option>
                            <option value={'2018'}>2018</option>
                            <option value={'2019'}>2019</option>
                            <option value={'2020'}>2020</option>
                            <option value={'2021'}>2021</option>
                            <option value={'2022'}>2022</option>
                            <option value={'2023'}>2023</option>
                            <option value={'2024'}>2024</option>
                            <option value={'2025'}>2025</option>
                            <option value={'2026'}>2026</option>
                          </NativeSelect>
                        </Box>
                      </Grid>

                      {/* Inputs */}
                      <Grid size={{ xs: 12, md: 4 }}>
                        <TextField
                          autoFocus
                          id="name"
                          label="Cantidad de Cuotas"
                          placeholder="Ej: 36"
                          name="cantidad_cuotas"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={sxInput}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 8 }}>
                        <Box
                          sx={{
                            mt: 0.5,
                            px: 1.4,
                            py: 1.1,
                            borderRadius: 2,
                            border: `1px solid ${COLOR_BORDER}`,
                            backgroundColor: "#f9fafb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 2,
                            flexWrap: "wrap",
                          }}
                        >
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={isValorLoteEnabled}
                                onChange={handleCheckboxChange}
                                sx={{
                                  color: "#9aa7b0",
                                  "&.Mui-checked": { color: COLOR_ACCENT },
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 600, color: COLOR_TEXT, fontSize: 14 }}>
                                Habilitar cambiar valor total
                              </span>
                            }
                          />

                          <Box
                            sx={{
                              fontWeight: 500,
                              color: COLOR_MUTED,
                              fontSize: 12.5,
                            }}
                          >
                            Recomendado solo si necesitás recalcular el lote.
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          autoFocus
                          id="name"
                          label="Cambiar valor total"
                          placeholder="Ej: 1500000"
                          name="valordellote"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          size="small"
                          disabled={!isValorLoteEnabled}
                          sx={sxInput}
                        />
                      </Grid>

                      <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                          autoFocus
                          id="name"
                          label="Cambiar el porcentaje de anticipo"
                          placeholder="Ej: 30"
                          name="porcentaje"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          size="small"
                          sx={sxInput}
                        />
                      </Grid>

                      {/* Acciones */}
                      <Grid size={12} sx={{ mt: 0.5 }}>
                        <DialogActions sx={{ px: 0, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                          {estadoCuotas.mesanticipo && estadoCuotas.mes && estadoCuotas.anio && estadoCuotas.anioanticipo ? (
                            <Button type="submit" variant="contained" sx={sxPrimaryBtn}>
                              Enviar
                            </Button>
                          ) : (
                            <Box sx={sxDisabledHint}>Completar todos los datos</Box>
                          )}
                        </DialogActions>
                      </Grid>
                    </Grid>
                  </form>
                </Box>
              </Paper>
            </Box>
          </MenuIzq2>
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
