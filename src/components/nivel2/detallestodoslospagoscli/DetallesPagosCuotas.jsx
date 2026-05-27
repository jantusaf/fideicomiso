import * as React from 'react';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import servicioPagos from '../../../services/pagos';
import Button from "@mui/material/Button";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Modif from './modalactcompic3';
import BorrarComp from '../detallePagosCuota/modalborrarcomprobanteic3';

export default function DetallesPagos(props) {
    let params = useParams();
    let id = params.id;
    
    const [pagos, setPagos] = useState([]);

    useEffect(() => {
        traer();
    }, []);

    const traer = async () => {
        const aux = { id: id };
        const pag = await servicioPagos.detallesPagocli(aux);
        setPagos(pag);
    };

    const download = async (index) => {
        try {
            const pdfBlob = await servicioPagos.traerPdfConstanciadepagoic3(pagos[index].id);
            const url = URL.createObjectURL(pdfBlob);
            window.open(url, '_blank');
        } catch (error) {
            console.error('Error al obtener el PDF:', error);
            alert('Error al cargar el PDF');
        }
    };

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Cuota</TableCell>
                        <TableCell>fecha</TableCell>
                        <TableCell>Borrar comprobante</TableCell>
                        <TableCell>Modificar</TableCell>
                        <TableCell>Ver/Borrar</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pagos.map((pago, index) => (
                        <TableRow key={pago.id}>
                            <TableCell>{pago.id}</TableCell>
                            <TableCell>{pago.cuo}</TableCell>
                            <TableCell>{pago.messs}/{pago.aniooo}</TableCell>
                            
                            <TableCell>
                                {pago.ubicacion != null ? (
                                    <>
                                        Tiene comprobante
                                        <BorrarComp id={pago.id}
                                           getData={async () => {
                                            const aux = { id: id };
                                            const pag = await servicioPagos.detallesPagocli(aux);
                                            setPagos(pag);
                                        }} />
                                    </>
                                ) : <></>}
                            </TableCell>
                            <TableCell>
                                {pago.ubicacion != null ? (
                                    <>
                                        Tiene comprobante
                                        <Modif id={pago.id} 
                                    traer={async () => {
                                        const aux = { id: id };
                                        const pag = await servicioPagos.detallesPagocli(aux);
                                        setPagos(pag);
                                    }}/>
                                    </>
                                ) : (
                                    <Modif id={pago.id}
                                    traer={async () => {
                                        const aux = { id: id };
                                        const pag = await servicioPagos.detallesPagocli(aux);
                                        setPagos(pag);
                                    }} />
                                )}
                            </TableCell>
                            <TableCell>
                                <Button onClick={() => download(index)}>Ver Online</Button>
                               {/*  <Borrar id={pago.id} /> */}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
