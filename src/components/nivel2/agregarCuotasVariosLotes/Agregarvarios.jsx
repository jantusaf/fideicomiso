

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

    return (
        <div>

            <>

       
                {todos ? <>
                    <h4> Valor metro cuadrado del parque  {valores.valorparque}</h4>
                    <h4> Valor metro cuadrado IC {valores.valorotro}</h4>
                  <h3> Total {total}</h3>
                  {parte1 ? <>
                    {
                        todos.map((option) => (
                            
                            <FormGroup>
                                <FormControlLabel  onClick={() =>  handleChangelote(option)} control={<Checkbox  />} label= { 'Zona '+ option.zona + ' Manzana  '+  option.manzana +  ' Parcela '+ option.parcela   + ' (Lote '+ option.lote +')' + ' (Superficie '+ option.superficie +')' }/>

                            </FormGroup>

                        ))}
                </>: <>
                {
                        todos.map((option) => (
                            
                            <FormGroup>
                                <FormControlLabel disabled  onClick={() =>  handleChangelote(option)} control={<Checkbox  />} label= { 'Zona '+ option.zona + ' Manzana  '+  option.manzana +  ' Parcela '+ option.parcela   + ' (Lote '+ option.lote +')' + ' (Superficie '+ option.superficie +')' }/>

                            </FormGroup>

                        ))}
                
                
                </>}

                </> : <></>}

            </>
            <Button onClick={() => { probar() }} >Enviar</Button>

            <form onSubmit={agregarCuotas}>

                {/*  <h2>Valor del lote</h2>
          <TextField
           style ={{width: '25%'}}
              autoFocus
              margin="dense"
              id="name"
              label="Valor del lote "
              name="monto_total"
              onChange={handleChange}
              fullWidth
              variant="standard"
            />
    
    <br /> <br /> 
    
          <Box sx={{ flexGrow: 1 }}>
              <Grid container spacing={1} columns={16}>
              <TextField
              style ={{width: '25%'}}
              autoFocus
              margin="dense"
              id="name"
              label="Anticipo"
              name="anticipo"
              onChange={handleChange}
              fullWidth
              variant="standard"
            />
              </Grid>
            </Box> */}
                <h2>Fecha Anticipo</h2>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    inputProps={{
                        name: 'mesanticipo',
                        id: 'uncontrolled-native',

                    }}

                > <option value={''}>Elegir</option>
                    <option value={'1'}>Enero</option>
                    <option value={'2'}>Febrero</option>
                    <option value={'3'}>Marzo</option>
                    <option value={'4'}>Abril</option>
                    <option value={'5'}>Mayo</option>
                    <option value={'6'}>Junio</option>
                    <option value={'7'}>Julio</option>
                    <option value={'8'}>Agosto</option>
                    <option value={'9'}>Septiembre</option>
                    <option value={'10'}>Octubre</option>
                    <option value={'11'}>Noviembre</option>
                    <option value={'12'}>Diciebre</option>


                </NativeSelect>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    inputProps={{
                        name: 'anioanticipo',
                        id: 'uncontrolled-native',

                    }}

                > <option value={''}>Elegir</option>
                    <option value={'2015'}>2015</option>
                    <option value={'2016'}>2016</option>
                    <option value={'2017'}>2017</option>
                    <option value={'2018'}>2018</option>
                    <option value={'2019'}>2019</option>
                    <option value={'2020'}>2020</option>
                    <option value={'2021'}>2021</option>
                    <option value={'2022'}>2022</option>
                    <option value={'2023'}>2023</option>
                    <option value={'2024'}>2024</option>


                </NativeSelect>

                <br /> <br /> <br />

                <h2>Fecha inicio de las cuotas</h2>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    inputProps={{
                        name: 'mes',
                        id: 'uncontrolled-native',

                    }}

                > <option value={''}>Elegir</option>
                    <option value={'1'}>Enero</option>
                    <option value={'2'}>Febrero</option>
                    <option value={'3'}>Marzo</option>
                    <option value={'4'}>Abril</option>
                    <option value={'5'}>Mayo</option>
                    <option value={'6'}>Junio</option>
                    <option value={'7'}>Julio</option>
                    <option value={'8'}>Agosto</option>
                    <option value={'9'}>Septiembre</option>
                    <option value={'10'}>Octubre</option>
                    <option value={'11'}>Noviembre</option>
                    <option value={'12'}>Diciebre</option>


                </NativeSelect>
                <NativeSelect
                    defaultValue={30}
                    onChange={handleChange}
                    inputProps={{
                        name: 'anio',
                        id: 'uncontrolled-native',

                    }}

                > <option value={''}>Elegir</option>
                    <option value={'2015'}>2015</option>
                    <option value={'2016'}>2016</option>
                    <option value={'2017'}>2017</option>
                    <option value={'2018'}>2018</option>
                    <option value={'2019'}>2019</option>
                    <option value={'2020'}>2020</option>
                    <option value={'2021'}>2021</option>
                    <option value={'2022'}>2022</option>
                    <option value={'2023'}>2023</option>
                    <option value={'2024'}>2024</option>


                </NativeSelect>
                <br />

                <TextField
                    style={{ width: '20%' }}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Cantidad de Cuotas"
                    name="cantidad_cuotas"
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                />
                <br />
                <TextField
                    style={{ width: '20%' }}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Cambiar el porcentaje de anticipo"
                    name="porcentaje"
                    onChange={handleChange}
                    fullWidth
                    variant="standard"
                />


                <DialogActions>
                    {estadoCuotas.mesanticipo && estadoCuotas.mes && estadoCuotas.anio && estadoCuotas.anioanticipo ? <> <Button onClick={() => { agregarCuotas() }} >Enviar</Button> </> : <> <p>Completar todos los datos</p></>}
                </DialogActions>
            </form>




        </div>
    )











}

export default AgregarVarias;