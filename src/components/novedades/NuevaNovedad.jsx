import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {  useState } from "react";
import servicioNovedades from '../../services/novedades'
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import { Paper } from '@mui/material';


export default function ClienteNuevo(props) {
  let params = useParams()
    let cuil_cuit = params.cuil_cuit
   
  const [open, setOpen] = React.useState(false);
  const [form, setForm] = useState({})
  const [caracteres, setCaracteres] = useState(0)

  const handleChange = (e) =>{
    setForm({  ...form, [e.target.name]: e.target.value }) 
    console.log(form)
 }
 const handleChange2 = (e) =>{
  handleChange(e) 
  setCaracteres((form.detalle.length))
  


}
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleDeterminar = async (event) => {
    event.preventDefault();
    try {

      await servicioNovedades.crear(form)
 
     
     } catch (error) {
       console.error(error);
       console.log('Error algo sucedio')
   
     
     }
     props.getClients()
   
    setOpen(false);
  };
  
  const handleClose = () => {
    setOpen(false);
   
  };

  return (
    <div>


      <Button variant="outlined" onClick={handleClickOpen}>
      Nueva Novedad <PersonAddAlt1Icon/>
      </Button>
      <Dialog open={open} onClose={handleClose}>
     
        <DialogTitle>Nueva Novedad  </DialogTitle>
        <Paper
        sx={{
          cursor: 'pointer',
          background: '#fafafa',
          color: '#bdbdbd',
          border: '1px dashed #ccc',
          '&:hover': { border: '1px solid #ccc' },
        }}
      >
        <DialogContent>
          <DialogContentText>
       Nueva Novedad
          </DialogContentText>
          <form  onSubmit={handleDeterminar}> 
      
      
            <InputLabel  variant="standard" htmlFor="uncontrolled-native">
                         Dirigido a
                        </InputLabel>
                        <NativeSelect
                            defaultValue={30}
                            onChange={handleChange}
                            inputProps={{
                                name: 'dirigido',
                                id: 'uncontrolled-native',
                               
                            }}
                        >   <option  value={'todos'}>Elegir</option>
                            <option   value={'todos'}>Todos</option>
                            <option  value={'dirigidoa'}>Una Persona</option>
                         
                        </NativeSelect>    
           
                  
                        <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Numero (con guiones)"
            name="cuil_cuit"
            onChange={handleChange}
            fullWidth
            variant="standard"
            maxRows="13"
          />
                                   
              <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Asunto"
            name="asunto"
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          
              <TextField
            autoFocus
            margin="dense"
            id="name"
            label="detalle"
            name="detalle"
            multiline
            rows={4}
            onChange={handleChange2}
            fullWidth
            variant="standard"
          />
       <InputLabel  variant="standard" htmlFor="uncontrolled-native">
                            {form.detalle > 0 ? <>Caracteres: {caracteres + 1 }/9999</> : <>Caracteres: {caracteres  }/9999</>}
                         


                        </InputLabel>
          <DialogActions>
          { form.detalle && form.dirigido  && form.asunto ? <><Button variant="contained" color="primary"  type="submit">Crear</Button></> : <><h6  style={{color: "red"}} >Completar todos los campos</h6></> } 
          <Button  variant="outlined" color="error" style={{ marginLeft: "auto" }} onClick={handleClose}>Cancelar</Button>
         
        </DialogActions>
           </form>
         

        </DialogContent>
      
        </Paper>
        
      </Dialog>
      
    </div>
  );
}
