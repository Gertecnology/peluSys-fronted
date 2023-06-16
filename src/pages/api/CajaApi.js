import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


class CajaApi {
    constructor(token) {
        this.token = token;
    }

    getCajas = async () => {
        try {
            const api = `${process.env.API_URL}api/cajas/`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener las cajas");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    getCajaEmpleado = async (id) => {
        try {
            const api = `${process.env.API_URL}api/cajas/cajaDelEmpleado/${id}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener las cajas de empleados");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    getMontoCaja = async (id) => {
        try {
            const api = `${process.env.API_URL}api/cajas/montoCaja/${id}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los montos de las cajas del empleado");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };


}

export default CajaApi;