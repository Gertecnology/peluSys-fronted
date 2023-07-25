import Layout from "@/layout/Layout";
import { Modal, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { AuthContext } from "@/pages/contexts/AuthContext";
import { formatearDinero, formatearFecha } from "@/helpers";
import GeneradorInforme from "@/components/GeneradorInforme";
import { PDFViewer } from "@react-pdf/renderer";
import InformeApi from "./api/InformeApi";
import DatePicker from "react-datepicker";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { FaSearch } from 'react-icons/fa';
import es from 'date-fns/locale/es';
registerLocale('es', es)


import "react-datepicker/dist/react-datepicker.css";
import { AiOutlineEye } from "react-icons/ai";
import ClienteApi from "./api/ClienteApi";
import ProductoApi from "./api/ProductoApi";
import GeneradorInformeCaja from "@/components/GeneradorInformeCaja";


const PAGE_SIZE = 10;

const InformeCompraProducto = ({ }) => {
    const { user } = useContext(AuthContext);

    const ruta = useRouter();

    const [cajas, setCajas] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesFilter, setTotalPagesFilter] = useState(0);

    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [isFiltro, setIsFiltro] = useState(false);
    const [showInformeModal, setShowInformeModal] = useState(false);
    const [showFacturasModal, setShowFacturasModal] = useState(false);
    const [isFiltroFactura, setIsFiltroFactura] = useState(false);
    const [isFiltroProducto, setIsFiltroProducto] = useState(false);
    const [showProductoModal, setProductoModal] = useState(false);

    const [cajasFiltrados, setCajasFiltrados] = useState([]);
    const [cajaSeleccionada, setCajaSeleccionada] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [productos, setProductos] = useState([]);
    const [productosLista, setProductosLista] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);


    const [informeCajas, setInformeCajas] = useState([]);

    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaCierre, setFechaCierre] = useState(new Date());

    const [totalPeriodo, setTotalPeriodo] = useState("");
    const [cajaInput, setCajaInput] = useState("");
    const [cajeroInput, setCajeroInput] = useState("");
    const [clienteNombreInput, setClienteNombreInput] = useState("");
    const [productoNombreInput, setProductoNombreInput] = useState("");


    useEffect(() => {
        obtenerInformesCaja();
        obtenerClientes();
        obtenerProductos();
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedCajas = cajas?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );
    const paginatedCajasFiltradas = cajasFiltrados?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );



    const obtenerClientes = () => {

        const clienteApi = new ClienteApi(user.token);

        clienteApi.getClientes()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setClientes(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los clientes:", error);
            });

    }


    const handleInformeModal = () => {
        setShowInformeModal(!showInformeModal);
    };

    const formatearCliente = (id) => {
        const cliente = clientes?.find(cliente => cliente.id === id);
        return cliente?.nombre;
    }

    const formatearProducto = (id) => {
        const producto = productosLista?.find(producto => producto.id === id);
        return producto?.nombre;
    }



    const handleFacturasModal = (caja) => {
        setCajaSeleccionada(caja)
        setFacturas(caja.facturaList)
        setShowFacturasModal(true);
    };

    const cerrarFacturasModal = () => {
        setSelectedRowIndex(null);
        setFacturas([])
        setShowFacturasModal(false);
        setClienteNombreInput("");
    }
    const cerrarProductoModal = () => {
        setProductoModal(false);
        setProductos([])
    }

    const calcularTotalPeriodo = (data) => {
        let total = 0;

        // Recorremos el arreglo de objetos y accedemos a la propiedad facturaList de cada objeto
        data.map((item) => {
            // Sumamos los precio_total de cada facturaList del objeto actual
            item.facturaList.map((factura) => {
                total += factura.precio_total;
            });
        });
        // Actualizamos el estado totalPeriodo con el nuevo total
        setTotalPeriodo(total);
    };



    const obtenerFechaFormateada = (fecha) => {
        // Fecha de inicio (12:00 AM)
        const fechaFormateada = new Date(fecha);

        const year = fechaFormateada.getFullYear();
        const month = String(fechaFormateada.getMonth() + 1).padStart(2, '0');
        const day = String(fechaFormateada.getDate()).padStart(2, '0');
        const hours = String(fechaFormateada.getHours()).padStart(2, '0');
        const minutes = String(fechaFormateada.getMinutes()).padStart(2, '0');
        const seconds = String(fechaFormateada.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    };


    const obtenerFechaInicio = (fecha) => {
        const fechaInicio = new Date(fecha);
        fechaInicio.setHours(0, 0, 0, 0);
        return fechaInicio;
    };

    const obtenerFechaCierre = (fecha) => {
        const fechaCierre = new Date(fecha);
        fechaCierre.setHours(23, 59, 59, 999);
        return fechaCierre;
    };

    const obtenerProductos = () => {

        const productoApi = new ProductoApi(user.token);

        productoApi.getProductoList()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setProductosLista(datos);

            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las cajas:", error);
            });

    }

    const obtenerInformesCaja = () => {
        const fechaInicioT = obtenerFechaInicio(fechaInicio); // Obtener la hora de inicio
        const fechaCierreT = obtenerFechaCierre(fechaCierre); // Obtener la hora de cierre

        const inicioFormateado = obtenerFechaFormateada(fechaInicioT);
        const cierreFormateado = obtenerFechaFormateada(fechaCierreT);
        if (user && user.token) {
            const cajaApi = new InformeApi(user.token);

            cajaApi
                .getInformeCaja(inicioFormateado, cierreFormateado)
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setCajas(datos.content);
                    calcularTotalPeriodo(datos.content);
                    setTotalPages(datos.totalPages);
                    setInformeCajas(datos.content);
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener las Facturas:", error);
                });
        }
    };




    const handleFiltrar = (fechaInicio, fechaCierre, cajaInput, cajeroInput) => {
        const fechaInicioT = obtenerFechaInicio(fechaInicio); // Obtener la hora de inicio
        const fechaCierreT = obtenerFechaCierre(fechaCierre); // Obtener la hora de cierre

        const inicioFormateado = obtenerFechaFormateada(fechaInicioT);
        const cierreFormateado = obtenerFechaFormateada(fechaCierreT);

        setCargando(true);
        setIsBuscar(true);
        const informeApi = new InformeApi(user.token);
        informeApi
            .getInformeCaja(inicioFormateado, cierreFormateado)
            .then((datos) => {
                // Filtrar por cajero y caja
                let cajasFiltradas = datos.content;

                if (cajaInput || cajeroInput) {
                    cajasFiltradas = cajasFiltradas.filter((caja) => {
                        //capturar la marca y el nombre del producto
                        const cajaDetalle = caja.caja.detalle.toLowerCase();
                        const cajeroNombre = caja.arqueoCaja.empleadoNombre?.toLowerCase();

                        const cajaValida = !cajaInput || cajaDetalle?.includes(cajaInput.toLowerCase());
                        const cajeroValido = !cajeroInput || cajeroNombre?.includes(cajeroInput.toLowerCase());

                        return cajaValida && cajeroValido;
                    });
                }

                // Realizar algo con los datos obtenidos
                setCajasFiltrados(cajasFiltradas);
                setTotalPages(datos.totalPages);
                calcularTotalPeriodo(cajasFiltradas);
                setTotalPagesFilter(datos?.totalPages);
                // Actualizar el estado informeProductos con los datos filtrados
                setInformeCajas(cajasFiltradas);
                setTimeout(() => {
                    setCargando(false);
                }, 500);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los productos en la fecha:", error);
                setTimeout(() => {
                    setCargando(false);
                }, 500);
            });
    };

    useEffect(() => {
        if (clienteNombreInput.length > 4) {
            handleFiltrarFacturas(clienteNombreInput);
            setIsFiltroFactura(true);
        }
        else {
            setIsFiltroFactura(false);
        }
    }, [clienteNombreInput])


    const handleFiltrarFacturas = (clienteInput) => {
        const clienteFiltrado = clientes.filter((cliente) =>
            cliente.nombre.toLowerCase().includes(clienteInput.toLowerCase())
        );

        const facturasFiltradas = facturas.filter((factura) =>
            clienteFiltrado.some((cliente) => cliente.id === factura.cliente_id)
        ); informeCajas

        setFacturasFiltradas(facturasFiltradas);
    };



    const sumarPrecioTotalFacturas = (facturaList) => {
        if (!facturaList || facturaList.length === 0) {
            return 0;
        }

        const total = facturaList.reduce((acumulado, factura) => acumulado + factura.precio_total, 0);

        return total;
    };

    const obtenerSumaPrecioTotal = (data) => {
        // Usamos la función reduce para sumar los valores de precio_total
        const sumaTotal = data?.reduce((acumulador, factura) => {
            return acumulador + factura?.precio_total;
        }, 0);

        return sumaTotal;
    };

    const handleGuardarProducto = (producto) => {
        if (!productos) {
            setProductos([]);
        }
        setProductos((prevProductos) => [...prevProductos, producto]);
    };

    const handleAbrirProductoModal = () => {
        setProductoModal(true);

    }



    const renderTable = (data) => {
        let total = obtenerSumaPrecioTotal(data);
        return (
            <>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md my-4">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 table-fixed">
                            <thead className="bg-blue-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Nro. Factura</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Cliente</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Fecha</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Total</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {isFiltroFactura ? (
                                    facturasFiltradas?.map((factura, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-900 text-center font-normal">{factura.numero_factura}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearCliente(factura.cliente_id)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearFecha(factura.fecha)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(factura.precio_total)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center hover:cursor-pointer" onClick={() => { handleAbrirProductoModal(), handleGuardarProducto(data) }}>
                                                <AiOutlineEye className="inline-block" />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    data?.map((data, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-gray-900 text-center font-normal">{data.numero_factura}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearCliente(data.cliente_id)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearFecha(data.fecha)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(data.precio_total)}</td>
                                            <td className="px-6 py-4 text-gray-900 text-center hover:cursor-pointer">
                                                <AiOutlineEye className="inline-block" onClick={() => { handleAbrirProductoModal(), handleGuardarProducto(data); }} />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                            <tfoot>
                                {isFiltroFactura ? (
                                    <tr className="bg-red-500 text-white">
                                        <td className="px-6 py-4 font-medium text-center align-middle">Total Factura</td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="font-bold text-base text-center align-middle">{formatearDinero(obtenerSumaPrecioTotal(facturasFiltradas))}</td>
                                    </tr>
                                ) : (
                                    <tr className="bg-red-500 text-white">
                                        <td className="px-6 py-4 font-medium text-center align-middle">Total Factura</td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="font-bold text-base text-center align-middle">{formatearDinero(total)}</td>
                                    </tr>
                                )}
                            </tfoot>
                        </table>
                    </div>
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
                        {isFiltro ? (
                            Array.from({ length: totalPagesFilter }, (_, index) => (
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
                            ))
                        ) : (
                            Array.from({ length: totalPages }, (_, index) => (
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
                            ))
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === (isFiltro ? totalPagesFilter - 1 : totalPages - 1)}
                            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>
            </>
        )
    };

    const formatearClienteProducto = (data) => {
        const cliente = clientes?.find((cliente) => cliente.id === data[0]?.cliente_id);
        return cliente?.nombre ?? 'Cliente no encontrado';
    };

    const renderTableProductos = (data) => {
        let total = obtenerSumaPrecioTotal(data);
        return (
            <div className="flex flex-col">
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-4">
                    <div className="w-full overflow-x-auto">
                        <div className="max-h-96 overflow-y-auto">
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 table-fixed mx-auto">
                                <thead className="bg-blue-800">
                                    <tr>
                                        <th scope="col" className="sticky top-0 px-6 py-4 font-medium text-white text-center justify-center bg-blue-800">
                                            Producto
                                        </th>
                                        <th scope="col" className="sticky top-0 px-6 py-4 font-medium text-white text-center justify-center bg-blue-800">
                                            Cantidad
                                        </th>
                                        <th scope="col" className="sticky top-0 px-6 py-4 font-medium text-white text-center justify-center bg-blue-800">
                                            Precio Unitario
                                        </th>
                                        <th scope="col" className="sticky top-0 px-6 py-4 font-medium text-white text-center justify-center bg-blue-800">
                                            Subtotal
                                        </th>
                                        <th scope="col" className="sticky top-0 px-6 py-4 font-medium text-white text-center justify-center bg-blue-800">
                                            Total Iva
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isFiltroProducto ? (
                                        data?.map((data, index) => (

                                            data?.detalles?.map((detalle, detalleIndex) => (
                                                <>
                                                    <tr key={detalleIndex} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-gray-900 text-center font-normal">{formatearProducto(detalle.producto_id)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{detalle.cantidad}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.precio_unitario)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.subtotal)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.subtotal_iva)}</td>
                                                    </tr>
                                                </>
                                            ))

                                        ))
                                    ) : (
                                        data?.map((data, index) => (

                                            data?.detalles?.map((detalle, detalleIndex) => (
                                                <>
                                                    <tr key={detalleIndex} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-gray-900 text-center font-normal">{formatearProducto(detalle.producto_id)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{detalle.cantidad}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.precio_unitario)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.subtotal)}</td>
                                                        <td className="px-6 py-4 text-gray-900 text-center">{formatearDinero(detalle.subtotal_iva)}</td>
                                                    </tr>
                                                </>
                                            ))

                                        ))
                                    )}
                                </tbody>
                                <tfoot>
                                    {isFiltroProducto ? (
                                        <tr className="text-black">
                                            <td className="px-6 py-4 font-medium text-center align-middle">Total Factura</td>
                                            <td className="text-center align-middle"></td>
                                            <td className="text-center align-middle"></td>
                                            <td className="text-center align-middle"></td>
                                            <td className="font-bold text-base text-center align-middle">{formatearDinero(obtenerSumaPrecioTotal(facturasFiltradas))}</td>
                                        </tr>
                                    ) : (
                                        <tr className=" text-black">
                                            <td className="px-6 py-4 font-medium text-center align-middle">Total Factura</td>
                                            <td className="text-center align-middle"></td>
                                            <td className="text-center align-middle"></td>
                                            <td className="text-center align-middle"></td>
                                            <td className="font-bold text-base text-center align-middle">{formatearDinero(total)}</td>
                                        </tr>
                                    )}
                                </tfoot>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    };






    return (
        <Layout pagina={"Informe Caja"} titulo={"Informe de Caja"} ruta={ruta.pathname}>

            <div className="block">
                {/*Este engloba todo*/}
                <div className="flex">
                    {/*Parte de filtros */}
                    <div className="w-3/4 flex items-center gap-3 mx-16">


                        <div>
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Fecha de Apertura:
                                </Form.Label>
                                <DatePicker
                                    className="border border-black rounded-lg text-center"
                                    selected={fechaInicio}
                                    onChange={(date) => setFechaInicio(date)}
                                    locale="es"
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Fecha de Cierre:
                                </Form.Label>
                                <DatePicker
                                    className="border border-black rounded-lg text-center"
                                    selected={fechaCierre}
                                    onChange={(date) => setFechaCierre(date)}
                                    locale="es"
                                />
                            </Form.Group>
                        </div>

                        <div className="w-2/4">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Caja:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por Nombre de Caja"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={cajaInput}
                                    onChange={(e) => setCajaInput(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="w-2/4">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Cajero:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por Nombre del Cajero"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={cajeroInput}
                                    onChange={(e) => setCajeroInput(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        {/*boton para filtrar*/}
                        <div className="w-1/4">
                            <div className="pt-4">
                                <button
                                    className="flex items-center justify-center p-2 bg-transparent rounded-md"
                                    onClick={() => handleFiltrar(fechaInicio, fechaCierre, cajaInput, cajeroInput)}

                                >
                                    <FaSearch className="w-5 h-5 text-black" />
                                </button>
                            </div>
                        </div>

                    </div>

                    {/*Boton de generar informe */}
                    <div className="flex items-center justify-center">
                        <button
                            onClick={() => {
                                handleInformeModal()
                            }}
                            variant="success"
                            className="font-semibold rounded-lg p-2 bg-gradient-to-r from-green-500 to-green-900 text-white"
                        >
                            Generar Informe
                        </button>
                    </div>

                </div>

                {cargando ? (<div class="sk-circle">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500 table-fixed">
                                <thead className="bg-blue-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Caja</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Cajero</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Monto Apertura</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Monto Cierre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Fecha Apertura</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Fecha Cierre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Monto Total</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar || isFiltro ? (
                                        (paginatedCajasFiltradas?.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-gray-900 text-center font-bold uppercase">
                                                    Lo sentimos, No se encontraron cajas en ese rango.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedCajasFiltradas?.map((caja, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 text-center">{caja.caja.detalle}</td>
                                                    <td className="text-center">{caja.aperturaCaja.empleadoNombre}</td>
                                                    <td className="text-center">{formatearDinero(caja.aperturaCaja.monto)}</td>
                                                    <td className="text-center">{formatearDinero(caja.arqueoCaja.montoReal)}</td>
                                                    <td className="text-center">{formatearFecha(caja.aperturaCaja.fechaInicio)}</td>
                                                    <td className="text-center">{formatearFecha(caja.aperturaCaja.fechaCierre)}</td>
                                                    <td className="text-center">
                                                        {
                                                            formatearDinero(sumarPrecioTotalFacturas(caja.facturaList))
                                                        }
                                                    </td>
                                                    <td className="text-center hover:cursor-pointer" onClick={() => handleFacturasModal(caja)}>
                                                        <AiOutlineEye className="inline-block" />
                                                    </td>
                                                </tr>
                                            ))
                                        ))
                                    ) : (
                                        (paginatedCajas?.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-4 text-gray-900 text-center font-bold uppercase">
                                                    No se han registrado cierres de cajas en este día.
                                                </td>
                                            </tr>
                                        ) : (
                                            paginatedCajas?.map((caja, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 text-center">{caja.caja.detalle}</td>
                                                    <td className="text-center">{caja.aperturaCaja.empleadoNombre}</td>
                                                    <td className="text-center">{formatearDinero(caja.aperturaCaja.monto)}</td>
                                                    <td className="text-center">{formatearDinero(caja.arqueoCaja.montoReal)}</td>
                                                    <td className="text-center">{formatearFecha(caja.aperturaCaja.fechaInicio)}</td>
                                                    <td className="text-center">{formatearFecha(caja.aperturaCaja.fechaCierre)}</td>
                                                    <td className="text-center">
                                                        {
                                                            formatearDinero(sumarPrecioTotalFacturas(caja.facturaList))
                                                        }
                                                    </td>
                                                    <td className="text-center hover:cursor-pointer" onClick={() => handleFacturasModal(caja)}>
                                                        <AiOutlineEye className="inline-block" />
                                                    </td>
                                                </tr>
                                            ))
                                        ))

                                    )}
                                </tbody>
                                <tfoot>
                                    <tr className="bg-red-500 text-white">
                                        <td className="px-6 py-4 font-medium text-center align-middle">Total del periodo</td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="text-center align-middle"></td>
                                        <td className="font-bold text-base text-center align-middle">{formatearDinero(totalPeriodo)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                )}
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
                        {isFiltro ? (
                            Array.from({ length: totalPagesFilter }, (_, index) => (
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
                            ))
                        ) : (
                            Array.from({ length: totalPages }, (_, index) => (
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
                            ))
                        )}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === (isFiltro ? totalPagesFilter - 1 : totalPages - 1)}
                            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>

            </div>


            {/* Modal del Informe */}
            <Modal show={showInformeModal} onHide={handleInformeModal} size="xl">
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">Imprimir Informe</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ width: '100%', height: '80vh' }}>
                        <PDFViewer width="100%" height="100%">
                            <GeneradorInformeCaja
                                data={informeCajas}
                                totalPeriodo={totalPeriodo}
                                clientes={clientes}
                                texto={'Total del Periodo'}
                                fechaInicio={formatearFecha(fechaInicio)}
                                fechaCierre={formatearFecha(fechaCierre)}
                            />
                        </PDFViewer>
                    </div>
                </Modal.Body>
            </Modal>

            {/* Modal de facturas */}
            <Modal show={showFacturasModal} onHide={cerrarFacturasModal} fullscreen={true} >
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">Facturas de la {cajaSeleccionada.caja?.detalle} - Cajero: {cajaSeleccionada.arqueoCaja?.empleadoNombre} {cajaSeleccionada.arqueoCaja?.empleadoApellido}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="flex flex-col">
                        <div className="w-2/4">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Nombre del Cliente:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre del cliente"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={clienteNombreInput}
                                    onChange={(e) => setClienteNombreInput(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="mt-4">{renderTable(cajaSeleccionada.facturaList)}</div>
                    </div>
                </Modal.Body>
            </Modal>


            {/* Modal de productos de facturas */}
            <Modal show={showProductoModal} onHide={cerrarProductoModal} size="lg" centered >
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">
                        <div className="flex flex-col">
                            <h3>Productos Vendidos - Cliente: {formatearClienteProducto(productos)}</h3>
                            <h5>FacturaNro: {productos[0]?.numero_factura}</h5>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <div className="flex flex-col">
                    <div>{renderTableProductos(productos)}</div>
                </div>
                <Modal.Body>
                </Modal.Body>
            </Modal>




        </Layout >
    );
};

export default InformeCompraProducto;
