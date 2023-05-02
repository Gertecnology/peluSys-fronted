import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";


const Servicio = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue } = useForm();
    const [servicios, setServicios] = useState([])
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Detalle" },
            { id: 2, value: "Marca" }
        ]
    )

    useEffect(() => {
        obtenerDatos();
    }), []


    const obtenerDatos = () => {
        const api = "http://erpsistem-env.eba-n5ubcteu.us-east-1.elasticbeanstalk.com/api/servicios/";
        const token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0Iiwicm9sZXMiOlsiUk9MRV9ERVYiXSwiaWF0IjoxNjgzMDU1NDk2LCJleHAiOjE2ODMxMjAyOTZ9.eYIRcaFvksEkzgroPVOrY2e3LJ4YDQVd-M3egiEF2H4"
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setServicios(res.data);
            })
            .catch((error) => {
                console.log(error)
            });



    }

    const handleModal = () => {
        const campos = ["id", "Detalle", "Precio"]
        campos.forEach((campo) => setValue(campo, ""))
        setShowModal(!showModal);

    };

    const formSubmit = (data) => {
        handleModal()
        setServicios([...servicios, data])
    }

    const handleEditar = (id) => {

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
                            <Form.Label>Detalle</Form.Label>
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

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Producto</Button>

                </div>

                <div className="px-5">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead>
                            <tr>
                                <th>Detalle</th>
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
        </Layout>
    );
}


export default Servicio;
