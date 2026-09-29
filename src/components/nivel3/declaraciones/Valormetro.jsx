import { useState } from "react";

import servicioNivel3 from '../../../services/nivel3'

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField'
import NativeSelect from '@mui/material/NativeSelect';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {
  COLOR_TEXT,
  COLOR_ACCENT,
  sxBtnPrimary,
} from "../../nivel2/detalleclienteIngresos/estilos";

const Valormetro = () => {
    const [valor, setValor] = useState({ zona: 'PIT' })
    const [loading, setLoading] = useState(false)

    const handleChange = (e) => {
        setValor({ ...valor, [e.target.name]: e.target.value })
        console.log(valor)
    }

    const handleDeterminar = async (event) => {
        setLoading(true)
        event.preventDefault();
        try {
            await servicioNivel3.valormetrocuadrado(valor)
            window.location.reload(true)
        } catch (error) {
            console.error(error);
            console.log('Error algo sucedio')
        }
    };

    const sxSelect = {
        border: "1px solid #c9d2d8",
        borderRadius: 1.5,
        px: 1.5,
        height: 40,
        display: "flex",
        alignItems: "center",
        "&:hover": { borderColor: COLOR_ACCENT },
        "&:focus-within": { borderColor: COLOR_ACCENT, boxShadow: `0 0 0 1px ${COLOR_ACCENT}` },
    };
    const sxLabel = { fontWeight: 600, fontSize: 13, color: COLOR_TEXT, mb: 0.6 };

    return (
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Box sx={{ width: 160 }}>
                <Typography sx={sxLabel}>Zona</Typography>
                <Box sx={sxSelect}>
                    <NativeSelect
                        defaultValue={'PIT'}
                        onChange={handleChange}
                        disableUnderline
                        fullWidth
                        inputProps={{ name: 'zona', id: 'zona-select' }}
                        sx={{ fontSize: 15, color: COLOR_TEXT }}
                    >
                        <option value={'PIT'}>PIT</option>
                        <option value={'IC3'}>Resto</option>
                    </NativeSelect>
                </Box>
            </Box>

            <Box sx={{ width: 220 }}>
                <Typography sx={sxLabel}>Valor metro cuadrado</Typography>
                <TextField
                    type={'number'}
                    name="valor"
                    onChange={handleChange}
                    fullWidth
                    size="small"
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
                />
            </Box>

            <Button variant="contained" onClick={handleDeterminar} sx={{ ...sxBtnPrimary, height: 40 }}>
                {loading ? <CircularProgress color="inherit" size={20} /> : "Enviar"}
            </Button>
        </Box>
    )
}

export default Valormetro;
