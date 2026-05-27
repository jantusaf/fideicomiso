import React, { useState, useEffect } from "react";
import servicioLotes from '../../services/lotes'
import DialogActions from '@mui/material/DialogActions';
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

/////////////actualmente para usuario legales


const Formulario = (props) => {
  // Estados para almacenar los valores de los campos
  const [lotes, setLotes] = React.useState();
  const [clients, setClients] = useState()
  const [deudaExigible, setDeudaExigible] = useState([''])
  const [detallePendiente, setDetallePendiente] = useState([''])
  const navigate = useNavigate();

  const getClients = async () => {
    let clients
    if (props.mapa === "PIT") {
      clients = await servicioLotes.traersegunmapa2(props.info)
    } else {
      clients = await servicioLotes.traersegunmapa1(props.info)
    }


    setClients(clients)
    setDeudaExigible(clients[1][0])
    setDetallePendiente(clients[1][1])

  }

  useEffect(() => {
    getClients()
  }, [])
  const cerrar = () => {

    props.cerrar();


  };
  return (
    <>
      {clients ? <>
        {clients.nombrec = "Sin asignar" ? <>

          Cliente: {clients[0].nombrec}<br />
          Adrema:{clients[0].adrema}<br />
          {props.nivel ? <>
             {props.nivel ==2 ? <>
          {clients[0].nombrec ? <><p style={{ color: 'green', cursor: 'pointer' }} onClick={()=>{ window.open("/usuario2/detallecliente/"+clients[0].cuil_cuit)}}  >Ver cliente</p></>:<></>}
      </>:<></>}
      
          </>:<></>}
          Cantidad de cuotas:{clients[0].cant_cuotas}<br />
          Liquidadas:{clients[0].cuotasliq}<br />
          Adrema:{clients[0].adrema}<br />
          {deudaExigible[0]!=0 ? 
          <>
            <Paper
              sx={{
                cursor: 'pointer',
                background: '#eeeeee',
                color: '#bdbdbd',
                border: '1px dashed #ccc',
                width: "110%",
                '&:hover': { border: '1px solid #ccc' },
                border: "1px solid black",
                margin: '10px',
                display: 'flex'
              }}
            >
              <TableContainer >
                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="normal" >Detalles de Deuda Exigible </TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {deudaExigible.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >

                        <TableCell align="left" padding="normal">{row.datoa}</TableCell>
                        <TableCell align="left" padding="normal">{new Intl.NumberFormat('de-DE').format(row.datob)}</TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
            <Paper
              sx={{
                cursor: 'pointer',
                background: '#eeeeee',
                color: '#bdbdbd',
                border: '1px dashed #ccc',
                width: "110%",
                '&:hover': { border: '1px solid #ccc' },
                border: "1px solid black",
                margin: '10px',
                display: 'flex'
              }}
            >

              <TableContainer >
                <Table sx={{ minWidth: 650 }} aria-label="simple table" >
                  <TableHead>
                    <TableRow>
                      <TableCell padding="normal" >Detalle de Cuotas Pendientes </TableCell>


                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {detallePendiente.map((row) => (
                      <TableRow
                        key={row.name}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >

                        <TableCell align="left" padding="normal">{row.datoa}</TableCell>
                        <TableCell align="left" padding="normal">{new Intl.NumberFormat('de-DE').format(row.datob)}</TableCell>

                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </>
          :<>Sin cuotas</>}
        </> : <>Lote sin asignar</>}
      </> : <></>}

      <DialogActions>

        <Button onClick={cerrar}>Cerrar</Button>

      </DialogActions></>
  );
};

export default Formulario;
