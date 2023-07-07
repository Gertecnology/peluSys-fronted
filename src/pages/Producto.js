import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { IoMdAddCircleOutline } from "react-icons/io"
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from 'next/router'
import ProductoApi from "./api/ProductoApi";
import ProveedorApi from "./api/ProveedorApi";
import MarcaApi from "./api/MarcaApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import Proveedor from "./Proveedor";


const PAGE_SIZE = 10;

const Producto = ({ }) => {
    const ruta = useRouter();

    const { user } = useContext(AuthContext);

    const form2 = useForm();
    const [productos, setProductos] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [proveedores, setProveedores] = useState([]);
    const [marcas, setMarcas] = useState([]);
    const [valor, setValor] = useState("");
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues, control,
    } = useForm();
    const { register: registerForm2, handleSubmit: handleSubmitForm2, formState: { errors: errorform2 }, setValue: setValueForm2, reset: resetForm2, getValues: getValuesForm2,
    } = form2;
    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showNuevaMarcaModal, setShowNuevaMarcaModal] = useState(false);
    const [showNuevoProveedorModal, setShowNuevoProveedorModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState(undefined);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);
    const [iva, setIva] = useState(
        [
            { id: 1, value: 0.1 },
            { id: 2, value: 0.05 }
        ]
    )

    const [nombreMarca, setNombreMarca] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)




    useEffect(() => {
        obtenerProductos();
        obtenerProveedores();
        obtenerMarcas();
        console.log(productos)
    }, [user]);


    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrar(valor)
        }
        else {
            actualizar();
        }
    }, [valor])

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    const paginatedProducto = productos.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const obtenerProductos = () => {
        if (user && user.token) {
            const productoApi = new ProductoApi(user.token);

            productoApi.getProducto()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setProductos(datos.content);
                    setTotalPages(datos.totalPages);

                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener los productos:", error);
                });
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


    const obtenerMarcas = () => {

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

    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }



    const handleModal = () => {
        setShowModal(!showModal);
        setIsEditar(false);


    };

    const handleFiltrar = (filtro) => {
        setCargando(true);
        setIsBuscar(true);

        const productoApi = new ProductoApi(user.token);
        productoApi.filterProducto(filtro)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setProductosFiltrados(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los datos:", error);
            });

        setTimeout(() => {
            setCargando(false);
        }, 500);
    }


    const formSubmit = (data) => {
        console.log(data)
        handleModal()
        const api = `${process.env.API_URL}api/producto/guardar`;
        axios.post(
            api,
            {

                nombre: data.nombre,
                detalle: data.detalle,
                precioVenta: Number(data.precioVenta),
                precioCompra: Number(data.precioCompra),
                tipo_iva: Number(data.tipo_iva),
                id_marca: Number(data.id_marca),
                id_proveedor: Number(data.id_proveedor),

            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Producto Agregado');
                console.log(response.data);
            })
            .catch((error) => {
                toast.error('No se pudo agregar el producto!"');
                reset();
            })
            .finally(() => {
                obtenerProductos();
                reset();
                setShowNuevaMarcaModal(false);
                setShowNuevoProveedorModal(false);

            })

    }


    const handleSetEditar = (id) => {

        const producto = productos?.find(p => p.id === id);
        const marca = marcas?.find(m => m.id === producto.id_marca);
        const proveedor = proveedores?.find(p => p.id === producto.id_proveedor);
        setProductoEditar(producto);
        handleModal();
        setIsEditar(true);
        setValue("nombre", producto.nombre);
        setValue("marca", marca.id);
        setValue("proveedor", proveedor.id);
        setValue("precioVenta", producto.precioVenta);
        setValue("precioCompra", producto.precioCompra);
        setValue("detalle", producto.detalle);
        setValue("iva", producto.tipo_iva);
    }

    const handleEditar = (data) => {
        console.log(data)
        handleModal();
        const api = `${process.env.API_URL}api/producto/actualizar/${productoEditar.id}`;
        axios.post(api, {
            id: productoEditar.id,
            ...data,
        },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                console.log(response.data)
                toast.success('Producto Actualizado');
                obtenerProductos();
                reset();
            })
            .catch((error) => {
                console.log(error.response.data)
                toast.error('No se pudo actualizar!"');
                reset();

            })
            .finally(() => {
                setProductoEditar(undefined);
                setIsEditar(false);
                setShowDetalleModal(false);
                setShowNuevaMarcaModal(false);
                setShowNuevoProveedorModal(false);
                setValor("");



            })


    }



    const handleSetDelete = (id) => {
        setShowDeleteModal(true);
        setIdEliminar(id);
    }

    const handleDelete = (id) => {
        const api = `${process.env.API_URL}api/producto/eliminar/${id}`;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${user.token}` } })
            .then(() => {
                toast.info('Producto Eliminado');
                obtenerProductos();
            })
            .catch(() => {
                toast.error('No se pudo Eliminar!');
            })
            .finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
                setShowDetalleModal(false);
            })

    }

    const handleClose = () => setShowDetalleModal(false);
    const handleRowClick = (id) => {
        const item = productos.find(p => p.id === id);
        setProductoSeleccionado(item);
        setShowDetalleModal(true)

    }

    const convertidorMarca = (id) => {
        const marca = marcas?.find(m => m.id === id);
        return marca?.nombre
    }

    const convertidorProveedor = (id) => {
        const proveedor = proveedores?.find(p => p.id === id);
        return proveedor?.nombre
    }

    const convertidorIva = (value) => {
        if (value === 0.1) {
            return 10;
        }
        else {
            return 5;
        }
    }

    const marcaSubmit = () => {
        const api = `${process.env.API_URL}api/marca/guardar/`;

        axios.post(
            api,
            {
                nombre: nombreMarca,

            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Marca Agregada con Exito');
            })
            .catch((error) => {
                toast.error('No se pudo agregar la Marca!!');
            })
            .finally(() => {
                obtenerMarcas();
                setShowModal(true);
                setNombreMarca("");
            })

    }

    // guardo un nuevo proveedor
    const proveedorSubmit = (data) => {
        const api = `${process.env.API_URL}api/proveedores/guardar`;

        axios.post(
            api,
            {
                nombre: data.nombre,
                ruc: data.ruc,
                telefono: data.telefono,
                direccion: data.direccion,
                pais: data.pais,

            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Proveedor Agregado con Exito');
            })
            .catch((error) => {
                toast.error('No se pudo agregar el Proveedor!"');
            })
            .finally(() => {
                obtenerProveedores();
                resetForm2();
                setShowNuevoProveedorModal(false);
                setShowModal(true);
            })

    }



    return (
        <Layout pagina={"Producto"} titulo={"CRUD Producto"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={() => { handleModal(), setShowDetalleModal(false) }}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header>
                        <Modal.Title> {isEditar ? "Editar Producto" : "Agregar Producto"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del producto"
                                isInvalid={errors.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Marca</Form.Label>

                            <div className="flex gap-2">
                                <Form.Select {...register("id_marca", { required: true })}

                                >
                                    <option selected key={""} value={""}>Selecciona una opción</option>

                                    {marcas?.map((marca) => (
                                        <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                    ))}
                                </Form.Select>
                                <Button variant="success" onClick={() => { setShowNuevaMarcaModal(true), setShowModal(false), setShowDetalleModal(false) }}>
                                    +
                                </Button>
                            </div>

                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control

                                {...register("detalle", {
                                    required: true
                                })}

                                type="text"
                                placeholder="Descripción del producto"
                                isInvalid={errors.detalle}
                            />
                        </Form.Group>


                        <Form.Group>
                            <Form.Label>Precio de Compra</Form.Label>
                            <Form.Control
                                {...register("precioCompra", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Precio de Compra del producto"
                                isInvalid={errors.precioCompra}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Precio de Venta</Form.Label>
                            <Form.Control
                                {...register("precioVenta", {
                                    required: true
                                })}
                                type="number"

                                placeholder="Precio de Venta del producto"
                                isInvalid={errors.precioVenta}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Proveedor</Form.Label>
                            <div className="flex gap-2">
                                <Form.Select {...register("id_proveedor", { required: true })}
                                >
                                    <option selected key={""} value={""}>Selecciona una opción</option>
                                    {proveedores?.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                                    ))}
                                </Form.Select>
                                <Button variant="success" onClick={() => { setShowNuevoProveedorModal(true), setShowModal(false), setShowDetalleModal(false) }}>
                                    +
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>IVA</Form.Label>
                            <Form.Select {...register("tipo_iva", { required: true })}
                            >
                                <option defaultValue="" disabled selected hidden>IVA</option>

                                {iva?.map((iva) => (
                                    <option key={iva.id} value={iva.value}>{convertidorIva(iva.value)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { handleModal(), setShowDetalleModal(false), reset() }}>
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
                        <Form.Control
                            placeholder="Has tu busqueda aquí"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                        />
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
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Marca</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Precio Compra</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Precio Venta</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">IVA</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        productosFiltrados?.map((producto, index) => (
                                            <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(producto.id)}>
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{producto.nombre}</td>
                                                <td>{convertidorMarca(producto.id_marca)}</td>
                                                <td>{producto.precioCompra} Gs.</td>
                                                <td>{producto.precioVenta} Gs.</td>
                                                <td>{convertidorIva(producto.tipo_iva)} %</td>
                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link" onClick={() => handleSetEditar(producto.id)}>
                                                            <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                        <Button size="sm" variant="link" onClick={() => handleSetDelete(producto.id)}>
                                                            <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedProducto.map((producto, index) => (
                                        <tr key={index} className="hover:bg-gray-50" onClick={() => handleRowClick(producto.id)}>
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{producto.nombre}</td>
                                            <td>{convertidorMarca(producto.id_marca)}</td>
                                            <td>{producto.precioCompra} Gs.</td>
                                            <td>{producto.precioVenta} Gs.</td>
                                            <td>{convertidorIva(producto.tipo_iva)} %</td>
                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(producto.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(producto.id)}>
                                                        <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                </div>
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

            <Modal show={(showDeleteModal || showModal) ? "" : showDetalleModal} onHide={(handleClose)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 className="text-3xl font-bold">{productoSeleccionado.nombre}</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-xl font-light">Descripción del Producto: <span className="text-2xl font-normal">{productoSeleccionado.detalle}</span></p>
                    <p className="text-xl font-light">Proveedor: <span className="text-2xl font-normal">{convertidorProveedor(productoSeleccionado.id_proveedor)}</span></p>

                </Modal.Body>

            </Modal>


            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false), setShowDetalleModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Producto</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar el Producto?</p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false)
                        setIdEliminar(-1)
                        setShowDetalleModal(false)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showNuevaMarcaModal} onHide={() => { setShowNuevaMarcaModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Agregar Nueva Marca</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <Form.Group>
                        <Form.Label>Nombre de la Marca</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Ingrese el nombre de la Marca"
                            value={nombreMarca}
                            onChange={e => setNombreMarca(e.target.value)}

                        />
                    </Form.Group>



                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowNuevaMarcaModal(false), setShowModal(true) }}>
                        Cerrar
                    </Button>
                    <Button variant="primary" type="submit" onClick={() => marcaSubmit()}>
                        Guardar
                    </Button>
                </Modal.Footer>
            </Modal>




            <Modal show={showNuevoProveedorModal} onHide={() => { setShowNuevoProveedorModal(false), setShowModal(true), reset() }}>
                <Form
                    onSubmit={handleSubmitForm2(proveedorSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                        <Form.Group>
                            <Form.Label>Nombre del Proveedor</Form.Label>
                            <Form.Control
                                {...registerForm2("nombre", {
                                    required: true
                                })}
                                isInvalid={errorform2.nombre}
                                type="text"
                                placeholder="Ingrese el nombre del Proveedor"

                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Dirección del Proveedor</Form.Label>
                            <Form.Control
                                {...registerForm2("direccion", {
                                    required: true
                                })}
                                placeholder="Ingrese la dirección del Proveedor"
                                isInvalid={errorform2.direccion}
                                type="text"

                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>RUC del Proveedor</Form.Label>
                            <Form.Control
                                {...registerForm2("ruc", {
                                    required: true
                                })}
                                isInvalid={errorform2.ruc}
                                type="number"
                                placeholder="Ingrese RUC del Proveedor"


                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Telefono del Proveedor</Form.Label>
                            <Form.Control
                                {...registerForm2("telefono", {
                                    required: true
                                })}
                                isInvalid={errorform2.telefono}
                                type="number"
                                placeholder="Ingrese número telefono del Proveedor"

                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>País del Proveedor</Form.Label>
                            <Form.Control
                                {...registerForm2("pais", {
                                    required: true
                                })}
                                isInvalid={errorform2.pais}
                                type="text"
                                placeholder="Ingrese País del Proveedor"

                            />
                        </Form.Group>

                            <Form.Group>
                            <Form.Label>Timbrado</Form.Label>
                            <Form.Control
                                {...registerForm2("timbrado", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Timbrado del Proveedor"
                                isInvalid={errorform2.timbrado}
                            />
                        </Form.Group>



                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { setShowNuevoProveedorModal(false), setShowModal(true) }}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Guardar
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>


        </Layout >
    );
}


export default Producto;
