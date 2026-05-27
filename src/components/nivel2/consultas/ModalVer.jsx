import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import servicioNovedades from '../../../services/novedades'
import NativeSelect from '@mui/material/NativeSelect';
import Tooltip from "@mui/material/Tooltip";
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import React, { useEffect, useState, Fragment } from "react";
const currencies = [
  {
    value: 'CBU',
    label: 'CBU N°1',
  },
  {
    value: 'CBU',
    label: 'CBU N°2',
  },


  
];

export default function SelectTextFields(props) {
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext

  const [novedad, setNovedad] = useState({})
  const [activo, setActivo] = useState(false)




  const traer = async () => {
    
   const nov = await servicioNovedades.leer(props.id)

  await setNovedad(nov)

   setActivo(true)

  }

  const preba = JSON.parse(window.localStorage.getItem('loggedNoteAppUser'))
  const cuil_cuit = preba.cuil_cuit

  const [pago, setPago] = useState({

    cuil_cuit: cuil_cuit,
    id:props.id


  })


  const handleClickOpen = () => {
    setOpen(true);
    traer()
    
  };

  const handleClose = () => {
    setOpen(false);
  };

  

  const [currency, setCurrency] = React.useState('EUR');

  /*   const handleChange = (event) => {
      setCurrency(event.target.value);
    }; */


  return (


    
    
    <Box

      sx={{
        '& .MuiTextField-root': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
       < Tooltip title="Leer">
      <FindInPageTwoToneIcon variant="outlined" onClick={handleClickOpen}/>
      </Tooltip>
      <Dialog open={open} onClose={handleClose}>
        <DialogContent>

            {activo ?   
             <div>
             <h3>Novedad: 
              <br/>
              Asunto: {novedad[0].asunto} </h3>
             
               
   
   
                 <br />
                 <label>{novedad[0].detalle}</label>
                
   
   
   
          
             
             </div>:    <div> </div> }
         
        </DialogContent>
      </Dialog>
    </Box >

   
  );
}