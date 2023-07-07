import React, { useRef } from 'react';
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/layout/Layout";
import { useContext, useEffect, useState, ReactDOMServer } from "react";
import jsPDF from 'jspdf';
import axios from "axios";


const Stock = ({ }) => {
    const ref = useRef(null)
    const { user } = useContext(AuthContext)
    const [productos, setProductos] = useState([])
    const [marcas, setMarcas] = useState([])


    useEffect(() => {
        obtenerDatos()
        obtenerMarcas()
    }, [])


    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/producto/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setProductos(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }


    const obtenerMarcas = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/marca/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setMarcas(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(16);
        doc.text('Stock de Productos', 10, 10);

        let y = 20;

        productos.forEach((producto, index) => {
            const marca = marcas.find((marca) => marca.id === producto.id_marca)?.nombre || '';

            doc.setFontSize(12);
            doc.text(producto.nombre, 10, y);
            doc.text(marca, 50, y);
            doc.text(producto.detalle, 90, y);
            doc.text(producto.cantidad.toString(), 150, y);

            y += 10;
        });

        doc.save('stock_productos.pdf');
    };



    return (<Layout pagina={"Stock de productos"}>
        <div ref={ref}>

            <h1 className="text-center">
                Stock de Productos
            </h1>

            <div className='flex justify-end pe-4'>
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generarPDF}>
                    Guardar Informe
                </button>
            </div>


            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md mx-5 mt-3">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-blue-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Marca</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Detalle</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">En Stock</th>

                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-xl">
                            {(productos?.map((producto, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="ps-3">{producto.nombre}</td>
                                    <td>{marcas?.find(marca => marca.id === producto.id_marca)?.nombre}</td>
                                    <td>{producto.detalle}</td>
                                    <td>{producto.cantidad}</td>
                                </tr>
                            )))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

    </Layout>);
}

export default Stock;