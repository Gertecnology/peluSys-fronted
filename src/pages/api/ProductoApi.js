import axios from "axios";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import { useContext } from "react";
import { AuthContext } from "@/pages/contexts/AuthContext";

class ProductoApi {
    constructor(token) {
        this.token = token;
    }

    getProducto = async (page, size) => {
        try {
            const api = `${process.env.API_URL}api/producto/page`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
                params: { page, size },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al obtener los productos");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };


    filterProducto = async (filter) => {
        try {
            const api = `${process.env.API_URL}api/producto/buscar?nombre=${filter}&marca=${filter}`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
            });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al filtrar los productos");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };



    saveProducto = async (data) => {
        console.log(data);
        try {
            const api = `${process.env.API_URL}api/producto/guardar`;
            const response = await axios.post(api, {
                nombre: data.nombre,
                detalle: data.detalle,
                precio: data.precio,
                tipo_iva: data.iva,
                id_marca: data.marca,
                id_proveedor: data.proveedor,
            },
                {
                    headers: { Authorization: `Bearer ${this.token}` },
                });

            if (response.status === 200) {
                return response.data;
            } else {
                throw new Error("Error al guardar el producto");
            }
        } catch (error) {
            console.error("Error en la solicitud HTTP:", error);
            throw error;
        }
    };





}



export default ProductoApi;