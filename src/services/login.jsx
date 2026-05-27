import axios from "axios"

const baseUrl = `${import.meta.env.VITE_API_URL}signinn/`;






const login= async  credentials => {
    const {data } = await axios.post(baseUrl,credentials)
    return data 
}   

const guardar= async  credentials => {
    const {data } = await axios.post(baseUrl,credentials)
    return data 
} 
export default {login, guardar}
