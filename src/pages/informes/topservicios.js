import React, { useRef } from 'react';
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/layout/Layout";
import { useContext, useEffect, useState, ReactDOMServer } from "react";
import jsPDF from 'jspdf';
import axios from "axios";


const TopServicios = ({}) => {
    const { user } = useContext(AuthContext)
    const [servicios, setServicios] = useState([])

    useEffect(() => {
        obtenerDatos()
    }, [])


    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/informes/topServicios?eCompra=VENTA`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setServicios(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const generarPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Servicios que más venden', 10, 10);

        let y = 20;

        servicios.forEach((s, index) => {

            doc.setFontSize(12);
            doc.text(s.servicio.detalle, 10, y);
            doc.text(String(s.cantidad), 90, y);
            y += 10;
        });

        doc.save('top_servicios.pdf');
    };
    


    return (<Layout pagina={"Top Servicios"}>

        <h1 className="text-center">
            Top Servicios Mas vendidos
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
                            <th scope="col" className="px-6 py-4 font-medium text-white">Detalle</th>
                            <th scope="col" className="px-6 py-4 font-medium text-white">Cantidad de Ventas</th>

                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xl">
                        {(servicios?.map((servicio, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td>{servicio.servicio.detalle}</td>
                                <td>{servicio.cantidad}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>

</Layout>);
}
 
export default TopServicios;