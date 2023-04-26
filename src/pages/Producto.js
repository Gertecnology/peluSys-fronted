import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useState } from "react";
import { useForm } from "react-hook-form";


const Producto = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue } = useForm();
    const [productos, setProductos] = useState([{ id: 1, detalle: "Shampoo", marca: "Sedal", precio: 15000, iva: 10 }])
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Detalle" },
            { id: 2, value: "Marca" }
        ]
    )

    const handleModal = () => {
        const campos = ["id", "Detalle", "Marca", "Precio", "IVA"]
        campos.forEach((campo) => setValue(campo, ""))
        setShowModal(!showModal);
    };

    const formSubmit = (data) => {
        handleModal()
        setProductos([...productos, data])

    }

    const handleEditar = (id) => {

    }


    return (
        <Layout pagina={"Producto"}>

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
                            <Form.Label>Marca</Form.Label>
                            <Form.Control

                                {...register("marca", {
                                    required: true
                                })}

                                type="text"
                                placeholder="Marca del producto"
                                isInvalid={errors.marca}
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

                        <Form.Group>
                            <Form.Label>IVA</Form.Label>
                            <Form.Control
                                {...register("IVA", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Iva"
                                isInvalid={errors.iva}
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
                                <th>Marca</th>
                                <th>Precio</th>
                                <th>IVA</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) => (
                                <tr key={index}>
                                    <td>{producto.detalle}</td>
                                    <td>{producto.marca}</td>
                                    <td>{producto.precio}</td>
                                    <td>%{producto.iva}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="primary" onClick={() => handleEditar(producto.id)}>Editar</Button> {" "}
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


export default Producto;
