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
import { Alert, Checkbox, FormControlLabel } from '@mui/material';

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

  // ===== SOLO ESTILO (no lógica) =====
  const sxPage = {
    px: { xs: 1.5, md: 3 },
    py: 2.5,
    minHeight: "100vh",
    background:
      "radial-gradient(1100px 520px at 10% 0%, rgba(1,86,124,0.14), transparent 55%), radial-gradient(900px 420px at 90% 10%, rgba(20,141,141,0.10), transparent 45%), #f4f8fb",
  };

  const sxHeader = {
    borderRadius: 3,
    overflow: "hidden",
    border: "1px solid rgba(1,86,124,0.12)",
    boxShadow: "0 18px 45px rgba(10,59,79,0.10)",
    background: "linear-gradient(135deg, #0b2a3a 0%, #01567c 60%, #148D8D 100%)",
    color: "#fff",
    px: { xs: 2, md: 3 },
    py: { xs: 2, md: 2.4 },
    mb: 2,
  };

  const sxCard = {
    borderRadius: 3,
    border: "1px solid #e8eef5",
    boxShadow: "0 18px 45px rgba(10,59,79,0.08)",
    overflow: "hidden",
    backgroundColor: "#fff",
  };

  const sxSectionTitle = {
    fontWeight: 900,
    color: "#0a3b4f",
    fontSize: 14,
    mb: 1,
    letterSpacing: 0.2,
  };

  const sxSelectWrap = {
    width: "100%",
    borderRadius: 2,
    border: "1px solid rgba(1,86,124,0.18)",
    backgroundColor: "#fbfdff",
    px: 1.4,
    py: 1.1,
    transition: "0.18s ease",
    "&:hover": {
      borderColor: "rgba(1,86,124,0.35)",
      backgroundColor: "rgba(1,86,124,0.03)",
    },
  };

  const sxNativeSelect = {
    width: "100%",
    fontWeight: 800,
    color: "#0a3b4f",
    outline: "none",
    border: "none",
    background: "transparent",
    fontSize: 14,
  };

  const sxInput = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: "#fbfdff",
      "& fieldset": { borderColor: "rgba(1,86,124,0.18)" },
      "&:hover fieldset": { borderColor: "rgba(1,86,124,0.35)" },
      "&.Mui-focused fieldset": { borderColor: "#01567c" },
      "&.Mui-focused": { boxShadow: "0 0 0 3px rgba(1,86,124,0.12)" },
    },
    "& .MuiInputLabel-root": {
      fontWeight: 900,
      color: "#2b3a42",
    },
    "& input::placeholder": {
      opacity: 0.75,
      fontWeight: 700,
    },
  };


  const sxPrimaryBtn = {
    px: 2.4,
    py: 1.1,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 900,
    backgroundColor: "#01567c",
    boxShadow: "0 10px 25px rgba(1,86,124,0.22)",
    "&:hover": { backgroundColor: "#014a6b" },
  };

  const sxDisabledHint = {
    mt: 1,
    px: 1.4,
    py: 1,
    borderRadius: 2,
    backgroundColor: "rgba(211,47,47,0.06)",
    border: "1px solid rgba(211,47,47,0.14)",
    color: "#b71c1c",
    fontWeight: 900,
    fontSize: 13,
  };

  return (
    <div>
      {logueado ? (
        <div> 
          <MenuIzq2>
            <Box sx={sxPage}>
              {/* Header */}
              <Box sx={sxHeader}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Box sx={{ fontWeight: 900, letterSpacing: 0.3, fontSize: 16 }}>
                      Agregar cuotas
                    </Box>
                    <Box sx={{ opacity: 0.92, mt: 0.4, fontSize: 13, fontWeight: 700 }}>
                      Configurá anticipo, fecha de inicio y parámetros del lote.
                    </Box>
                  </Box>

                  <Box
                    sx={{
                      px: 1.2,
                      py: 0.7,
                      borderRadius: 2,
                      backgroundColor: "rgba(255,255,255,0.14)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      fontWeight: 900,
                      fontSize: 13,
                      whiteSpace: "nowrap",
                    }}
                  >
                    ID: {params.id}
                  </Box>
                </Box>
              </Box>

              {/* Form Card */}
              <Paper sx={sxCard}>
                <Box sx={{ p: { xs: 2, md: 2.6 } }}>
                  <form onSubmit={agregarCuotas}>
                    <Grid container spacing={2}>
                      {/* Fecha Anticipo */}
                      <Grid item xs={12}>
                        <Box sx={sxSectionTitle}>Fecha Anticipo</Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Box sx={{ fontWeight: 900, fontSize: 12.5, color: "rgba(10,59,79,0.75)", mb: 0.6 }}>
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

                      <Grid item xs={12} md={6}>
                        <Box sx={{ fontWeight: 900, fontSize: 12.5, color: "rgba(10,59,79,0.75)", mb: 0.6 }}>
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
                      <Grid item xs={12} sx={{ mt: 0.5 }}>
                        <Box sx={sxSectionTitle}>Fecha inicio de las cuotas</Box>
                      </Grid>


                      <Grid item xs={12} md={6}>
                        <Box sx={{ fontWeight: 900, fontSize: 12.5, color: "rgba(10,59,79,0.75)", mb: 0.6 }}>
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

                      <Grid item xs={12} md={6}><Box sx={{ fontWeight: 900, fontSize: 12.5, color: "rgba(10,59,79,0.75)", mb: 0.6 }}>
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
                      <Grid item xs={12} md={4}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Cantidad de Cuotas"
                          placeholder="Ej: 36"
                          name="cantidad_cuotas"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          sx={sxInput}
                        />
                      </Grid>

                      <Grid item xs={12} md={8}>
                        <Box
                          sx={{
                            mt: 0.5,
                            px: 1.4,
                            py: 1.1,
                            borderRadius: 2,
                            border: "1px solid rgba(1,86,124,0.12)",
                            backgroundColor: "rgba(1,86,124,0.04)",
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
                                  color: "#01567c",
                                  "&.Mui-checked": { color: "#148D8D" },
                                }}
                              />
                            }
                            label={
                              <span style={{ fontWeight: 900, color: "#0a3b4f" }}>
                                Habilitar cambiar valor total
                              </span>
                            }
                          />

                          <Box
                            sx={{
                              fontWeight: 900,
                              color: "rgba(10,59,79,0.70)",
                              fontSize: 12.5,
                            }}
                          >
                            Recomendado solo si necesitás recalcular el lote.
                          </Box>
                        </Box>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Cambiar valor total"
                          placeholder="Ej: 1500000"
                          name="valordellote"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          disabled={!isValorLoteEnabled}
                          sx={sxInput}
                        />
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <TextField
                          autoFocus
                          margin="dense"
                          id="name"
                          label="Cambiar el porcentaje de anticipo"
                          placeholder="Ej: 30"
                          name="porcentaje"
                          onChange={handleChange}
                          fullWidth
                          variant="outlined"
                          sx={sxInput}
                        />
                      </Grid>

                      {/* Acciones */}
                      <Grid item xs={12} sx={{ mt: 0.5 }}>
                        <DialogActions sx={{ px: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
