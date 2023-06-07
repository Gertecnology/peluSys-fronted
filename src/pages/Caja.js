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
import Mensaje from "@/components/Mensaje";
import axios from "axios";


const Caja = () => {
    const ruta = useRouter();

    const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm();

    const { user } = useContext(AuthContext);


    const [nombreCliente, setNombreCliente] = useState("");
    const [rucCliente, setRucCliente] = useState("");
    const [urlPhoto, setUrlPhoto] = useState("")
    const [mensaje, setMensaje] = useState("");

    const [clientes, setClientes] = useState([]);
    const [cajas, setCajas] = useState([]);
    const [cajasDisponibles, setCajasDisponibles] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);


    const [isBuscar, setIsBuscar] = useState(false);
    const [showAbrirCajaModal, setShowAbrirCajaModal] = useState(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
    const handleClose = () => setShowAbrirCajaModal(false);
    const [visible, setVisible] = useState(false);

    const [areComponentsEnabled, setAreComponentsEnabled] = useState(false);

    const handleChangeComponents = () => {
        setAreComponentsEnabled(!areComponentsEnabled);
    };

    useEffect(() => {
        obtenerCajas();
        obtenerCajas();
        obtenerClientes();
        obtenerEmpleados();
        obtenerProductos();
        console.log(clientes);
    }, [user]);




    useEffect(() => {
        if (rucCliente.length > 6) {
            filtrarCliente(rucCliente)
        }
        else {
            setNombreCliente("");
        }
    }, [rucCliente])



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


    const formatearCliente = (id) => {
        const cliente = clientes?.find(cliente => cliente.id === id);
        return cliente?.nombre;
    }

    const formatearProducto = (id) => {
        const producto = productos.find(producto => producto.id === id);
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
        console.log(data)
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




    const formatearEmpleado = (id) => {
        const empleado = empleados?.find(empleado => empleado.id === id);
        return empleado?.apellido;
    }


    const filtrarCliente = (valor) => {
        const datoCliente = clientes.find(cliente => cliente?.ruc === valor);
        setNombreCliente(datoCliente?.nombre);
    }

    return (
        <Layout pagina={"Caja"} titulo={"CRUD Caja"} ruta={ruta.pathname}>
            <div className="block">
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex items-center gap-3">
                        <div className="1/4">
                            <Form.Label>Cliente:</Form.Label>
                            <Form.Control
                                placeholder="Cliente"
                                value={nombreCliente}
                                onChange={e => setNombreCliente(e.target.value)}
                                disabled={true}

                            />
                        </div>
                        <div className="1/4">
                            <Form.Label>RUC:</Form.Label>
                            <Form.Control
                                placeholder="RUC"
                                value={rucCliente}
                                onChange={e => setRucCliente(e.target.value)}
                                disabled={!areComponentsEnabled}
                            />
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
                <div className="flex pl-12 mt-5 w-1/2 gap-3">
                    <div className="w-3/4">
                        <Form.Control
                            placeholder="Producto"

                            disabled={!areComponentsEnabled}
                        />
                    </div>
                    <div className="w-2/4">
                        <Form.Control
                            placeholder="Cantidad"

                            disabled={!areComponentsEnabled}
                        />
                    </div>
                    <div className="w-1/4">
                        <Button variant="success" disabled={!areComponentsEnabled}>
                            +
                        </Button>
                    </div>
                </div>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-blue-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Producto</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Cantidad</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Precio unitario</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Subtotal</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(carrito?.map((item, index) => (
                                    <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                        <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{item.numero_factura}</td>
                                        <td >{formatearCliente(item.cliente_id)}</td>
                                        <td >{item.ruc}</td>
                                        <td >{item.fecha}</td>
                                        <td>{item.pagado}</td>
                                        <td className="text-center">{item.precio_total}</td>
                                        <td className="flex justify-center items-center">
                                            <Button size="sm" variant="link" onClick={() => handleSetDelete(producto.id)}>
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
        </Layout>
    );
};

export default Caja;
