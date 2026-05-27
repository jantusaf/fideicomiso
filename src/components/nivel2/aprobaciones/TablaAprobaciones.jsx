import { useState, useEffect } from "react";

import servicioAprobaciones from '../../../services/Aprobaciones'
import serviciousuario1 from '../../../services/usuario1'
import { useNavigate } from "react-router-dom";
import * as React from 'react';
import EditIcon from "@mui/icons-material/Edit";
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import CheckIcon from '@mui/icons-material/Check';
import BotonRechazo from './RechazoConstancia'
//import overbookingData from "./overbooking";
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';
import CargaDeTabla from "../../CargaDeTabla"
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});




const TablaAprobaciones = () => {
    //configuracion de Hooks
    const [pendientes, setPendientes] = useState([]);
    const [act, setAct] = useState(false)
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();




    const getPendientes = async () => {

        const pendientes = await servicioAprobaciones.lista({

        })
        setPendientes(pendientes)
        setLoading(false);
    }

    const aprobar = async (id) => {

        await servicioAprobaciones.aprobacion(id)
        window.location.reload(true)
    }

    useEffect(() => {
        getPendientes()
    }, [])

    ///

    async function download(index, rowIndex, data) {
        const filename = (pendientes[index].ubicacion)


        const link = await serviciousuario1.obtenerurl(filename)

        window.open(link.data)


    }

    function verFile(index, rowIndex, data) {

        /* const filename = (products[index].key)
        console.log(filename)
        const link = await axios.get(`http://localhost:4000/usuario1/get-object-url/` + filename)
        console.log(link.data)
        setAct(true) */
        return (
            <>

                <Button
                    onClick={() => veronline(index)}
                >Ver online</Button>


            </>
        );
    }


    async function veronline(index, rowIndex, data) {
        const filename = (pendientes[index].ubicacion)


        const link = await serviciousuario1.obtenerurlonline(filename)
        console.log(link.data)
        window.open(link.data)


        // var nueva_ventana = window.open('', '_blank');
        //nueva_ventana.document.write('<html><head><title>PDF de AWS</title></head><body style="text-align:center;"><embed src="' + link + '" width="100%" height="100%" type="application/pdf" /></body></html>');
    }
    function downloadFile(index, rowIndex, data) {

        /* const filename = (products[index].key)
        console.log(filename)
        const link = await axios.get(`http://localhost:4000/usuario1/get-object-url/` + filename)
        console.log(link.data)
        setAct(true) */
        return (
            <>

                <Button
                    onClick={() => download(index)}
                >Descargar</Button>


            </>
        );
    }

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {

        return (
            <>

                <BotonRechazo
                    id={pendientes[dataIndex].id}
                />

                <Tooltip title="Aprobar">
                    <CheckIcon style={{ cursor: "pointer" }}
                        onClick={() => {
                            aprobar(pendientes[dataIndex].id)
                            /*  navigate('/usuario2/detallecliente/'+pendientes[dataIndex].id) */
                        }}//Navigate('usuario2/detallecliente'+clients[dataIndex].cuil_cuit)
                    />
                </Tooltip>
            </>
        );
    }
    // definimos las columnas
    const columns = [
        {
            name: "tipo",
            label: "Tipo",

        },
        {
            name: "cuil_cuit",
            label: "Cuil/cuit",
        },
        {
            name: "ubicacion",
            label: "Descripcion",

        },
        {
            name: "estado",
            label: "Estado",
            actions: { onClick: (event, rowData) => alert(rowData) }
        },
        {
            name: "fecha",
            label: "fecha",

        },
        {
            name: "Ver online",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    verFile(
                        dataIndex,
                        rowIndex,
                        // overbookingData,
                        // handleEditOpen
                    )
            }

        },
        {
            name: "Descarga",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    downloadFile(
                        dataIndex,
                        rowIndex,
                        // overbookingData,
                        // handleEditOpen
                    )
            }

        },
        {
            name: "Acciones",
            options: {
                customBodyRenderLite: (dataIndex, rowIndex) =>
                    CutomButtonsRenderer(
                        dataIndex,
                        rowIndex,
                        // overbookingData,
                        // handleEditOpen
                    )
            }

        },



    ];
    const options = {

        setTableProps: () => {
            return {
                style: {
                    backgroundColor: "#e3f2fd", // Cambia el color de fondo de la tabla
                },
            };
        },
        customHeadRender: (columnMeta, handleToggleColumn) => ({
            TableCell: {
                style: {
                    backgroundColor: '#e6f8d7', // Cambia el color de fondo del encabezado
                    color: 'white', // Cambia el color del texto del encabezado
                },
            },
        }),
        selectableRows: false, // Desactivar la selección de filas
        stickyHeader: true,
        selectableRowsHeader: false,
        selectableRowsOnClick: true,
        responsive: 'scroll',
        rowsPerPage: 5,
        rowsPerPageOptions: [5, 10, 15],
        downloadOptions: { filename: 'tableDownload.csv', separator: ',' },
        print: true,
        filter: true,
        viewColumns: true,
        pagination: true,

        textLabels: {
            body: {
                noMatch: "No se encontraron registros",
                toolTip: "Ordenar",
            },
            pagination: {
                next: "Siguiente",
                previous: "Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
            toolbar: {
                search: "Buscar",
                downloadCsv: "Descargar CSV",
                print: "Imprimir",
                viewColumns: "Ver columnas",
                filterTable: "Filtrar tabla",
            },
            filter: {
                all: "Todos",
                title: "FILTROS",
                reset: "RESETEAR",
            },
            viewColumns: {
                title: "Mostrar columnas",
                titleAria: "Mostrar/ocultar columnas de la tabla",
            },
            selectedRows: {
                text: "fila(s) seleccionada(s)",
                delete: "Eliminar",
                deleteAria: "Eliminar filas seleccionadas",
            },
        },
    };
    // renderiza la data table
    return (
        <div>

            {loading ? <CargaDeTabla /> : <>
                <>
                    <Stack spacing={2} sx={{ width: '100%' }}>

                        <Alert
                            severity="info"
                            sx={{
                                backgroundColor: '#148d8d', color: '#ffffff' }}
                        >Cantidad pendientes: {pendientes.length}
                        </Alert>

                    </Stack>
                </>
             {/*    <MUIDataTable
                    title={"LISTA DE APROBACIONES PENDIENTES"}
                    data={pendientes}
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
            </>}
        </div>
    )
}

export default TablaAprobaciones;