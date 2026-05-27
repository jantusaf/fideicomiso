import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, Marker, useMap } from "react-leaflet";
import { useMapEvents } from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "./MapaConCapas.css";
import parcasLogo from "../../Assets/marcas.png";
import L from "leaflet";
import serviciolotes from "../../services/lotes";
import { centerOfMass, pointOnFeature, booleanPointInPolygon } from "@turf/turf";
import { LayersControl } from "react-leaflet";
const MapaConCapas = () => {
    //  Helper: inyecta properties.id si no existe (para area1..4 y cualquier capa que venga sin id)
    const normalizarGeojsonConIds = (data, nombreCapa) => {
        if (!data?.features) return data;

        return {
            ...data,
            features: data.features.map((f, idx) => {
                const yaTieneId =
                    f?.properties?.id ??
                    f?.properties?.ID ??
                    f?.properties?.Id ??
                    f?.properties?.id_mapa ??
                    f?.id ??
                    null;

                // ✅ SI NO VIENE ID, GENERO NUMÉRICO SIEMPRE
                const idGenerado = idx + 1;

                // ✅ fuerza a número cuando se pueda
                const idFinal = yaTieneId ?? idGenerado;
                const idNumerico = Number.isNaN(Number(idFinal)) ? idFinal : Number(idFinal);

                return {
                    ...f,
                    properties: {
                        ...f.properties,
                        id: idNumerico,
                    },
                };
            }),
        };
    };



    const [zoomActual, setZoomActual] = useState(14);

    const ZoomWatcher = () => {
        useMapEvents({
            zoomend: (e) => setZoomActual(e.target.getZoom()),
        });
        return null;
    };

    const [capasActivas, setCapasActivas] = useState({
        Manzanas: true,
        "Plan Especial": false,
        Barrios: false,
        "Planificación Sección Sur": false,
        "Zonificación Sta Catalina": false,
        "ZRU Predios La Caja": false,
        area1: false,
        area2: false,
        area3: false,
        area4: false,
        area5: false,
        area6: false,
        ic3: false,
         lineasparque: true,
    });

    const [subCapasActivas, setSubCapasActivas] = useState({
        planespecial1: false,
        planespecial2: false,
        planespecial3: false,
        planespecial4: false,
        planespecial5: false,
    });

    const opcionesSubclasificacion = [
        "C1-Corredor de densidad 1",
    

    ];



    const coloresPorSubclasificacion = {
        "C1-Corredor de densidad 1": "#ffbc8e",
      
        "ZPA-Zona de Proteccion Ambiental-Reserva Natural Santa Catalina": "#034F04",
        "": "red",
        null: "red",
        undefined: "red",
    };
    const [verPublicoPrivado, setVerPublicoPrivado] = useState(false);
    const [geojsonData, setGeojsonData] = useState({});
    const [modalDetalleAbierto, setModalDetalleAbierto] = useState(false);
    const [modalAbierto, setModalAbierto] = useState(false);
    const [texto, setTexto] = useState("");
    const [idSeleccionado, setIdSeleccionado] = useState(null);
    const [nombreCapaSeleccionada, setNombreCapaSeleccionada] = useState("");
    const [centroSeleccionado, setCentroSeleccionado] = useState(null);
    const [poligonosGuardados, setPoligonosGuardados] = useState([]);
    const idsDesdeBase = (poligonosGuardados || []).map((p) => p.id_mapa);
    const [mapa, setMapa] = useState(null);
    const [subclasificacion, setSubclasificacion] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [verReferencias, setVerReferencias] = useState(true);
    const [datosZonaSeleccionada, setDatosZonaSeleccionada] = useState(null);
    const [judicializado, setJudicializado] = useState("");
    const [adrema, setAdrema] = useState("");
    const [privado, setPrivado] = useState("");
    const [superficie, setSuperficie] = useState("");
const [fechaSentinel, setFechaSentinel] = useState("2024-01-01");
const [animarSentinel, setAnimarSentinel] = useState(false);
    const [mensura, setMensura] = useState("");
    const [subCapasSur, setSubCapasSur] = useState({
        PIT: false,
        "PLC-C": false,
        "PLC-F": false,
        ZPA: false,
        ic3: false,
        ic4: false,
        ic42: false,
    });
    const esAreaEspecial = ["area1", "area2", "area3", "area4", "area5", "area6", "ic3", "ic4", "ic42"].includes(nombreCapaSeleccionada
    );
    const redondearFechaSentinel = (fecha) => {
    const d = new Date(fecha);
    const dia = d.getDate();
    const redondeado = Math.floor(dia / 5) * 5 || 1;
    d.setDate(redondeado);
    return d.toISOString().slice(0, 10);
};
useEffect(() => {
    if (!animarSentinel) return;

    const intervalo = setInterval(() => {
        setFechaSentinel((prev) => {
            const d = new Date(prev);
            d.setMonth(d.getMonth() + 1);
            return d.toISOString().slice(0, 10);
        });
    }, 1500);

    return () => clearInterval(intervalo);
}, [animarSentinel]);
const fechaSentinelValida = redondearFechaSentinel(fechaSentinel);
    // Carga inicial de datos guardados desde backend
    useEffect(() => {
        serviciolotes
            .poligonosguardados()
            .then((data) => {
                console.log("Polígonos guardados:", data);
                setPoligonosGuardados(data);
            })
            .catch(console.error);
    }, []);

    // Carga de geojson
    useEffect(() => {
        // Manzanas
        fetch("/puntosparque.geojson")
            .then((r) => r.json())
            .then((data) => {
                // manzanas normalmente ya trae id; igual no molesta normalizar
                const normalizado = normalizarGeojsonConIds(data, "Manzanas");
                setGeojsonData((prev) => ({ ...prev, Manzanas: normalizado }));
            })
            .catch(console.error);

        // Planes especiales
      
        fetch("/ic42.geojson")
            .then((r) => r.json())
            .then((data) => {
                const normalizado = normalizarGeojsonConIds(data, "ic42");
                setGeojsonData((prev) => ({ ...prev, ic42: normalizado }));
            })
            .catch(console.error);
        fetch("/lineasparque.geojson")

            .then((r) => r.json())
            .then((data) => {
                const normalizado = normalizarGeojsonConIds(data, "lineasparque");
                setGeojsonData((prev) => ({ ...prev, lineasparque: normalizado }));
            })
            .catch(console.error);
        const nuevasCapas = [
            { nombre: "Zonificación Sta Catalina", archivo: "zonificacion_stacatalina.geojson" },
            { nombre: "ZRU Predios La Caja", archivo: "zru_prediosdelacaja.geojson" },
        ];

        const capasSeccionSur = [
            { nombre: "PIT", archivo: "pitfases.geojson" },
            { nombre: "PLC-C", archivo: "plc-c.geojson" },
            { nombre: "PLC-F", archivo: "plc-f.geojson" },
            { nombre: "ZPA", archivo: "zpa.geojson" },
        ];

        capasSeccionSur.forEach((capa) => {
            fetch(`/${capa.archivo}`)
                .then((r) => r.json())
                .then((data) => {
                    const normalizado = normalizarGeojsonConIds(data, capa.nombre);
                    setGeojsonData((prev) => ({ ...prev, [capa.nombre]: normalizado }));
                })
                .catch((error) => console.error(`Error cargando ${capa.nombre}:`, error));
        });

        nuevasCapas.forEach((capa) => {
            fetch(`/${capa.archivo}`)
                .then((r) => r.json())
                .then((data) => {
                    const normalizado = normalizarGeojsonConIds(data, capa.nombre);
                    setGeojsonData((prev) => ({ ...prev, [capa.nombre]: normalizado }));
                })
                .catch((error) => console.error(`Error cargando ${capa.nombre}:`, error));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // match recomendado: id_mapa + capa
    const buscarPoligonoDB = (arr, id, capa) => {
        const matchExacto = (arr || []).find(
            (p) => String(p.id_mapa) === String(id) && String(p.capa || "") === String(capa || "")
        );
        if (matchExacto) return matchExacto;

        const fallback = (arr || []).find((p) => String(p.id_mapa) === String(id));
        return fallback || null;
    };




   const handleFeatureClick = (e, nombreCapa) => {
        const feature = e.target.feature;
        const layer = e.target;
    let center;

if (layer.getBounds) {
    center = layer.getBounds().getCenter(); // para polígonos
} else if (layer.getLatLng) {
    center = layer.getLatLng(); // para puntos
}

        if (nombreCapa === "Barrios") return;

        const id =
            feature?.properties?.id ??
            feature?.properties?.ID ??
            feature?.properties?.Id ??
            feature?.properties?.id_mapa ??
            feature?.id ??
            null;

        if (id == null) return;

        const datosBase = buscarPoligonoDB(poligonosGuardados, id, nombreCapa);

        setIdSeleccionado(id);
        setCentroSeleccionado(center);
        setNombreCapaSeleccionada(nombreCapa);

        setDatosZonaSeleccionada(datosBase);

        setTexto(datosBase?.dato1 ?? "");
        setSubclasificacion(datosBase?.subclasificacion ?? "");
        setDescripcion(datosBase?.descripcion ?? "");
        setPrivado(datosBase?.privado ?? "");
        setAdrema(datosBase?.adrema ?? "");
        setSuperficie(datosBase?.superficie ?? "");
        setJudicializado(datosBase?.judicializado ?? "");
        setMensura(datosBase?.mensura ?? "");
        setModalDetalleAbierto(true);
        setModalAbierto(false);
    };


    const InstanciaDelMapa = ({ setMapa }) => {
        const map = useMap();
        useEffect(() => {
            setMapa(map);
        }, [map, setMapa]);
        return null;
    };

    const onEachFeature = (feature, layer) => {
        layer.on({ click: handleFeatureClick });
    };

    const toggleCapaPrincipal = (nombre) => {
        const nuevoEstado = !capasActivas[nombre];
        setCapasActivas((prev) => ({ ...prev, [nombre]: nuevoEstado }));

        if (nombre === "Plan Especial") {
            const nuevoEstadoSubcapas = {};
            Object.keys(subCapasActivas).forEach((key) => {
                nuevoEstadoSubcapas[key] = nuevoEstado;
            });
            setSubCapasActivas(nuevoEstadoSubcapas);
        }

        if (nombre === "Planificación Sección Sur") {
            const nuevoEstadoSubcapasSur = {};
            Object.keys(subCapasSur).forEach((key) => {
                nuevoEstadoSubcapasSur[key] = nuevoEstado;
            });
            setSubCapasSur(nuevoEstadoSubcapasSur);
        }
    };

    const toggleSubCapa = (nombre) => {
        setSubCapasActivas((prev) => ({ ...prev, [nombre]: !prev[nombre] }));

        if (Object.values(subCapasActivas).every((val) => val)) {
            setCapasActivas((prev) => ({ ...prev, "Plan Especial": true }));
        }
    };

    const getCentroideAproximado = (geometry) => {
        try {
            const centroVisual = centerOfMass(geometry);
            const [lng, lat] = centroVisual.geometry.coordinates;

            const estaDentro = booleanPointInPolygon(centroVisual, geometry);
            if (estaDentro) return { lat, lng };

            const puntoSeguro = pointOnFeature(geometry).geometry.coordinates;
            return { lat: puntoSeguro[1], lng: puntoSeguro[0] };
        } catch (err) {
            console.error("Error calculando centroide:", err);
            return null;
        }
    };

    const EtiquetasPoligonos = ({
        geojsonData,
        poligonosGuardados,
        capasActivas,
        subCapasActivas,
        subCapasSur,
        mostrarEtiquetas,
        zoomActual,
    }) => {
        if (!mostrarEtiquetas) return null;
        const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

        const fontSize = clamp(10 + (zoomActual - 16) * 2.2, 10, 20);
        const paddingY = clamp(6 + (zoomActual - 16) * 1.2, 6, 14);
        const paddingX = clamp(6 + (zoomActual - 16) * 0.8, 6, 16);
        const minWidth = clamp(18 + (zoomActual - 16) * 6, 18, 60);

        return (
            <>
                {Object.entries(geojsonData).map(([nombreCapa, geojson]) => {
                    const esSubcapa = nombreCapa.startsWith("planespecial");
                    const esSubcapaSur = ["PIT", "PLC-C", "PLC-F", "ZPA"].includes(nombreCapa);

                    const estaActiva = esSubcapa
                        ? subCapasActivas[nombreCapa]
                        : esSubcapaSur
                            ? subCapasSur[nombreCapa]
                            : capasActivas[nombreCapa];

                    if (!estaActiva) return null;

                    return geojson?.features?.map((feature) => {
                        const id = feature.properties?.id;
                        const poligonoDB = buscarPoligonoDB(poligonosGuardados, id, nombreCapa);


                        if (!poligonoDB || !feature.geometry) return null;

                        try {
                            const center = getCentroideAproximado(feature.geometry);
                            if (!center) return null;

                            return (
                                <Marker
                                    key={`etiqueta-${nombreCapa}-${id}`}
                                    position={center}
                                    icon={L.divIcon({
                                        className: "sc-labelIcon",
                                        html: `
    <div class="sc-labelBubble" style="
      font-size:${fontSize}px;
      padding:${paddingY}px ${paddingX}px;
      min-width:${minWidth}px;
    ">
      ${poligonoDB.dato1}
    </div>
  `,
                                        iconSize: [0, 0],
                                        iconAnchor: [0, 0],
                                    })}


                                />
                            );
                        } catch (error) {
                            console.error("Error al calcular centro:", error);
                            return null;
                        }
                    });
                })}
            </>
        );
    };


    const getStylePoligono = (feature, nombreCapa) => {
        const id = feature.properties?.id;

        const poligono = buscarPoligonoDB(poligonosGuardados, id, nombreCapa);

        let fillColor = "white";
        let fillOpacity = 0.2;

        if (!poligono) {
            return {
                fillColor,
                weight: 1,
                opacity: 0.5,
                color: "black",
                fillOpacity,
            };
        }

        // ✅ MODO PUBLICO / PRIVADO ACTIVADO
        if (verPublicoPrivado) {
            if (poligono.privado === "privado") {
                fillColor = "#d32f2f"; // rojo fuerte
            } else if (poligono.privado === "publico") {
                fillColor = "#2e7d32"; // verde fuerte
            } else {
                fillColor = "#9e9e9e"; // gris si no tiene dato
            }

            fillOpacity = 0.85;
        } else {
            // ✅ MODO NORMAL POR SUBCLASIFICACION
            const sub = poligono.subclasificacion;
            fillColor = coloresPorSubclasificacion[sub] || "gray";
            fillOpacity = 0.8;
        }

        return {
            fillColor,
            weight: 1,
            opacity: 0.5,
            color: "black",
            fillOpacity,
        };
    };



    return (
        <div className="mapa-contenedor">
            <div className="panel-lateral">
                <div className="logo-container">
                    <img src={parcasLogo} alt="Logo PARCAS" className="logo-parcas" />
                </div>
                <div className="capa-principal">
                    <label>
                        <input
                            type="checkbox"
                            checked={verPublicoPrivado}
                            onChange={() => setVerPublicoPrivado((p) => !p)}
                        />
                        <strong>Ver Público / Privado</strong>
                    </label>
                </div>
                <h3>Capas disponibles</h3>

                <div className="capa-principal">
                    <input type="checkbox" checked={!!capasActivas.Manzanas} onChange={() => toggleCapaPrincipal("Manzanas")} />
                    <label>
                        <strong>Manzanas</strong>
                    </label>
                </div>

                </div>

        <div style={{marginTop:"10px"}}>
<div style={{marginTop:"10px"}}>
<label><strong>🛰️ Fecha Sentinel</strong></label>

<input
type="date"
value={fechaSentinel}
onChange={(e)=>setFechaSentinel(e.target.value)}
style={{width:"100%"}}
/>

<div style={{fontSize:"12px",marginTop:"4px"}}>
fecha usada: {fechaSentinelValida}
</div>

<button
onClick={()=>setAnimarSentinel(!animarSentinel)}
style={{
marginTop:"6px",
width:"100%",
padding:"6px",
cursor:"pointer"
}}
>
{animarSentinel ? "⏸ detener animación" : "▶ animar evolución"}
</button>

</div>
</div>

            <MapContainer center={[-27.5450, -58.8050]} zoom={17} style={{ height: "100vh", width: "100%" }}><ZoomWatcher />

                <EtiquetasPoligonos
                    geojsonData={geojsonData}
                    poligonosGuardados={poligonosGuardados}
                    capasActivas={capasActivas}
                    subCapasActivas={subCapasActivas}
                    subCapasSur={subCapasSur}
                    mostrarEtiquetas={verReferencias && zoomActual >= 15}

                    zoomActual={zoomActual}
                />

                <InstanciaDelMapa setMapa={setMapa} />

<LayersControl position="topright">

  {/* MAPA NORMAL */}
  <LayersControl.BaseLayer name="Mapa (OpenStreetMap)">
    <TileLayer
      attribution="© OpenStreetMap contributors"
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      maxZoom={21}
    />
  </LayersControl.BaseLayer>

  {/* SATELITE ESRI */}
  <LayersControl.BaseLayer checked name="Satélite ESRI">
    <TileLayer
      attribution="Tiles © Esri"
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
      maxZoom={20}
    />
  </LayersControl.BaseLayer>

  {/* SATELITE GOOGLE */}
  <LayersControl.BaseLayer name="Satélite Google">
    <TileLayer
      url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      maxZoom={20}
    />
  </LayersControl.BaseLayer>

</LayersControl>

                {/* Manzanas */}
                {capasActivas.Manzanas && geojsonData.Manzanas && (
                    <GeoJSON
    data={geojsonData.Manzanas}
    pointToLayer={(feature, latlng) => {
        return L.circleMarker(latlng, {
            radius: 6,
            fillColor: "red",
            color: "black",
            weight: 1,
            fillOpacity: 0.8
        });
    }}
    onEachFeature={(feature, layer) => {
        layer.on({
            click: (e) => handleFeatureClick(e, "Manzanas")
        });
    }}
/>
                )}

                {/* Plan Especial */}
                {Object.entries(subCapasActivas).map(
                    ([nombre, activa]) =>
                        activa &&
                        geojsonData[nombre] && (
                            <GeoJSON
                                key={nombre}
                                data={geojsonData[nombre]}
                                style={(feature) => {
                                    const id = feature.properties?.id;

                                    const poligono = poligonosGuardados.find(
                                        (p) => String(p.id_mapa) === String(id)
                                    );

                                    let fillColor = "white";
                                    let fillOpacity = 0.2;

                                 
                                   

                                    return {
                                        fillColor,
                                        weight: 1,
                                        opacity: 0.5,
                                        color: "black",
                                        fillOpacity,
                                    };
                                }}
                                onEachFeature={onEachFeature}
                            />
                        )
                )}

                {/* Barrios / Calles */}
            
           


                {["area1", "area2", "area3", "area4", "area5", "area6", "lineasparque", "ic3", "ic4", "ic42"].map(

                    (nombre) =>
                        capasActivas[nombre] &&
                        geojsonData[nombre] && {
                            area1: (
                                <GeoJSON
                                    key="area1"
                                    data={geojsonData.area1}
                                    style={() => ({
                                        fillColor: "purple",
                                        fillOpacity: 0.15,
                                        color: "purple",
                                        weight: 2,
                                        opacity: 1,
                                    })}
                                    onEachFeature={onEachFeature}
                                />
                            ),
 lineasparque: (
      <GeoJSON
          key="lineasparque"
          data={geojsonData.lineasparque}
          style={() => ({
              color: "green",
              weight: 4,
              opacity: 1
          })}
          onEachFeature={(feature, layer) => {
              layer.on({
                  click: (e) => handleFeatureClick(e, "lineasparque")
              });
          }}
      />
  ),
                            ic4: (
                                <GeoJSON
                                    key="ic4"
                                    data={geojsonData.ic4}
                                    style={(feature) => {
                                        const id = feature?.properties?.id;

                                        const poligono = poligonosGuardados.find(
                                            (p) => String(p.id_mapa) === String(id)
                                        );

                                        // 🔴🟢 SI EL TOGGLE ESTÁ ACTIVADO
                                        if (verPublicoPrivado && poligono) {
                                            let colorBase = "#9e9e9e"; // gris por defecto

                                            if (poligono.privado === "privado") colorBase = "#d32f2f";
                                            if (poligono.privado === "publico") colorBase = "#2e7d32";

                                            return {
                                                fillColor: colorBase,
                                                fillOpacity: 0.9,
                                                color: "black", // 👈 borde negro como pediste
                                                weight: 3,
                                                opacity: 1,
                                            };
                                        }

                                        // 🎨 MODO NORMAL (como lo tenías)
                                        return {
                                            fillColor: "cyan",
                                            fillOpacity: 0.2,
                                            color: "blue",
                                            weight: 3,
                                            opacity: 1,
                                        };
                                    }}
                                    onEachFeature={onEachFeature}
                                />
                            ),

                        }[nombre]
                )},


            </MapContainer>


            {modalDetalleAbierto && (
                <div className="sc-modalOverlay" onClick={() => setModalDetalleAbierto(false)}>
                    <div className="sc-modalCard" onClick={(e) => e.stopPropagation()}>
                        <div className="sc-modalHeader">
                            <div>
                                <div className="sc-modalTitle">Detalle de zona</div>
                                <div className="sc-modalSubtitle">
                                    <span className="sc-badge">ID {idSeleccionado}</span>
                                    <span className="sc-dot">•</span>
                                    <span className="sc-muted">{nombreCapaSeleccionada || "Capa"}</span>
                                </div>
                            </div>

                            <button
                                className="sc-iconBtn"
                                onClick={() => setModalDetalleAbierto(false)}
                                aria-label="Cerrar"
                                title="Cerrar"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="sc-modalBody">
                            {datosZonaSeleccionada ? (
                                <div className="sc-grid2">
                                    <div className="sc-infoItem">
                                        <div className="sc-infoLabel">Dato</div>
                                        <div className="sc-infoValue">{datosZonaSeleccionada.dato1 || "-"}</div>
                                    </div>

                                    <div className="sc-infoItem">
                                        <div className="sc-infoLabel">Subclasificación</div>
                                        <div className="sc-infoValue">{datosZonaSeleccionada.subclasificacion || "-"}</div>
                                    </div>

                                    <div className="sc-infoItem sc-span2">
                                        <div className="sc-infoLabel">Descripción</div>
                                        <div className="sc-infoValue">{datosZonaSeleccionada.descripcion || "-"}</div>
                                    </div>
                                    <div className="sc-infoItem">
                                        <div className="sc-infoLabel">Privado/Publico</div>
                                        <div className="sc-infoValue">{datosZonaSeleccionada.privado || "-"}</div>
                                    </div>
                                    {esAreaEspecial && (
                                        <>
                                            {/* Fila 1: Nombre + CUIL/CUIT (en sc-grid2 = 2 cols) */}


                                            {/* Fila 2: 3 columnas dentro de una fila que ocupa 2 columnas del grid principal */}
                                            <div className="sc-span2" style={{ width: "100%" }}>
                                                <div
                                                    style={{
                                                        display: "grid",
                                                        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                                                        gap: 12,
                                                    }}
                                                >
                                                    <div className="sc-infoItem" style={{ margin: 0 }}>
                                                        <div className="sc-infoLabel">Superficie</div>
                                                        <div className="sc-infoValue">{datosZonaSeleccionada.superficie || "-"}</div>
                                                    </div>

                                                    <div className="sc-infoItem" style={{ margin: 0 }}>
                                                        <div className="sc-infoLabel">Mensura</div>
                                                        <div className="sc-infoValue">{datosZonaSeleccionada.mensura || "-"}</div>
                                                    </div>

                                                    <div className="sc-infoItem" style={{ margin: 0 }}>
                                                        <div className="sc-infoLabel">Adrema</div>
                                                        <div className="sc-infoValue">{datosZonaSeleccionada.adrema || "-"}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                    <div className="sc-infoItem sc-span2">
                                        <div className="sc-infoLabel">Capa</div>
                                        <div className="sc-infoValue">
                                            {datosZonaSeleccionada.capa || nombreCapaSeleccionada || "-"}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="sc-emptyState">
                                    <div className="sc-emptyTitle">Sin información cargada</div>
                                    <div className="sc-emptyText">Todavía no hay datos guardados para esta zona.</div>
                                </div>
                            )}
                        </div>

                        <div className="sc-modalFooter">
                            <button className="sc-btn sc-btnGhost" onClick={() => setModalDetalleAbierto(false)}>
                                Cerrar
                            </button>

                            <button
                                className="sc-btn sc-btnPrimary"
                                onClick={() => {
                                    setModalDetalleAbierto(false);
                                    setModalAbierto(true);
                                }}
                            >
                                Agregar / Editar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {modalAbierto && (
                <div className="sc-modalOverlay" onClick={() => setModalAbierto(false)}>
                    <div className="sc-modalCard" onClick={(e) => e.stopPropagation()}>
                        <div className="sc-modalHeader">
                            <div>
                                <div className="sc-modalTitle">Agregar / Editar información</div>
                                <div className="sc-modalSubtitle">
                                    <span className="sc-badge">ID {idSeleccionado}</span>
                                    <span className="sc-dot">•</span>
                                    <span className="sc-muted">{nombreCapaSeleccionada || "Capa"}</span>
                                </div>
                            </div>

                            <button className="sc-iconBtn" onClick={() => setModalAbierto(false)} aria-label="Cerrar" title="Cerrar">
                                ✕
                            </button>
                        </div>

                        <div className="sc-modalBody">
                            <div className="sc-formGrid">
                                <div className="sc-field">
                                    <label className="sc-label">Dato</label>
                                    <input
                                        className="sc-input"
                                        type="text"
                                        value={texto}
                                        onChange={(e) => setTexto(e.target.value)}
                                        placeholder="Ej: Hípico"
                                    />
                                </div>

                                <div className="sc-field">
                                    <label className="sc-label">Subclasificación</label>
                                    <select className="sc-select" value={subclasificacion} onChange={(e) => setSubclasificacion(e.target.value)}>
                                        <option value="">Selecciona una opción</option>
                                        {opcionesSubclasificacion.map((opcion, index) => (
                                            <option key={index} value={opcion}>
                                                {opcion}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="sc-field">
                                    <label className="sc-label">Privado/publico</label>
                                    <select className="sc-select" value={privado} onChange={(e) => setPrivado(e.target.value)}>
                                        <option value="">Selecciona una opción</option>

                                        <option value={"publico"}>
                                            Publico
                                        </option>
                                        <option value={"privado"}>
                                            Privado
                                        </option>
                                    </select>
                                </div>
                                <div className="sc-field">
                                    <label className="sc-label">Judicializado</label>
                                    <select className="sc-select" value={judicializado} onChange={(e) => setJudicializado(e.target.value)}>
                                        <option value="">Selecciona una opción</option>

                                        <option value={"No"}>
                                            No
                                        </option>
                                        <option value={"Si"}>
                                            Si
                                        </option>
                                    </select>
                                </div>
                                <div className="sc-field sc-span2">
                                    <label className="sc-label">Descripción</label>
                                    <input
                                        className="sc-input"
                                        type="text"
                                        value={descripcion}
                                        onChange={(e) => setDescripcion(e.target.value)}
                                        placeholder="Breve descripción…"
                                    />
                                </div>
                            </div>
                            {/* ✅ REORDENADO SOLO FRONTEND (layout) */}

                            {/* Fila 2: Superficie + Mensura + Adrema (3 columnas) */}
                            <div
                                className="sc-formGrid"
                                style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
                            >
                                <div className="sc-field">
                                    <label className="sc-label">Superficie</label>
                                    <input
                                        className="sc-input"
                                        value={superficie}
                                        onChange={(e) => setSuperficie(e.target.value)}
                                    />
                                </div>

                                <div className="sc-field">
                                    <label className="sc-label">Mensura</label>
                                    <input
                                        className="sc-input"
                                        value={mensura}
                                        onChange={(e) => setMensura(e.target.value)}
                                    />
                                </div>

                                <div className="sc-field">
                                    <label className="sc-label">Adrema</label>
                                    <input
                                        className="sc-input"
                                        value={adrema}
                                        onChange={(e) => setAdrema(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="sc-hint">
                                Se guardará asociado a <b>{nombreCapaSeleccionada}</b> con ID <b>{idSeleccionado}</b>.
                            </div>
                        </div>

                        <div className="sc-modalFooter">
                            <button
                                className="sc-btn sc-btnGhost"
                                onClick={() => {
                                    setModalAbierto(false);
                                    setModalDetalleAbierto(true);
                                }}
                            >
                                Volver
                            </button>

                            <button
                                className="sc-btn sc-btnPrimary"
                                onClick={async () => {
                                    try {
                                        console.log("Guardando:", {
                                            id_mapa: idSeleccionado,
                                            dato1: texto,
                                            descripcion,
                                            subclasificacion,
                                            capa: nombreCapaSeleccionada,
                                        });
                                        await serviciolotes.guardarpoligono({
                                            id_mapa: String(idSeleccionado),
                                            dato1: texto,
                                            descripcion,
                                            subclasificacion,
                                            capa: nombreCapaSeleccionada,
                                            privado,
                                            adrema,
                                            superficie,
                                            judicializado,
                                            mensura,
                                        });



                                        const nuevos = await serviciolotes.poligonosguardados();
                                        setPoligonosGuardados(nuevos);

                                        const actualizado = buscarPoligonoDB(nuevos, idSeleccionado, nombreCapaSeleccionada);
                                        setDatosZonaSeleccionada(actualizado);

                                        setModalAbierto(false);
                                        setModalDetalleAbierto(true);
                                    } catch (err) {
                                        console.error("Error guardando polígono:", err);
                                        alert("No se pudo guardar. Revisá la consola (Network/Console) para ver el error.");
                                    }
                                }}

                            >
                                Guardar cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapaConCapas;
