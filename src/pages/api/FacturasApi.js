import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

class FacturasApi {
    constructor(token) {
        this.token = token;
    }

    getFacturas = async (page, size) => {
        try {
            const api = `${process.env.API_URL}api/factura/page`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { page, size },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener las facturas");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    filterFacturas = async (filter) => {
        try {
            const api = `${process.env.API_URL}api/factura/buscar?pagado={filter}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al filtrar las facturas");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

}

export default FacturasApi;