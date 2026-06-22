import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import loginService from '../../services/login';
import servicioUsuario from '../../services/usuarios';

import {
  Button, Box, TextField, Typography,
  CircularProgress, InputAdornment, IconButton,
  Alert, Checkbox, FormControlLabel, Divider,
} from "@mui/material";

import Visibility    from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import marcas from '../../Assets/marcas.png';

/* ── estilos compartidos de input ── */
const inputSx = {
  mb: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: '#f8fafc',
    '& fieldset':           { borderColor: '#e2e8f0' },
    '&:hover fieldset':     { borderColor: '#0B3546' },
    '&.Mui-focused fieldset': { borderColor: '#0B3546', borderWidth: 2 },
    '&.Mui-error fieldset': { borderColor: '#ef4444' },
  },
  '& .MuiInputLabel-root.Mui-focused': { color: '#0B3546' },
};

const labelSx = {
  display: 'block',
  variant: 'caption',
  fontWeight: 700,
  fontSize: 11,
  color: '#64748b',
  letterSpacing: 0.8,
  mb: 0.5,
};

const btnSx = {
  height: 48, borderRadius: '12px', fontWeight: 700,
  fontSize: 15, letterSpacing: 0.4, textTransform: 'none',
  background: 'linear-gradient(135deg, #0B3546, #072637)',
  boxShadow: '0 6px 20px rgba(11,53,70,0.28)',
  '&:hover': {
    background: 'linear-gradient(135deg, #092d3e, #051e2b)',
    boxShadow: '0 8px 24px rgba(11,53,70,0.38)',
    transform: 'translateY(-1px)',
  },
  '&:active': { transform: 'translateY(0)' },
  transition: 'all 0.2s ease',
};

