import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

class InformeApi {
    constructor(token) {
        this.token = token;
    }



    getProductos = async (eCompra, inicio, cierre, page, size) => {
        try {
            const api = `${process.env.API_URL}api/informes/topProductos?eCompra=${eCompra}&inicio=${inicio}&fin=${cierre}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { page, size },
            });
            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los informes de los productos");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };

    getInformeProducto = async (eCompra, fechaIncio, fechaCierre) => {
        try {
            //http://localhost:8081/api/informes/topProductos?eCompra=COMPRA&inicio=2023-07-04T15%3A30%3A00&fin=2023-07-04T15%3A30%3A00&
            const api = `${process.env.API_URL}api/informes/topProductos?eCompra=${eCompra}&inicio=${fechaIncio}&fin=${fechaCierre}`;
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