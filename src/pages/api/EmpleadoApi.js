import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


class EmpleadoApi {
    constructor(token) {
        this.token = token;
    }

    getEmpleados = async () => {
        try {
            const api = `${process.env.API_URL}api/empleado/?page=0&size=100&sort=asc`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los empleados");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };


}

export default EmpleadoApi;