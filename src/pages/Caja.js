import Layout from "@/layout/Layout";
import { Modal, Button, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import FacturasApi from "@/pages/api/FacturasApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import ClienteApi from "./api/ClienteApi";
import CajaApi from "./api/CajaApi";
import EmpleadoApi from "./api/EmpleadoApi";
import ProductoApi from "./api/ProductoApi";


const PAGE_SIZE = 10;

const Caja = ({ }) => {
    const ruta = useRouter();

    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useContext(AuthContext);

    const [valor, setValor] = useState("");
    const [urlPhoto, setUrlPhoto] = useState("")

    const [facturas, setFacturas] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [cajas, setCajas] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [productos, setProductos] = useState([]);
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [seleccionado, setSeleccionado] = useState([]);
    const [facturaDetalle, setFacturaDetalle] = useState([]);
    const [facturaSeleccionadaDetalle, setFacturaSelecciionadaDetalle] = useState([]);


    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showAbrirCajaModal, setShowAbrirCajaModal] = useState(true);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
    const handleClose = () => setShowAbrirCajaModal(false);
    const [visible, setVisible] = useState(false);
    const [showDetalleFacturaModal, setShowDetalleFacturaModal] = useState(false);
    const handleCloseFacturaDetalleModal = () => setShowDetalleFacturaModal(false);



    useEffect(() => {
        obtenerFacturas();
        obtenerClientes();
        obtenerCajas();
        obtenerEmpleados();
        obtenerProductos();
        console.log(user)
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedFactura = facturas.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );


    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrar(valor)
        }
        else {
            actualizar();
        }
    }, [valor])

    const obtenerFacturas = () => {
        if (user && user.token) {
            const facturaApi = new FacturasApi(user.token);

            facturaApi.getFacturas()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setFacturas(datos.content);
                    setTotalPages(datos.totalPages);
                    setUrlPhoto(user?.urlPhoto)
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener los datos:", error);
                });
        }
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

    const obtenerCajas = () => {

        const cajaApi = new CajaApi(user.token);

        cajaApi.getCajas()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setCajas(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las cajas:", error);
            });

    }

    const obtenerEmpleados = () => {

        const empleadoApi = new EmpleadoApi(user.token);

        empleadoApi.getEmpleados()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setEmpleados(datos.content);

            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los empleados:", error);
            });

    }

    const obtenerProductos = () => {

        const productoApi = new ProductoApi(user.token);

        productoApi.getProductoList()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setProductos(datos);

            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las cajas:", error);
            });

    }

    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }

    const formatearCliente = (id) => {
        const cliente = clientes?.find(cliente => cliente.id === id);
        return cliente?.nombre;
    }

    const formatearProducto = (id) => {
        console.log(productos);
        const producto = productos.find(producto => producto.id === id);
        //console.log(producto);
    }



    const handleCheckboxChange = (i) => {
        setShowDetalleFacturaModal(false);

        if (seleccionado.includes(i)) {
            setSeleccionado(seleccionado.filter((id) => id !== i));
        } else {
            setSeleccionado([...seleccionado, i]);
        }
    };

    const facturaSeleccionada = (id) => {
        console.log(id);
    }


    const handleAbrirCajaModal = () => {
        setShowAbrirCajaModal(true);
        setIsCheckboxDisabled(!isCheckboxDisabled);
        setVisible(!visible);
    }

    const formAbrirCaja = (data) => {
        getValues("")
        handleAbrirCajaModal();

    }


    const handleFiltrar = (filtro) => {
        setCargando(true);
        setIsBuscar(true);
        const facturaApi = new FacturasApi(user.token);
        facturaApi.filterFacturas(filtro)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setFacturasFiltradas(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los datos:", error);
            });

        setTimeout(() => {
            setCargando(false);
        }, 500);
    }


    const handleRowClick = (id) => {
        const factura = facturas.find(f => f.id === id);
        setFacturaDetalle(factura);
        setFacturaSelecciionadaDetalle(factura.detalles);
        setShowDetalleFacturaModal(true);

    }

    const formatearEmpleado = (id) => {
        const empleado = empleados?.find(empleado => empleado.id === id);
        return empleado?.apellido;
    }


    return (
        <Layout pagina={"Caja"} titulo={"CRUD Caja"} ruta={ruta.pathname}>
            <div className="block">
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex items-center">
                        <Form.Control
                            placeholder="Has tu busqueda aquí"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                        />
                    </div>


                    <div className="w-1/4">
                        <div className="flex justify-center gap-3">
                            <button
                                type="button"
                                className={`transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    }  inline-block rounded bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#14a44d] transition duration-150 ease-in-out hover:bg-success-600 hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:outline-none focus:ring-0 active:bg-success-700 active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(20,164,77,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)]`}>
                                Ir a Pagar
                            </button>
                            <button
                                type="button"
                                class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                onClick={() => handleAbrirCajaModal()}>
                                Abrir Caja
                            </button>
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
                                        <th scope="col" className="px-6 py-4 font-medium text-white">RUC</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Fecha</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Estado</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Total</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Seleccionar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        facturasFiltradas?.map((factura, index) => (
                                            <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                                <td >{formatearCliente(factura.cliente_id)}</td>
                                                <td >{factura.ruc}</td>
                                                <td >{factura.fecha}</td>
                                                <td>{factura.pagado}</td>
                                                <td>{factura.precio_total}</td>

                                                <td className="flex justify-center items-center" onClick={() => setShowDetalleFacturaModal(false)}>
                                                    <input
                                                        checked={seleccionado.includes(factura.id)}
                                                        disabled={isCheckboxDisabled}
                                                        onChange={() => { facturaSeleccionada(factura.id), handleCheckboxChange(factura.id) }}
                                                        type="checkbox"
                                                    />
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedFactura.map((factura, index) => (
                                        <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer" onClick={() => { handleRowClick(factura.id) }}>
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                            <td >{formatearCliente(factura.cliente_id)}</td>
                                            <td >{factura.ruc}</td>
                                            <td >{factura.fecha}</td>
                                            <td>{factura.pagado}</td>
                                            <td className="text-center">{factura.precio_total}</td>

                                            <td className="flex justify-center items-center" onClick={() => setShowDetalleFacturaModal(false)}>
                                                <input
                                                    checked={seleccionado.includes(factura.id)}
                                                    disabled={isCheckboxDisabled}
                                                    onChange={() => { facturaSeleccionada(factura.id), handleCheckboxChange(factura.id) }}
                                                    type="checkbox"
                                                />

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

            {/*Modal para abrir caja*/}
            <Modal show={showAbrirCajaModal} onHide={handleClose} centered>
                <Form
                    onSubmit={handleSubmit(formAbrirCaja)}
                >
                    <Modal.Header>
                        <Modal.Title>
                            Abrir Caja
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="flex justify-between">
                            <div className="flex-col">
                                <p>
                                    <span className="font-bold">Cajero:</span> {user?.username} {" "} {formatearEmpleado(user?.empleado_id)}
                                </p>
                                <p>
                                     
                                </p>

                            </div>
                            <div>
                                <img
                                    src={urlPhoto}
                                    className="object-cover btn- h-9 w-9 rounded-full mr-2 bg-gray-300" alt="" />

                            </div>

                        </div>



                        <Form.Group>
                            <Form.Label>Monto de Apertura de Caja</Form.Label>
                            <Form.Control
                                {...register("monto", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Monto de Apertura"
                                isInvalid={errors.monto}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Numero de Caja</Form.Label>

                            <div className="flex gap-2">
                                <Form.Select {...register("caja", { required: true })}

                                >
                                    <option defaultValue="" disabled hidden>Selecciona una opción</option>
                                    {cajas?.map((caja) => (
                                        <option key={caja.id} value={caja.id}>{caja.detalle}</option>
                                    ))}
                                </Form.Select>
                            </div>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                       
                        <Button variant="primary" type="submit">
                            Abrir
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            {/*Modal para ver los detalles de las facturas*/}
            <Modal show={showDetalleFacturaModal} onHide={handleCloseFacturaDetalleModal}>

                <Modal.Header closeButton>
                    <Modal.Title>Detalles de Factura - Cliente {formatearCliente(facturaDetalle.cliente_id)}</Modal.Title>
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
                                        {formatearProducto(factura.producto_id)}
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
                                <p className="font-bold">Total a Pagar:</p>
                            </div>
                            <div className="w-1/4 ">
                                <p className="text-center">{facturaDetalle.precio_total} Gs.</p>
                            </div>



                        </div>

                    </div>

                </Modal.Body>
            </Modal>


        </Layout>
    );
};

export default Caja;
