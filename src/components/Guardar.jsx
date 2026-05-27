import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import loginService from '../services/usuarios'


import {
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";

const Guardar = () => {
  const [cliente, setCliente] = useState({
    cuil_cuit: "",
    algo: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
   
  }, []);


  const guardarSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      
        const response = await await loginService.usuarios({
          cuil_cuit: cliente.cuil_cuit,
          algo: cliente.algo
        })
        
      /*    fetch("http://localhost:4000/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        }); 
        await response.json();*/
      

      setLoading(false);
    //  navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) =>
    setCliente({ ...cliente, [e.target.name]: e.target.value });

  return (
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
            {editing ? "Update Task" : "Create Task"}
          </Typography>
          <CardContent>
            <form onSubmit={guardarSubmit}>
              <TextField
                variant="filled"
                label="Write your Title"
                sx={{
                  display: "block",
                  margin: ".5rem 0",
                }}
                name="cuil_cuit"
                onChange={handleChange}
                value={cliente.cuil_cuit}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />
              <TextField
                variant="outlined"
                label="Write your Description"
                multiline
                rows={4}
                sx={{
                  display: "block",
                  margin: ".5rem 0",
                }}
                name="algo"
                onChange={handleChange}
                value={cliente.algo}
                inputProps={{ style: { color: "white" } }}
                InputLabelProps={{ style: { color: "white" } }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={!cliente.cuil_cuit || !cliente.algo}
              >
                {loading ? (
                  <CircularProgress color="inherit" size={25} />
                ) : (
                  "Save"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </Grid>

    </>
  );
};

export default Guardar;