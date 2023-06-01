import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import {useContext} from "react";
import {AuthContext} from "@/pages/contexts/AuthContext";

class ServicioServices {
    constructor(token) {
        this.token = token;
    }

    getServicios = async (page, size) => {
        try {
            const api = `${process.env.API_URL}api/servicios/page`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { page, size },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los servicios");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };
}

export default ServicioServices;