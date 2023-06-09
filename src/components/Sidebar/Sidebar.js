
import { AuthContext } from "@/pages/contexts/AuthContext";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { FcCalendar, FcShop } from "react-icons/fc";


const Sidebar = ({ children }) => {
    const router = useRouter();
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [isSubMenuFacturacionOpen, setIsSubMenuFacturacionOpen] = useState(false);
    const [isSubMenuVentasOpen, setIsSubMenuVentasOpen] = useState(false);
    const {setUser} = useContext(AuthContext)


    const handleMenuClick = (route) => {
        router.push(route);
    };

    const handleSubMenuClick = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };
    const handleSubMenuFacturacionClick = () => {
        setIsSubMenuFacturacionOpen(!isSubMenuFacturacionOpen);

    };
    const handleSubMenuVentasClick = () => {
        setIsSubMenuVentasOpen(!isSubMenuVentasOpen);

    };

    return (
        <div className="flex">
            {/* Menú lateral */}
            <aside className="bg-gray-200 fixed  w-64 h-screen overflow-y-auto">
                <div className="bg-white border-r h-full">
                    <ul className="p-8">
                        <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                            <button
                                onClick={() => handleMenuClick("/citas")}
                                className="flex justify-center items-center space-x-4 hover:text-white hover:bg-blue-700 text-gray-400 rounded px-2 py-2 w-full md:w-52"
                            >
                                <FcCalendar className="text-xl" />
                                <p className="text-lg mb-0">Citas</p>
                            </button>
                        </li>
                        <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                            <button
                                onClick={handleSubMenuClick}
                                className="flex justify-center items-center space-x-4 hover:text-white hover:bg-blue-700 text-gray-400 rounded px-2 py-2 w-full md:w-52"
                            >
                                <FcShop className="text-xl" />
                                <p className="text-lg mb-0">Inventarios</p>
                            </button>
                            {isSubMenuOpen && (
                                <ul className="ml-8 mt-2">
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/Producto")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Producto
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/Servicio")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Servicio
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/Marca")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Marca
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/Proveedor")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Proveedor
                                        </button>
                                    </li>

                                </ul>
                            )}
                        </li>


                        <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                            <button
                                onClick={handleSubMenuFacturacionClick}
                                className="flex justify-center items-center space-x-4 hover:text-white hover:bg-blue-700 text-gray-400 rounded px-2 py-2 w-full md:w-52"
                            >
                                <FcShop className="text-xl" />
                                <p className="text-lg mb-0">Facturación</p>
                            </button>
                            {isSubMenuFacturacionOpen && (
                                <ul className="ml-8 mt-2">
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/CompraProductos")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Comprar P.
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>


                        <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                            <button
                                onClick={handleSubMenuVentasClick}
                                className="flex justify-center items-center space-x-4 hover:text-white hover:bg-blue-700 text-gray-400 rounded px-2 py-2 w-full md:w-52"
                            >
                                <FcShop className="text-xl" />
                                <p className="text-lg mb-0">Ventas</p>
                            </button>
                            {isSubMenuVentasOpen && (
                                <ul className="ml-8 mt-2">
                                      <li>
                                        <button
                                            onClick={() => handleMenuClick("/Caja")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Caja
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => handleMenuClick("/Facturacion")}
                                            className="text-gray-600 py-3 hover:text-gray-900"
                                        >
                                            Facturas
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </li>
                    </ul>
                    

                </div>

            </aside>

            {/* Contenido principal */}
            <div className="flex flex-col flex-1 ml-64">
                <header className="mb-4">
                    <button className="block sm:hidden text-gray-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16m-7 6h7"
                            />
                        </svg>
                    </button>
                </header>
                <main className="flex-grow">{children}</main>
            </div>
        </div>
    );
}

export default Sidebar;
