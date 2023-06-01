import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearch } from 'react-icons/fa';
import { toast } from "react-toastify";
import { AuthContext } from "./contexts/AuthContext";


const Cliente = ({ }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const { register: registerBuscar, handleSubmit: handleSubmitBuscar } = useForm()
    const [clientes, setClientes] = useState([])
    const [isEditar, setIsEditar] = useState(false)
    const [clienteEditar, setClienteEditar] = useState(undefined)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)


    useEffect(() => {
        obtenerDatos();
    }, [])


    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setClientes(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const buscarDatos = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/buscar/${data.nombre}&${data.ruc}`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setClientes(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const handleModal = () => {
        Object.keys(getValues()).forEach(key => setValue(key, ""))
        setShowModal(!showModal);

    };

    // guardo un nuevo cliente
    const formSubmit = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/guardar/`;
        const token = user.token
        handleModal()
        Object.keys(data).forEach((key) => data[key] = data[key] === null ? "" : data[key])

        axios.post(
            api,
            {
                ...data,
                credito: 0,
                credito_maximo: 0
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                obtenerDatos()
                toast.success('cliente Agregado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo agregar!"');
            });

    }

    const handleSetEditar = (id) => {
        const cliente = clientes.find(s => s.id === id)
        setClienteEditar(cliente);
        handleModal();
        setIsEditar(true);
        console.log(clienteEditar)
        Object.keys(getValues()).forEach(key => setValue(key, cliente[key]))
    }

    const handleEditar = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/actualizar/` + clienteEditar.id;
        const token = user.accessToken
        axios.post(
            api,
            {
                id: clienteEditar.id,
                ...data
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Cliente Modificado');
                obtenerDatos();
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo modificar!"');
            }).finally(() => {
                setClienteEditar(undefined)
                setIsEditar(false)
            })
        handleModal()


    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }

    const handleDelete = (id) => {
        if (!id || !user) return
        const api = `${process.env.API_URL}api/clientes/eliminar/${id}`;
        const token = user.accessToken;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.success('cliente Eliminado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo Eliminar!"');
            }).finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })
    }

    return (
        <Layout pagina={"cliente"}>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Cliente</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar el cliente?</p>
                </Modal.Body>

                <Modal.Footer>
                    <       Button variant="secondary" onClick={() => {
                        setShowDeleteModalModal(false)
                        setIdEliminar(-1)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)} >Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar cliente</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del cliente"
                                isInvalid={errors.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                {...register("telefono", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Teléfono"
                                isInvalid={errors.telefono}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>RUC</Form.Label>
                            <Form.Control

                                {...register("ruc", {
                                    required: false
                                })}

                                type="text"
                                placeholder="RUC"
                                isInvalid={errors.ruc}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                {...register("direccion", {
                                    required: false
                                })}
                                type="text"
                                placeholder="Dirección"
                                isInvalid={errors.direccion}
                            />
                        </Form.Group>




                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>


            <div className="block">
                <Form onSubmit={handleSubmitBuscar(buscarDatos) }>
                    <div className="px-5 flex justify-between gap-3">

                        <Form.Control
                            {...registerBuscar("nombre")}
                            className="w-1/6"
                            placeholder="Nombre del cliente"
                            
                        />
                        <Form.Control
                            {...registerBuscar("ruc")}
                            className="w-1/6"
                            placeholder="RUC"
                        />

                        <Button variant="secondary" className="text-xs" type="subtmit">
                            <div className="flex justify-between gap-2 items-center">
                                <div>Buscar</div>
                                <div className="flex align-middle items-center"><FaSearch /></div>
                            </div>
                        </Button>

                        <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Cliente</Button>

                    </div>
                </Form>


                <div className="px-5 mt-2 h-96 overflow-y-scroll">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th>Nombre</th>
                                <th>RUC</th>
                                <th>Dirección</th>
                                <th>Teléfono</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientes.map((cliente, index) => (
                                <tr key={index}>
                                    <td>{cliente.nombre}</td>
                                    <td>{cliente.ruc}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="link" onClick={() => handleSetEditar(cliente.id)}>
                                                <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link" onClick={() => handleSetDelete(cliente.id)}>
                                                <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Layout >
    );
}


export default Cliente;
