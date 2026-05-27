import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loginService from '../services/login'
import {
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import servicioUsuario from '../services/usuarios'

const Login = () => {

    const [usuario, setUsuario] = useState({
        cuil_cuit: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    //const [editing, setEditing] = useState(false);

    const navigate = useNavigate();
    const params = useParams();

    let user =''



 const loginSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  setErrorCredenciales(""); // ✅ limpia el mensaje anterior

  try {
    const user = await loginService.login({
      cuil_cuit: usuario.cuil_cuit,
      password: usuario.password
    });

    window.localStorage.setItem('loggedNoteAppUser', JSON.stringify(user));
    servicioUsuario.setToken(user.token);
    setUser(user);

    setLoading(false);

    switch(user.nivel){
      case 1: navigate('/usuario/menu'); window.location.reload(true); break;
      case 2: navigate('/usuario2/clientes'); window.location.reload(true); break;
      case 3: navigate('/nivel3'); window.location.reload(true); break;
      case 4: navigate('/legales/clientes'); window.location.reload(true); break;
      case 5: navigate('/usuariomapas/inicio'); break;
      case 10: navigate('/admin/usuarios'); window.location.reload(true); break;
      default: break;
    }

  } catch (error) {
    console.error(error);
    console.log('error credenciales');

    setLoading(false);

    // ✅ en vez de alert + reload
    setErrorCredenciales("error credenciales");
    // ❌ NO window.location.reload(true);
    // ❌ NO alert(...)
  }
};


    const pediuser =  (event) =>{
        return(user)
    }
    const handleChange = (e) =>
        setUsuario({ ...usuario, [e.target.name]: e.target.value });

    return(
    <>
    <Grid
        container
        alignItems="center"
        direction="column"
        justifyContent="center"
    >
        <Grid item xs={3}>
            <Card
                sx={{ mt: 5 }}
                style={{
                    backgroundColor: "#1E272E",
                    padding: "1rem",
                }}
            > 
                <Typography variant="h5" textAlign="center" color="white">
                    Ingresar
                </Typography>
                <CardContent>
                    <form onSubmit={loginSubmit}>
                        <TextField
                            variant="filled"
                            label="Cuil/cuit"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            name="cuil_cuit"
                            onChange={handleChange}
                            value={usuario.cuil_cuit}
                            inputProps={{ style: { color: "white" } }}
                            InputLabelProps={{ style: { color: "white" } }}
                        />
                        <TextField
                            variant="outlined"
                            label="Contraseña"
                            type="password"
                            sx={{
                                display: "block",
                                margin: ".5rem 0",
                            }}
                            name="password"
                            onChange={handleChange}
                            value={usuario.password}
                            inputProps={{ style: { color: "white" } }}
                            InputLabelProps={{ style: { color: "white" } }}
                        />
                  
                        <Button
                            type="submit"
                            variant="contained"
                            color="#002d57"
                            disabled={!usuario.cuil_cuit || !usuario.password}
                        >
                            {loading ? (
                                <CircularProgress color="inherit" size={25} />
                            ) : (
                                "Ingresar"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Grid>
    </Grid>
    </> 
    )
}

export default Login;