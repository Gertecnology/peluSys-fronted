import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Select from 'react-select';
import axios from "axios";
import { toast } from "react-toastify";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

const Producto = ({ }) => {

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [productoEditar, setProductoEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues, control,
    } = useForm();
    const [productos, setProductos] = useState([])
    const [opciones, setOpciones] = useState(
        [
            { id: 1, value: "Detalle" },
            { id: 2, value: "Marca" }
        ]
    )

    const [iva, setIva] = useState(
        [
            { id: 1, value: 0.1 },
            { id: 2, value: 0.5 }
        ]
    )

    const [marcas, setMarcas] = useState([]);
    const [proveedores, setProveedores] = useState([]);


    useEffect(() => {
        obtenerDatos();
        obtenerMarcas();
        obtenerProveedores();
    }, [])



    const obtenerDatos = () => {
        const api = `${process.env.API_URL}/producto/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProductos(res.data);

            })
            .catch((error) => {
                console.log(error)
            })

    }

    const obtenerMarcas = () => {
        const api = `${process.env.API_URL}/marca/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setMarcas(res.data);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const obtenerProveedores = () => {
        const api = `${process.env.API_URL}/proveedores/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProveedores(res.data);
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const handleModal = () => {
        setShowModal(!showModal);
        reset();
        setIsEditar(false);


    };

    // guardo un nuevo producto
    const formSubmit = (data) => {
        console.log(data)
        const token = process.env.TOKEN;
        handleModal()
        const api = `${process.env.API_URL}/producto/guardar`;

        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Producto Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar el producto!"');
                console.log(error);
            });

    }




    const handleSetEditar = (id) => {
        const producto = productos.find(p => p.id === id);
        const proveedor = proveedores.find(p => p.id === producto.id_proveedor);
        const marca = marcas.find(m => m.id === producto.id_marca);
        setProductoEditar(producto);
        handleModal();
        setValue("nombre", producto.nombre);
        setValue("proveedor", producto.id_proveedor);
        setValue("detalle", producto.detalle);
        setValue("precio", producto.precio);
        setValue("marca", marca.id);
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, producto[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const token = process.env.TOKEN;
        const api = `${process.env.API_URL}/productos/actulizar/${productoEditar.id}`;
        axios.post(api, {
            id: productoEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Producto Actualizado');
                obtenerDatos();
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo actualizar!"');
            })
            .finally(() => {
                setProductoEditar(undefined);
                setIsEditar(false);

            })
        handleModal();

    }

    const handleDelete = (id) => {
        const api = `${process.env.API_URL}/producto/eliminar/${id}`;
        const token = process.env.TOKEN;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.info('Producto Eliminado');
                obtenerDatos();
            })
            .catch(() => {
                toast.error('No se pudo Eliminar!');
            });

    }

    const converter = (value) => {
        if (value === 0.1) {
            return 10;
        }
        else {
            return 5;
        }
    }


    return (
        <Layout pagina={"Producto"}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Agregar Producto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del producto"
                                isInvalid={errors.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Marca</Form.Label>

                            <Form.Select {...register("marca", { required: true })}
                            >
                                <option value="" disabled selected hidden>Seleccione una Marca</option>

                                {marcas?.map((marca) => (
                                    <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                ))}
                            </Form.Select>


                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Detalle</Form.Label>
                            <Form.Control

                                {...register("detalle", {
                                    required: true
                                })}

                                type="text"
                                placeholder="Descripción del producto"
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
                            <Form.Label>Proveedor</Form.Label>
                            <Form.Select {...register("proveedor", { required: true })}
                            >
                                <option value="" disabled selected hidden>Seleccione un Proveedor</option>

                                {proveedores?.map((proveedor) => (
                                    <option key={proveedor.id} value={proveedor.id}>{proveedor.nombre}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>IVA</Form.Label>
                            <Form.Select {...register("iva", { required: true })}
                            >
                                <option value="" disabled selected hidden>IVA</option>

                                {iva?.map((iva) => (
                                    <option key={iva.id} value={iva.id}>{converter(iva.value)}</option>
                                ))}
                            </Form.Select>
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
                                <th>Nombre</th>
                                <th>Marca</th>
                                <th>Precio</th>
                                <th>IVA</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map((producto, index) => (
                                <tr key={index}>
                                    <td>{producto.nombre}</td>
                                    <td>{producto.marca}</td>
                                    <td>{producto.precio}</td>
                                    <td>%{converter(producto.tipo_iva)}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="link" onClick={() => handleSetEditar(producto.id)}>
                                                <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link" onClick={() => handleDelete(producto.id)}>
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


export default Producto;
