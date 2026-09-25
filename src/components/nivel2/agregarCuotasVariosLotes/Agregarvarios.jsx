

import * as React from 'react';
import { useParams } from "react-router-dom"
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import NativeSelect from '@mui/material/NativeSelect';
import DialogActions from '@mui/material/DialogActions';

import { useEffect, useState } from "react";


import { useNavigate } from "react-router-dom";
import servicioCuotas from '../../../services/cuotas'
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { Box, Paper, Typography, Chip, Divider } from '@mui/material';
import ViewListOutlinedIcon from '@mui/icons-material/ViewListOutlined';
import { COLOR_TEXT, COLOR_ACCENT, COLOR_MUTED, COLOR_BORDER, sxCard, sxBtnPrimary } from '../detalleclienteIngresos/estilos';



const AgregarVarias = () => {
    const [seleccion, setSeleccion] = useState({}) /// ES UN DICCIONARIO DE DICCIONARIOS
    const [cant, setCant] = useState(0) 
    let params = useParams()
    const navigate = useNavigate();
    let cuil_cuit = params.cuil_cuit
    const [parte1, setParte1] = useState(true) 
    const [estadoCuotas, setestadoCuotas] = useState({
        cuil_cuit

    })
    const [total, setTotal] = useState(0)
    const [todos, setTodos] = useState(null) 
    const [valores, setValores] = useState(null) 


    

      
    useEffect(() => {
        getTodos()
        console.log(seleccion)
    }, [])

    const getTodos = async () => {

        const tod = await servicioCuotas.listavarios(cuil_cuit)
        console.log(tod)
        setTodos(tod[0])
        setValores(tod[1])
    }


    const agregarCuotas = async (event) => {
       
        try {
          
            
            
            const respuesta = await servicioCuotas.agregarCuotasVarios(estadoCuotas)
            //alert(respuesta[1])
           // navigate('/usuario2/detallecliente/' + respuesta[0])


        } catch (error) {
            console.error(error);
            console.log('Error algo sucedio')


        }
    }



    const handleChange = (e) => {
        console.log(estadoCuotas)
        setestadoCuotas({ ...estadoCuotas, [e.target.name]: e.target.value })


    }

    const handleChangelote = (e) => {
       

   try {
    
   
      const  lote = {
          
           zona: e.zona,
           superficie: e.superficie,
        }
       let valor = 0
        if (e.zona === 'PIT'){
             valor = (valores['valorparque'])
        }else {
             valor = (valores['valorotro'])
        }
       
        setSeleccion({ ...seleccion, [cant]: e.id })
       

   
     

        const moment =total + (parseFloat(e.superficie)*(valor))
        console.log(seleccion)
    
        setestadoCuotas({ ...estadoCuotas, ['cant']: cant+1 })
       setTotal(moment)
       setCant(cant+1)
   
       
       
    } catch (error) {
    console.log(error)
    }

       
      
        

    }

    const probar = async (event) => {
       
        setestadoCuotas({ ...estadoCuotas, ['seleccion']: [seleccion] })
     
        
      
        setParte1(false)
    }

    const MESES_OPCIONES = [
        ['1', 'Enero'], ['2', 'Febrero'], ['3', 'Marzo'], ['4', 'Abril'], ['5', 'Mayo'], ['6', 'Junio'],
        ['7', 'Julio'], ['8', 'Agosto'], ['9', 'Septiembre'], ['10', 'Octubre'], ['11', 'Noviembre'], ['12', 'Diciebre'],
    ]
    const ANIOS_OPCIONES = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024']

    const sxSelect = {
        border: '1px solid #c9d2d8',
        borderRadius: 1.5,
        px: 1.5,
        height: 40,
        minWidth: 160,
        display: 'flex',
        alignItems: 'center',
        '&:hover': { borderColor: COLOR_ACCENT },
        '&:focus-within': { borderColor: COLOR_ACCENT, boxShadow: `0 0 0 1px ${COLOR_ACCENT}` },
    }

    const etiquetaLote = (option) =>
        'Zona ' + option.zona + ' Manzana  ' + option.manzana + ' Parcela ' + option.parcela +
        ' (Lote ' + option.lote + ')' + ' (Superficie ' + option.superficie + ')'

    const selectorFecha = (nombreMes, nombreAnio) => (
        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
            <Box sx={sxSelect}>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    disableUnderline
                    fullWidth
                    inputProps={{ name: nombreMes, id: 'uncontrolled-native' }}
                    sx={{ fontSize: 15, color: COLOR_TEXT }}
                >
                    <option value={''}>Mes</option>
                    {MESES_OPCIONES.map(([v, l]) => (
                        <option key={v} value={v}>{l}</option>
                    ))}
                </NativeSelect>
            </Box>
            <Box sx={sxSelect}>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    disableUnderline
                    fullWidth
                    inputProps={{ name: nombreAnio, id: 'uncontrolled-native' }}
                    sx={{ fontSize: 15, color: COLOR_TEXT }}
                >
                    <option value={''}>Año</option>
                    {ANIOS_OPCIONES.map((a) => (
                        <option key={a} value={a}>{a}</option>
                    ))}
                </NativeSelect>
            </Box>
        </Box>
    )

    return (
        <Box sx={{ maxWidth: 980, mx: 'auto', px: { xs: 0, md: 1 }, pt: { xs: 1, md: 2 }, pb: 6 }}>
            {/* ENCABEZADO */}
            <Paper elevation={0} sx={{ ...sxCard, p: { xs: 2.5, md: 3 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(13,58,73,0.08)',
                                flexShrink: 0,
                            }}
                        >
                            <ViewListOutlinedIcon sx={{ color: COLOR_ACCENT }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h5"
                                sx={{ fontWeight: 700, fontSize: 20, textTransform: 'none', color: COLOR_TEXT, m: 0, pt: 0 }}
                            >
                                Cuotas para varios lotes
                            </Typography>
                            <Typography variant="body2" sx={{ color: COLOR_MUTED, mt: 0.25 }}>
                                Elegí los lotes y definí las fechas del plan de cuotas
                            </Typography>
                        </Box>
                    </Box>

                    {todos && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            <Chip variant="outlined" label={`Parque: ${valores.valorparque} / m²`} sx={{ fontWeight: 600 }} />
                            <Chip variant="outlined" label={`IC: ${valores.valorotro} / m²`} sx={{ fontWeight: 600 }} />
                            <Chip label={`Total: ${total}`} sx={{ fontWeight: 700, bgcolor: COLOR_TEXT, color: '#fff' }} />
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* LOTES */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15 }}>Lotes</Typography>
                <Divider sx={{ mt: 1, mb: 1.5, borderColor: COLOR_BORDER }} />

                {todos ? (
                    <FormGroup>
                        {todos.map((option, i) => (
                            <FormControlLabel
                                key={i}
                                disabled={!parte1}
                                onClick={() => handleChangelote(option)}
                                control={<Checkbox size="small" sx={{ color: '#9aa7b0', '&.Mui-checked': { color: COLOR_ACCENT } }} />}
                                label={<Typography sx={{ fontSize: 14, color: COLOR_TEXT }}>{etiquetaLote(option)}</Typography>}
                            />
                        ))}
                    </FormGroup>
                ) : (
                    <Typography sx={{ fontSize: 13.5, color: COLOR_MUTED }}>Cargando lotes...</Typography>
                )}

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    <Button variant="contained" onClick={() => { probar() }} sx={sxBtnPrimary}>
                        Enviar
                    </Button>
                </Box>
            </Paper>

            {/* PLAN DE CUOTAS */}
            <Paper elevation={0} sx={{ ...sxCard, mt: 2.5, p: { xs: 2.5, md: 3 } }}>
                <form onSubmit={agregarCuotas}>
                    <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15 }}>Fecha anticipo</Typography>
                    <Divider sx={{ mt: 1, mb: 2, borderColor: COLOR_BORDER }} />
                    {selectorFecha('mesanticipo', 'anioanticipo')}

                    <Typography sx={{ fontWeight: 700, color: COLOR_TEXT, fontSize: 15, mt: 3.5 }}>
                        Fecha inicio de las cuotas
                    </Typography>
                    <Divider sx={{ mt: 1, mb: 2, borderColor: COLOR_BORDER }} />
                    {selectorFecha('mes', 'anio')}

                    <Box sx={{ display: 'flex', gap: 2.5, flexWrap: 'wrap', mt: 3 }}>
                        <TextField
                            size="small"
                            id="name"
                            label="Cantidad de cuotas"
                            name="cantidad_cuotas"
                            onChange={handleChange}
                            sx={{ width: 240, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                        <TextField
                            size="small"
                            id="name"
                            label="Cambiar el porcentaje de anticipo"
                            name="porcentaje"
                            onChange={handleChange}
                            sx={{ width: 300, '& .MuiOutlinedInput-root': { borderRadius: 1.5 } }}
                        />
                    </Box>

                    <DialogActions sx={{ px: 0, pt: 3, justifyContent: 'flex-end' }}>
                        {estadoCuotas.mesanticipo && estadoCuotas.mes && estadoCuotas.anio && estadoCuotas.anioanticipo ? (
                            <Button variant="contained" onClick={() => { agregarCuotas() }} sx={sxBtnPrimary}>
                                Enviar
                            </Button>
                        ) : (
                            <Typography sx={{ fontSize: 13.5, color: COLOR_MUTED }}>Completar todos los datos</Typography>
                        )}
                    </DialogActions>
                </form>
            </Paper>
        </Box>
    )
}

export default AgregarVarias;
