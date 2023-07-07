import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { set, useForm, useWatch } from "react-hook-form";

import { useRouter } from 'next/router'
import FacturasApi from "./api/FacturasApi";
import ProveedorApi from "./api/ProveedorApi";
import ProductoApi from "./api/ProductoApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { MdDeleteOutline } from "react-icons/md";
import { toast } from "react-toastify";
import { formatearDecimales, formatearFecha } from "@/helpers";
import InformeCompra from "@/components/InformeCompra";
import InformeApi from "./api/InformeApi";
import MarcaApi from "./api/MarcaApi";


const PAGE_SIZE = 10;

const CompraProductos = ({ }) => {
    const { user } = useContext(AuthContext);


    const ruta = useRouter();

    const [facturas, setFacturas] = useState([]);
    const [productos, setProductos] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalPagesFilter, setTotalPagesFilter] = useState(0);


    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [isFiltro, setIsFiltro] = useState(false);
    const [isFiltroDetalle, setIsFiltroDetalle] = useState(false);

    const formDos = useForm();
    const [idEliminar, setIdEliminar] = useState(-1)
    const [facturaEditar, setFacturaEditar] = useState(undefined);
    const [showInformeModal, setShowInformeModal] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, reset, getValues
    } = useForm();
    const { register: registerDetalle, handleSubmit: handleSubmitDetalle, formState: { errors: errorsDetalle }, setValue: setValueDetalle, reset: resetDetalle, getValues: getValuesDetalle
    } = formDos;
    const [facturasFiltradas, setFacturasFiltradas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState([]);
    const [facturaSeleccionadaDetalle, setFacturaSeleccionadaDetalle] = useState([]);
    const [productosAgregar, setProductosAgregar] = useState([]);
    const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [proveedorDatos, setProveedorDatos] = useState([]);
    const [productosDatos, setProductoDatos] = useState([]);
    const [produtosDetallesFiltrados, setProductoDetallesFiltrados] = useState([]);
    const [informeProductos, setInformeProductos] = useState([]);
    const [marcas, setMarcas] = useState([]);

    const [valorFiltrado, setValorFiltroInput] = useState("");
    const [filtroInputDetalle, setFiltroInputDetalle] = useState("");
    const [valorFiltro, setValorFiltro] = useState("");
    const [nombreProveedorInput, setNombreProveedorInput] = useState("");
    const [nombreProductoInput, setNombreProductoInput] = useState("");
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


    const [estado, setEstado] = useState(
        [
            { id: 1, value: "PAGADO" },
            { id: 2, value: "PENDIENTE" }
        ]
    )





    useEffect(() => {
        obtenerFacturas();
        obtenerProductos();
        obtenerProveedores();
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
        console.log(fecha)
        // Función para obtener el inicio y el final del día en formato "YYYY-MM-DDTHH:mm:ss"
        const getStartOfDay = (date) => {
            const startDateTime = new Date(date); // Crea una nueva instancia de la fecha
            startDateTime.setHours(0, 0, 0, 0); // Establece la hora al inicio del día
            return (startDateTime.toISOString().slice(0, -1)) // Retorna la fecha y hora en formato ISO
        };

        const getEndOfDay = (date) => {
            const endDateTime = new Date(date); // Crea una nueva instancia de la fecha
            endDateTime.setHours(23, 59, 59, 999); // Establece la hora al final del día
            return (endDateTime.toISOString().slice(0, -1)) // Retorna la fecha y hora en formato ISO
        };

        // Obtiene el inicio y el final del día actual
        const startOfDay = getStartOfDay(currentDate);
        const endOfDay = getEndOfDay(currentDate);

        // Llama a la función obtenerProductosDia() con las fechas obtenidas
        obtenerProductosDia(startOfDay, endOfDay);
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
                    const facturasFiltradas = datos.content.filter((factura) => factura.esCompra === "COMPRA");
                    setFacturas(facturasFiltradas);
                    const totalPagesFacturas = facturasFiltradas.map((factura) => factura.totalPages);
                    setTotalPages(totalPagesFacturas);
                    console.log(facturasFiltradas);


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


    const obtenerProductosDia = (fechaInicio, fechaCierre) => {

        const informeApi = new InformeApi(user.token);

        informeApi.getInformeProducto("COMPRA",fechaInicio, fechaCierre)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setInformeProductos(datos);
                console.log(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los productos del dia:", error);
            });

    }


    const actualizar = () => {
        valorFiltrado === "" ? setIsFiltro(false) : null;
        isBuscar ? handleFiltrar(valorFiltro) : null;

    }


    const handleModal = () => {
        setShowModal(!showModal);
        setIsEditar(false);


    };

    const DetallesTabla = ({ detalles }) => {
        return (
            <div className="mt-2 scrollable-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isFiltroDetalle ? (

                            produtosDetallesFiltrados.reverse().map((detalle, index) => (
                                <tr key={index}>
                                    <td>{formatearDetalleProducto(detalle.producto_id)}</td>
                                    <td>{detalle.cantidad}</td>
                                    <td>
                                        <Button size="sm" variant="link" onClick={() => handleSetEliminarDetalle(detalle.producto_id)}>
                                            <MdDeleteOutline color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                        </Button>
                                    </td>
                                </tr>
                            ))


                        ) :
                            (
                                detalles.map((detalle, index) => (
                                    <tr key={index}>
                                        <td>{formatearDetalleProducto(detalle.producto_id)}</td>
                                        <td>{detalle.cantidad}</td>
                                        <td>
                                            <Button size="sm" variant="link" onClick={() => handleSetEliminarDetalle(detalle.producto_id)}>
                                                <MdDeleteOutline color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}

                    </tbody>
                </Table>
            </div>
        );
    };

    const handleSetEliminarDetalle = (id) => {
        const detalleActualizado = productosAgregar.filter(p => p.producto_id !== id);
        setProductosAgregar(detalleActualizado);
    }

    const handleAgregarDetalle = (data) => {
        if (productosDatos.id && data.cantidad > 0) {
            const detalleProducto = {
                cantidad: Number(data.cantidad),
                producto_id: productosDatos.id,

                servicio_id: 0
            };
            const productoExistente = productosAgregar.find(
                (producto) => producto.producto_id === detalleProducto.producto_id
            );

            if (productoExistente) {
                // Si el producto ya existe, incrementar la cantidad
                productoExistente.cantidad += detalleProducto.cantidad;
                setProductosAgregar([...productosAgregar]);
            } else {
                // Si el producto no existe, agregarlo al arreglo
                setProductosAgregar([...productosAgregar, detalleProducto]);
            }
        };
        resetDetalle({
            ...data,
            cantidad: ""
        });
        setNombreProductoInput([]);

    }

    const formSubmit = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/proveedores/guardarCompra/`;
        const json = {
            proveedorId: proveedorDatos.id,

            numeroFactura: data.factura,
            pagado: data.estado,
            detalles: productosAgregar
        }

        axios.post(
            api,
            json,
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Compra Agregada');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
                reset();


            })
            .finally(() => {
                obtenerFacturas();
                reset();
                resetDetalle();
                setProductosAgregar([]);
                setNombreProveedorInput([]);
                setNombreProductoInput([]);

            })




    }

    const handleSetEditar = (id) => {
        const factura = facturas.find(s => s.id === id);
        setFacturaEditar(factura);
        const proveedor = proveedores?.find(p => p.id === factura.proveedor_id);
        setNombreProveedorInput(proveedor.nombre);
        setProveedorDatos(proveedor);
        setValue("factura", factura.numero_factura);

        setValue("estado", factura.pagado);
        setProductosAgregar(...productosAgregar, factura.detalles);
        handleModal();
        setIsEditar(true);
    }


    const handleEditar = (data) => {

        handleModal();
        const api = `${process.env.API_URL}api/proveedores/actualizarCompra/${facturaEditar.id}`;
        const json = {
            proveedorId: proveedorDatos.id,
            numeroFactura: data.factura,
            pagado: data.estado,
            detalles: productosAgregar
        }
        axios.post(api,
            json,

            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Factura Actualizado');
                obtenerFacturas();
                setShowDetalleModal(false);



            })
            .catch((error) => {
                toast.error('No se pudo actualizar la Factura!!!"');
                setShowDetalleModal(false);



            })
            .finally(() => {
                setFacturaEditar(undefined);
                setIsEditar(false);
                reset();
                resetDetalle();
                setProductosAgregar([]);
                setNombreProveedorInput([]);
                setNombreProductoInput([]);

            })

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

    const handleClose = () => setShowDetalleModal(false);

    const handleRowClick = (id) => {
        const factura = facturas.find(p => p.id === id);
        setFacturaSeleccionada(factura);
        setFacturaSeleccionadaDetalle(factura.detalles);
        setShowDetalleModal(true)

    }

    const formatearDetalleProducto = (idP) => {
        const producto = productos.find(producto => producto.id === idP);
        return producto?.nombre;
    }

    const handleInputProveedorChange = (event) => {
        const value = event.target.value;
        setNombreProveedorInput(value);
        // Filtra los elementos basado en el valor de búsqueda
        const listaProveedoresFiltrados = proveedores.filter(proveedor => proveedor?.nombre.toLowerCase().includes(value.toLowerCase()));
        setProveedoresFiltrados(listaProveedoresFiltrados)
    };


    const handleClickProveedorRow = (id) => {
        const proveedor = proveedores.find(c => c.id === id);
        setNombreProveedorInput(proveedor?.nombre);
        setProveedorDatos(proveedor);
        setProveedoresFiltrados([]);
    }

    const handleInputProductoChange = (event) => {
        const value = event.target.value;
        setNombreProductoInput(value);
        const listaProductosFiltrados = productos.filter(producto => producto?.nombre.toLowerCase().includes(value.toLowerCase()));
        setProductosFiltrados(listaProductosFiltrados);

    }

    const handleClickProductoRow = (id) => {
        const producto = productos.find(c => c.id === id);
        setNombreProductoInput(producto?.nombre);
        setProductoDatos(producto);
        setProductosFiltrados([]);
    }






    return (
        <Layout pagina={"Compra de Productos"} titulo={"CRUD Compras Producto"} ruta={ruta.pathname}>


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
                                placeholder="Buscar Ej.: Nombre del Proveedor"
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
                            <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleModal()}
                                className=" px-3"
                            >
                                Agregar
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
                                    {isBuscar || isFiltro ? (
                                        paginatedFacturaFiltradas?.map((factura, index) => (
                                            <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(factura.id)}>
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                                <td>{formatearProveedor(factura.proveedor_id)}</td>

                                                <td >{formatearFecha(factura.fecha)}</td>
                                                <td >{(factura.pagado)}</td>
                                                <td >{(factura.precio_total)}</td>
                                                <td >{factura.iva_total5 === 0 ? "-" : formatearDecimales(factura.iva_total5, 4)}</td>
                                                <td >{factura.iva_total10 === 0 ? "-" : formatearDecimales(factura.iva_total10, 4)}</td>

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
                                            <td>{formatearProveedor(factura.proveedor_id)}</td>

                                            <td >{formatearFecha(factura.fecha)}</td>
                                            <td >{(factura.pagado)}</td>
                                            <td >{(factura.precio_total)}</td>
                                            <td >{factura.iva_total5 === 0 ? "-" : formatearDecimales(factura.iva_total5, 4)}</td>
                                            <td >{factura.iva_total10 === 0 ? "-" : formatearDecimales(factura.iva_total10, 4)}</td>

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

            <Modal size="xl" show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header>
                        <Modal.Title> {isEditar ? "Editar Factura de Compra" : "Cargar Factura(s) de compra(s) de Producto(s)"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <div className="flex flex-col">
                            <div>
                                <Form.Group>
                                    <Form.Label>Nombre del Proveedor</Form.Label>
                                    <Form.Control
                                        {...register("proveedor", {
                                            required: true
                                        })}
                                        type="text"
                                        placeholder="Nombre del Proveedor"
                                        isInvalid={errors.proveedor}
                                        value={nombreProveedorInput}
                                        onChange={handleInputProveedorChange}
                                    />
                                </Form.Group>
                            </div>

                            <div className="fixed my-20 shadow z-50 bg-white w-80">
                                {nombreProveedorInput && proveedoresFiltrados.length > 0 && (
                                    <ul>
                                        {proveedoresFiltrados.map((proveedor) => (
                                            <li className="border-y-1 border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickProveedorRow(proveedor.id)} key={proveedor.id}>{proveedor.nombre}</li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>


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
                                <option value="" disabled selected>Seleccione un Estado</option>

                                {estado?.map((estado) => (
                                    <option key={estado.id} value={estado.value}>{estado.value}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <div className="flex flex-col">
                            <div>
                                <Form.Group>
                                    <Form.Label>Nombre del Producto</Form.Label>
                                    <Form.Control
                                        {...register("producto", {
                                            required: false,
                                        })}
                                        type="text"
                                        placeholder="Nombre del Producto"
                                        isInvalid={errors.producto}
                                        value={nombreProductoInput}
                                        onChange={handleInputProductoChange}
                                    />
                                </Form.Group>
                            </div>

                            <div className="fixed my-20 shadow z-40 bg-white w-80">
                                {nombreProductoInput && productosFiltrados.length > 0 && (
                                    <ul>
                                        {productosFiltrados.map((producto) => (
                                            <li className="border-y-1 border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickProductoRow(producto.id)} key={producto.id}>{producto.nombre}</li>
                                        ))}
                                    </ul>
                                )}

                            </div>
                        </div>


                        <Form.Group>
                            <Form.Label>Cantidad a Comprar</Form.Label>
                            <Form.Control
                                {...registerDetalle("cantidad")}
                                type="number"
                                placeholder="Cantidad del Producto"
                                isInvalid={errorsDetalle.cantidad}
                            />
                        </Form.Group>


                        {/* Botón para agregar el detalle de factura */}
                        <div className="mt-2 mb-2 ml-1">
                            <Button variant="success" onClick={handleSubmitDetalle(handleAgregarDetalle)}>
                                Agregar Detalle
                            </Button>
                        </div>



                        <DetallesTabla detalles={productosAgregar} />



                    </Modal.Body>
                    <Modal.Footer>

                        <Button variant="secondary" onClick={() => { handleModal(), reset(), resetDetalle(), setProductosAgregar([]), setShowDetalleModal(false), setNombreProductoInput(""), setNombreProveedorInput("") }}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            {isEditar ? "Terminar Edición" : "Guardar"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>



            {/* Modal del Informe */}
            <Modal show={showInformeModal} onHide={handleInformeModal}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-lg">Imprimir Informe</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <InformeCompra data={informeProductos} nombre={"Informe de Compras"} fecha={fecha} proveedores={proveedores} marcas={marcas} />
                </Modal.Body>

            </Modal>



        </Layout >



    );
};

export default CompraProductos;
