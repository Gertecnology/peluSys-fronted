import Layout from "@/layout/Layout";


import { useContext, useEffect, useState } from "react";

import { useRouter } from 'next/router'

import ServicioServices from "@/pages/api/SericiosApi";

import { AuthContext } from "@/pages/contexts/AuthContext";


const PAGE_SIZE = 10;

const Servicio = ({ }) => {
    const ruta = useRouter();

    const [servicio, setServicio] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user && user.token) {
            const servicioServices = new ServicioServices(user.token);

            servicioServices.getServicios()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    console.log("Datos obtenidos:", datos);
                    setServicio(datos.content);
                    setTotalPages(datos.totalPages);
                    console.log("Valor de servicio:", servicio);
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener los datos:", error);
                });
        }
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedServicio = servicio.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    return (
        <Layout pagina={"Servicio"} titulo={"CRUD Servicio"} ruta={ruta.pathname}>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-blue-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-white">
                                    Servicio
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">
                                    Precio
                                </th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {paginatedServicio.map((item) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">
                                        <div className="text-sm">
                                            <div className=" text-gray-700">
                                                {item.detalle}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{item.precio} gs</td>
                                    <td className="px-6 py-4 flex items-center">
                                        <div className="flex justify-end gap-4">
                                            <a
                                                x-data="{ tooltip: 'Delete' }"
                                                href="#"
                                                className="text-gray-500 hover:text-red-600"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                    />
                                                </svg>
                                            </a>
                                            <a
                                                x-data="{ tooltip: 'Edit' }"
                                                href="#"
                                                className="text-gray-500 hover:text-blue-600"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    strokeWidth="1.5"
                                                    stroke="currentColor"
                                                    className="h-6 w-6"
                                                    x-tooltip="tooltip"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Paginación */}
                <div className="flex justify-center mt-5">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === index
                                        ? "text-blue-600 hover:text-blue-700"
                                        : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>
            </div>

        </Layout>
    );
};

export default Servicio;
