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


const PAGE_SIZE = 10;

const InformeCompraProducto = ({ }) => {
    const { user } = useContext(AuthContext);

    const ruta = useRouter();

    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesFilter, setTotalPagesFilter] = useState(0);

    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [isFiltro, setIsFiltro] = useState(false);
    const [showInformeModal, setShowInformeModal] = useState(false);

    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [informeProductos, setInformeProductos] = useState([]);
    const [fechaInicio, setFechaInicio] = useState(new Date());
    const [fechaCierre, setFechaCierre] = useState(new Date());

    const [totalPeriodo, setTotalPeriodo] = useState("");
    const [marcaInput, setMarcaInput] = useState("");
    const [nombreInput, setNombreInput] = useState("");
    const [proveedorInput, setProveedorInput] = useState("");


    useEffect(() => {
        obtenerProductos();
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedProducto = productos?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );
    const paginatedProductoFiltrado = productosFiltrados?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const handleInformeModal = () => {

        setShowInformeModal(!showInformeModal);
    };


    const calcularTotalPeriodo = (productos) => {
        const total = productos?.reduce((acumulador, producto) => {
            const precioVenta = producto.productos.precioVenta;
            const cantidad = producto.cantidad;
            return acumulador + (precioVenta * cantidad);
        }, 0);

        return total;
    };


    useEffect(() => {
        const totalPeriodo = calcularTotalPeriodo(productos);
        setTotalPeriodo(totalPeriodo);
    }, [productos]);

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
        const fechaInicioT = obtenerFechaInicio(fechaInicio); // Obtener la hora de inicio
        const fechaCierreT = obtenerFechaCierre(fechaCierre); // Obtener la hora de cierre

        const inicioFormateado = obtenerFechaFormateada(fechaInicioT);
        const cierreFormateado = obtenerFechaFormateada(fechaCierreT);

        if (user && user.token) {
            const productoApi = new InformeApi(user.token);


            productoApi
                .getProductos("COMPRA", inicioFormateado, cierreFormateado, 0, 100)
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setProductos(datos.content);
                    console.log(datos.content)
                    setTotalPages(datos.totalPages);
                    const totalPeriodo = calcularTotalPeriodo(productos);
                    setTotalPeriodo(totalPeriodo);
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener las Facturas:", error);
                });
        }
    };




    const handleFiltrar = (fechaInicio, fechaCierre, marcaInput, nombreInput, proveedorInput) => {
        const fechaInicioT = obtenerFechaInicio(fechaInicio); // Obtener la hora de inicio
        const fechaCierreT = obtenerFechaCierre(fechaCierre); // Obtener la hora de cierre

        const inicioFormateado = obtenerFechaFormateada(fechaInicioT);
        const cierreFormateado = obtenerFechaFormateada(fechaCierreT);


        setCargando(true);
        setIsBuscar(true);
        const informeApi = new InformeApi(user.token);
        informeApi
            .getProductos("COMPRA", inicioFormateado, cierreFormateado, 0, 100)
            .then((datos) => {
                console.log(datos)
                // Filtrar por estado y rango de fechas
                let productosFiltrados = datos.content;


                if (marcaInput || nombreInput || proveedorInput) {
                    productosFiltrados = productosFiltrados.filter((producto) => {
                        //capturar la marca y el nombre del producto
                        const marcaProducto = producto.marca?.toLowerCase();
                        const nombreProducto = producto.productos.nombre?.toLowerCase();
                        const proveedorProducto = producto.proveedor?.toLowerCase();

                        const marcaValida = !marcaInput || marcaProducto?.includes(marcaInput.toLowerCase());
                        const proveedorValido = !proveedorInput || proveedorProducto?.includes(proveedorInput.toLowerCase());
                        const nombreValido = !nombreInput || nombreProducto?.includes(nombreInput.toLowerCase());

                        return marcaValida && nombreValido && proveedorValido;
                    });
                }

                // Realizar algo con los datos obtenidos
                setProductosFiltrados(productosFiltrados);
                setTotalPages(datos.totalPages);
                const totalPeriodo = calcularTotalPeriodo(productosFiltrados);
                setTotalPeriodo(totalPeriodo);
                setTotalPagesFilter(datos?.totalPages);
                // Actualizar el estado informeProductos con los datos filtrados
                setInformeProductos(productosFiltrados);
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

    const convertidorIva = (value) => {
        if (value === 0.1) {
            return 10;
        }
        else {
            return 5;
        }
    }
    function calcularPrecioTotal(producto, cantidad) {
        return formatearDinero(cantidad * producto.precioVenta);
    }
    return (
        <Layout pagina={"Informe Compra"} titulo={"Compras de Productos"} ruta={ruta.pathname}>

            <div className="block">
                {/*Este engloba todo*/}
                <div className="flex">
                    {/*Parte de filtros */}
                    <div className="w-3/4 flex items-center gap-3 mx-16">


                        <div>
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Fecha de Inicio:
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

                        <div className="w-3/3">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Marca:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por Marca"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={marcaInput}
                                    onChange={(e) => setMarcaInput(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="w-3/3">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Proveedor:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por Proveedor"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={proveedorInput}
                                    onChange={(e) => setProveedorInput(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="w-1/4">
                            <Form.Group className="flex flex-col">
                                <Form.Label className="font-bold">
                                    Nombre:
                                </Form.Label>
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre del Producto"
                                    className="border border-black rounded-lg text-center p-0.5"
                                    value={nombreInput}
                                    onChange={(e) => setNombreInput(e.target.value)}
                                >

                                </input>
                            </Form.Group>
                        </div>
                        {/*boton para filtrar*/}
                        <div className="w-1/4">
                            <div className="pt-4">
                                <button
                                    className="flex items-center justify-center p-2 bg-transparent rounded-md"
                                    onClick={() => handleFiltrar(fechaInicio, fechaCierre, marcaInput, nombreInput, proveedorInput)}

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
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Nombre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Cantidad</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Marca</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Proveedor</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Precio Unitario</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Precio Total Venta</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white text-center justify-center">Porc. Iva</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar || isFiltro ? (
                                        (paginatedProductoFiltrado?.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-gray-900 text-center font-bold uppercase">Lo sentimos, No se encontraron compras en ese rango.</td>
                                            </tr>
                                        ) : (
                                            paginatedProductoFiltrado?.map((producto, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 text-center">{producto.productos.nombre}</td>
                                                    <td className="text-center">{producto.cantidad}</td>
                                                    <td className="text-center">{producto.marca}</td>
                                                    <td className="text-center">{producto.proveedor}</td>
                                                    <td className="text-center">{formatearDinero(producto.productos.precioVenta)}</td>
                                                    <td className="text-center">{calcularPrecioTotal(producto.productos, producto.cantidad)}</td>
                                                    <td className="text-center">{convertidorIva(producto.productos.tipo_iva)} %</td>
                                                </tr>
                                            ))
                                        ))
                                    ) : (
                                        (paginatedProducto?.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-gray-900 text-center font-bold uppercase">No se han registrado compras en este día.</td>
                                            </tr>
                                        ) : (
                                            paginatedProducto?.map((producto, index) => (
                                                <tr key={index} className="hover:bg-gray-50">
                                                    <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 text-center">{producto.productos.nombre}</td>
                                                    <td className="text-center">{producto.cantidad}</td>
                                                    <td className="text-center">{producto.marca}</td>
                                                    <td className="text-center">{producto.proveedor}</td>
                                                    <td className="text-center">{formatearDinero(producto.productos.precioVenta)}</td>
                                                    <td className="text-center">{calcularPrecioTotal(producto.productos, producto.cantidad)}</td>
                                                    <td className="text-center">{convertidorIva(producto.productos.tipo_iva)} %</td>
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
            <Modal show={showInformeModal} onHide={handleInformeModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">Imprimir Informe</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div style={{ width: '100%', height: '80vh' }}>
                        <PDFViewer width="100%" height="100%">
                            <GeneradorInforme
                                data={informeProductos}
                                totalPeriodo={totalPeriodo}
                                nombre={"Informe de Compras"}
                                texto={'Total de Compra'}
                                fechaInicio={formatearFecha(fechaInicio)}
                                fechaCierre={formatearFecha(fechaCierre)}
                            />
                        </PDFViewer>
                    </div>
                </Modal.Body>
            </Modal>




        </Layout >
    );
};

export default InformeCompraProducto;