/* ══════════════════════════════════════════════ */
const Login = () => {
  const navigate = useNavigate();

  /* login */
  const [usuario,           setUsuario]           = useState({ cuil_cuit: '', password: '' });
  const [loading,           setLoading]           = useState(false);
  const [errorLogin,        setErrorLogin]        = useState('');
  const [showPass,          setShowPass]          = useState(false);
  const [recordar,          setRecordar]          = useState(false);

  /* registro */
  const [modoRegistro,      setModoRegistro]      = useState(false);
  const [registro,          setRegistro]          = useState({ nombre: '', cuil_cuit: '', mail: '', password: '' });
  const [showPassReg,       setShowPassReg]       = useState(false);
  const [loadingReg,        setLoadingReg]        = useState(false);
  const [errorRegistro,     setErrorRegistro]     = useState('');
  const [successRegistro,   setSuccessRegistro]   = useState('');

  /* ── redirigir si ya está logueado ── */
  useEffect(() => {
    const json = window.localStorage.getItem('loggedNoteAppUser');
    if (!json) return;
    const u = JSON.parse(json);
    const rutas = {
      1: '/usuario/menu', 2: '/usuario2/clientes', 3: '/nivel3/',
      4: '/legales/clientes', 5: '/usuariomapas/inicio', 6: '/nivel6/carga',
    };
    if (rutas[u.nivel]) navigate(rutas[u.nivel]);
  }, [navigate]);

  /* ── helpers de navegación post-login ── */
  const redirigir = (nivel) => {
    const rutas = {
      1: '/usuario/menu', 2: '/usuario2/clientes', 3: '/nivel3',
      4: '/legales/clientes', 5: '/usuariomapas/inicio', 6: '/nivel6/carga',7:'/mov2/resumen1',
      10: '/admin/usuarios',
    };
    if (rutas[nivel]) { navigate(rutas[nivel]); window.location.reload(); }
  };

  /* ── submit login ── */
  const loginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorLogin('');
    try {
      const user = await loginService.login(usuario);
      window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
      servicioUsuario.setToken(user.token);
      setLoading(false);
      redirigir(user.nivel);
    } catch {
      setLoading(false);
      setErrorLogin('Cuil/Cuit y/o contraseña incorrectos');
    }
  };

  /* ── submit registro ── */
  const registroSubmit = async (e) => {
    e.preventDefault();
    setLoadingReg(true);
    setErrorRegistro('');
    setSuccessRegistro('');
    try {
      await servicioUsuario.registro(registro);
      setLoadingReg(false);
      setSuccessRegistro('Cuenta creada correctamente. Ya podés iniciar sesión.');
      setTimeout(() => { setModoRegistro(false); setSuccessRegistro(''); }, 2500);
    } catch {
      setLoadingReg(false);
      setErrorRegistro('No se pudo crear la cuenta. Revisá los datos e intentá nuevamente.');
    }
  };

  /* ── cambio de campos ── */
  const handleLogin   = (e) => setUsuario  ({ ...usuario,  [e.target.name]: e.target.value });
  const handleRegistro = (e) => setRegistro ({ ...registro, [e.target.name]: e.target.value });

  /* ════════════════════════════════ RENDER ════════════════════════════════ */
  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

      {/* ── Panel izquierdo: imagen ── */}
      <Box sx={{
        display: { xs: 'none', md: 'flex' }, flex: 1,
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #051821 0%, #0a3040 60%, #0f4a5c 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <Box sx={{ position:'absolute', width:500, height:500, borderRadius:'50%', top:-100, left:-100,
          background:'rgba(20,141,141,0.06)', pointerEvents:'none' }} />
        <Box sx={{ position:'absolute', width:350, height:350, borderRadius:'50%', bottom:-80, right:-60,
          background:'rgba(20,141,141,0.08)', pointerEvents:'none' }} />
        <Box sx={{ position:'relative', zIndex:1, textAlign:'center', px:6 }}>
          <Box component="img" src={marcas} alt="Logo"
            sx={{ width:'100%', maxWidth:460, filter:'drop-shadow(0 8px 32px rgba(0,0,0,0.4))' }} />
        </Box>
      </Box>

      {/* ── Panel derecho: formulario ── */}
      <Box sx={{
        width: { xs:'100%', md:'45%' },
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#ffffff', px: { xs:3, sm:6 },
        overflowY: 'auto',
      }}>
        <Box sx={{ width:'100%', maxWidth:400, py:4 }}>

          {/* ────────── FORMULARIO LOGIN ────────── */}
          {!modoRegistro && (
            <>
              <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={800}
                  sx={{ color: '#0B3546', letterSpacing:'-0.5px', mb:0.5 }}>
                  Bienvenido
                </Typography>
                <Typography variant="body2" sx={{ color:'#94a3b8' }}>
                  Ingresá tus credenciales para continuar
                </Typography>
              </Box>

              {errorLogin && (
                <Alert severity="error" sx={{ mb:2, borderRadius:'12px', fontSize:13 }}>
                  {errorLogin}
                </Alert>
              )}

              <Box component="form" onSubmit={loginSubmit} noValidate>

                <Typography sx={labelSx}>CUIL / CUIT</Typography>
                <TextField fullWidth name="cuil_cuit" placeholder="Ej: 20-12345678-9"
                  value={usuario.cuil_cuit} onChange={handleLogin}
                  variant="outlined" error={!!errorLogin} sx={{ ...inputSx, mt:0 }} />

                <Typography sx={labelSx}>CONTRASEÑA</Typography>
                <TextField fullWidth name="password" placeholder="••••••••"
                  type={showPass ? 'text' : 'password'}
                  value={usuario.password} onChange={handleLogin}
                  variant="outlined" error={!!errorLogin} sx={{ ...inputSx, mt:0 }}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPass(p => !p)} edge="end" size="small" sx={{ color:'#94a3b8' }}>
                        {showPass ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />

                <FormControlLabel
                  control={
                    <Checkbox checked={recordar} onChange={e => setRecordar(e.target.checked)}
                      sx={{ color:'#0B3546', '&.Mui-checked':{ color:'#0B3546' } }} />
                  }
                  label={<Typography variant="body2" sx={{ color:'#64748b' }}>Recordarme</Typography>}
                  sx={{ mb: 1 }}
                />

                <Button type="submit" fullWidth variant="contained" disabled={loading} sx={btnSx}>
                  {loading ? <CircularProgress size={22} sx={{ color:'#fff' }} /> : 'Ingresar'}
                </Button>

              </Box>

              <Divider sx={{ my: 3, borderColor:'#f1f5f9' }} />

              <Box sx={{ textAlign:'center' }}>
                <Typography variant="body2" sx={{ color:'#94a3b8' }}>
                  ¿No tenés cuenta?{' '}
                  <Typography component="span" variant="body2"
                    onClick={() => { setModoRegistro(true); setErrorLogin(''); }}
                    sx={{ color:'#0B3546', fontWeight:700, cursor:'pointer',
                      '&:hover':{ textDecoration:'underline' } }}>
                    Registrarse
                  </Typography>
                </Typography>
              </Box>
            </>
          )}

          {/* ────────── FORMULARIO REGISTRO ────────── */}
          {modoRegistro && (
            <>
              <Box sx={{ display:'flex', alignItems:'center', gap:1, mb:3 }}>
                <IconButton onClick={() => { setModoRegistro(false); setErrorRegistro(''); setSuccessRegistro(''); }}
                  size="small" sx={{ color:'#0B3546' }}>
                  <ArrowBackIcon fontSize="small" />
                </IconButton>
                <Box>
                  <Typography variant="h5" fontWeight={800} sx={{ color:'#0B3546', letterSpacing:'-0.5px' }}>
                    Crear cuenta
                  </Typography>
                  <Typography variant="body2" sx={{ color:'#94a3b8' }}>
                    Completá tus datos para registrarte
                  </Typography>
                </Box>
              </Box>

              {errorRegistro && (
                <Alert severity="error" sx={{ mb:2, borderRadius:'12px', fontSize:13 }}>{errorRegistro}</Alert>
              )}
              {successRegistro && (
                <Alert severity="success" sx={{ mb:2, borderRadius:'12px', fontSize:13 }}>{successRegistro}</Alert>
              )}

              <Box component="form" onSubmit={registroSubmit} noValidate>

                <Typography sx={labelSx}>NOMBRE COMPLETO</Typography>
                <TextField fullWidth name="nombre" placeholder="Juan Pérez"
                  value={registro.nombre} onChange={handleRegistro}
                  variant="outlined" error={!!errorRegistro} sx={{ ...inputSx, mt:0 }} />

                <Typography sx={labelSx}>CUIL / CUIT</Typography>
                <TextField fullWidth name="cuil_cuit" placeholder="Ej: 20-12345678-9"
                  value={registro.cuil_cuit} onChange={handleRegistro}
                  variant="outlined" error={!!errorRegistro} sx={{ ...inputSx, mt:0 }} />

                <Typography sx={labelSx}>CORREO ELECTRÓNICO</Typography>
                <TextField fullWidth name="mail" type="email" placeholder="correo@ejemplo.com"
                  value={registro.mail} onChange={handleRegistro}
                  variant="outlined" error={!!errorRegistro} sx={{ ...inputSx, mt:0 }} />

                <Typography sx={labelSx}>CONTRASEÑA</Typography>
                <TextField fullWidth name="password" placeholder="••••••••"
                  type={showPassReg ? 'text' : 'password'}
                  value={registro.password} onChange={handleRegistro}
                  variant="outlined" error={!!errorRegistro} sx={{ ...inputSx, mt:0 }}
                  InputProps={{ endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassReg(p => !p)} edge="end" size="small" sx={{ color:'#94a3b8' }}>
                        {showPassReg ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  )}} />

                <Button type="submit" fullWidth variant="contained" disabled={loadingReg} sx={{ ...btnSx, mt:1 }}>
                  {loadingReg ? <CircularProgress size={22} sx={{ color:'#fff' }} /> : 'Crear cuenta'}
                </Button>

              </Box>
            </>
          )}

        </Box>
      </Box>
    </Box>
  );
};

export default Login;
