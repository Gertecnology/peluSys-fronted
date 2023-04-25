import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
const Roles = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading },setValue } = useForm();
    const [roles, setRoles] = useState([{id: 1, nombre: "Cajero"}])


    const handleModal = () => {
        const campos = ["id","nombre"]
        campos.forEach( (campo) => setValue(campo,"") )
        setShowModal(!showModal);
    };

    const formSubmit = (data) => {
        handleModal()
        setRoles([...roles, data])
    }

    const handleEditar = (id) => {

    }


    return (
        <Layout pagina={"Roles"}>  

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Rol</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del Rol"
                                isInvalid={errors.nombre}
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
                        placeholder="Nombre del rol"
                    />

                    <Button variant="secondary">
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Rol</Button>

                </div>

                <div className="px-5">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roles.map((rol, index) => (
                                <tr key={index}>
                                    <td>{rol.nombre}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                        <Button size="sm" variant="primary" onClick={() => handleEditar(rol.id)}>Editar</Button> {" "}
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


export default Roles;