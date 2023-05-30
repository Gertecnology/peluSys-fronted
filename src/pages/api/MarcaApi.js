import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";


class MarcaApi {
    constructor(token) {
        this.token = token;
    }

    getMarcas = async () => {
        try {
            const api = `${process.env.API_URL}api/marca/page`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener las marcas");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };
}

export default MarcaApi;