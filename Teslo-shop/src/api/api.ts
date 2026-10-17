import axios from "axios";


const BASE_URL = import.meta.env.VITE_API_URL

export const api = axios.create({

    baseURL: `${BASE_URL}`

})

// Lee el token en el momento exacto de cada petición (no depende de que un
// efecto de React ya haya corrido), evitando una condición de carrera donde
// la primera petición tras cargar la página sale sin Authorization.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})