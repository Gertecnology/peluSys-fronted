import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import { useRouter } from 'next/router'



const Servicio = ({ }) => {
    const ruta = useRouter();

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [servicioEditar, setServicioEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [servicios, setServicios] = useState([]);
    const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
    const [valor, setValor] = useState("");
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Nombre" },
            { id: 2, value: "Marca" }
        ]
    )

    useEffect(() => {
        obtenerDatos();
    }, [])


    useEffect(() => {
        actualizar();
    }, [valor])



    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }

    const obtenerDatos = () => {
        const api = `${process.env.API_URL}/servicios/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setServicios(res.data);
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
        const api = `${process.env.API_URL}/servicios/guardar`;

        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Servicio Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                obtenerDatos();

            })

    }

    const handleSetEditar = (id) => {
        const servicio = servicios.find(s => s.id === id);
        console.log(servicio)
        setServicioEditar(servicio);
        handleModal();
        setValue("detalle", servicio.detalle);
        setValue("precio", servicio.precio);
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, servicio[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const token = process.env.TOKEN;
        const api = `${process.env.API_URL}/servicios/actulizar/${servicioEditar.id}`;
        axios.post(api, {
            id: servicioEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then(() => {
                toast.success('Servicio Actualizado');
                obtenerDatos();
            })
            .catch((error) => {
                toast.error('No se pudo actualizar!!!"');
            })
            .finally(() => {
                setServicioEditar(undefined);
                setIsEditar(false);

            })
        handleModal();

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }
    const handleDelete = (id) => {
        const api = `${process.env.API_URL}/servicios/eliminar/${id}`;
        const token = process.env.TOKEN;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.info('Servicio Eliminado');
                obtenerDatos();
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
        const api = `${process.env.API_URL}/servicios/buscarNombre?nombre=${n}`;
        const token = process.env.TOKEN;
        axios.get(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setServiciosFiltrados(res.data);
                console.log(res.data.id)
            });
        setTimeout(() => {
            setCargando(false);
        }, 300);
    }

    return (
        <Layout pagina={"Servicio"} titulo={"CRUD Servicio"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Servicio</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("detalle", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Detalle del servicio"
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
                                placeholder="Precio del servicio"
                                isInvalid={errors.precio}
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

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Servicio</Button>

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
                                    <th>Nombre</th>
                                    <th>Precio</th>
                                    <th className="w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isBuscar ? (
                                    serviciosFiltrados.map((servicio, index) => (
                                        <tr key={index}>
                                            <td>{servicio.detalle}</td>
                                            <td>{servicio.precio}</td>
                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(servicio.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(servicio.id)}>
                                                        <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))


                                ) : (servicios.map((servicio, index) => (
                                    <tr key={index}>
                                        <td>{servicio.detalle}</td>
                                        <td>{servicio.precio}</td>
                                        <td>
                                            <div className="flex gap-2 ">
                                                <Button size="sm" variant="link" onClick={() => handleSetEditar(servicio.id)}>
                                                    <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                </Button>
                                                <Button size="sm" variant="link" onClick={() => handleSetDelete(servicio.id)}>
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
                    <Modal.Title>Eliminar Servicio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar el Servicio?</p>
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


export default Servicio;
