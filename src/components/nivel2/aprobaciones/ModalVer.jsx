import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import servicioPagos from '../../../services/pagos'
import NativeSelect from '@mui/material/NativeSelect';
import useUser from '../../../hooks/useUser'
import servicioNotificaciones from '../../../services/notificaciones'
import Tooltip from '@material-ui/core/Tooltip';
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import React, { useEffect, useState, Fragment } from "react";



export default function ModalVer(props) {
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext

  const [notificacion, setNotidicaciones] = useState()
  const [activo, setActivo] = useState(false)

  useEffect(() => {

    traer()

  }, [])


  const traer = async () => {

   const not = await servicioNotificaciones.leer(props.id)
   setNotidicaciones(not)

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

  
  const handleChange = (e) => {
    console.log(pago)
    // setPago({ ...pago, ['id']: props.id })
    setPago({ ...pago, [e.target.name]: e.target.value })


    console.log(pago)
  }
  ////
  const pagar = async (event) => {
    // event.preventDefault();

    console.log(pago)
    try {

      await servicioPagos.pagar(
        pago


      )


    } catch (error) {
      console.error(error);
      console.log('Error algo sucedio')

    }

    setOpen(false);
  };/////
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
             <h3>Notificacion: {notificacion.asunto} </h3>
             
               
   
   
                 <br />
                 <label>{notificacion.descripcion}</label>
                
   
   
   
          
             
             </div>:    <div> </div> }
         
        </DialogContent>
      </Dialog>
    </Box >

   
  );
}