
import Widget from '../../../components/nivel4/EstadistivasRelev/Widget/Widget';
import Widgett from '../../../components/nivel4/EstadistivasRelev/Widget/Widget';
import Featured from '../../../components/nivel4/EstadistivasRelev/Featured/Featured'
/* import Chart from '../../../components/nivel4/EstadistivasRelev/Featured/Featured'
import Tabla from '../../../components/nivel4/EstadistivasRelev/Tabla/Tabla'
import ModalBorrar from '../../../components/nivel4/ModalBorrar/ModalBorrar' */
import "./Home.scss";

import React, { useEffect, useState, } from "react";

import servicioClientes from '../../../services/clientes'

import { useNavigate } from "react-router-dom";

import Snackbar from '@mui/material/Snackbar';







export default function Legajos(props) {

  const [cli, setCli] = useState(
    {
      cuil_cuit: props.cuil_cuit
    });
  const [datos, setDatos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const navigate = useNavigate();
  const [state, setState] = React.useState({
    open: false,
    vertical: 'bottom',
    horizontal: 'right',
  });
  const { vertical, horizontal, open } = state;
  useEffect(() => {

    buscar()

  }, [])

  useEffect(() => {
    buscar();
  }, [props.refresh]); // Actualizar cuando cambie el prop refresh



  const buscar = async () => {
    const datoss = await servicioClientes.datoslegajo({ cuil_cuit: props.cuil_cuit });
    setDatos(Array.isArray(datoss) ? datoss : []); // Si `datoss` no es un array, se asigna un array vacío
  }; 
  const handleClose = () => {
    setState({ ...state, open: false });
  };





  return (
<>
{datos  ? <>

    <div>
      {datos[0] ?
        <div>
         {Array.isArray(datos) && datos.length > 0 ? (
  <div>
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      onClose={handleClose}
      message={datos[0]?.Faltan} // Usa "?" para prevenir el error
      key={vertical + horizontal}
    />
  </div>
) : (
  <div></div>
)}
        </div> : <div> </div>
      }
      {datos[0] ?
        <div>
         {/*  <Featured
            porcentaje={datos[0].porccompleto}
            titulo="Completo"

          /> */}
        </div> : <div><Featured /> </div>}



      {datos[0] ?
        <div>
          {datos[0].acreditacion_i}
          <div className="home">

            <div className="container">

              <div className="widgets">
                {datos[0] ?
                  <div>
                    <Widget type="total"
                      cantidad={datos[0].total}
                    />
                  </div> : <div> <Widget type="total"
                  /></div>
                }

                {datos[0] ?
                  <div>
                    <Widget type="Pendientes"
                      cantidad={datos[0].Pendientes}
                      porcentaje={datos[0].porcPendientes}
                    />
                  </div> : <div> <Widget type="Pendientes"
                  /></div>
                }
                {datos[0] ?
                  <div>
                    <Widget type="Aprobadas"
                      cantidad={datos[0].Aprobadas}
                      porcentaje={datos[0].porcAprobadas}
                    />
                  </div> : <div> <Widget type="Aprobadas"
                  /></div>
                }
                {datos[0] ?
                  <div>
                    <Widget type="Rechazadas"
                      cantidad={datos[0].Rechazadas}
                      porcentaje={datos[0].porcRechazadas}

                    />
                  </div> : <div> <Widget type="Rechazadas"
                  /></div>
                }





              </div>
              <div className="charts">






              </div>

            </div>
          </div>


        </div>

        : <div></div>}

    </div>


</>:<></>

  }


</>
  );

}

