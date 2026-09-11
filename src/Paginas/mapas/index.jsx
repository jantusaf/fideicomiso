import Mapa from '../../components/mapassegundaparte/componente1'

// El botón "Cerrar sesión" vive ahora dentro del panel lateral de <Mapa/>
// (junto al logo), en el flujo normal del documento, para que nunca
// choque con la tabla de referencias flotante.
export default function Legajos() {
    return (
      <div>
        <Mapa/>
      </div>
    );
}
