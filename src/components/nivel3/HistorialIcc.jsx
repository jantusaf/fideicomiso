import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import servicionivel3 from "../../services/nivel3";


const Historial = () => {
  const [historial, setHistorial] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [pagina, setPagina] = useState(1);
  const [filasPorPagina, setFilasPorPagina] = useState(5);

  const navigate = useNavigate();

  const traer = async () => {
    try {
      const respuesta = await servicionivel3.traerhistorial();

      // Por si el servicio devuelve directamente el array
      // o devuelve { data: [...] }
      setHistorial(Array.isArray(respuesta) ? respuesta : respuesta?.data || []);
    } catch (error) {
      console.error("Error al traer historial:", error);
      setHistorial([]);
    }
  };

  useEffect(() => {
    traer();
  }, []);

  // Busca por zona, mes, año o valor ICC.
  const historialFiltrado = historial.filter((item) => {
    const texto = busqueda.toLowerCase();

    return (
      String(item.zona || "").toLowerCase().includes(texto) ||
      String(item.mes || "").toLowerCase().includes(texto) ||
      String(item.anio || "").toLowerCase().includes(texto) ||
      String(item.ICC || "").toLowerCase().includes(texto)
    );
  });

  const totalPaginas = Math.ceil(
    historialFiltrado.length / filasPorPagina
  );

  const inicio = (pagina - 1) * filasPorPagina;
  const historialPaginado = historialFiltrado.slice(
    inicio,
    inicio + filasPorPagina
  );

  const cambiarBusqueda = (e) => {
    setBusqueda(e.target.value);
    setPagina(1);
  };

  const cambiarFilas = (e) => {
    setFilasPorPagina(Number(e.target.value));
    setPagina(1);
  };

  return (
    <div className="historial-contenedor">
      <div className="historial-cabecera">
        <h2>Historial de ICC</h2>

        <button
          className="boton-nuevo"
          onClick={() => navigate("/nivel3/agregaricc")}
        >
          Nuevo
        </button>
      </div>

      <div className="historial-herramientas">
        <input
          type="text"
          placeholder="Buscar por zona, mes, año o valor..."
          value={busqueda}
          onChange={cambiarBusqueda}
          className="input-busqueda"
        />

        <div className="filas-por-pagina">
          <label>Filas por página: </label>

          <select value={filasPorPagina} onChange={cambiarFilas}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>
      </div>

      <div className="tabla-responsive">
        <table className="tabla-historial">
          <thead>
            <tr>
              <th>Zona</th>
              <th>Mes</th>
              <th>Año</th>
              <th>Valor ICC</th>
            </tr>
          </thead>

          <tbody>
            {historialPaginado.length > 0 ? (
              historialPaginado.map((item, index) => (
                <tr key={item.id || `${item.zona}-${item.mes}-${item.anio}-${index}`}>
                  <td>{item.zona}</td>
                  <td>{item.mes}</td>
                  <td>{item.anio}</td>
                  <td>
                    {item.ICC !== null && item.ICC !== undefined
                      ? Number(item.ICC).toLocaleString("es-AR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="sin-registros">
                  No se encontraron registros
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="paginacion">
        <span>
          Mostrando {historialFiltrado.length === 0 ? 0 : inicio + 1} a{" "}
          {Math.min(inicio + filasPorPagina, historialFiltrado.length)} de{" "}
          {historialFiltrado.length} registros
        </span>

        <div className="botones-paginacion">
          <button
            onClick={() => setPagina((prev) => prev - 1)}
            disabled={pagina === 1}
          >
            Anterior
          </button>

          <span>
            Página {pagina} de {totalPaginas || 1}
          </span>

          <button
            onClick={() => setPagina((prev) => prev + 1)}
            disabled={pagina >= totalPaginas || totalPaginas === 0}
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default Historial;