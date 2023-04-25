import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table, Container, Row, Col, Badge } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
const Usuarios = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, watch } = useForm();
    const [usuarios, setUsuarios] = useState([{ id: 1, username: "alexis", email: "email@email.com", password: "123456", confirmPassword: "123456", empleado: "Empleado 1", roles: [1, 2, 3] }])

    const empleados = [
        "Empleado 1",
        "Empleado 2",
        "Empleado 3"
    ]
    const roles = [
        { id: 1, name: "Cajero" },
        { id: 2, name: "Gerente" },
        { id: 3, name: "Peluquero" }
    ]

    const handleModal = () => {
        const campos = ["username", "email", "password", "confirmPassword", "empleado", "roles"]
        campos.forEach((campo) => setValue(campo, ""))
        setShowModal(!showModal);
    };

    const formSubmit = (data) => {
        handleModal()
        setUsuarios([...usuarios, data])
    }

    const handleEditar = (id) => {

    }


    return (
        <Layout pagina={"Usuarios"}>

            <Modal show={showModal} onHide={handleModal} size="lg">
                <Form onSubmit={handleSubmit(formSubmit)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Crear cuenta de usuario</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nombre de usuario</Form.Label>
                                        <Form.Control
                                            {...register("username", {
                                                required: true
                                            })}
                                            type="text"
                                            placeholder="Nombre de usuario"
                                            isInvalid={errors.username}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control
                                            {...register("email", {
                                                required: true,
                                                pattern: /^\S+@\S+$/i //validar que sea un correo electrónico válido
                                            })}
                                            type="text"
                                            placeholder="Email"
                                            isInvalid={errors.email}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Contraseña</Form.Label>
                                        <Form.Control
                                            {...register("password", {
                                                required: true,
                                                minLength: 8 //validar que la contraseña tenga al menos 8 caracteres
                                            })}
                                            type="password"
                                            placeholder="Contraseña"
                                            isInvalid={errors.password}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Confirmar contraseña</Form.Label>
                                        <Form.Control
                                            {...register("confirmPassword", {
                                                required: true,
                                                validate: (value) => value === watch("password") //validar que la confirmación de contraseña sea igual a la contraseña ingresada
                                            })}
                                            type="password"
                                            placeholder="Confirmar contraseña"
                                            isInvalid={errors.confirmPassword}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Empleado</Form.Label>
                                        <Typeahead
                                            {...register("empleado", { required: true })}
                                            onChange={(selected) => {
                                                setValue("empleado", selected);
                                            }}
                                            options={empleados}
                                            placeholder="Selecciona una opción"
                                            name="empleado"
                                            isInvalid={errors.empleado}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Roles</Form.Label>
                                        <div>
                                            {roles.map((rol) => (
                                                <Form.Check
                                                    key={rol.id}
                                                    type="checkbox"
                                                    label={rol.name}
                                                    value={rol.id}
                                                    {...register("roles")}
                                                />
                                            ))}
                                        </div>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleModal}>
                            Cerrar
                        </Button>
                        <Button variant="primary" type="submit">
                            Crear cuenta
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>




            <div className="block">
                <div className="px-5 flex justify-between gap-3">

                    <Form.Control
                        className="w-1/6"
                        placeholder="Nombre de usuario"
                    />
                    <Form.Control
                        className="w-1/6"
                        placeholder="Email del usuario"
                    />

                    <Button variant="secondary">
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" onClick={() => handleModal()}>Agregar Usuario</Button>

                </div>

                <div className="px-5">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead>
                            <tr>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Empleado</th>
                                <th>Roles</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map((usuario, index) => (
                                <tr key={index}>
                                    <td>{usuario.username}</td>
                                    <td>{usuario.email}</td>
                                    <td>{usuario.empleado}</td>
                                    <td>
                                        {usuario.roles.map(rol => <Badge className="me-2" bg="primary">{
                                            roles.find(r => Number(r.id) === Number(rol)).name
                                        }
                                        </Badge>)}
                                    </td>
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


export default Usuarios;