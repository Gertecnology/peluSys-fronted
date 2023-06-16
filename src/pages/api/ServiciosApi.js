import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

class ServicioApi {
    constructor(token) {
        this.token = token;
    }

    getServicios = async (page, size) => {
        try {
            ///servicios/page?page=0&size=1&sort=string
            const api = `${process.env.API_URL}api/servicios/page?page=${page}&size=${size}&sort=desc`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}`},
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

    filterServicio = async (filter) => {
        try {
            const api = `${process.env.API_URL}api/servicios/buscarNombre?nombre=${filter}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al filtrar los servicios");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    getServiciosList = async () => {
        try {
            const api = `${process.env.API_URL}api/servicios/`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
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

export default ServicioApi;