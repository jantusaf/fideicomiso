import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import ServicioPagos from '../../../services/pagos'
import Tooltip from "@mui/material/Tooltip";
import React, { useEffect, useState, Fragment } from "react";

///
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export default function Inconscistencia(props) {
  const [open, setOpen] = React.useState(false);
  //const usuario  = useUser().userContext

  const [constancias, setConstancias] = useState([])
  const [activo, setActivo] = useState(false)



  const handleClickOpen = () => {
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
  };





  ///Ver coincidencias
  async function verCoinc(index, rowIndex, data) {



    const constanciass = await ServicioPagos.verCoincidencias(props.id)

    setConstancias(constanciass)


  }
  ////////////Buscar monto del pago
  function montoDistint(index, rowIndex, data) {

    return (
      <>
        <Tooltip title="Ver coincidencia" arrow>
          <Button
            onClick={() => verCoinc()}
          >Ver Coincidencias</Button>

        </Tooltip>
      </>
    );
  }




  // definimos las columnas
  const columns = [


    {
      name: "nombre",
      label: "nombre",

    },
    {
      name: "fecha",
      label: "fecha",

    },
    {
      name: "creditos",
      label: "monto",
    },

    {
      name: "descripcion",
      label: "Cuil/Cuit CBU",
    },






  ];


  return (




    <div>

      <Box

        sx={{
          '& .MuiTextField-root': { m: 1, width: '45ch' },
        }}
        noValidate
        autoComplete="off"
      >
        < Tooltip title="Ver Constancias">
          <Button
            onClick={handleClickOpen}
          >Ver </Button>

        </Tooltip>
        <Dialog open={open} onClose={handleClose}>
          <DialogContent>

            <div>
              <h3>Inconscistencia</h3>
              {props.monto_distinto === 'Si' ? <><p >Monto Distinto  </p> </> : <> </>}

              {props.cuil_cuit_distinto === 'Si' ? <> Cuil/Cuit no encontrado o CBU distinto  </> : <> </>}
              <br />
              {props.monto_inusual === 'Si' ? <>Monto Inusual</> : <> </>}
              <br />
              {props.yarealizado === 'SI' ? <>Monto ya realizado</> : <> </>}

              {montoDistint()}


              {constancias === [] || constancias === null ? <>No se encontraron coincidencias</> : <>
                <div>

                  <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nombre</TableCell>
                          <TableCell align="right">Fecha</TableCell>
                          <TableCell align="right">Cuil/cuit</TableCell>
                          <TableCell align="right">Monto</TableCell>
                          <TableCell align="right">Descripcion</TableCell>

                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {constancias.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row">
                              {row.nombre}
                            </TableCell>
                            <TableCell align="right">{row.descripcion}</TableCell>
                            <TableCell align="right">{row.fecha}</TableCell>
                            <TableCell align="right">{row.creditos}</TableCell>
                            <TableCell align="right">{row.descripcion}</TableCell>

                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                </div>

              </>}



            </div>




          </DialogContent>
        </Dialog>
      </Box >

    </div>
  );
}