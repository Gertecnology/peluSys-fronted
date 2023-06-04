import Layout from "@/layout/Layout";
import { Modal, Button, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import FacturasApi from "./api/FacturasApi";
import ProveedorApi from "./api/ProveedorApi";
import ProductoApi from "./api/ProductoApi";
import ServicioApi from "./api/ServiciosApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io"
import { toast } from "react-toastify";


const PAGE_SIZE = 10;

const CompraProductos = ({ }) => {
    const ruta = useRouter();

    const [facturas, setFacturas] = useState([]);
    const [facturasMostrar, setFacturasMostrar] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [servicios, setServicios] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);


    const { user } = useContext(AuthContext);

    useEffect(() => {
        obtenerFacturas();
        obtenerProductos();
        obtenerProveedores();
        obtenerServicios();

    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedFactura = facturasMostrar?.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isSubMenuServicioOpen, setIsSubMenuServicioOpen] = useState(false);
    const [isSubMenuProductoOpen, setIsSubMenuProductoOpen] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);

    const [idEliminar, setIdEliminar] = useState(-1)
    const [servicioEditar, setServicioEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState([]);
    const [facturaSeleccionadaDetalle, setFacturaSeleccionadaDetalle] = useState([]);
    const [valor, setValor] = useState("");
    const [valorFiltro, setValorFiltro] = useState("");
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


    const [estado, setEstado] = useState(
        [
            { id: 1, value: "PAGADO" },
            { id: 2, value: "PENDIENTE" }
        ]
    )




    useEffect(() => {
        handleFiltrar(valorFiltro)

    }, [valorFiltro])

    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrarInput(valor)
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
                    setFacturas(datos?.content);
                    setTotalPages(datos?.totalPages);
                    const filtrado = facturas?.filter(factura => factura.pagado === "PAGADO");
                    setFacturasMostrar(filtrado);
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


    const obtenerServicios = () => {

        const servicioApi = new ServicioApi(user.token);

        servicioApi.getServiciosList()
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setServicios(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los Servicios:", error);
            });

    }
    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }


    const handleModal = () => {
        setShowModal(!showModal);
        setIsEditar(false);


    };

    const handleSubMenuServicioClick = (event) => {
        event.preventDefault();
        setIsSubMenuServicioOpen(!isSubMenuServicioOpen);
        setIsSubMenuProductoOpen(false);

    };

    const handleSubMenuProductoClick = (event) => {
        event.preventDefault();
        setIsSubMenuProductoOpen(!isSubMenuProductoOpen);
        setIsSubMenuServicioOpen(false);
    };


    axios.interceptors.request.use((config) => {
        console.log('Solicitud enviada:', JSON.stringify(config.data));
        return config;
    });

    const formSubmit = (data) => {
        console.log(data)
        handleModal();
        const api = `${process.env.API_URL}api/proveedores/guardarCompra/`;
        if (isSubMenuProductoOpen) {
            axios.post(
                api,
                {
                    proveedorId: Number(data.proveedorId),
                    numeroFactura: data.factura,
                    pagado: data.estado,
                    detalles: [
                        {
                            cantidad: Number(data.cantidad),
                            producto_id: Number(data.productoId),
                            servicio_id: 0,
                        }
                    ]
                },
                { headers: { "Authorization": `Bearer ${user.token}` } }
            )
                .then((response) => {
                    toast.success('Compra Agregada');
                })
                .catch((error) => {
                    toast.error('No se pudo agregar!"');
                    console.log(error)
                    reset();


                })
                .finally(() => {
                    obtenerFacturas();
                    reset();



                })
        }
        else {
            axios.post(
                api,
                {
                    proveedorId: Number(data.proveedorId),
                    numeroFactura: data.factura,
                    pagado: data.estado,
                    detalles: [
                        {
                            cantidad: Number(data.cantidad),
                            producto_id: 0,
                            servicio_id: Number(data.servicioId),
                        }
                    ]
                },
                { headers: { "Authorization": `Bearer ${user.token}` } }
            )
                .then((response) => {
                    toast.success('Factura Agregada');
                })
                .catch((error) => {
                    toast.error('No se pudo agregar!"');
                    reset();

                })
                .finally(() => {
                    obtenerFacturas();
                    reset();


                })
        }


    }

    const handleSetEditar = (id) => {
        const servicio = facturas.find(s => s.id === id);
        setServicioEditar(servicio);
        handleModal();
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, (servicio[key])));

    }


    const handleEditar = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/servicios/actulizar/${servicioEditar.id}`;
        axios.post(api, {
            id: servicioEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Servicio Actualizado');
                obtenerFacturas();


            })
            .catch((error) => {
                toast.error('No se pudo actualizar el Servicio!!!"');

            })
            .finally(() => {
                setServicioEditar(undefined);
                setIsEditar(false);
                reset();

            })

    }


    const handleSelectChange = (e) => {
        setValorFiltro(e.target.value);
        // Realiza alguna acción con el valor seleccionado
        console.log("Valor seleccionado:", e.target.value);
    };

    const handleFiltrar = (estado) => {
        setCargando(true);
        setIsBuscar(true);
        const facturaApi = new FacturasApi(user.token);
        facturaApi.filterFacturasCompra(estado)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setFacturasFiltradas(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los datos:", error);
            })

        setTimeout(() => {
            setCargando(false);
        }, 500);
    }

    const handleFiltrarInput = (filtro) => {
        const filtrado = facturasFiltradas.filter(factura => factura.numero_factura.includes(filtro))
        setFacturasFiltradas(filtrado);
    }

    const convertidorProveedor = (id) => {
        const proveedor = proveedores?.find(p => p.id === id);
        return proveedor?.nombre
    }

    const handleClose = () => setShowDetalleModal(false);

    const handleRowClick = (id) => {
        const factura = facturas.find(p => p.id === id);
        setFacturaSeleccionada(factura);
        setFacturaSeleccionadaDetalle(factura.detalles);
        setShowDetalleModal(true)

    }

    const formatearDetalleNombre = (idP, idS) => {
        const producto = productos.find(producto => producto.id === idP);
        const servicio = servicios.find(servicio => servicio.id === idS);
        if (producto?.id === undefined || producto?.id === 0) {
            return servicio?.detalle
        } else {

            return producto?.nombre;
        }
    }



    return (
        <Layout pagina={"Compra de Productos"} titulo={"CRUD Compras Producto"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header>
                        <Modal.Title> {isEditar ? "Editar Factura" : "Cargar Factura"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>




                        <Form.Group>
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Select {...register("proveedorId", { required: true })}
                            >
                                <option defaultValue="" disabled selected hidden>Seleccione un Proveedor</option>

                                {proveedores?.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Número de Factura</Form.Label>
                            <Form.Control
                                {...register("factura", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Número de Factura"
                                isInvalid={errors.factura}
                            />
                        </Form.Group>


                        <Form.Group>
                            <Form.Label>Estado de la Factura </Form.Label>
                            <Form.Select {...register("estado", { required: true })}
                            >
                                <option disabled selected hidden>Seleccione un Estado</option>

                                {estado?.map((estado) => (
                                    <option key={estado.id} value={estado.value}>{estado.value}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Label className="mt-3 font-bold">Elija por favor</Form.Label>
                        <div className="bg-white border-r w-full">
                            <ul className="mt-2 p-0">


                                <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                                    <button
                                        onClick={handleSubMenuServicioClick}
                                        className="w-full border rounded py-2 appearance-none bg-white focus:outline-none focus:border-blue-500">
                                        <p className="text-lg mb-0">Servicio</p>
                                    </button>
                                    {isSubMenuServicioOpen && (
                                        <ul className="w-full p-0 mt-2">
                                            <li>

                                                <Form.Group>
                                                    <Form.Select {...register("servicioId")}
                                                    >
                                                        <option disabled selected hidden>Seleccione un Servicio</option>

                                                        {servicios?.map((servicio) => (
                                                            <option key={servicio.id} value={servicio.id}>{servicio.detalle}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </li>

                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border-r w-full">
                            <ul className="mt-2 p-0">
                                <li className="flex justify-start flex-col w-full md:w-auto items-start pb-1">
                                    <button
                                        onClick={handleSubMenuProductoClick}
                                        className="w-full border rounded py-2 appearance-none bg-white focus:outline-none focus:border-blue-500">
                                        <p className="text-lg mb-0">Producto</p>
                                    </button>
                                    {isSubMenuProductoOpen && (
                                        <ul className="w-full p-0 mt-2">
                                            <li>

                                                <Form.Group>
                                                    <Form.Select {...register("productoId")}
                                                    >
                                                        <option disabled selected hidden>Seleccione un Producto</option>

                                                        {productos?.map((producto) => (
                                                            <option key={producto.id} value={producto.id}>{producto.nombre}</option>
                                                        ))}
                                                    </Form.Select>
                                                </Form.Group>
                                            </li>



                                            <li>
                                                <Form.Group>
                                                    <Form.Label>Cantidad a Comprar</Form.Label>
                                                    <Form.Control
                                                        {...register("cantidad")}
                                                        type="text"
                                                        placeholder="Cantidad del Producto"
                                                        isInvalid={errors.cantidad}
                                                    />
                                                </Form.Group>
                                            </li>
                                        </ul>
                                    )}
                                </li>
                            </ul>
                        </div>




                    </Modal.Body>
                    <Modal.Footer>

                        <Button variant="secondary" onClick={() => { handleModal(), reset(), setIsSubMenuProductoOpen(false), setIsSubMenuServicioOpen(false); }}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            {isEditar ? "Terminar Edición" : "Guardar"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            <div className="block">
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex items-center">
                        <div className="w-1/4">
                            <Form.Group>
                                <Form.Select value={valorFiltro} onChange={handleSelectChange}>
                                    <option disabled selected hidden>Filtro</option>
                                    {opciones?.map((opcion) => (
                                        <option key={opcion.id} value={opcion.value}>{opcion.value}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </div>
                        <div className="w-3/4">
                            <Form.Control
                                placeholder="Has tu busqueda aquí"
                                value={valor}
                                onChange={e => setValor(e.target.value)}
                            />
                        </div>
                    </div>


                    <div className="w-1/4 pl-40">
                        <div className="flex justify-center mt-3">
                            <button
                                size="lg"
                                onClick={() => handleModal()}>
                                <div className="flex gap-1">
                                    <p className="text-center hover:text-blueEdition hover:font-bold">
                                        Agregar
                                    </p>
                                    <IoMdAddCircleOutline color="#808080" size="30px" onMouseOver={({ target }) => target.style.color = "blue"}
                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                </div>
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
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Proveedor</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Fecha</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Estado</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Precio Total</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Iva 5%</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Iva 10%</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        facturasFiltradas?.map((factura, index) => (
                                            <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(factura.id)}>
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                                <td>{convertidorProveedor(factura.proveedor_id)}</td>
                                                <td >{(factura.fecha)}</td>
                                                <td >{(factura.pagado)}</td>
                                                <td >{(factura.precio_total)}</td>
                                                <td >{(factura.iva_total5)} %</td>
                                                <td >{(factura.iva_total10)}</td>

                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link" onClick={() => handleSetEditar(factura.id)}>
                                                            <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedFactura.map((factura, index) => (
                                        <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(factura.id)}>
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                            <td>{convertidorProveedor(factura.proveedor_id)}</td>
                                            <td >{(factura.fecha)}</td>
                                            <td >{(factura.pagado)}</td>
                                            <td >{(factura.precio_total)}</td>
                                            <td >{(factura.iva_total5)} %</td>
                                            <td >{(factura.iva_total10)}</td>

                                            <td>
                                                <Button size="sm" variant="link" onClick={() => handleSetEditar(factura.id)}>
                                                    <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
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

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Servicio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar este Servicio?</p>
                </Modal.Body>

                <Modal.Footer>
                    <       Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false)
                        setIdEliminar(-1)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)} >Eliminar</Button>
                </Modal.Footer>
            </Modal>



            <Modal show={(showModal) ? "" : showDetalleModal} onHide={(handleClose)} centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 className="text-3xl font-bold">Factura Nro. {facturaSeleccionada.numero_factura} {convertidorProveedor(facturaSeleccionada.proveedor_id)}</h1>
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
                                        {formatearDetalleNombre(factura.producto_id, factura.servicio_id)}
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


        </Layout >



    );
};

export default CompraProductos;
