// La protección de acceso la maneja <RutaProtegida> en Rutas.jsx:
// si se llega hasta acá es porque hay sesión válida y la ruta no existe.
export default function NotFound() {
  return (
    <div style={{ padding: 40, fontFamily: "system-ui, sans-serif" }}>
      <h2>Página no encontrada</h2>
      <p>La dirección a la que intentaste ingresar no existe.</p>
      <a href="/">Volver al inicio</a>
    </div>
  );
}
