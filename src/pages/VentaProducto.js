import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { set, useForm, useWatch } from "react-hook-form";
import { useRouter } from 'next/router'
import FacturasApi from "./api/FacturasApi";
import ProveedorApi from "./api/ProveedorApi";
import ProductoApi from "./api/ProductoApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import { LiaEyeSolid } from "react-icons/lia"
import { formatearDecimales, formatearFecha } from "@/helpers";
import InformeVenta from "@/components/InformeVenta";
import InformeApi from "./api/InformeApi";
import MarcaApi from "./api/MarcaApi";
import ClienteApi from "./api/ClienteApi";


const PAGE_SIZE = 10;

const VentaProducto = ({ }) => {
    const { user } = useContext(AuthContext);

    const ruta = useRouter();

    const [facturas, setFacturas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesFilter, setTotalPagesFilter] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [isFiltro, setIsFiltro] = useState(false);
    const [isFiltroDetalle, setIsFiltroDetalle] = useState(false);
    const formDos = useForm();
    const [showInformeModal, setShowInformeModal] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, reset, getValues
    } = useForm();
    const { register: registerDetalle, handleSubmit: handleSubmitDetalle, formState: { errors: errorsDetalle }, setValue: setValueDetalle, reset: resetDetalle, getValues: getValuesDetalle
    } = formDos;
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState([]);
    const [facturaSeleccionadaDetalle, setFacturaSeleccionadaDetalle] = useState([]);
    const [informeProductos, setInformeProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [clientes, setClientes] = useState([]);

    const [valorFiltrado, setValorFiltroInput] = useState("");
    const [filtroInputDetalle, setFiltroInputDetalle] = useState("");
    const [valorFiltro, setValorFiltro] = useState("");
    const [valorDefecto, setValorDefecto] = useState("");
    const [fecha, setFecha] = useState("");
    const [iva, setIva] = useState(
        [
            { id: 1, value: 0.1 },
            { id: 2, value: 0.05 }
        ]
    )

    const [opciones, setOpcion] = useState(
        [
            { id: 1, value: "PAGADO" },
            { id: 2, value: "PENDIENTE" },
        ]
    )






    useEffect(() => {
        obtenerFacturas();
        obtenerProductos();
        obtenerProveedores();
        obtenerClientes();
        obtenerMarca();
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedFactura = facturas?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );
    const paginatedFacturaFiltradas = facturasFiltradas?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const handleInformeModal = () => {
        const currentDate = new Date(); // Obtiene la fecha y hora actual

        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setFecha(formattedDate);
        // Obtengo el inicio y el final del día en formato "YYYY-MM-DDTHH:mm:ss"
        const getStartOfDay = (date) => {
            const startDateTime = new Date(date);
            startDateTime.setHours(0, 0, 0, 0);
            return (startDateTime.toISOString().slice(0, -1))
        };

        const getEndOfDay = (date) => {
            const endDateTime = new Date(date);
            endDateTime.setHours(23, 59, 59, 999);
            return (endDateTime.toISOString().slice(0, -1))
        };

        // Aqui obtengo el inicio y el final del día actual
        const startOfDay = getStartOfDay(currentDate);
        const endOfDay = getEndOfDay(currentDate);

        obtenerVentasDia(startOfDay, endOfDay);
        setShowInformeModal(!showInformeModal);
    };

    useEffect(() => {
        if (valorFiltrado.length === 0) {
            actualizar();
        }
    }, [valorFiltrado])


    useEffect(() => {
        if (filtroInputDetalle.length === 0) {
            setIsFiltroDetalle(false);
        }
    }, [filtroInputDetalle]);


    const obtenerFacturas = () => {
        if (user && user.token) {
            const facturaApi = new FacturasApi(user.token);

            facturaApi.getFacturas()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    const facturasFiltradas = datos.content.filter((factura) => factura.esCompra === "VENTA");
                    setFacturas(facturasFiltradas);
                    console.log(facturas);
                    const totalPagesFacturas = facturasFiltradas.map((factura) => factura.totalPages);
                    setTotalPages(totalPagesFacturas);
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener las Facturas:", error);
                })
        }
    }

    const obtenerProveedores = () => {

        const proveedorApi = new ProveedorApi(user.token);

        proveedorApi.getProveedor()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setProveedores(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los proveedores:", error);
            });

    }

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

    const obtenerMarca = () => {

        const marcaApi = new MarcaApi(user.token);

        marcaApi.getMarcas()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setMarcas(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las marcas:", error);
            });

    }

    const obtenerProductos = () => {

        const productoAPi = new ProductoApi(user.token);

        productoAPi.getProductoList()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setProductos(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los productos:", error);
            });

    }


    const obtenerVentasDia = (fechaInicio, fechaCierre) => {

        const informeApi = new InformeApi(user.token);

        informeApi.getInformeProducto("VENTA", fechaInicio, fechaCierre)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setInformeProductos(datos);
                console.log(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las ventas del dia:", error);
            });

    }


    const actualizar = () => {
        valorFiltrado === "" ? setIsFiltro(false) : null;
        isBuscar ? handleFiltrar(valorFiltro) : null;
    }





    const handleSelectChange = (event) => {
        const valor = event.target.value;
        setValorFiltro(valor);
        handleFiltrar(valor);
    };

    const handleFiltrar = (estado) => {
        const valorPredeterminado = "PENDIENTE";
        const valor = estado || valorPredeterminado;
        setCargando(true);
        setIsBuscar(true);
        const facturaApi = new FacturasApi(user.token);
        facturaApi.filterFacturasCompraPage(valor)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setFacturasFiltradas(datos?.content);
                setTotalPagesFilter(datos?.totalPages)
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los datos:", error);
            })

        setTimeout(() => {
            setCargando(false);
        }, 500);
    }

    const handleFiltrarInput = (event) => {
        setIsFiltro(true)
        const value = event.target.value;
        setValorFiltroInput(value);
        if (isFiltro) {
            const filtrado = facturas?.filter(factura => factura.numero_factura.includes(value))
            setFacturasFiltradas(filtrado);
        }
        else if (isFiltro && isBuscar) {
            const filtrado = facturasFiltradas?.filter(factura => factura.numero_factura.includes(value))
            setFacturasFiltradas(filtrado);
        }
    }



    const formatearProveedor = (id) => {
        const proveedor = proveedores?.find(p => p.id === id);
        return proveedor?.nombre
    }
    const formatearCliente = (id) => {
        const cliente = clientes?.find(p => p.id === id);
        return cliente?.nombre
    }

    const handleClose = () => setShowDetalleModal(false);


    const formatearDetalleProducto = (idP) => {
        const producto = productos.find(producto => producto.id === idP);
        return producto?.nombre;
    }


    const handleRowClick = (id) => {
        const factura = facturas.find(p => p.id === id);
        setFacturaSeleccionada(factura);
        setFacturaSeleccionadaDetalle(factura.detalles);
        setShowDetalleModal(true)

    }

    return (
        <Layout pagina={"Ventas"} titulo={"Ventas de Productos"} ruta={ruta.pathname}>

            <div className="block">
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex items-center">
                        <div className="w-1/4">
                            <Form.Group>
                                <Form.Select value={valorFiltro} onChange={handleSelectChange}>
                                    <option value={valorDefecto} disabled selected>Seleccione un Filtro</option>
                                    {opciones?.map((opcion) => (
                                        <option key={opcion.id} value={opcion.value}>{opcion.value}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="w-3/4">
                            <Form.Control
                                placeholder="Buscar Ej.: Numero de Factura"
                                value={valorFiltrado}
                                onChange={handleFiltrarInput}
                            />
                        </div>
                    </div>


                    <div className="w-1/4 pl-40">
                        <div className="flex justify-center gap-3 mr-28">
                            <Button
                                size="sm"
                                onClick={() => {
                                    handleInformeModal()
                                }}
                                variant="secondary"
                                className="px-3"

                            >
                                Imprimir Informe
                            </Button>
                        </div>
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
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                <thead className="bg-blue-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Nro. Factura</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Cliente</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Fecha</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Estado</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Precio Total</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Iva 5%</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Iva 10%</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar || isFiltro ? (
                                        paginatedFacturaFiltradas?.map((factura, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                                <td>{formatearCliente(factura.cliente_id)}</td>
                                                <td >{formatearFecha(factura.fecha)}</td>
                                                <td >{(factura.pagado)}</td>
                                                <td >{(factura.precio_total)}</td>
                                                <td >{factura.iva_total5 === 0 ? "-" : formatearDecimales(factura.iva_total5, 4)}</td>
                                                <td >{factura.iva_total10 === 0 ? "-" : formatearDecimales(factura.iva_total10, 4)}</td>
                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link">
                                                            <LiaEyeSolid color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedFactura.map((factura, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                            <td>{formatearCliente(factura.cliente_id)}</td>
                                            <td >{formatearFecha(factura.fecha)}</td>
                                            <td >{(factura.pagado)}</td>
                                            <td >{(factura.precio_total)}</td>
                                            <td >{factura.iva_total5 === 0 ? "-" : formatearDecimales(factura.iva_total5, 4)}</td>
                                            <td >{factura.iva_total10 === 0 ? "-" : formatearDecimales(factura.iva_total10, 4)}</td>

                                            <td>
                                                <Button size="sm" variant="link">
                                                    <LiaEyeSolid color="#808080" size="25px" onClick={() => handleRowClick(factura.id)} onMouseOver={({ target }) => target.style.color = "blue"}
                                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                </Button>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
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


            <Modal show={(showModal) ? "" : showDetalleModal} onHide={(handleClose)} centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 className="text-3xl font-bold">Factura Nro. {facturaSeleccionada.numero_factura} {formatearProveedor(facturaSeleccionada.proveedor_id)}</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col">

                        {/*cabecera*/}
                        <div className="flex border-b-2 border-gray-400">

                            <div className="w-3/4 border-r-2 border-gray-400  ">

                                <h6>
                                    Lista de detalles de factura
                                </h6>

                            </div>

                            <div className="w-1/4 border-r-2 border-gray-400 ">

                                <h6 className="text-center">
                                    Cantidad
                                </h6>

                            </div>



                            <div className="w-1/4">

                                <h6 className="text-center">
                                    Subtotal
                                </h6>
                            </div>

                        </div>


                        {/*Cuerpo */}
                        {facturaSeleccionadaDetalle?.map(factura => (
                            <div key={factura.id} className="flex ">

                                <div className="w-3/4 border-r-2 border-gray-400">

                                    <p>
                                        {formatearDetalleProducto(factura.producto_id)}
                                    </p>

                                </div>

                                <div className="w-1/4 border-r-2 border-gray-400">

                                    <p className="text-center">
                                        {factura.cantidad}
                                    </p>

                                </div>



                                <div className="w-1/4">

                                    <p className="text-center">
                                        {factura.precio_unitario} Gs.
                                    </p>
                                </div>

                            </div>
                        ))}


                        <div className="flex items-center border-t-2 border-b-2 border-gray-400">
                            <div className="w-3/4">
                                <p className="font-bold">Total Pagado:</p>
                            </div>
                            <div className="w-1/4 ">
                                <p className="text-center">{facturaSeleccionada.precio_total} Gs.</p>
                            </div>
                        </div>

                    </div>

                </Modal.Body>
            </Modal>

            {/* Modal del Informe */}
            <Modal show={showInformeModal} onHide={handleInformeModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">Imprimir Informe</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InformeVenta data={informeProductos} nombre={"Informe de Ventas"} fecha={fecha} proveedores={proveedores} marcas={marcas} />
                </Modal.Body>

            </Modal>



        </Layout >
    );
};

export default VentaProducto;
