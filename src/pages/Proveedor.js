import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'



const Proveedor = ({ }) => {
    const ruta = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [proveedorEditar, setProveedorEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [proveedores, setProveedores] = useState([]);
    const [proveedorFiltrados, setProveedorFiltrados] = useState([]);
    const [valor, setValor] = useState("");

    useEffect(() => {
        obtenerProveedores();
        console.log(proveedores)
    }, [])


    useEffect(() => {
        actualizar();
    }, [valor])



    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }

    const obtenerProveedores = () => {
        const api = `${process.env.API_URL}/proveedores/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProveedores(res.data);
            })
            .catch((error) => {
                console.log(error)
            });



    }

    const handleModal = () => {
        setShowModal(!showModal);
        reset();
        setIsEditar(false);


    };

    // guardo un nuevo servicio
    const formSubmit = (data) => {
        const token = process.env.TOKEN;
        console.log(data.id);
        handleModal()
        const api = `${process.env.API_URL}/proveedores/guardar`;

        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Proveedor Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                obtenerProveedores();

            })

    }

    const handleSetEditar = (id) => {
        const proveedor = proveedores.find(s => s.id === id);
        setProveedorEditar(proveedor);
        handleModal();
        setValue("ruc", proveedor.ruc);
        setValue("nombre", proveedor.nombre);
        setValue("telefono", proveedor.telefono);
        setValue("direccion", proveedor.direccion);
        setValue("pais", proveedor.pais);
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, proveedor[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const token = process.env.TOKEN;
        const api = `${process.env.API_URL}/proveedores/actualizar/${proveedorEditar.id}`;
        axios.post(api, {
            id: proveedorEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then(() => {
                toast.success('Proveedor Actualizado');
                obtenerProveedores();
            })
            .catch((error) => {
                toast.error('No se pudo actualizar!"');
            })
            .finally(() => {
                setProveedorEditar(undefined);
                setIsEditar(false);

            })
        handleModal();

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }
    const handleDelete = (id) => {
        const api = `${process.env.API_URL}/proveedores/eliminar/${id}`;
        const token = process.env.TOKEN;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.info('Proveedor Eliminado');
                obtenerProveedores();
            })
            .catch(() => {
                toast.error('No se pudo Eliminar!');
            })
            .finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })

    }

    const handleFiltrar = (n) => {
        setCargando(true);
        setIsBuscar(true);
        const api = `${process.env.API_URL}/proveedores/buscarNombre?nombre=${n}`;
        const token = process.env.TOKEN;
        axios.get(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setProveedorFiltrados(res.data);
                console.log(res.data.id)
            });
        setTimeout(() => {
            setCargando(false);
        }, 300);
    }

    return (
        <Layout pagina={"Proveedor"} titulo={"CRUD Proveedores"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Nuevo Proveedor</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Ruc</Form.Label>
                            <Form.Control
                                {...register("ruc", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Ruc del Proveedor"
                                isInvalid={errors.ruc}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del Proveedor"
                                isInvalid={errors.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control
                                {...register("telefono", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Télefono del Proveedor"
                                isInvalid={errors.telefono}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control
                                {...register("direccion", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Direccion del Proveedor"
                                isInvalid={errors.direccion}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Pais</Form.Label>
                            <Form.Control
                                {...register("pais", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Pais del Proveedor"
                                isInvalid={errors.pais}
                            />
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModal}>
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
                    <Form.Control
                        className="w-1/6"
                        placeholder="Has tu busqueda"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                    />

                    <Button variant="secondary" onClick={() => handleFiltrar(valor)}>
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Nuevo Proveedor</Button>

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
                    <div className="px-5 py-3 h-96 overflow-y-scroll">
                        <Table bordered hover size="sm" className="bg-white mt-10">
                            <thead className="sticky top-0 bg-white">
                                <tr>
                                    <th>Ruc</th>
                                    <th>Nombre</th>
                                    <th>Telefono</th>
                                    <th>Direccion</th>
                                    <th>Pais</th>
                                    <th className="w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isBuscar ? (
                                    proveedorFiltrados.map((proveedor, index) => (
                                        <tr key={index}>
                                            <td>{proveedor.ruc}</td>
                                            <td>{proveedor.nombre}</td>
                                            <td>{proveedor.telefono}</td>
                                            <td>{proveedor.direccion}</td>
                                            <td>{proveedor.pais}</td>
                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(proveedor.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(proveedor.id)}>
                                                        <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))


                                ) : (proveedores.map((proveedor, index) => (
                                    <tr key={index}>
                                        <td>{proveedor.ruc}</td>
                                        <td>{proveedor.nombre}</td>
                                        <td>{proveedor.telefono}</td>
                                        <td>{proveedor.direccion}</td>
                                        <td>{proveedor.pais}</td>
                                        <td>
                                            <div className="flex gap-2 ">
                                                <Button size="sm" variant="link" onClick={() => handleSetEditar(proveedor.id)}>
                                                    <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                </Button>
                                                <Button size="sm" variant="link" onClick={() => handleSetDelete(proveedor.id)}>
                                                    <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )))}

                            </tbody>
                        </Table>
                    </div>)}
            </div>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Proveedor</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar este Proveedor?</p>
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
        </Layout >
    );
}


export default Proveedor;