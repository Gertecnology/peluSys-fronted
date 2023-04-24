import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";


const Servicio = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue } = useForm();
    const [servicios, setServicios] = useState([{ id: 1, detalle: "Corte Bakano", precio: 40.000 }])
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Detalle" },
            { id: 2, value: "Marca" }
        ]
    )

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
                        <Modal.Title>Agregar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Detalle</Form.Label>
                            <Form.Control
                                {...register("detalle", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Detalle del producto"
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
                                            <Button size="sm" variant="primary" onClick={() => handleEditar(servicio.id)}>Editar</Button> {" "}
                                            <Button size="sm" variant="danger">Eliminar</Button>
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
