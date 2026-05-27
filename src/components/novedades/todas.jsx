import servicioNovedades from '../../services/novedades'
import React, { useEffect, useState, Fragment } from "react";
import { Paper } from '@mui/material';

import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import FindInPageTwoToneIcon from '@mui/icons-material/FindInPageTwoTone';
import Tooltip from "@mui/material/Tooltip";
import ModalVer from "./ModalVer";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import Skeleton from '@mui/material/Skeleton';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));




const TablaNotificaciones = (props) => {
    const [novedades, setNovedades] = useState([''])
    const [usuario, setUsuario] = useState([''])
    const navigate = useNavigate();
    useEffect(() => {
        traer()



    }, [])


    const traer = async () => {
        try {
            const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
            if (loggedUserJSON) {
                const usuario = JSON.parse(loggedUserJSON)
                console.log(usuario.cuil_cuit)
                setUsuario(usuario)
                const novedades_aux = await servicioNovedades.todas()
                setNovedades(novedades_aux)
            }

        } catch (error) {

        }






    }

    function CutomButtonsRenderer(dataIndex, rowIndex, data, onClick) {
        return (
            <>
                <div>
                    < ModalVer
                        id={novedades[dataIndex].id} />
                    
                  


                </div>
            </>
        );
    }




    // definimos las columnas
    const columns = [
        {
            name: "mes",
            label: "fecha",

        },
        {
            name: "cuil_cuit",
            label: "Cuil/cuit",
        },

     
        {
            name: "asunto",
            label: "asunto",

        },
        {
            name: "Ver/Contestar",
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
        selectableRows: false, // Deshabilita los checkboxes
      };
    // renderiza la data table
    return (
        <div>

            <div>
                {/* <MUIDataTable

                    title={"Agenda de novedades"}
                    data={novedades}
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

        </div>
    )
}
export default TablaNotificaciones