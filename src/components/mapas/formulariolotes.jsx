import React, { useState } from 'react';
import servicioLotes from '../../services/lotes'
import DialogActions from '@mui/material/DialogActions';
import NativeSelect from '@mui/material/NativeSelect';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
/////////////actualmente para usuario legales
const Formulario = (props) => {
  // Estados para almacenar los valores de los campos
  const [lotes, setLotes] = React.useState();
  const [form, setForm] = useState({ mapa1: props.info,fraccion:1,manzana:1,lote:1 })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const determinar = async () => {
    let rta
    if (props.mapa=="IC3"){
        const rta = await servicioLotes.determinarmapa1(form)
    }else{
        const rta = await servicioLotes.determinarmapa2(form)
    }
    
    props.cerrar();
  
    props.getClients()


  }
  const determinarposecion = async () => {

    const rta = await servicioLotes.determinarposecion(form)
    props.cerrar();
  
    props.getClients()


  }
  const cerrar = () => {

    props.cerrar();


  };
  return (
   <>
  
   <InputLabel variant="standard" htmlFor="uncontrolled-native">
     Manzana
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'manzana',
       id: 'uncontrolled-native',

     }}
   >  <option value={1}>Seleccionar</option>  
    <option value={1}>1</option>
     <option value={2}>2</option>
     <option value={3}>3</option>
     <option value={4}>4</option>
     <option value={5}>5</option>
     <option value={6}>6</option>
     <option value={7}>7</option>
     <option value={8}>8</option>
     <option value={9}>9</option>
     <option value={10}>10</option>
     <option value={11}>11</option>
     <option value={12}>12</option>
     <option value={13}>13</option>
     <option value={14}>14</option>
     <option value={15}>15</option>
     <option value={16}>16</option>
     <option value={17}>17</option>
     <option value={18}>18</option>
     <option value={19}>19</option>
     <option value={20}>20</option>
     <option value={21}>21</option>
     <option value={22}>22</option>
     <option value={23}>23</option>
     <option value={24}>24</option>
     <option value={25}>25</option>
     <option value={26}>26</option>
     <option value={27}>27</option>
     <option value={28}>28</option>
     <option value={29}>29</option>
     <option value={30}>30</option>
     <option value={31}>31</option>
     <option value={32}>32</option>
     <option value={33}>33</option>
     <option value={34}>34</option>
     <option value={35}>35</option>
     <option value={36}>36</option>
     <option value={37}>37</option>
     <option value={38}>38</option>
     <option value={'B/3'}>B/3</option>
     <option value={'D/5'}>D/5</option>
     <option value={'Area verde'}>Area verde</option>
     <option value={'Equipamiento del parque'}>Equipamiento del parque</option>

   </NativeSelect>

   {props.mapa ==="PIT"? <>
   <InputLabel variant="standard" htmlFor="uncontrolled-native">
     Parcela
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'parcela',
       id: 'uncontrolled-native',

     }}
   ><option value={1}>Seleccionar</option>  
    <option value={1}>1</option>
     <option value={2}>2</option>
     <option value={3}>3</option>
     <option value={4}>4</option>
     <option value={5}>5</option>
     <option value={6}>6</option>
     <option value={7}>7</option>
     <option value={8}>8</option>
     <option value={9}>9</option>
     <option value={10}>10</option>
     <option value={11}>11</option>
     <option value={12}>12</option>
     <option value={13}>13</option>
     <option value={14}>14</option>
     <option value={15}>15</option>
     <option value={16}>16</option>
     <option value={17}>17</option>
     <option value={18}>18</option>
     <option value={19}>19</option>
     <option value={20}>20</option>
     <option value={21}>21</option>
     <option value={22}>22</option>
     <option value={23}>23</option>
     <option value={24}>24</option>
     <option value={25}>25</option>
     <option value={26}>26</option>
     <option value={27}>27</option>
     <option value={28}>28</option>
     <option value={29}>29</option>
     <option value={30}>30</option>
     <option value={"a"}>a</option>
     <option value={"b"}>b</option>
     <option value={"c"}>c</option>
     <option value={"d"}>d</option>
     <option value={"e"}>e</option>
     <option value={"f"}>f</option>
     <option value={"g"}>g</option>
     <option value={"h"}>h</option>
     <option value={"i"}>i</option>
     <option value={"j"}>j</option>
     <option value={"k"}>k</option>
     <option value={'B/3'}>B/3</option>
     <option value={'D/5'}>D/5</option>
     

   </NativeSelect>
   
   </>:<>
   <InputLabel variant="standard" htmlFor="uncontrolled-native">
     Lote
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'lote',
       id: 'uncontrolled-native',

     }}
   ><option value={1}>Seleccionar</option>  
    <option value={1}>1</option>
     <option value={2}>2</option>
     <option value={3}>3</option>
     <option value={4}>4</option>
     <option value={5}>5</option>
     <option value={6}>6</option>
     <option value={7}>7</option>
     <option value={8}>8</option>
     <option value={9}>9</option>
     <option value={10}>10</option>
     <option value={11}>11</option>
     <option value={12}>12</option>
     <option value={13}>13</option>
     <option value={14}>14</option>
     <option value={15}>15</option>
     <option value={16}>16</option>
     <option value={17}>17</option>
     <option value={18}>18</option>
     <option value={19}>19</option>
     <option value={20}>20</option>
     <option value={21}>21</option>
     <option value={22}>22</option>
     <option value={23}>23</option>
     <option value={24}>24</option>
     <option value={25}>25</option>
     <option value={26}>26</option>
     <option value={27}>27</option>
     <option value={28}>28</option>
     <option value={29}>29</option>
     <option value={30}>30</option>
     <option value={"a"}>a</option>
     <option value={"b"}>b</option>
     <option value={"c"}>c</option>
     <option value={"d"}>d</option>
     <option value={"e"}>e</option>
     <option value={"f"}>f</option>
     <option value={"g"}>g</option>
     <option value={"h"}>h</option>
     <option value={"i"}>i</option>
     <option value={"j"}>j</option>
     <option value={"k"}>k</option>
     <option value={'B/3'}>B/3</option>
     <option value={'D/5'}>D/5</option>

     

   </NativeSelect></>}

   <InputLabel variant="standard" htmlFor="uncontrolled-native">
    <b>Posecion Lote</b>
   </InputLabel>
   <NativeSelect
     defaultValue={'sin determnar'}
     onChange={handleChange}
     inputProps={{
       name: 'posecion_lote',
       id: 'uncontrolled-native',

     }}
   ><option value={1}>Seleccionar</option>  
    <option value={"Dos actas"}>Dos actas</option>
     <option value={"Un acta"}>Un acta</option>
     <option value={"Ningun acta"}>Ningun acta</option>
   

   </NativeSelect>
  
   <DialogActions>
     <Button onClick={determinar}>Determinar ubicacion</Button>
     <Button onClick={determinarposecion}>Determinar posecion</Button>

     
     <Button onClick={cerrar}>Cerrar</Button>
     
   </DialogActions></>
  );
};

export default Formulario;
