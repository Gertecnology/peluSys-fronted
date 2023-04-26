import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
const Clientes = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading },setValue } = useForm();
    const [clientes, setClientes] = useState([{id:1,nombre:"Alexis",ruc:"5087494",direccion:"012365",telefono:"0986144552"}])


    const handleModal = () => {
        const campos = ["id","nombre","ruc","telefono","direccion"]
        campos.forEach( (campo) => setValue(campo,"") )
        setShowModal(!showModal);
    };

    const formSubmit = (data) => {
        handleModal()
        setClientes([...clientes, data])
    }

    const handleEditar = (id) => {

    }


    return (
        <Layout pagina={"Clientes"}>  

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(formSubmit)}
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
                            <Form.Label>RUC</Form.Label>
                            <Form.Control

                                {...register("ruc", {
                                    required: true
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
                                    required: true
                                })}
                                type="text"
                                placeholder="Dirección"
                                isInvalid={errors.direccion}
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


                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary"  onClick={handleModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">Guardar</Button>
                    </Modal.Footer>
                </Form>
            </Modal>



            <div className="block">
                <div className="px-5 flex justify-between gap-3">

                    <Form.Control
                        className="w-1/6"
                        placeholder="Nombre del cliente"
                    />
                    <Form.Control
                        className="w-1/6"
                        placeholder="RUC"
                    />

                    <Button variant="secondary">
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Cliente</Button>

                </div>

                <div className="px-5">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead>
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
                                        <Button size="sm" variant="primary" onClick={() => handleEditar(cliente.id)}>Editar</Button> {" "}
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


export default Clientes;