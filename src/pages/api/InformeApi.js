import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

class InformeApi {
    constructor(token) {
        this.token = token;
    }

    getInformeProducto = async (eCompra, fechaIncio, fechaCierre) => {
        try {
            //api/informes/topProductosFechas?eCompra=COMPRA&fechaInicio=2023-07-03T09%3A00%3A42.411&fechaCierre=2023-07-03T19%3A00%3A42.411
            const api = `${process.env.API_URL}api/informes/topProductosFechas?eCompra=${eCompra}&fechaInicio=${fechaIncio}&fechaCierre=${fechaCierre}`;
            const response = await axios(api, {
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los productos en la fecha");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    getInformeCaja = async (id) => {
        try {
            //api/informes/topProductosFechas?eCompra=COMPRA&fechaInicio=2023-07-03T09%3A00%3A42.411&fechaCierre=2023-07-03T19%3A00%3A42.411
            const api = `${process.env.API_URL}api/cajas/ResumenUltimoArqueo/${id}`;
            const response = await axios(api, {
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los arqueos en la fecha");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

}

export default InformeApi;