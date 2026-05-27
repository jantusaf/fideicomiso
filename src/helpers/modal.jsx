import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import NativeSelect from '@mui/material/NativeSelect';
import Tooltip from '@material-ui/core/Tooltip';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import React, { useEffect, useState, Fragment } from "react";
import DialogActions from '@mui/material/DialogActions';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import Featured from '../../estadisticas/featured/Featured'
import { useParams } from "react-router-dom"
import InputLabel from '@mui/material/InputLabel';
import Logoesme from '../Assets/marcas.jpg';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';



export default function SelectTextFields(props) {
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext
  const [profesores, setProfesores] = useState()
 
  const [mostrarDialogo, setMostrarDialogo] = useState(false);
  const [activo, setActivo] = useState(false)
  const [rta, setRta] = useState()






  const [inscripcion, setInscripcion] = useState({
    id:props.id
  
  })


  const handleClickOpen = () => {
    traer()
    setOpen(true);
  };
  const traer = async () => {
  
 //    const not = await servicioPersonas.traerencargados()
    
   //  setProfesores(not)
    
//setActivo(true)
    
    }
      //
  const handleClose = () => {
    setMostrarDialogo(false)
    setActivo(false)
    setOpen(false);
  };

  
  const handleChange = (e) => {
    console.log(inscripcion)
  
    setInscripcion({ ...inscripcion, [e.target.name]: e.target.value })
}
  



  ////
  const handleDeterminar = async (event) => {

   

      await servicioTurnos.modificarTurno(
        inscripcion


      )
      setRta('Realizado')
      setMostrarDialogo(true)
      props.getClients()
     
   
    
  };/////
  const [currency, setCurrency] = React.useState('EUR');

  /*   const handleChange = (event) => {
      setCurrency(event.target.value);
    }; */
    const islogo = {
      width: "20%",
      height: "20%",
      margin: 0,
      padding: 0,
      display: "flex",
  
  };

  return (
<>
 < Tooltip title="Modificaciones">
       <Button variant="contained" onClick={handleClickOpen} style={{minWidth: '150px'}}>  Modificar     </Button>
    
      </Tooltip>
      {!mostrarDialogo ? <>
    
    <Box

      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      
      <Dialog open={open} onClose={handleClose}>

   
        <DialogContent>
      {  props.id}
        <h2>Modificar el horario de la clase</h2>
  
         
                 <br />
                 <label>Definir la descripcion </label>
                 <InputLabel variant="standard" htmlFor="uncontrolled-native">
                             
                            </InputLabel>
                            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Horario del curso"
            name={props.name1}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
     <label>Asignar encargado </label>
                 <InputLabel variant="standard" htmlFor="uncontrolled-native">
                             
                            </InputLabel>
                            <NativeSelect
                                defaultValue={30}
                                onChange={handleChange}
                                inputProps={{
                                    name: 'id_encargado',
                                    id: 'uncontrolled-native',

                                }}
                            >  
                             <option value={'Pendiente'}>Asignar</option>
                            {activo ? <>
                            
                              {profesores.map((row) => (
                                       
                                        <option value={row.id}> {row.nombre}</option>

                              ))}
                            
                            </> : <>
                             <option value={'Pendiente'}>Asignar</option></>}
                           

                            </NativeSelect>
   
   

                 <DialogActions>
         <Button variant="contained" color="primary"   onClick={handleDeterminar} >Modificar</Button>
          <Button  variant="outlined" color="error" style={{ marginLeft: "auto" }} onClick={handleClose}>Cancelar</Button>
         
        </DialogActions>
           
         
        </DialogContent>
      
      </Dialog>
    </Box >
    </>:<>
    <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
      <DialogTitle id="alert-dialog-title" style={{ display: 'flex', alignItems: 'center' }}>
  <div>
    {"Escuela de mujeres emprendedoras"}
  </div>
  <img style={islogo} src={Logoesme} alt="logo" />
</DialogTitle>
        <DialogContent>
      
          <DialogContentText id="alert-dialog-description">
{rta ? <>{rta}</>:<></> }         
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Entendido</Button>
          
           
          
        </DialogActions>
      </Dialog>
      </>}
   </>
  );
}
