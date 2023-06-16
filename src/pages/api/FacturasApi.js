import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

class FacturasApi {
    constructor(token) {
        this.token = token;
    }

    getFacturas = async (page, size) => {
        try {
            ///api/factura/page
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
            const api = `${process.env.API_URL}api/factura/buscar?pagado=${filter}`;
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

    obtenerFacturas = async () => {
        try {
            const api = `${process.env.API_URL}api/factura/`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
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

    filterFacturasVentas = async (filter) => {
        try {
            //http://localhost:8081/api/factura/buscarPyC?pagado=PAGADO&compra=VENTA
            const api = `${process.env.API_URL}api/factura/buscarPyC?pagado=${filter}&compra=VENTA`;
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

    filterFacturasCompra = async (filter) => {
        try {
            const api = `${process.env.API_URL}api/factura/buscarPyC?pagado=${filter}&compra=COMPRA`;
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

    filterFacturasCompraPage = async (filter, page, size) => {
        try {
            const api = `${process.env.API_URL}api/factura/pageBuscar?pagado=${filter}&esCompra=COMPRA`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { page, size },
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
    filterFacturasVentasListar = async (filter) => {
        try {
            const api = `${process.env.API_URL}api/factura/buscar/NombreRucPagado?pagado=PENDIENTE&ruc=${filter}&nombre=${filter}`;
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

    imprimirFactura = async (id) => {
        try {
            const api = `${process.env.API_URL}api/imprimir/Factura/${id}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al imprimir la factura");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };


}

export default FacturasApi;