import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table, Container, Row, Col, Type } from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useState } from "react";
import { useForm } from "react-hook-form";
import { getCountries } from "country-language";
import Image from "next/image";

const Empleados = ({ }) => {
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue } = useForm();
    const [empleados, setEmpleados] = useState([])
    const nacionalidades = getCountries().map(pais => pais.name);

    const handleModal = () => {
        //  const campos = ["id","nombre","ruc","telefono","direccion"]
        // campos.forEach( (campo) => setValue(campo,"") )
        setShowModal(!showModal);

    };

    const formSubmit = (data) => {
        handleModal()
        setEmpleados([...empleados, data])
        console.log(data.fotoPerfil)
    }

    const handleEditar = (id) => {

    }

    return (
        <Layout pagina={"Empleados"}>

            <Modal show={showModal} onHide={handleModal} size="lg"> 
                <Form
                    onSubmit={handleSubmit(formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Empleado</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Nombre</Form.Label>
                                        <Form.Control
                                            {...register("nombre", { required: true })}
                                            type="text"
                                            placeholder="Nombre del cliente"
                                            isInvalid={errors.nombre}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            {...register("apellido", { required: true })}
                                            type="text"
                                            placeholder="Apellido del cliente"
                                            isInvalid={errors.apellido}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Fecha de Nacimiento</Form.Label>
                                        <Form.Control
                                            {...register("fechaNacimiento", { required: true })}
                                            type="date"
                                            placeholder="Fecha de Nacimiento"
                                            isInvalid={errors.fechaNacimiento}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Cédula de Identidad</Form.Label>
                                        <Form.Control
                                            {...register("cedula", { required: true })}
                                            type="text"
                                            placeholder="Cédula de Identidad"
                                            isInvalid={errors.cedula}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Dirección</Form.Label>
                                        <Form.Control
                                            {...register("direccion", { required: true })}
                                            type="text"
                                            placeholder="Dirección"
                                            isInvalid={errors.direccion}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Teléfono</Form.Label>
                                        <Form.Control
                                            {...register("telefono", { required: true })}
                                            type="text"
                                            placeholder="Teléfono"
                                            isInvalid={errors.telefono}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Grupo Sanguíneo</Form.Label>
                                        <Form.Control
                                            {...register("grupoSanguineo", { required: true })}
                                            type="text"
                                            placeholder="Grupo Sanguíneo"
                                            isInvalid={errors.grupoSanguineo}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Nacionalidad</Form.Label>
                                        <Typeahead
                                            id="nacionalidad"
                                         {...register("nacionalidad", { required: true })}
                                         onChange={(selected) => {
                                            setValue("nacionalidad",selected)
                                          }}
                                          options={nacionalidades}
                                          placeholder="Selecciona una opción"
                                          name="nacionalidad"
                                          isInvalid={errors.nacionalidad}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Salario</Form.Label>
                                        <Form.Control
                                            {...register("salario", { required: true })}
                                            type="text"
                                            placeholder="Salario"
                                            isInvalid={errors.salario}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Foto de perfil</Form.Label>
                                        <Form.Control
                                            {...register("fotoPerfil", { required: true })}
                                            type="file"
                                            accept="image/*"
                                            isInvalid={errors.fotoPerfil}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Container>

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
                <div className="px-5 flex justify-between gap-1">

                    <Form.Control
                        className="w-1/6"
                        placeholder="Nombre del empleado"
                    />
                    <Form.Control
                        className="w-1/6"
                        placeholder="Apellido del empleado"
                    />
                    <Form.Control
                        className="w-1/6"
                        placeholder="Cedula de Identidad"
                    />

                    <Button variant="secondary">
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm" className="w-4/6" onClick={() => handleModal()}>Agregar Empleado</Button>

                </div>

                <div className="px-5">
                    <Table bordered hover size="sm" className="bg-white mt-3">
                        <thead>
                            <tr>
                                <th>Perfil</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cedula de Identidad</th>
                                <th>Nacionalidad</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map((empleado, index) => (
                                <tr key={index}>
                                    <td className="flex text-center align-middle justify-center ">
                                        <img src={empleado.fotoPerfil.name} width={75} height={75} />
                                    </td>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.apellido}</td>
                                    <td>{empleado.cedula}</td>
                                    <td>{empleado.nacionalidad}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="primary" onClick={() => handleEditar(empleado.id ?? 1)}>Editar</Button> {" "}
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

export default Empleados;