import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from '@mui/icons-material/Search';

import servicioLotes from '../../../services/lotes'
import { useNavigate } from "react-router-dom";
import CargaDeTabla from "../../CargaDeTabla"
import * as React from 'react';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import Modaldetalles from './modalver'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { alpha } from "@mui/material/styles";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



const Lotes = () => {
    //configuracion de Hooks
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <Modaldetalles
                    zona={clients[0][dataIndex]['zona']}
                    fraccion={clients[0][dataIndex]['fraccion']}
                    manzana={clients[0][dataIndex]['manzana']}
                    lote={clients[0][dataIndex]['lote']}
                    parcela={clients[0][dataIndex]['parcela']}
                    adrema={clients[0][dataIndex]['adrema']}
                    superficie={clients[0][dataIndex]['superficie']}
                    mensura={clients[0][dataIndex]['mensura']}
                    nombre={clients[0][dataIndex]['nombre']}
                    cuil_cuit={clients[0][dataIndex]['cuil_cuit']}


                />
            </>
        );
    }

    const getClients = async () => {

        const clients = await servicioLotes.lista({

        })

        setClients(clients)
        setLoading(false);
    }

    useEffect(() => {
        getClients()
    }, [])

    // definimos las columnas
    const columns = [
        {
            name: "Ver",
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
        {
            name: "zona",
            label: "Zona",
        },
        {
            name: "fraccion",
            label: "Fraccion",


        },
        {
            name: "manzana",
            label: "Manzana",

        },
        {
            name: "lote",
            label: "Lote",
        },
        {
            name: "parcela",
            label: "Parcela",
        },
        {
            name: "superficie",
            label: "superficie",
        },
        {
            name: "estado",
            label: "Estado",
        },
        {
            name: "cuil_cuit",
            label: "cuil_cuit",
        },
        {
            name: "nombre",
            label: "Persona",
        },

        /*   {
              name: "Actions",
              options: {
                  customBodyRenderLite: (dataIndex, rowIndex) =>
                      CutomButtonsRenderer(
                          dataIndex,
                          rowIndex,
                         // overbookingData,
                         // handleEditOpen
                      )
              }
          
          },   */

    ];
    // renderiza la data table
    const options = {
        selectableRows: false, // Deshabilita los checkboxes
    };
    return (
        <>
            {loading ? (<CargaDeTabla />)
                : (
                    <div>
                        <Stack spacing={2} sx={{ width: "100%" }}>
                            <Box
                                sx={{
                                    borderRadius: 3,
                                    px: 2.5,
                                    py: 2,
                                    mb: 3,
                                    background:
                                        "linear-gradient(90deg, #0a3b4f 0%, #0b4f6c 55%, #0f7f86 100%)",
                                    boxShadow: "0 14px 35px rgba(15,127,134,0.35)",
                                    color: "#ffffff",
                                    display: "flex",
                                    alignItems: { xs: "flex-start", md: "center" },
                                    justifyContent: "space-between",
                                    gap: 2,
                                    flexWrap: "wrap",
                                }}
                            >
                                {/* IZQUIERDA: TEXTO */}
                                <Box sx={{ mt: 0.75 }}>
                                    <Typography
                                        sx={{
                                            fontSize: { xs: 16, md: 18 },
                                            fontWeight: 900,
                                            letterSpacing: 0.3,
                                            lineHeight: 1.2,
                                        }}
                                    >
                                        LOTES – Resumen General
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            opacity: 0.9,
                                            lineHeight: 1.4,
                                            mt: 1,
                                        }}
                                    >
                                        Total: {clients[0].length}
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            opacity: 0.9,
                                            lineHeight: 1.4,
                                        }}
                                    >
                                        Disponibles: {clients[1]}
                                    </Typography>
                                    <Typography
                                        sx={{
                                            mt: 0.5,
                                            fontSize: 14,
                                            fontWeight: 600,
                                            opacity: 0.9,
                                        }}
                                    >

                                        · Parque: {clients[2]} · IC3: {clients[3]}
                                    </Typography>
                                </Box>

                                {/* DERECHA: BADGE */}
                                <Box
                                    sx={{
                                        px: 2,
                                        py: 0.75,
                                        borderRadius: 999,
                                        background: "rgba(255,255,255,0.16)",
                                        border: "1px solid rgba(255,255,255,0.35)",
                                        fontWeight: 900,
                                        fontSize: 14,
                                        whiteSpace: "nowrap",
                                    }}
                                >
                                    📊 Lotes disponibles
                                </Box>
                            </Box>
                        </Stack>
 <Box
                                    sx={{
                                        /* =========================
                                           TEXTO GENERAL (BODY)
                                        ========================== */
                                        "& .MuiTableBody-root .MuiTableCell-root": {
                                            borderBottom: `1px solid ${alpha("#01567c", 0.08)}`,
                                            fontWeight: 650,
                                            color: "#0b2b3a", // ✅ color letra filas
                                        },

                                        /* =========================
                                           TEXTO HEADER
                                        ========================== */
                                        "& .MuiTableHead-root .MuiTableCell-root": {
                                            borderBottom: "0px",
                                            color: "#01567c", // ✅ texto blanco en header
                                            fontWeight: 800,
                                        },

                                        /* =========================
                                           TOOLBAR (buscar, icons)
                                        ========================== */
                                        "& .MuiToolbar-root": {
                                            px: 2,
                                            color: "#01567c",
                                        },

                                        "& .MuiToolbar-root .MuiInputBase-input": {
                                            color: "#0b2b3a", // texto del buscador
                                            fontWeight: 700,
                                        },

                                        /* =========================
                                           ICONOS (DEFAULT)
                                        ========================== */
                                        "& .MuiIconButton-root, & svg": {
                                            color: alpha("#01567c", 0.75),
                                            transition: "all 0.2s ease",
                                        },

                                        /* =========================
                                           ICONOS HOVER
                                        ========================== */
                                        "& .MuiIconButton-root:hover, & svg:hover": {
                                            color: "#148D8D", // ✅ color hover íconos
                                            transform: "translateY(-1px)",
                                        },

                                        /* =========================
                                           HOVER FILAS
                                        ========================== */


                                        /* =========================
                                           PAGINACIÓN
                                        ========================== */
                                        "& .MuiTablePagination-root, & .MuiTablePagination-root *": {
                                            color: "#01567c",
                                            fontWeight: 700,
                                        },
                                    }}>
                      {/*   <MUIDataTable


                            data={clients[0]}
                            columns={columns}
                            actions={[
                                {
                                    icon: 'save',
                                    tooltip: 'Save User',
                                    onClick: (event, rowData) => alert("You saved " + rowData.name)
                                }
                            ]}

                            options={options}



                        /> */}</Box>
                    </div>
                )}
        </>


    )
}

export default Lotes;