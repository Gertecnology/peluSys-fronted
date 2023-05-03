import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-toastify";


const Servicio = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset,
    } = useForm();
    const [servicios, setServicios] = useState([])
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Detalle" },
            { id: 2, value: "Marca" }
        ]
    )

    useEffect(() => {
        obtenerDatos();
    }), [servicios]


    const obtenerDatos = () => {
        const api = "http://erpsistem-env.eba-n5ubcteu.us-east-1.elasticbeanstalk.com/api/servicios/";
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9ERVYiXSwiaWF0IjoxNjgzMTIzMTYzLCJleHAiOjE2ODMxODc5NjN9.zWXSCd-KwefmQMTh6RMwuImZJHo5GBqTBjWAvUccA3Q"
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setServicios(res.data);
            })
            .catch((error) => {
                console.log(error)
            });



    }

    const handleModal = () => {
        reset();
        setShowModal(!showModal);

    };

    // guardo un nuevo servicio
    const formSubmit = (data) => {
        const api = "http://erpsistem-env.eba-n5ubcteu.us-east-1.elasticbeanstalk.com/api/servicios/guardar";
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9ERVYiXSwiaWF0IjoxNjgzMTIzMTYzLCJleHAiOjE2ODMxODc5NjN9.zWXSCd-KwefmQMTh6RMwuImZJHo5GBqTBjWAvUccA3Q"

        handleModal()
        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Servicio Agregado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo agregar!"');
            });

    }

    const handleEditar = (id) => {
        const servicioEditar = servicios.find(s => s.id === id);
        handleModal();
        console.log(id)
    }


    const handleDelete = (id) =>{
        
    }

    return (
        <Layout pagina={"Servicio"}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(formSubmit)}
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
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>



            <div className="block">
                <div className="px-5 flex justify-between gap-3">
                    <Form.Select aria-label="w-1/2">
                        <option value={-1}>-- Filtrar por --</option>
                        {opciones.map((value, id) => (
                            <option key={id} value={value.value}>{value.value}</option>
                        ))}
                    </Form.Select>
                    <Form.Control
                        className="w-1/6"
                        placeholder="Has tu busqueda"
                    />

                    <Button variant="secondary">
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Servicio</Button>

                </div>

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
                            {servicios.map((servicio, index) => (
                                <tr key={index}>
                                    <td>{servicio.detalle}</td>
                                    <td>{servicio.precio}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="link" onClick={() => handleEditar(servicio.id)}>
                                                <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link">
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


export default Servicio;
