import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { use, useContext, useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import { AuthContext } from "@/pages/contexts/AuthContext";
import ClienteApi from "./api/ClienteApi";
import CajaApi from "./api/CajaApi";
import EmpleadoApi from "./api/EmpleadoApi";
import ProductoApi from "./api/ProductoApi";
import { AiOutlineDelete } from "react-icons/ai"
import { AiOutlineUserAdd } from "react-icons/ai";
import { LuShoppingCart } from 'react-icons/lu';
import { FiEdit2 } from "react-icons/fi";
import Mensaje from "@/components/Mensaje";
import { toast } from "react-toastify";
import axios from "axios";
import FacturasApi from "./api/FacturasApi";
import { formatearDinero, formatearFecha } from "@/helpers";
import InformeCaja from "@/components/InformeCaja";
import InformeApi from "./api/InformeApi";



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
    const [filtroFacturas, setFiltroFacturas] = useState("");
    const [montoTarjeta, setMontoTarjeta] = useState("");
    const [montoTotal, setMontoTotal] = useState("");
    const [montoEfectivo, setMontoEfectivo] = useState("");
    const [vueltoMostrar, setVueltoMostrar] = useState("");
    const [empleadoNombre, setEmpleadoNombre] = useState("");
    const [montoApertura, setMontoApertura] = useState('');
    const [montoCierre, setMontoCierre] = useState(0);
    const [montoFormateado, setMontoFormateado] = useState("");


    const [clientes, setClientes] = useState([]);
    const [cajas, setCajas] = useState([]);
    const [cajasDisponibles, setCajasDisponibles] = useState([]);
    const [empleados, setEmpleados] = useState([]);
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [clientesFiltrados, setClientesFiltrados] = useState([]);
    const [datosCliente, setDatosCliente] = useState([]);
    const [guardarProductosFactura, setGuardarProductosFactura] = useState([]);
    const [cajaEmpleado, setCajaEmpleado] = useState([]);
    const [facturas, setFacturas] = useState([]);
    const [facturaSeleccionada, setFacturaSeleccionada] = useState([]);
    const [facturasId, setFacturasId] = useState([]);
    const [listaFacturasPagar, setListaFacturasPagar] = useState([]);
    const [listaMetodosPago, setListaMetodosPago] = useState([]);
    const [totalPagarFacturas, setTotalPagarFacturas] = useState([]);
    const [vuelto, setVuelto] = useState([]);
    const [listaFacturasFiltradas, setListaFacturasFiltradas] = useState([]);
    const [montoReal, setMontoReal] = useState([]);
    const [montoTeorico, setMontoTeorico] = useState([]);
    const [transacciones, setTransacciones] = useState([]);
    const [montoTeoricoLs, setMontoTeoricoLs] = useState([]);
    const [informeCaja, setInformeCaja] = useState([]);
    const [fecha, setFecha] = useState([]);






    const [showAbrirCajaModal, setShowAbrirCajaModal] = useState(false);
    const [isCheckboxDisabled, setIsCheckboxDisabled] = useState(true);
    const handleClose = () => setShowAbrirCajaModal(false);
    const [visible, setVisible] = useState(false);
    const [areComponentsEnabled, setAreComponentsEnabled] = useState(false);
    const [showAddClienteModal, setShowAddClienteModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [btnAbrirCajaVisible, setBtnAbrirCajaVisible] = useState(false);
    const [btnCerrarCajaVisible, setBtnCerrarCajaVisible] = useState(true);
    const [isAbierto, setIsAbierto] = useState(false);
    const [showFacturasModal, setShowFacturasModal] = useState(false);
    const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);
    const [isSubMenuEfectivoOpen, setIsSubMenuEfectivoOpen] = useState(false);
    const [isSubMenuTarjetaOpen, setIsSubMenuTarjetaOpen] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [showCerrarCajaModal, setShowCerrarCajaModal] = useState(false);
    const [isMostrarVuelto, setIsMostrarVuelto] = useState(false);
    const [isTotalPagarShow, setIsTotalPagarShow] = useState(false);
    const [showInformeModal, setShowInformeModal] = useState(false);






    const handleChangeComponents = () => {
        setAreComponentsEnabled(!areComponentsEnabled);
    };

    const handleCerrarCajaModal = () => {
        const currentDate = new Date(); // Obtiene la fecha y hora actual

        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${day}-${month}-${year}`;

        setFecha(formattedDate);
        setShowCerrarCajaModal(!showCerrarCajaModal);
    };

    useEffect(() => {
        obtenerClientes();
        obtenerEmpleados();
        obtenerProductos();
        obtenerFacturas();

    }, [user]);


    useEffect(() => {
        if (showFacturasModal) {
            listadoFacturas();
        }
    }, [showFacturasModal]);

    useEffect(() => {
        const sumaTotal = carrito.reduce((total, producto) => total + producto.subtotal, 0);
        setTotalPagar(sumaTotal);
    }, [carrito])

    useEffect(() => {
        if (filtroFacturas.length > 4) {
            setIsBuscar(true);
            handleFiltrar(filtroFacturas)
        } else {
            setIsBuscar(false);
        }

    }, [filtroFacturas])

    useEffect(() => {
        if (montoEfectivo.length > 2) {
            setIsMostrarVuelto(true);
            const vuelto = montoEfectivo - totalPagarFacturas
            setVueltoMostrar(vuelto)
        } else {
            setIsMostrarVuelto(false);
        }
    }, [montoEfectivo])




    useEffect(() => {
        if (rucCliente.length > 4) {

            filtrarPorRuc(rucCliente)
        }
        else {
            setNombreCliente("");
        }
    }, [rucCliente])

    const handleClienteModal = () => {
        Object.keys(getValuesCliente()).forEach(key => setClientesSearchValue(key, ""))
        setShowAddClienteModal(!showAddClienteModal);

    };

    const handleFacturasModal = () => {
        obtenerFacturas();
        setShowFacturasModal(!showFacturasModal);
    }

    const handleMetodoPagoModal = () => {
        if (facturaSeleccionada.length > 0) {
            listadoFacturas();
            setShowMetodoPagoModal(!showMetodoPagoModal);
            setShowFacturasModal(!showFacturasModal);
            setIsTotalPagarShow(!isTotalPagarShow);
        }
        else {
            alert("Por favor,Elija facturas a pagar");
        }
    }

    const handleSubMenuEfectivo = () => {
        setIsSubMenuEfectivoOpen(!isSubMenuEfectivoOpen);
    }

    const handleSubMenuTarjeta = () => {
        setIsSubMenuTarjetaOpen(!isSubMenuTarjetaOpen);
    }

    const handleShowInformeModal = () => {
        setShowInformeModal(!showInformeModal);
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


    const obtenerCajas = async () => {
        return new Promise((resolve, reject) => {
            const cajaApi = new CajaApi(user.token);
            cajaApi
                .getCajas()
                .then((datos) => {
                    const filtrarCajasDisponibles = datos?.filter(
                        (caja) => caja?.estado === "CERRADO"

                    );
                    setCajasDisponibles(filtrarCajasDisponibles);
                    resolve(); // Resolver la promesa una vez que se completó la tarea
                })
                .catch((error) => {
                    console.error("Error al obtener las cajas:", error);
                    reject(); // Rechazar la promesa en caso de error

                });
        });
    };

    const obtenerFacturas = () => {
        const facturaApi = new FacturasApi(user.token);
        facturaApi.obtenerFacturas()
            .then((datos) => {
                const facturasVentaPendientes = datos.filter((factura) => {
                    return factura.esCompra === "VENTA" && factura.pagado === "PENDIENTE";
                });

                // Realizar algo con las facturas filtradas
                setFacturas(facturasVentaPendientes);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener las facturas:", error);
            });
    };



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

    const obtenerInformeCaja = (id) => {
        console.log(id)
        const informeApi = new InformeApi(user.token);
        informeApi.getInformeCaja(id)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setInformeCaja(datos);

            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los informes de caja:", error);
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
    const obtenerMonto = (id) => {

        const cajaApi = new CajaApi(user.token);

        cajaApi.getMontoCaja(id)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setMontoTeorico(datos.montoTeorico);
                localStorage.setItem('montoTeorico', datos.montoTeorico);
                const valorLocalStorage = localStorage.getItem('montoTeorico');
                setMontoTeoricoLs(valorLocalStorage)
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los montos:", error);
            })


    }


    const handleAbrirCajaModal = () => {
        setShowAbrirCajaModal(true);

    }

    const formAbrirCaja = (data) => {
        const montoAperturaNumerico = montoApertura.replace(/[^\d]/g, '');
        if (montoAperturaNumerico < 0) {

            setMensaje("Monto no valido!!");
            return;
        }
        if (montoAperturaNumerico.trim() === '') {
            setMensaje("El monto de apertura es requerido.");
            return;
        }
        setMensaje("");
        const api = `${process.env.API_URL}api/cajas/aperturas`;

        axios.post(
            api,
            {
                cajaId: Number(data.cajaId),
                monto: parseInt(montoAperturaNumerico),
                empleadoId: Number(user.empleado_id)

            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((data) => {
                setIsCheckboxDisabled(!isCheckboxDisabled);
                setVisible(!visible);
                handleChangeComponents();
                handleClose();
                setCajaEmpleado(data.data)
                setBtnAbrirCajaVisible(!btnAbrirCajaVisible);
                setBtnCerrarCajaVisible(!btnCerrarCajaVisible);
                verCajaEmpleado();
                setMontoTeorico(data.data.monto);
                setMontoApertura("");

            })
            .catch((error) => {
                reset();
            })
            .finally(() => {
                reset();
            })
    }

    const verCajaEmpleado = () => {
        return new Promise((resolve, reject) => {
            const cajaApi = new CajaApi(user.token);
            cajaApi
                .getCajaEmpleado(user.empleado_id)
                .then((datos) => {
                    localStorage.setItem('cajaEmpleado', JSON.stringify(datos));
                    setCajaEmpleado(datos);
                    setIsAbierto(true);
                    setIsCheckboxDisabled(true);
                    setVisible(true);
                    setAreComponentsEnabled(true)
                    handleClose();
                    resolve(); // Resolver la promesa una vez que se completó la tarea
                })
                .catch((error) => {
                    console.error("Error al obtener las cajas:", error);
                    reject(); // Rechazar la promesa en caso de error
                })
        });
    };

    useEffect(() => {
        const storedCajaEmpleado = localStorage.getItem('cajaEmpleado');
        if (storedCajaEmpleado) {
            const parsedCajaEmpleado = JSON.parse(storedCajaEmpleado);
            setCajaEmpleado(parsedCajaEmpleado);
            obtenerMonto(parsedCajaEmpleado.cajas_id);
            setBtnAbrirCajaVisible(!btnAbrirCajaVisible);
            setBtnCerrarCajaVisible(!btnCerrarCajaVisible);
            setIsAbierto(true);
            setIsCheckboxDisabled(true);
            setVisible(true);
            setAreComponentsEnabled(true);
        } else {
            obtenerCajas();
        }
    }, []);

    const formClienteSubmit = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/guardar/`;
        const token = user.token

        handleClienteModal();
        axios.post(
            api,
            {
                ...data,
                credito: 0,
                credito_maximo: 0,

            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Cliente Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                resetCliente();
                obtenerClientes();
            })

    }


    const handleFiltrar = (filtro) => {
        setIsBuscar(true);
        const facturaApi = new FacturasApi(user.token);
        facturaApi.filterFacturasVentasListar(filtro)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setListaFacturasFiltradas(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al filtrar las facturas:", error);
            })


    }


    const formatearEmpleado = (id) => {
        const empleado = empleados?.find(empleado => empleado.id === id);
        return empleado?.apellido;
    }


    const filtrarPorRuc = (valor) => {
        const datoCliente = clientes.find(cliente => cliente?.ruc === valor);
        setClientesSearchValue(datoCliente?.nombre);
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
        setRucCliente(cliente?.ruc);

        setDatosCliente(cliente);
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


    const handleGuardarProductoFactura = (items) => {
        if (items.length > 0) {
            setGuardarProductosFactura([...items]);
        }
        else {
            // Si el producto no existe, agregarlo al arreglo
            setGuardarProductosFactura([...guardarProductosFactura, items]);
        }
    }



    const handleAgregarDetalle = (detalle) => {
        const crearFactura = {
            cantidad: Number(detalle.cantidad),
            producto_id: Number(detalle.id),
            servicio_id: 0,
        };

        if (detalle.cantidad > 0) {
            const productoExistenteIndex = carrito.findIndex((item) => item.id === detalle.id);

            if (productoExistenteIndex !== -1 && isEditar) {
                // Si el producto existe y se está editando, actualizar la cantidad
                const carritoActualizado = [...carrito];
                carritoActualizado[productoExistenteIndex] = {
                    ...carrito[productoExistenteIndex],
                    cantidad: Number(detalle.cantidad),
                };

                setCarrito(carritoActualizado);
            } else if (productoExistenteIndex !== -1 && !isEditar) {
                // Si el producto existe pero no se está editando, incrementar la cantidad
                const carritoActualizado = [...carrito];
                carritoActualizado[productoExistenteIndex] = {
                    ...carrito[productoExistenteIndex],
                    cantidad: carrito[productoExistenteIndex].cantidad + Number(detalle.cantidad),
                };

                setCarrito(carritoActualizado);
            } else {
                // Si el producto no existe, agregarlo al arreglo
                setCarrito([...carrito, detalle]);
            }

            handleGuardarProductoFactura([...guardarProductosFactura, crearFactura]);
        }

        setProductosSearchValue("");
        setCantidad("");
    };


    const handleEditProductoCarrito = (id) => {
        const productoActualizado = carrito.find((c) => c.id === id);
        setIsEditar(true);
        setProductosSearchValue(productoActualizado?.nombre);
        setCantidad(productoActualizado.cantidad);
    };

    const handleDeleteProductoCarrito = (id) => {
        const carritoActualizado = carrito.filter(c => c.id !== id);
        setCarrito(carritoActualizado);
    }

    const guardarFacturacion = () => {
        if (carrito.length > 0 && datosCliente.nombre !== "") {
            if (!user) return
            const api = `${process.env.API_URL}api/factura/guardarVentar/`;
            const token = user.token;

            axios.post(
                api,
                {
                    proveedorId: 0,
                    clienteId: datosCliente.id,
                    pagado: "PENDIENTE",
                    detalles: guardarProductosFactura
                },
                { headers: { "Authorization": `Bearer ${token}` } }
            )
                .then((response) => {
                    toast.success('Factura Agregado');
                })
                .catch((error) => {

                    toast.error('No se pudo agregar!"');
                })
                .finally(() => {
                    setClientesSearchValue("");
                    setRucCliente("");
                    setProductosSearchValue("");
                    setCarrito([]);
                    setCantidad("");
                });
        } else {
            alert("Por favor complete los campos!!")
        }

    }

    const actualizarFactura = (id, facturaActualizada) => {
        //Pasamos el id de la factura
        if (id !== undefined || id !== null) {
            if (!user) return
            const api = `${process.env.API_URL}api/factura/actualizar/${id}`
            const token = user.token;
            const json = {
                id: id,
                ...facturaActualizada
            }
            axios.post(
                api,
                json,
                { headers: { "Authorization": `Bearer ${token}` } }
            )
                .then((response) => {
                    toast.success('Factura Agregado');
                })
                .catch((error) => {
                    toast.error('No se pudo agregar!"');
                })
                .finally(() => {
                    setClientesSearchValue("");
                    setRucCliente("");
                    setProductosSearchValue("");
                    setCarrito([]);
                    setCantidad("");
                });
        } else {
            alert("Por favor complete los campos!!")
        }


    }

    const handleCerrarCaja = () => {
        const montoCierreFormat = montoFormateado.replace(/[^\d]/g, '');
        if (montoCierreFormat < 0) {

            setMensaje("Monto no valido!!");
            return;
        }
        if (montoCierreFormat.trim() === '') {
            setMensaje("El monto de cierre es requerido.");
            return;
        }

        setMensaje("");
        const diferencia = montoCierreFormat - montoTeorico;
        const json = {

            cajaId: cajaEmpleado.cajas_id,
            montoTeorico: montoTeorico.montoTeorico,
            montoReal: montoCierreFormat,
            diferencia: diferencia,
            empleadoAutorizanteId: user.empleado_id
        }
        const api = `${process.env.API_URL}api/cajas/arqueo`;
        const token = user.token;
        axios.post(
            api,
            json,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                handleCerrarCajaModal()
                handleShowInformeModal();
                obtenerInformeCaja(cajaEmpleado.cajas_id);
                setBtnCerrarCajaVisible(!btnCerrarCajaVisible);
                setBtnAbrirCajaVisible(!btnAbrirCajaVisible);
                setAreComponentsEnabled(false);
                setVisible(false)
                setCajaEmpleado([])
                localStorage.removeItem('cajaEmpleado');
                setMontoTeoricoLs([])
                setCarrito([]);
                setRucCliente("");
                setClientesSearchValue("");
                setMontoTeorico([]);
                obtenerCajas();
                setMontoFormateado("")

            })
            .catch((error) => {
                console.log(error)
            })
    }


    const handleMontoChange = (event) => {
        const valor = event.target.value;
        if (valor === "") {
            setMontoFormateado(""); // Establecer un valor predeterminado cuando el input está vacío
            return;
        }

        // Eliminar los separadores de miles y el símbolo de moneda
        const valorSinFormato = valor.replace(/\D/g, '');
        // Convertir el valor a un número entero
        const valorNumerico = parseInt(valorSinFormato, 10);

        if (isNaN(valorNumerico)) {
            setMontoFormateado(""); // Establecer un valor predeterminado si el valor no es numérico
        } else {
            // Formatear el valor numerico utilizando la función formatearDinero
            const valorFormateado = formatearDinero(valorNumerico);
            setMontoFormateado(valorFormateado);
        }
    };




    const comprobarFacturasCliente = (id) => {
        if (carrito.length > 0 && clientesSearchValue.length > 0) {
            const facturasCliente = facturas.find(factura => factura.cliente_id === id);
            if (facturasCliente !== undefined) {
                // Obtener los datos anteriores de la factura
                const facturaAnterior = facturasCliente;
                const detallesAnteriores = facturaAnterior.detalles;

                // Crear un nuevo arreglo de detalles con la estructura deseada
                const detalleAnterior = detallesAnteriores.map((detalle) => ({
                    cantidad: Number(detalle.cantidad),
                    producto_id: Number(detalle.producto_id),
                    servicio_id: 0,
                }));



                // Agregar los nuevos detalles al arreglo
                const detallesNuevos = guardarProductosFactura.map((detalle) => ({
                    cantidad: Number(detalle.cantidad),
                    producto_id: Number(detalle.producto_id),
                    servicio_id: 0,
                }));

                // Combinar los detalles anteriores y nuevos
                const detallesCombinados = [...detalleAnterior, ...detallesNuevos];


                // Crear el nuevo objeto de factura con los datos anteriores y los nuevos detalles
                const facturaActualizada = {
                    proveedorId: 0,
                    clienteId: facturaAnterior.cliente_id,
                    pagado: facturaAnterior.pagado,
                    detalles: detallesCombinados,
                };


                actualizarFactura(facturaAnterior.id, facturaActualizada)
            }
            else {
                //Crear nueva factura
                guardarFacturacion()

            }
        } else {
            alert("completar los campos");
        }

    }

    const formatearCliente = (id) => {
        const cliente = clientes?.find(cliente => cliente.id === id);
        return cliente?.nombre;
    }

    const handleCheckboxChange = (id) => {
        setFacturaSeleccionada((prevState) =>
            prevState.includes(id) ? prevState.filter((selectedId) => selectedId !== id) : [...prevState, id]
        );
    };

    const handleMontoAperturaChange = (event) => {
        const valor = event.target.value;

        if (valor === "") {
            setMontoApertura(""); // Establecer un valor predeterminado cuando el input está vacío
            return;
        }

        // Eliminar los separadores de miles y el símbolo de moneda
        const valorSinFormato = valor.replace(/\D/g, '');
        // Convertir el valor a un número entero
        const valorNumerico = parseInt(valorSinFormato, 10);

        if (isNaN(valorNumerico)) {
            setMontoApertura(""); // Establecer un valor predeterminado si el valor no es numérico
        } else {
            // Formatear el valor numerico utilizando la función formatearDinero
            const valorFormateado = formatearDinero(valorNumerico);
            setMontoApertura(valorFormateado);
        }
    };




    const DetallesTabla = ({ facturas }) => {
        // Ordenar las facturas por ID en orden descendente
        const facturasOrdenadas = facturas.sort((a, b) => b.id - a.id);
        return (
            <div className="mt-2 scrollable-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className="text-center">Nro. Factura</th>
                            <th className="text-center">Cliente</th>
                            <th className="text-center">RUC</th>
                            <th className="text-center">Fecha</th>
                            <th className="text-center">Estado</th>
                            <th className="text-center">Total</th>
                            <th className="text-center">Seleccionar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isBuscar ? (
                            listaFacturasFiltradas.map((factura, index) => (
                                <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                    <td className="text-center align-middle">{factura.numero_factura}</td>
                                    <td className="text-center align-middle">{formatearCliente(factura.cliente_id)}</td>
                                    <td className="text-center align-middle">{factura.ruc}</td>
                                    <td className="text-center align-middle">{formatearFecha(factura.fecha)}</td>
                                    <td className="text-center align-middle">{factura.pagado}</td>
                                    <td className="text-center align-middle">{formatearDinero(factura.precio_total)}</td>
                                    <td className="text-center flex justify-center items-center">
                                        <input
                                            checked={facturaSeleccionada.includes(factura.id)}
                                            onChange={() => {
                                                handleCheckboxChange(factura.id);
                                            }}
                                            type="checkbox"
                                        />
                                    </td>
                                </tr>
                            ))
                        ) : (
                            facturasOrdenadas.map((factura, index) => (
                                <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                    <td className="text-center align-middle">{factura.numero_factura}</td>
                                    <td className="text-center align-middle">{formatearCliente(factura.cliente_id)}</td>
                                    <td className="text-center align-middle">{factura.ruc}</td>
                                    <td className="text-center align-middle">{formatearFecha(factura.fecha)}</td>
                                    <td className="text-center align-middle">{factura.pagado}</td>
                                    <td className="text-center align-middle">{formatearDinero(factura.precio_total)}</td>
                                    <td className="text-center flex justify-center items-center">
                                        <input
                                            checked={facturaSeleccionada.includes(factura.id)}
                                            onChange={() => {
                                                handleCheckboxChange(factura.id);
                                            }}
                                            type="checkbox"
                                        />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

            </div>
        );
    };

    const FacturasPagar = ({ facturas }) => {
        // Ordenar las facturas por ID en orden descendente
        const facturasOrdenadas = facturas?.sort((a, b) => b.id - a.id);
        return (
            <div className="mt-2 scrollable-table-container">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Nro. Factura</th>
                            <th>Cliente</th>
                            <th>RUC</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {facturasOrdenadas?.map((factura, index) => (
                            <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{factura.numero_factura}</td>
                                <td >{formatearCliente(factura.cliente_id)}</td>
                                <td >{factura.ruc}</td>
                                <td >{formatearFecha(factura.fecha)}</td>
                                <td>{factura.pagado}</td>
                                <td>{formatearDinero(factura.precio_total)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        );
    };

    const listadoFacturas = () => {
        const facturasSeleccionadas = facturas.filter((factura) =>
            facturaSeleccionada.includes(factura.id)
        );
        const facturasIds = facturasSeleccionadas.map((factura) => factura.id);

        setListaFacturasPagar(facturasSeleccionadas);
        setFacturasId(facturasIds);
        const sumaTotal = facturasSeleccionadas.reduce(
            (total, factura) => total + factura.precio_total,
            0
        );
        setTotalPagarFacturas(sumaTotal);
    };


    const realizarTransaccion = () => {
        if (isSubMenuEfectivoOpen && isSubMenuTarjetaOpen) {
            const montoRestante = totalPagarFacturas - montoEfectivo;
            setMontoTarjeta(montoRestante);
            const montoTotal = montoEfectivo + montoTarjeta;
            setMontoTotal(montoTotal);

            const transaccionEfectivo = {
                monto: Number(montoEfectivo),
                descripcion: "Pago en efectivo",
                esCompra: "VENTA",
                formaPago: "EFECTIVO",
            };
            const transaccionTarjeta = {
                monto: Number(montoTarjeta),
                descripcion: "Pago en tarjeta",
                esCompra: "VENTA",
                formaPago: "TARJETA",
            };

            setTransacciones([...transacciones, transaccionEfectivo]);
            setTransacciones([...transacciones, transaccionTarjeta]);

        } else if (isSubMenuEfectivoOpen) {
            if (montoEfectivo >= totalPagarFacturas && montoEfectivo > 0) {
                const vuelto = -(montoEfectivo - totalPagarFacturas);
                setMontoTotal(totalPagarFacturas);
                setVuelto(vuelto);

                const transaccionEfectivo = {
                    monto: Number(montoEfectivo),
                    descripcion: "Pago en efectivo",
                    esCompra: "VENTA",
                    formaPago: "EFECTIVO",
                };

                setTransacciones([...transacciones, transaccionEfectivo]);


            } else {
                setIsMostrarVuelto(false);
                alert("Monto insuficiente");
                return;
            }
        } else if (isSubMenuTarjetaOpen) {
            setMontoTarjeta(totalPagarFacturas);
            setMontoTotal(totalPagarFacturas);

            const transaccionTarjeta = {
                monto: Number(montoTarjeta),
                descripcion: "Pago en tarjeta",
                esCompra: "VENTA",
                formaPago: "TARJETA",
            };


            setTransacciones([...transacciones, transaccionTarjeta]);

        }
        formTransaccion()
    };

    const formTransaccion = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/pagos`;
        const token = user.token
        const json = {
            cajaId: cajaEmpleado.cajas_id,
            precioTotalFactura: totalPagarFacturas,
            pagoTotal: montoTotal,
            facturasIds: facturasId,
            movimientoDetalles: transacciones,
        }
        axios.post(
            api,
            json,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Factura Pagada');
                handleMetodoPagoModal()
                setShowFacturasModal(false);
                setMontoTarjeta("");
                setMontoEfectivo("");
                setIsSubMenuEfectivoOpen(false);
                setIsSubMenuTarjetaOpen(false);
                setTransacciones([])
                imprimirFacturas(facturasId);
                obtenerMonto(cajaEmpleado.cajas_id)

                // Actualizar el valor de montoTeoricoLs sumando montoTotal
                setMontoTeorico((prevMonto) => prevMonto + montoTotal);
            })
            .catch((error) => {
                toast.error('No se pudo Pagar!"');
                console.log(error);
                setMontoTarjeta("")
                setMontoEfectivo("")

            })

    }


    const imprimirFacturas = (facturasIds) => {
        const facturaApi = new FacturasApi(user?.token);

        facturasIds.forEach((id) => {
            facturaApi
                .imprimirFactura(id)
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                })
                .catch((error) => {
                    // Manejar el error
                    console.error(error);
                });
        });
    };





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
                                        <li className="border-y-1 border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickClienteRow(cliente.id)} key={cliente.id}>
                                            Cliente: {cliente.nombre} <span className="ml-10">RUC: {cliente.ruc}</span></li>

                                    ))}
                                </ul>
                            )}

                        </div>

                    </div>
                    <div className="w-1/4 pr-20">
                        <div>
                            <p className="text-2xl font-bold">Monto Actual en Caja: {formatearDinero(montoTeorico)}</p>
                        </div>

                        <div className="flex justify-center gap-3">

                            <button
                                type="button"
                                className={`transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    }  inline-block rounded bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#14a44d] transition duration-150 ease-in-out hover:bg-success-600 hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:outline-none focus:ring-0 active:bg-success-700 active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(20,164,77,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)]`}

                                onClick={() => handleFacturasModal()}
                            >
                                Ver Facturas
                            </button>
                            <button
                                type="button"
                                className={`transition-opacity duration-500 ease-in-out ${visible ? 'opacity-100 visible' : 'opacity-0 invisible'
                                    }  inline-block rounded bg-success px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#14a44d] transition duration-150 ease-in-out hover:bg-success-600 hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:bg-success-600 focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] focus:outline-none focus:ring-0 active:bg-success-700 active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.3),0_4px_18px_0_rgba(20,164,77,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(20,164,77,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(20,164,77,0.2),0_4px_18px_0_rgba(20,164,77,0.1)]`}

                                onClick={() => comprobarFacturasCliente(datosCliente.id)}
                            >
                                Facturar Venta

                            </button>
                            <button
                                type="button"
                                class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                onClick={() => handleAbrirCajaModal()}
                                hidden={btnAbrirCajaVisible}

                            >
                                Abrir Caja
                            </button>

                            <button
                                type="button"
                                class="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                                onClick={() => handleCerrarCajaModal()}
                                hidden={btnCerrarCajaVisible}



                            >
                                Cerrar Caja
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col pl-12 mt-1 gap-3 w-6/7">
                    <div className="flex w-1/2 gap-3 items-center">
                        <div className="w-5/12">
                            <Form.Group className="flex flex-col">
                                <Form.Label>Producto:</Form.Label>
                                <Form.Control
                                    placeholder="Producto"
                                    disabled={!areComponentsEnabled}
                                    value={productosSearchValue}
                                    onChange={handleInputProductoChange}
                                />
                            </Form.Group>
                        </div>
                        <div className="w-4/12">
                            <Form.Group className="flex flex-col">

                                <Form.Label>Cantidad:</Form.Label>
                                <Form.Control
                                    type="number"

                                    placeholder="Cantidad"
                                    disabled={!areComponentsEnabled}
                                    value={cantidad}
                                    onChange={(e) => setCantidad(e.target.value)}
                                />
                            </Form.Group>
                        </div>
                        <div className="w-3/12 pt-8">
                            <button
                                className="flex items-center justify-center bg-transparent w-12 h-12 focus:outline-none"
                                onClick={() => agregarAlCarrito()}
                                disabled={!areComponentsEnabled}
                            >
                                <LuShoppingCart className="text-black hover:text-green-800" size={30} />

                            </button>
                        </div>

                    </div>
                    {/*Menu de opciones*/}
                    <div className="fixed my-20 shadow z-50 bg-white w-80">
                        {productosSearchValue && productosFiltrados.length > 0 && (
                            <ul>
                                {productosFiltrados.map((producto) => (
                                    <li className="border-black py-2 hover:cursor-pointer hover:font-bold" onClick={() => handleClickRow(producto.id)} key={producto.id}>{producto.nombre}</li>
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
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center">Cantidad</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center">Precio unitario</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center">Subtotal</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white text-center w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 overflow-y-auto">
                                {carrito?.map((producto, index) => (
                                    <tr key={index} className="hover:bg-gray-50 hover:cursor-pointer">
                                        <td className="flex gap-3 px-6 py-4 font-normal text-gray-900 text-center">{producto.nombre}</td>
                                        <td className="text-center">{producto.cantidad}</td>
                                        <td className="text-center">{formatearDinero(producto.precioUnitario)}</td>
                                        <td className="text-center">{formatearDinero(producto.subtotal)}</td>
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
                                ))}
                            </tbody>
                        </table>

                    </div>
                </div>
                <div className="fixed bottom-12 right-48 flex justify-end">
                    <label className="text-black text-2xl font-mono">Total a pagar: {formatearDinero(totalPagar)}</label>
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
                                type="text"
                                placeholder="Monto de Apertura"
                                value={montoApertura}
                                onChange={handleMontoAperturaChange}
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
            <Modal show={showAddClienteModal} onHide={handleFacturasModal}>

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

            {/*Para listar las facturasss */}
            <Modal show={showFacturasModal} onHide={handleFacturasModal}
                backdrop="static"
                keyboard={false}
                size="xl"
            >

                <Modal.Header closeButton>
                    <Modal.Title>Lista de Facturas</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div className="w-4/5">
                                <div className="w-2/5">
                                    <Form.Group>
                                        <Form.Control
                                            type="text"
                                            placeholder="Buscar Ej.: Nombre del Cliente o RUC"
                                            value={filtroFacturas}
                                            onChange={(e) => setFiltroFacturas(e.target.value)}

                                        />
                                    </Form.Group>
                                </div>
                            </div>
                            <div>
                                <Button variant="success" onClick={handleMetodoPagoModal}>
                                    Pagar
                                </Button>
                            </div>
                        </div>
                        <div>
                            <DetallesTabla facturas={facturas} />
                        </div>
                    </div>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { handleFacturasModal(), setFacturaSeleccionada([]), setFiltroFacturas("") }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>


            {/*Para listar los Metodos de pago */}
            <Modal show={showMetodoPagoModal} onHide={handleMetodoPagoModal}
                backdrop="static"
                keyboard={false}
                size="xl"
            >

                <Modal.Header closeButton>
                    <Modal.Title>Elija el Metodo(s) de Pago(s)</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex flex-col">
                        <div className="flex justify-between">
                            <div>
                                <Form.Label className="text-xl mb-3">Por favor, Seleecione opcion</Form.Label>
                                <div className="flex">
                                    <li className="flex w-full md:w-auto items-start gap-3">
                                        <div className="flex flex-col">
                                            <button
                                                onClick={handleSubMenuEfectivo}
                                                className={`flex justify-center group items-center space-x-4 group border-l-4  border-blue-700 border-l-blue-700 ${isSubMenuEfectivoOpen ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-black "
                                                    } rounded px-2 py-2 w-full md:w-52`}
                                            >
                                                <p className="text-lg mb-0 group-hover:text-white">Efectivo</p>
                                            </button>
                                            {isSubMenuEfectivoOpen && (
                                                <ul className="mt-2">
                                                    <li>
                                                        <div className="mt-4">
                                                            <Form.Group>
                                                                <Form.Label className="text-xl">
                                                                    Ingrese Cantidad
                                                                </Form.Label>
                                                                <Form.Control
                                                                    type="number"
                                                                    placeholder="Ingresar Monto"
                                                                    value={montoEfectivo}
                                                                    onChange={(e) => setMontoEfectivo(e.target.value)}
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        {isMostrarVuelto ? (<div className="mt-2">
                                                            <Form.Label className="text-xl">
                                                                Vuelto: {vueltoMostrar}
                                                            </Form.Label>
                                                        </div>) : null}
                                                    </li>
                                                </ul>
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <button
                                                onClick={handleSubMenuTarjeta}
                                                className={`flex justify-center group items-center space-x-4 group border-l-4  border-blue-700 border-l-blue-700 ${isSubMenuTarjetaOpen ? "bg-blue-700 text-white" : "hover:bg-blue-700 text-black "
                                                    } rounded px-2 py-2 w-full md:w-52`}
                                            >
                                                <p className="text-lg mb-0 group-hover:text-white">Tarjeta</p>
                                            </button>
                                        </div>

                                    </li>
                                </div>
                            </div>
                            <div className="mt-2">
                                <Button variant="success" onClick={realizarTransaccion}>
                                    Realizar Pago
                                </Button>
                            </div>

                        </div>
                        <div className="mt-5">
                            <FacturasPagar facturas={listaFacturasPagar} />
                        </div>
                        <div className="mt-5 bottom-44 right-56 flex justify-end">
                            <label className="text-black text-2xl font-mono">{
                                isTotalPagarShow && (
                                    <p>Total venta: {formatearDinero(totalPagarFacturas)}</p>
                                )
                            }</label>
                        </div>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { handleMetodoPagoModal(), setIsSubMenuEfectivoOpen(false), setIsSubMenuTarjetaOpen(false), setMontoEfectivo("") }}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>


            {/*Modal para cerrar caja*/}
            <Modal show={showCerrarCajaModal} onHide={handleCerrarCajaModal} centered>

                <Modal.Header>
                    <Modal.Title>
                        Cerrar Caja
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mensaje && <Mensaje tipo="error">{mensaje}</Mensaje>}
                    <div className="flex justify-between">
                        <div className="flex-col">
                            <p>
                                <span className="font-bold">Cajero:</span> {user?.username} {" "} {formatearEmpleado(user?.empleado_id)}
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

                    <Form.Label className="font-bold">Monto Teorico: {formatearDinero(montoTeorico)}</Form.Label>
                    <Form.Group>
                        <Form.Label className="font-bold">Monto de Cierre de Caja</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Monto de Cierre"
                            value={montoFormateado}
                            onChange={handleMontoChange}
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" type="submit" onClick={() => { handleCerrarCajaModal(), setMontoReal([]) }}>
                        Salir
                    </Button>
                    <Button variant="success" type="submit" onClick={handleCerrarCaja}>
                        Cerrar Caja
                    </Button>
                </Modal.Footer>
            </Modal>



            {/*Modal para imprimir informe*/}
            <Modal show={showInformeModal} onHide={handleShowInformeModal} centered>

                <Modal.Header closeButton>
                    <Modal.Title>
                        Imprimir Informe
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InformeCaja data={informeCaja} fecha={fecha} />
                </Modal.Body>
            </Modal>



        </Layout >
    );
};

export default Caja;
