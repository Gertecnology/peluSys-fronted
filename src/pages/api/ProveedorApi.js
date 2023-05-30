import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


class ProveedorApi {
    constructor(token) {
        this.token = token;
    }

    getProveedor = async () => {
        try {
            const api = `${process.env.API_URL}api/proveedores/`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los proveedores");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };


}

export default ProveedorApi;


