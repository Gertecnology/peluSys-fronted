import Layout from "@/layout/Layout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { Alert, Modal, Button, Badge, Form } from "react-bootstrap";
import moment from "moment";
import { AiOutlineDelete, AiOutlineReload } from "react-icons/ai";
import { BsCheckAll, BsCreditCard2Back, BsPlusCircle, BsScissors, BsTrash, BsTrash2Fill } from "react-icons/bs";
import { toast } from "react-toastify";
import Select from "react-select"



const Citas = () => {
    const { user } = useContext(AuthContext)
    const [citas, setCitas] = useState([])
    const [productos, setProductos] = useState([])
    const [clientes, setClientes] = useState([])
    const [cliente, setCliente] = useState({})
    const [productoSeleccionado, setProductoSeleccionado] = useState(null)
    const [cantidadSeleccionada, setCantidadSeleccionada] = useState(0)
    const [factura, setFactura] = useState({})
    const [servicios, setServicios] = useState([])
    const [peluquero, setPeluquero] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showModalFacturacion, setShowModalFacturacion] = useState(false)
    const [showCita, setShowCita] = useState(undefined)
    const [citaAFacturar, setCitaAFacturar] = useState(-1)

    const coloresEstados = {
        "ESPERA": "#0369a1",
        "PROCESO": "#f97316",
        "FINALIZADO": "#15803d"
    }

    const textoEstados = {
        "ESPERA": <>
            <BsScissors />
        </>,
        "PROCESO": <>
            <BsCreditCard2Back />
        </>,
        "FINALIZADO": <>
        </>
    }

    const estados = ["ESPERA", "PROCESO", "FINALIZADO"]

    useEffect(() => {
        obtenerDatos()
        obtenerPeluquero();
        obtenerClientes()
        obtenerProductos()
    }, [])


    const handleModal = () => {
        setShowModal(!showModal)
    }

    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/cita/page`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setCitas(res.data.content.filter(cita => moment(cita.fechaEstimada).isSame(moment(), "day") && cita.empleado_id === user.empleado_id))
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const obtenerPeluquero = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/empleado/`;
        const token = user.token;
        axios.get(api, {
            "page": 0,
            "size": 100
        }, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setPeluquero(res.data.content.find(p => user.empleado_id === p.empleado_id))
            })
            .catch((error) => {
                console.log(error)
            });
    }


    const obtenerServiciosCitas = async (id) => {
        if (!user) return;
        const token = user.token;
        const api = `${process.env.API_URL}api/servicios/findByCitas/${id}`;
      
        try {
          const response = await axios.get(api, { headers: { "Authorization": `Bearer ${token}` } });
          const servicios = response.data;
          setServicios(servicios);
        } catch (error) {
          console.log(error);
        }
      };
      

    const generarFactura = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/factura/guardarVentar/`;
        const token = user.token;


        const detallesServicios = servicios.map(servicio => {
            return{
                cantidad: 1,
                producto_id: 0,
                servicio_id: servicio.servicio_id
            }
        })

        const detallesActualizados = [...detallesServicios, ...factura.detalles]

        const json = {proveedorId: 0, ...factura, detalles: detallesActualizados}
        console.log(json)

        axios.post(api,
           json, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                toast.info("Factura generada exitosamente!")
                cambiarEstado(citaAFacturar)
                setCitaAFacturar(-1)
            })
            .catch((error) => {
                toast.error("No se pudo generar la factura.")
                console.log(error)
            }).finally(() =>  setShowModalFacturacion(false))
    }

    const cambiarEstado = (id) => {
        if (!user) return
        const api = `${process.env.API_URL}api/cita/estado/${id}`;
        const token = user.token;
        const cita = citas.find(cita => cita.id === id)
        const estado = estados[estados.indexOf(cita.estado_cita) + 1]
        if (cita.estado_cita === "FINALIZADO") return
        axios.post(api,
            estado
            , {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "content-type": "application/json"
                },
            })
            .then(res => {
                obtenerDatos()
            })
            .catch((error) => {
                toast.error('No fue posible cambiar el estado de la cita.');
                console.log(error)
            });
    }

    const obtenerProductos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/producto/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProductos(res.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const obtenerClientes = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setClientes(res.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const showDetails = (id) => {
        const cita = citas.find(c => c.id === id)
        obtenerServiciosCitas(id)
        setShowCita(cita)
        handleModal()
    }

    const handleModalFacturacion = (id) => {
        const cita = citas.find(c => c.id === id)
        const cliente = clientes.find(cliente => cita.nombreCliente === cliente.nombre)
        obtenerServiciosCitas(cita.id)
        setCliente(cliente)
        setShowCita(cita)
        setFactura({
            clienteId: cliente.id,
            pagado: "PENDIENTE",
            detalles: []
        })
        setShowModalFacturacion(true)
    }

    const agregarProducto = () => {
        if (!productoSeleccionado || cantidadSeleccionada <= 0) return

        const detalleExistente = factura.detalles.find(detalle => detalle.productoId === productoSeleccionado.value);

        if (detalleExistente) {
            const detallesActualizados = factura.detalles.map(detalle => {
                if (detalle.productoId === productoSeleccionado.value) {
                    return {
                        ...detalle,
                        cantidad: Number(cantidadSeleccionada)
                    };
                }
                return detalle;
            });

            setFactura({ ...factura, detalles: detallesActualizados });
        } else {
            setFactura({ ...factura, detalles: [...factura.detalles, { producto_id: productoSeleccionado.value, cantidad: Number(cantidadSeleccionada), servicio_id:0 }] });
        }

        setProductoSeleccionado(null);
        setCantidadSeleccionada(1);
    }

    const deleteDetalle = (productoId) => {
        const detallesActualizados = factura.detalles.filter(detalle => detalle.productoId !== productoId);
        setFactura({ ...factura, detalles: detallesActualizados });
    }


    return (
        <Layout>


            <Modal size="lg" show={showModalFacturacion} onHide={() => setShowModalFacturacion(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Generar Factura</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="grid grid-cols-2 mx-2 text-xl mb-3">
                        <div className="col-span-1">
                            <div className="font-bold">Cliente: <span className="font-normal">{cliente?.nombre}</span></div>
                        </div>
                        <div className="col-span-1">
                            <div className="font-bold">RUC: <span className="font-normal">{cliente?.ruc}</span></div>
                        </div>
                    </div>

                    <div className="col-span-1 m-2">
                        <div className="font-bold">Agregar Productos utilizados durante la cita:</div>
                    </div>

                    <div className="flex justify-start items-center gap-4 w-full">

                        <Select
                            className="w-1/2"
                            isMulti={false}
                            options={productos?.map(p => { return { value: p.id, label: p.nombre } })}
                            value={productoSeleccionado}
                            onChange={(selectedOption) => {
                                setProductoSeleccionado(selectedOption);
                            }}
                        />

                        <input
                            type="number"
                            className="w-1/6 py-2 px-3 text-sm text-gray-700 border border-gray-300 rounded"
                            value={cantidadSeleccionada}
                            onChange={(event) => {
                                setCantidadSeleccionada(event.target.value);
                            }}
                            max={productos?.find(p => productoSeleccionado?.value === p.id)?.cantidad ?? 1}
                            min={1}
                        />




                        <button
                            onClick={agregarProducto}
                            className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-3 text-xl rounded">
                            <BsPlusCircle />
                        </button>
                    </div>
                    <table className="min-w-full divide-y divide-gray-200 mt-3">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Detalle
                                </th>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Subtotal
                                </th>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {servicios?.map(servicio =>  <tr key={servicio.servicio_id}>
                                        <td className="px-4 py-2 text-gray-700">
                                            {servicio.detalle}
                                        </td>
                                        <td className="px-4 py-2">
                                            1
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {servicio.precio} Gs.
                                        </td>
                                        <td className="px-4 py-2">
                                                -
                                        </td>
                                    </tr>)
                                        }

                    {factura?.detalles?.map((detalle, index) => {
                                const producto = productos.find(p => p.id === detalle.producto_id);

                                const actualizarCantidad = (event) => {
                                    const cantidad = event.target.value;
                                    if (cantidad <= 0) return
                                    const detallesActualizados = [...factura.detalles];
                                    detallesActualizados[index] = { ...detalle, cantidad: cantidad };

                                    setFactura({ ...factura, detalles: detallesActualizados });
                                };

                                return (
                                    <tr key={index}>
                                        <td className="px-4 py-2 text-gray-700">
                                            {producto.nombre}
                                        </td>
                                        <td className="px-4 py-2">
                                            <input
                                                type="number"
                                                value={detalle.cantidad}
                                                onChange={actualizarCantidad}
                                                className="w-16 py-1 px-2 text-sm text-gray-700 border border-gray-300 rounded"
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-gray-700">
                                            {producto.precioVenta * detalle.cantidad} Gs.
                                        </td>
                                        <td className="px-4 py-2">
                                            <AiOutlineDelete
                                                className="hover:cursor-pointer"
                                                color="#808080" size="20px"
                                                onMouseOver={({ target }) => target.style.color = "red"}
                                                onMouseOut={({ target }) => target.style.color = "#808080"}
                                                onClick={() => deleteDetalle(detalle.productoId)}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}


                        </tbody>
                    </table>

                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModalFacturacion(false)}>
                        Cerrar
                    </Button>
                    <Button variant="success" onClick={() => generarFactura()}>
                        Facturar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles de la cita</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <div className="grid grid-cols-3 mx-2 text-xl">
                        <div className="col-span-2">
                            <div className="font-bold text-3xl">
                                {showCita?.horaEstimada.slice(0, -3)}  Hs.
                            </div>
                            <div className="font-bold mt-3" >
                                Nombre del Cliente:{" "}
                                <span className="font-normal">{showCita?.nombreCliente}</span>
                            </div>
                            <div className="mt-3">
                                {showCita?.detalle}
                            </div>

                        </div>
                        <div style={{ color: coloresEstados[showCita?.estado_cita] }} className="col justify-end text-right -mt-3 font-bold text-2xl">
                            {showCita?.estado_cita}
                        </div>
                    </div>

                    <div className="font-bold mt-2 text-xl">
                                Servicios Solicitados:{" "}<br/>
                                <div className="grid grid-cols-2  gap-2">
                                    {servicios?.map(servicio => <Badge>{servicio.detalle}</Badge>)}
                                </div>
                            </div>
                </Modal.Body>



                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModal}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>



            <div>
                <div className="flex justify-end mr-10">
                    <button
                        onClick={obtenerDatos}
                        className="flex items-center bg-green-800 hover:bg-green-900 text-white font-bold py-1 px-3 rounded">
                        <AiOutlineReload className="mr-1" />
                        Refrescar
                    </button>
                </div>


                {citas.length ? (


                    <div className="grid grid-cols-3 gap-4 p-1 mx-10 justify-center align-middle text-center mt-2">
                        <div className="col items-center border-2 border-blue-500 rounded-lg px-4 overflow-auto">
                            <div className="sticky top-0 bg-white py-2">
                                <h3 className="text-blue-600">Espera</h3>
                            </div>
                            {citas.filter(cita => cita.estado_cita === "ESPERA").map(cita => (
                                <div
                                    onClick={() => showDetails(cita.id)}
                                    className="mb-5 border border-gray-300 rounded-md p-3 text-start shadow-sm mx-auto mt-3 hover:cursor-pointer hover:bg-gray-50" key={cita.id}>
                                    <div className="flex justify-between">
                                        <div className="text-2xl font-bold mb-2 text-center">{cita.horaEstimada.slice(0, -3)} Hs</div>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <div className="font-bold"> Cliente: <span className="font-normal">{cita.nombreCliente}</span></div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                cambiarEstado(cita.id);
                                            }}
                                            className={`flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-3 text-xl rounded`}>
                                            {textoEstados[cita.estado_cita]}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col items-center h-96 border-2 border-orange-400 rounded-lg px-4 overflow-auto">
                            <div className="sticky top-0 bg-white py-2">
                                <h3 className="text-orange-600">Proceso</h3>
                            </div>
                            {citas.filter(cita => cita.estado_cita === "PROCESO").map(cita => (
                                <div
                                    onClick={() => showDetails(cita.id)}
                                    className="mb-5 border border-gray-300 rounded-md p-3 text-start shadow-sm mx-auto mt-3 hover:cursor-pointer hover:bg-gray-50" key={cita.id}>
                                    <div className="flex justify-between">
                                        <div className="text-2xl font-bold mb-2 text-center">{cita.horaEstimada.slice(0, -3)} Hs</div>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <div className="font-bold"> Cliente: <span className="font-normal">{cita.nombreCliente}</span></div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleModalFacturacion(cita.id)
                                                setCitaAFacturar(cita.id)
                                            }}
                                            className={`flex items-center gap-2 bg-orange-700 hover:bg-orange-800 text-white font-bold py-2 px-3 text-xl rounded`}>
                                            {textoEstados[cita.estado_cita]}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col items-center h-96 border-2 border-green-500 rounded-lg px-4 overflow-auto">
                            <div className="sticky top-0 bg-white py-2">
                                <h3 className="text-green-600">Finalizado</h3>
                            </div>
                            {citas.filter(cita => cita.estado_cita === "FINALIZADO").map(cita => (
                                <div
                                    onClick={() => showDetails(cita.id)}
                                    className="mb-5 border border-gray-300 rounded-md p-3 text-start shadow-sm mx-auto mt-3 hover:cursor-pointer hover:bg-gray-50" key={cita.id}>
                                    <div className="flex justify-between">
                                        <div className="text-2xl font-bold mb-2 text-center">{cita.horaEstimada.slice(0, -3)} Hs</div>
                                    </div>
                                    <div className="flex justify-between mb-1">
                                        <div className="font-bold"> Cliente: <span className="font-normal">{cita.nombreCliente}</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>


                ) : (
                    <div
                        className="flex justify-center"
                    >
                        <Alert variant="info">
                            Aún no se agendaron citas el día de hoy para hoy.
                        </Alert>
                    </div>
                )}

            </div>


        </Layout>);
}

export default Citas;