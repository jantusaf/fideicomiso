import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import loginService from "../../services/login";
import servicioUsuario from "../../services/usuarios";

import {
  Button,
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Avatar,
  Link,
  FormControlLabel,
  Checkbox,
  Alert,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";


import marcas from "../../Assets/marcas.png";

const Login = () => {
  const [errorCredenciales, setErrorCredenciales] = useState("");

  const [usuario, setUsuario] = useState({
    cuil_cuit: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem("loggedNoteAppUser");

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);

      switch (user.nivel) {
        case 1:
          navigate("/usuario/menu");
          break;

        case 2:
          navigate("/usuario2/clientes");
          break;

        case 3:
          navigate("/nivel3");
          break;

        case 4:
          navigate("/legales/clientes");
          break;

        case 5:
          navigate("/usuariomapas/inicio");
          break;

        case 6:
          navigate("/nivel6/carga");
          break;

        default:
          break;
      }
    }
  }, [navigate]);

  const handleLogout = () => {
    setUser(null);

    if (user?.token) {
      servicioUsuario.setToken(user.token);
    }

    window.localStorage.removeItem("loggedNoteAppUser");
  };

const loginSubmit = async (event) => {
  event.preventDefault();

  setLoading(true);
  setErrorCredenciales("");

  try {
    const user = await loginService.login({
      cuil_cuit: usuario.cuil_cuit,
      password: usuario.password,
    });

    console.log("LOGIN OK", user);

    // guardar primero
    window.localStorage.setItem(
      "loggedNoteAppUser",
      JSON.stringify(user)
    );

    // guardar token
    servicioUsuario.setToken(user.token);

    // actualizar estado
    setUser(user);

    // pequeña espera para evitar rebote
    await new Promise((resolve) =>
      setTimeout(resolve, 300)
    );

    setLoading(false);

    // asegurar número
    const nivel = Number(user.nivel);

    switch (nivel) {
      case 1:
        navigate("/usuario/menu");
        break;

      case 2:
        navigate("/usuario2/clientes");
        break;

      case 3:
        navigate("/nivel3");
        break;

      case 4:
        navigate("/legales/clientes");
        break;

      case 5:
        navigate("/usuariomapas/inicio");
        break;

      case 6:
        navigate("/nivel6/carga");
        break;

      case 10:
        navigate("/admin/usuarios");
        break;

      default:
        navigate("/");
        break;
    }

  } catch (error) {
    console.error(error);

    setLoading(false);

    setErrorCredenciales(
      "Cuil/Cuit y/o contraseña incorrectos"
    );
  }
};

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Grid
      container
      component="main"
      sx={{
        minHeight: "100vh",
      }}
    >
      {/* Lado izquierdo */}
      <Grid
        item
        xs={false}
        md={6}
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
          background: "#051821",
          color: "white",
        }}
      >
        <Box
          component="img"
          src={marcas}
          alt="Logo"
          sx={{
            width: 700,
            maxWidth: "100%",
          }}
        />
      </Grid>

      {/* Lado derecho */}
      <Grid
        item
        xs={12}
        md={6}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#051821",
          p: 2,
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 420,
          }}
        >
          <Card
            elevation={10}
            sx={{
              borderRadius: 4,
              p: 4,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Avatar
                sx={{
                  m: 1,
                  bgcolor: "#002d57",
                  width: 56,
                  height: 56,
                }}
              >
                <LockOutlinedIcon />
              </Avatar>

              <Typography
                component="h1"
                variant="h5"
                fontWeight="bold"
              >
                BIENVENIDO
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 1,
                  mb: 3,
                  textAlign: "center",
                }}
              >
                Iniciar Sesión
              </Typography>
            </Box>

            {errorCredenciales && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {errorCredenciales}
              </Alert>
            )}

            <Box
              component="form"
              onSubmit={loginSubmit}
              noValidate
            >
              <TextField
                fullWidth
                margin="normal"
                label="Cuil/Cuit"
                name="cuil_cuit"
                value={usuario.cuil_cuit}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                fullWidth
                margin="normal"
                label="Contraseña"
                type="password"
                name="password"
                value={usuario.password}
                onChange={handleChange}
                variant="outlined"
              />

              <Box sx={{ mt: 1 }}>
                <Link
                  component="button"
                  variant="body2"
                  underline="hover"
                >
                 {/*  <RecuperoC /> */}
                </Link>
              </Box>

              <FormControlLabel
                control={<Checkbox color="primary" />}
                label="Recordarme"
                sx={{ mt: 1 }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={
                  loading ||
                  !usuario.cuil_cuit ||
                  !usuario.password
                }
                sx={{
                  background: "#148D8D",
                  mt: 2,
                  mb: 2,
                  height: 45,
                  fontWeight: "bold",
                }}
              >
                {loading ? (
                  <CircularProgress
                    size={25}
                    sx={{ color: "white" }}
                  />
                ) : (
                  "Ingresar"
                )}
              </Button>

              <Grid container justifyContent="center">
                <Typography variant="body2">
                  ¿No estás registrado? {/* <Registro /> */}
                </Typography>
              </Grid>
            </Box>
          </Card>
        </Box>
      </Grid>
    </Grid>
  );
};

export default Login;