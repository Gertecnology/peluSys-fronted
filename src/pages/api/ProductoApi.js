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


    getProductoList = async () => {
        try {
            const api = `${process.env.API_URL}api/producto/`;
            const response = await axios.get(api, {
                headers: { Authorization: `Bearer ${this.token}` },
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







}



export default ProductoApi;