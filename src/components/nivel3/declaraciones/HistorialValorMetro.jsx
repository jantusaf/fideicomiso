import { useState, useEffect } from "react";

import servicionivel3 from '../../../services/nivel3'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  COLOR_TEXT,
  COLOR_MUTED,
  COLOR_BORDER,
  COLOR_BRAND,
  COLOR_BRAND_SOFT,
  COLOR_BRAND_WARM,
  COLOR_HEADER_BG,
} from "../../nivel2/detalleclienteIngresos/estilos";

const Historial = () => {
    const [historial, setHistorial] = useState([]);

    const traer = async () => {
        const historial = await servicionivel3.traerhistorialvalor()
        setHistorial(historial)
    };

    useEffect(() => {
        traer()
    }, [])

    const sxTh = {
        backgroundColor: COLOR_HEADER_BG,
        color: COLOR_TEXT,
        fontWeight: 700,
        fontSize: 11.5,
        letterSpacing: 0.4,
        borderBottom: `1px solid ${COLOR_BORDER}`,
        py: 1.25,
    };
    const sxTd = { fontSize: 13.5, color: COLOR_TEXT, borderBottom: "1px solid #eef1f3", py: 1.1 };

    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={sxTh}>FECHA</TableCell>
                        <TableCell sx={sxTh}>ZONA</TableCell>
                        <TableCell sx={sxTh}>VALOR METRO CUADRADO</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {historial.length > 0 ? (
                        historial.map((item, index) => (
                            <TableRow key={index} hover sx={{ "&:last-child td": { borderBottom: 0 } }}>
                                <TableCell sx={sxTd}>{item.fecha}</TableCell>
                                <TableCell sx={{ ...sxTd, fontWeight: 600 }}>{item.valormetroparque}</TableCell>
                                <TableCell sx={sxTd}>{item.valormetrocuadrado}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={3} sx={{ ...sxTd, textAlign: "center", color: COLOR_MUTED, py: 4 }}>
                                No hay registros.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    )
}

export default Historial;
