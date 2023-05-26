import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { useRouter } from 'next/router'

const Producto = ({ }) => {
    const ruta = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showNuevaMarcaModal, setShowNuevaMarcaModal] = useState(false);
    const [showDetalleModal, setShowDetalleModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues, control,
    } = useForm();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState([]);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState([]);
    const [iva, setIva] = useState(
        [
            { id: 1, value: 0.1 },
            { id: 2, value: 0.05 }
        ]
    )


    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Nombre" },
            { id: 2, value: "Marca" }
        ]
    )

    const [opcionSeleccionada, setOpcionSeleccionada] = useState("")
    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);
    const [valor, setValor] = useState("");
    const [nombreMarca, setNombreMarca] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)


    useEffect(() => {
        obtenerDatos();
        obtenerMarcas();
        obtenerProveedores();
        console.log(marcas);
    }, [])

    useEffect(() => {
        actualizar();
    }, [valor])



    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }


    const obtenerDatos = () => {
        const api = `${process.env.API_URL}producto/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProductos(res.data);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const obtenerMarcas = () => {
        const api = `${process.env.API_URL}marca/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setMarcas(res.data);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const obtenerProveedores = () => {
        const api = `${process.env.API_URL}proveedores/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProveedores(res.data);

            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                console.log(proveedores)
            })

    }

    const handleModal = () => {
        setShowModal(!showModal);
        reset();
        setIsEditar(false);


    };

    // guardo un nuevo producto
    const formSubmit = (data) => {
        const token = process.env.TOKEN;
        handleModal()
        console.log(data)
        const api = `${process.env.API_URL}producto/guardar`;

        axios.post(
            api,
            {
                nombre: data.nombre,
                id_marca: data.marca,
                detalle: data.detalle,
                precio: data.precio,
                id_proveedor: data.proveedor,
                tipo_iva: data.iva,

            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Producto Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar el producto!"');
                console.log(error);
            })
            .finally(() => {
                obtenerDatos();
            })

    }




    const handleSetEditar = (id) => {
        const producto = productos.find(p => p.id === id);
        setMarcaSeleccionada(marcas.find(m => m.id === producto.id_marca));
        setProductoEditar(producto);
        handleModal();
        setValue("nombre", producto.nombre);
        setValue("proveedor", producto.id_proveedor);
        setValue("detalle", producto.detalle);
        setValue("precio", producto.precio);
        setValue("marca", marcaSeleccionada);
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, producto[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const token = process.env.TOKEN;
        const api = `${process.env.API_URL}productos/actulizar/${productoEditar.id}`;
        axios.post(api, {
            id: productoEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Producto Actualizado');
                obtenerDatos();
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo actualizar!"');
            })
            .finally(() => {
                setProductoEditar(undefined);
                setIsEditar(false);
                setShowDetalleModal(false);

            })
        handleModal();

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }

    const handleDelete = (id) => {
        const api = `${process.env.API_URL}producto/eliminar/${id}`;
        const token = process.env.TOKEN;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.info('Producto Eliminado');
                obtenerDatos();
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

    const handleFiltrar = (n) => {
        setCargando(true);
        setIsBuscar(true);

        if (parseInt(opcionSeleccionada) === 1) {
            const api = `${process.env.API_URL}producto/buscar?nombre=${n}&marca=""`;
            const token = process.env.TOKEN;
            axios.get(api,
                { headers: { "Authorization": `Bearer ${token}` } })
                .then((res) => {
                    setProductosFiltrados(res.data);
                });

        }
        else {
            const api = `${process.env.API_URL}producto/buscar?nombre=""&marca=${n}`;
            const token = process.env.TOKEN;
            axios.get(api,
                { headers: { "Authorization": `Bearer ${token}` } })
                .then((res) => {
                    setProductosFiltrados(res.data);
                });


        }
        setTimeout(() => {
            setCargando(false);
        }, 300);

    }

    const handleClose = () => setShowDetalleModal(false);
    const handleRowClick = (id) => {
        const item = productos.find(p => p.id === id);
        setProductoSeleccionado(item);
        setShowDetalleModal(true)

    }


    const converter = (value) => {
        if (value === 0.1 || value === 1) {
            return 10;
        }
        else {
            return 5;
        }
    }

    const converterMarca = (id) => {
        const marca = marcas.find(m => m.id === id);
        return marca?.nombre
    }

    const converterProveedor = (id) => {
        const proveedor = proveedores.find(p => p.id === id);
        return proveedor?.nombre
    }

    const marcaSubmit = () => {
        const token = process.env.TOKEN;
        handleModal()
        const api = `${process.env.API_URL}marca/guardar/`;

        axios.post(
            api,
            {
                nombre: nombreMarca,

            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Marca Agregada con Exito');
            })
            .catch((error) => {
                toast.error('No se pudo agregar la Marca!!!');
                console.log(error);
            })
            .finally(() => {
                obtenerMarcas();
                setShowModal(true);
                setNombreMarca("");
            })

    }

    return (
        <Layout pagina={"Producto"} titulo={"CRUD Producto"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={() => { handleModal(), setShowDetalleModal(false) }}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Producto</Modal.Title>
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
                                <Form.Select {...register("marca", { required: true })}
                                    value={marcaSeleccionada}
                                    onChange={(e) => setMarcaSeleccionada(e.target.value)}
                                >
                                    <option defaultValue="" disabled selected hidden>Seleccione una Marca</option>
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
                            <Form.Label>Detalle</Form.Label>
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
                            <Form.Label>Precio</Form.Label>
                            <Form.Control
                                {...register("precio", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Precio del producto"
                                isInvalid={errors.precio}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Proveedor</Form.Label>
                            <div className="flex gap-2">
                                <Form.Select {...register("proveedor", { required: true })}
                                >
                                    <option value="" disabled selected hidden>Seleccione un Proveedor</option>
                                    {proveedores?.map((proveedor) => (
                                        <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                                    ))}
                                </Form.Select>
                                <Button variant="success">
                                    +
                                </Button>
                            </div>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>IVA</Form.Label>
                            <Form.Select {...register("iva", { required: true })}
                            >
                                <option defaultValue="" disabled selected hidden>IVA</option>

                                {iva?.map((iva) => (
                                    <option key={iva.id} value={iva.id}>{converter(iva.value)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { handleModal(), setShowDetalleModal(false) }}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            {isEditar ? "Terminar Edición" : "Guardar"}
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>



            <div className="block">
                <div className="px-5 flex justify-between gap-3">
                    <Form.Select
                        value={opcionSeleccionada}
                        onChange={(e) => setOpcionSeleccionada(e.target.value)}
                    >

                        {opciones?.map((opcion) => (
                            <option key={opcion.id} value={opcion.id}>{opcion.value}</option>
                        ))}
                    </Form.Select>

                    <Form.Control
                        className="w-1/6"
                        placeholder="Has tu busqueda"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                    />

                    <Button variant="secondary" onClick={() => handleFiltrar(valor)}>
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Producto</Button>

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
                    <div className="px-5">
                        <Table bordered hover size="sm" className="bg-white mt-10">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Marca</th>
                                    <th>Precio</th>
                                    <th>IVA</th>
                                    <th className="w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isBuscar ? (
                                    productosFiltrados.map((producto, index) => (
                                        <tr key={index} onClick={() => handleRowClick(producto.id)}>
                                            <td>{producto.nombre}</td>
                                            <td>{converterMarca(producto.id_marca)}</td>
                                            <td>{producto.precio}</td>
                                            <td>{converter(producto.tipo_iva)}</td>
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


                                ) : (productos.map((producto, index) => (
                                    <tr key={index} onClick={() => handleRowClick(producto.id)}>
                                        <td>{producto.nombre}</td>
                                        <td>{converterMarca(producto.id_marca)}</td>
                                        <td>{producto.precio}</td>
                                        <td>{converter(producto.tipo_iva)}</td>
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
                        </Table>
                    </div>
                )}
            </div>

            <Modal show={(showDeleteModal || showModal) ? "" : showDetalleModal} onHide={(handleClose)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        <h1 className="text-3xl font-bold">{productoSeleccionado.nombre}</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-xl font-light">Detalle: <span className="text-2xl font-normal">{productoSeleccionado.detalle}</span></p>
                    <p className="text-xl font-light">Proveedor: <span className="text-2xl font-normal">{converterProveedor(productoSeleccionado.id_proveedor)}</span></p>

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
                    <       Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false)
                        setIdEliminar(-1)
                        setShowDetalleModal(false)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)} >Eliminar</Button>
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
                            isInvalid={errors.nombre}
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

        </Layout >
    );
}


export default Producto;
