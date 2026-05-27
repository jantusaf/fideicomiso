import { useState, useEffect } from "react";
import servicioPagos from '../../../services/pagos'
import servicioAdmin from '../../../services/Administracion'

import CargaDeTabla from "../../CargaDeTabla"
import { useNavigate } from "react-router-dom";
import MenuItem from '@mui/material/MenuItem';
import { Button,CircularProgress } from '@mui/material';
import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';



//import overbookingData from "./overbooking";
const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Estracto = () => {
    //configuracion de Hooks
    const [dats, setDats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [todos, setTodos] = useState([''])
    const [fecha, setFecha] = useState([''])
    const [activo, setActivo] = useState(false);
    const navigate = useNavigate();

    const getTodos = async () => {

        const tod = await servicioPagos.listaEstractos()
        console.log(tod)
        setTodos(tod)
    }


    const getClients = async () => {
        setActivo(true)
        const datos = await servicioPagos.VerEstracto(fecha)
        setDats(datos)
        setLoading(false);
    }
    const handleChange = (e) => {
  
    
        // setPago({ ...pago, ['id']: props.id })
        setFecha({ ...fecha, [e.target.name]: e.target.value })
    
    
      }
    useEffect(() => {
        getTodos()
    }, [])

    ///
    //opcionde click en el nombre

    //


    // definimos las columnas
    const columns = [
        {
            name: "descripcion",
            label: "descripcion",

        },
        {
            name: "referencia",
            label: "referencia",
        },


        {
            name: "debitos",
            label: "debitos",

        },
        {
            name: "creditos",
            label: "creditos",

        },



    ];

    const options = {

        /*    rowsPerPage: 10,
           download: false, // hide csv download option
           onTableInit: this.handleTableInit,
           onTableChange: this.handleTableChange, */
    };
    // renderiza la data table
    return (
        <>
            <TextField component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '25ch' },
                }}
                noValidate


                id="outlined-select-currency"
                select
                label="Elegir Fecha"
                name="id"
                onChange={handleChange}
                helperText="Seleccionar fecha"
            >
                {
                    todos.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                            {option.fecha}
                        </MenuItem>
                    ))}
            </TextField>
            {fecha.id != undefined ? <>
            <Button onClick={getClients}>Ver </Button>
            </>: <></>}
            {activo ? <>

            {loading ? (<CargaDeTabla />)
                : (
                    <div>
                        <br />

                       {/*  <MUIDataTable

                            title={"Tabla de estracto"}
                            data={dats}
                            columns={columns}
                            actions={[
                                {
                                    icon: 'save',
                                    tooltip: 'Save User',
                                    onClick: (event, rowData) => alert("You saved " + rowData.name)
                                }
                            ]}
                            options={options}


                        /> */}
                    </div>
                )}
                </> : <></>}
        </>


    )
}

export default Estracto;