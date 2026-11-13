import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}/pit/`;

// El token se lee en cada llamada (no al cargar el módulo) para tomar siempre la sesión vigente.
const leerToken = () => {
    try {
        return JSON.parse(window.localStorage.getItem('loggedNoteAppUser') || 'null')?.token || '';
    } catch {
        return '';
    }
};

const config = () => ({ headers: { Authorization: `Bearer ${leerToken()}` } });

// Datos editados de todos los lotes del PIT (una fila por pin del mapa).
const lista = async () => {
    const { data } = await axios.get(baseUrl + 'lotes', config());
    return Array.isArray(data) ? data : [];
};

// Guarda los cambios de un lote (solo nivel 8). Devuelve la fila actualizada.
const guardar = async (idMapa, cambios) => {
    const { data } = await axios.post(baseUrl + 'lotes/' + encodeURIComponent(idMapa), cambios, config());
    if (typeof data === 'string') throw new Error(data); // el back responde "error login" con 200 si el token falla
    return data;
};

const historial = async (idMapa) => {
    const { data } = await axios.get(baseUrl + 'lotes/' + encodeURIComponent(idMapa) + '/historial', config());
    return Array.isArray(data) ? data : [];
};

export default { lista, guardar, historial };
