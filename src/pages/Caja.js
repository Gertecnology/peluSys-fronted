import Layout from "@/layout/Layout";
import { Modal, Button, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { AuthContext } from "@/pages/contexts/AuthContext";
import ClienteApi from "./api/ClienteApi";
import CajaApi from "./api/CajaApi";
import EmpleadoApi from "./api/EmpleadoApi";
import ProductoApi from "./api/ProductoApi";
import { AiOutlineDelete } from "react-icons/ai"
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import Mensaje from "@/components/Mensaje";
import { toast } from "react-toastify";
import axios from "axios";


const Caja = () => {
    const ruta = useRouter();
    const form2 = useForm();

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();
    const { register: registerCliente, handleSubmit: handleSubmitCliente, formState: { errors: errorsCliente }, reset: resetCliente, getValues: getValuesCliente } = form2;

    const { user } = useContext(AuthContext);


    const [nombreCliente, setNombreCliente] = useState("");
    const [rucCliente, setRucCliente] = useState("");
    const [urlPhoto, setUrlPhoto] = useState("")
    const [mensaje, setMensaje] = useState("");
    const [productosSearchValue, setProductosSearchValue] = useState("");
    const [clientesSearchValue, setClientesSearchValue] = useState("");
    const [totalPagar, setTotalPagar] = useState("");
    const [cantidad, setCantidad] = useState('');

    const [clientes, setClientes] = useState([]);
    const [cajas, setCajas] = useState([]);
    const [cajasDisponibles, setCajasDisponibles] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);


    const [showAbrirCajaModal, setShowAbrirCajaModal] = useState(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
    const handleClose = () => setShowAbrirCajaModal(false);
    const [visible, setVisible] = useState(false);
    const [areComponentsEnabled, setAreComponentsEnabled] = useState(false);
    const [showAddClienteModal, setShowAddClienteModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);

    const handleChangeComponents = () => {
        setAreComponentsEnabled(!areComponentsEnabled);
    };

    useEffect(() => {
        obtenerCajas();
        obtenerCajas();
        obtenerClientes();
        obtenerEmpleados();
        obtenerProductos();
    }, [user]);

    useEffect(() => {
        const sumaTotal = carrito.reduce((total, producto) => total + producto.subtotal, 0);
        setTotalPagar(sumaTotal);
    }, [carrito])


    useEffect(() => {
        if (rucCliente.length > 6) {
            filtrarCliente(rucCliente)
        }
        else {
            setNombreCliente("");
        }
    }, [rucCliente])

    const handleClienteModal = () => {
        Object.keys(getValuesCliente()).forEach(key => setClientesSearchValue(key, ""))
        setShowAddClienteModal(!showAddClienteModal);

    };

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
                const filtrarCajasDisponibles = cajas?.filter(caja => caja.estado === "CERRADO")
                setCajasDisponibles(filtrarCajasDisponibles)
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

    const handleAbrirCajaModal = () => {
        setShowAbrirCajaModal(true);

    }

    const formAbrirCaja = (data) => {
        if (getValues("monto") <= 0) {
            setMensaje("Monto no valido!!");
            return;
        }
        setMensaje("");
        const api = `${process.env.API_URL}api/cajas/aperturas`;
        axios.post(
            api,
            {
                cajaId: Number(data.cajaId),
                monto: Number(data.monto),
                empleadoId: Number(user.empleado_id)

            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                setIsCheckboxDisabled(!isCheckboxDisabled);
                setVisible(!visible);
                handleChangeComponents();
                handleClose();
            })
            .catch((error) => {
                reset();
            })
            .finally(() => {
                reset();
            })
    }

    const formClienteSubmit = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/guardar/`;
        const token = user.accessToken
        handleClienteModal();
        axios.post(
            api,
            {

                nombre: data.nombre,
                ruc: data.ruc,
                direccion: data.direccion,
                telefono: data.telefono,
                credito: 0,
                credito_maximo: 0,
                linkFotoPerfil: null,
                email: data.email
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Cliente Agregado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo agregar!"');
            });

    }




    const formatearEmpleado = (id) => {
        const empleado = empleados?.find(empleado => empleado.id === id);
        return empleado?.apellido;
    }


    const filtrarCliente = (valor) => {
        const datoCliente = clientes.find(cliente => cliente?.ruc === valor);
        setNombreCliente(datoCliente?.nombre);
    }

    const handleInputProductoChange = (event) => {
        const value = event.target.value;
        setProductosSearchValue(value);
        // Filtra los elementos basado en el valor de búsqueda
        const filtrarProducto = productos.filter((producto) => producto.nombre.toLowerCase().includes(value.toLowerCase()));
        setProductosFiltrados(filtrarProducto);
    };

    const handleInputClienteChange = (event) => {
        const value = event.target.value;
        setClientesSearchValue(value);
        // Filtra los elementos basado en el valor de búsqueda
        const filtrarCliente = clientes.filter((cliente) => cliente.nombre.toLowerCase().includes(value.toLowerCase()));
        setClientesFiltrados(filtrarCliente);
    };

    const handleClickClienteRow = (id) => {
        const cliente = clientes.find(c => c.id === id);
        setClientesSearchValue(cliente?.nombre);
        setClientesFiltrados([]);
    }

    const handleClickRow = (id) => {
        const producto = productos.find(p => p.id === id);
        setProductosSearchValue(producto?.nombre);
        setProductosFiltrados([]);
    }

    const calcularSubtotal = (precio, cantidad) => {
        return precio * cantidad;

    }

    const agregarAlCarrito = () => {
        const productoAgregar = productos.find(p => p.nombre.toLowerCase().includes(productosSearchValue.toLowerCase()));

        const detalleCarrito = {
            id: productoAgregar.id,
            nombre: productoAgregar.nombre,
            cantidad: Number(cantidad),
            precioUnitario: productoAgregar.precioVenta,
            subtotal: calcularSubtotal(productoAgregar.precioVenta, cantidad),

        }
        handleAgregarDetalle(detalleCarrito);
    }

    const handleAgregarDetalle = (detalle) => {
        if (detalle.cantidad > 0) {
            const productoExistente = carrito.find(
                (item) => item.id === detalle.id
            );

            if (productoExistente) {
                (isEditar ? (
                    productoExistente.cantidad = Number(detalle.cantidad)
                ) : (
                    productoExistente.cantidad += Number(detalle.cantidad)
                ))
                // Si el producto ya existe, incrementar la cantidad

                setCarrito([...carrito]);
            }
            else {
                // Si el producto no existe, agregarlo al arreglo
                setCarrito([...carrito, detalle]);
            }
        };
        setProductosSearchValue("");
        setCantidad("");
    }

    const handleDeleteProductoCarrito = (id) => {
        const carritoActualizado = carrito.filter(c => c.id !== id);
        setCarrito(carritoActualizado);
    }

    const handleEditProductoCarrito = (id) => {
        const productoActualizado = carrito.find(c => c.id === id);
        setIsEditar(true);
        setProductosSearchValue(productoActualizado?.nombre);
        setCantidad(productoActualizado.cantidad);

    }

    return (
        <Layout pagina={"Caja"} titulo={"CRUD Caja"} ruta={ruta.pathname}>
            <div className="block">
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex flex-col">

                        <div className="flex items-center w-1/2 gap-2">

                            <div className="w-3/4">
                                <Form.Label>Cliente:</Form.Label>
                                <Form.Control
                                    placeholder="Cliente"
                                    value={clientesSearchValue}
                                    onChange={handleInputClienteChange}
                                    disabled={!areComponentsEnabled}
                                />
                            </div>
                            <div className="w-2/4">
                                <Form.Label>RUC:</Form.Label>
                                <Form.Control
                                    placeholder="RUC"
                                    value={rucCliente}
                                    onChange={e => setRucCliente(e.target.value)}
                                    disabled={!areComponentsEnabled}
                                />
                            </div>
                            <div className="w-1/4 pt-8">
                                <Button variant="link" onClick={() => handleClienteModal()} disabled={!areComponentsEnabled}>
                                    <AiOutlineUserAdd color="#808080" size="35px" onMouseOver={({ target }) => target.style.color = "green"}
                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                </Button>
                            </div>
                        </div>
                        <div className="fixed my-20 shadow z-50 bg-white w-80">
                            {clientesSearchValue && clientesFiltrados.length > 0 && (
                                <ul>
                                    {clientesFiltrados.map((cliente) => (
                                        <li className="border-y-1 border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickClienteRow(cliente.id)} key={cliente.id}>{cliente.nombre}</li>
                                    ))}
                                </ul>
                            )}

                        </div>
                        <div>

                        </div>
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
                <div className="flex flex-col pl-12 mt-5 gap-3 w-6/7">

                    <div className="flex w-1/2 gap-3">
                        <div className="w-3/4">
                            <Form.Control
                                placeholder="Producto"
                                disabled={!areComponentsEnabled}
                                value={productosSearchValue}
                                onChange={handleInputProductoChange}
                            />
                        </div>
                        <div className="w-2/4">
                            <Form.Control
                                placeholder="Cantidad"
                                disabled={!areComponentsEnabled}
                                value={cantidad}
                                onChange={(e) => setCantidad(e.target.value)}
                            />
                        </div>
                        <div className="w-1/4">
                            <Button variant="success" onClick={() => agregarAlCarrito()} disabled={!areComponentsEnabled}>
                                +
                            </Button>
                        </div>
                    </div>
                    <div className="fixed my-11 shadow z-50 bg-white w-80">
                        {productosSearchValue && productosFiltrados.length > 0 && (
                            <ul>
                                {productosFiltrados.map((producto) => (
                                    <li className="border-y-1 border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickRow(producto.id)} key={producto.id}>{producto.nombre}</li>
                                ))}
                            </ul>
                        )}

                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="sticky top-0 bg-blue-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Producto</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Cantidad</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Precio unitario</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Subtotal</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 overflow-y-auto">
                                {(carrito?.map((producto, index) => (
                                    <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                        <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{producto.nombre}</td>
                                        <td >{producto.cantidad}</td>
                                        <td >{producto.precioUnitario}</td>
                                        <td>{producto.subtotal}</td>
                                        <td className="flex justify-center items-center">
                                            <Button size="sm" variant="link" onClick={() => handleEditProductoCarrito(producto.id)}>
                                                <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link" onClick={() => handleDeleteProductoCarrito(producto.id)}>
                                                <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                        </td>
                                    </tr>
                                )))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="fixed bottom-12 right-48 flex justify-end">
                    <label className="text-black text-2xl font-mono">Total a pagar: {totalPagar}</label>
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
                        {mensaje && <Mensaje tipo="error">{mensaje}</Mensaje>}
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
                                    alt={`Foto de perfil ${user?.username}`}
                                    src={urlPhoto}
                                    width="500"
                                    height="400"
                                    className="object-cover btn- h-9 w-9 rounded-full mr-2 bg-gray-300" />
                            </div>
                        </div>
                        <Form.Group>
                            <Form.Label>Numero Caja</Form.Label>
                            <Form.Select {...register("cajaId", { required: true })}
                            >
                                <option defaultValue="" disabled selected hidden>Seleccione una Caja</option>

                                {cajasDisponibles?.map((caja) => (
                                    <option key={caja.id} value={caja.id}>{caja.detalle}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label className="font-bold">Monto de Apertura de Caja</Form.Label>
                            <Form.Control
                                {...register("monto", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Monto de Apertura"
                                isInvalid={errors.monto}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" type="submit">
                            Abrir
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>

            {/*Registrar nuevo cliente */}
            <Modal show={showAddClienteModal} onHide={handleClienteModal}>
                <Form
                    onSubmit={handleSubmitCliente(formClienteSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...registerCliente("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del cliente"
                                isInvalid={errorsCliente.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                {...registerCliente("telefono", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Teléfono"
                                isInvalid={errorsCliente.telefono}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>RUC</Form.Label>
                            <Form.Control

                                {...registerCliente("ruc", {
                                    required: false
                                })}

                                type="text"
                                placeholder="RUC"
                                isInvalid={errorsCliente.ruc}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                {...registerCliente("direccion", {
                                    required: false
                                })}
                                type="text"
                                placeholder="Dirección"
                                isInvalid={errorsCliente.direccion}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>E-mail</Form.Label>
                            <Form.Control
                                {...registerCliente("email", {
                                    required: false
                                })}
                                type="text"
                                placeholder="Email"
                                isInvalid={errorsCliente.email}
                            />
                        </Form.Group>




                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClienteModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>

        </Layout>
    );
};

export default Caja;
