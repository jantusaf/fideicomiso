import React, { useState } from 'react';
import servicioLotes from '../../services/lotes'
import DialogActions from '@mui/material/DialogActions';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

/////////////actualmente para usuario legales
const Formulario = (props) => {
  // Estados para almacenar los valores de los campos
  const [lotes, setLotes] = React.useState();
  const [form, setForm] = useState({ mapa: props.info })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const determinar = async () => {

    const rta = await servicioLotes.determinarmapatodos(form)
    
    props.cerrar();
  
    props.getClients()


  }

  const cerrar = () => {

    props.cerrar();


  };
  return (
   <>
 

   <InputLabel variant="standard" htmlFor="uncontrolled-native">
     Categoria 1
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'categoria1',
       id: 'uncontrolled-native',

     }}
   ><option value={1}>Seleccionar</option>  
    <option value={"Rojo"}>Rojo</option>
     <option value={"Amarillo"}>Amarillo</option>
     <option value={"Verde"}>Verde</option>

 
   </NativeSelect>

   <InputLabel variant="standard" htmlFor="uncontrolled-native">
    <b>Categoria 2</b>
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'categoria2',
       id: 'uncontrolled-native',

     }}
   ><option value={1}>Seleccionar</option>  
    <option value={"Fideicomiso estado"}>Fideicomiso estado</option>
     <option value={"Calles Esperanza"}>Calles Esperanza</option>
     <option value={"Esperanza Gremios"}>Esperanza Gremios</option>
     <option value={"Aguedo Mensura"}>Aguedo Mensura"</option>
     <option value={"Poligono Fideicomiso Osuna"}>Poligono Fideicomiso Osuna</option>
     <option value={"Pol.Mra 12.793-U- B°Sta Catalina Seccion V"}>Pol.Mra 12.793-U- B°Sta Catalina Seccion V</option>
     <option value={"Fraccion Reserva"}>Fraccion Reserva</option>
     <option value={"Alambrados"}>Alambrados</option>
     <option value={"Poligonos Causa Frettes"}>Poligonos Causa Frettes</option>
     <option value={"juan Manuel Leyva"}>juan Manuel Leyva</option>
     <option value={"Ningun acta"}>Ningun acta</option>
   

   </NativeSelect>
   <br/>
   <TextField 
           
            margin="dense"
            id="name"
            label="Perimetro"
            name="perimetro"
            onChange={handleChange}
            size="small"
            variant="standard"
          /> <br/>
             <TextField 
           
           margin="dense"
           id="name"
           label="Superficie"
           name="superficie"
           onChange={handleChange}
           size="small"
           variant="standard"
         /><br/>
            <TextField 
           
           margin="dense"
           id="name"
           label="Parcela"
           name="parcela"
           onChange={handleChange}
           size="small"
           variant="standard"
         /> <br/>
            <TextField 
           
           margin="dense"
           id="name"
           label="Mensura"
           name="mensura"
           onChange={handleChange}
           size="small"
           variant="standard"
         /> <br/>
   <DialogActions>
     <Button onClick={determinar}>Determinar </Button>
 

     
     <Button onClick={cerrar}>Cerrar</Button>
     
   </DialogActions></>
  );
};

export default Formulario;
