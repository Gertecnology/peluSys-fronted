import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table } from "react-bootstrap";
import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io"
import { toast } from "react-toastify";
import { useRouter } from 'next/router'
import { AuthContext } from "@/pages/contexts/AuthContext";
import ProveedorApi from "./api/ProveedorApi";

const PAGE_SIZE = 10;

const Proveedor = ({ }) => {
    const ruta = useRouter();
    const { user } = useContext(AuthContext);

    const [proveedores, setProveedores] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [proveedorEditar, setProveedorEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [proveedoresFiltrados, setProveedoresFiltrados] = useState([]);
    const [valor, setValor] = useState("");

    useEffect(() => {
        obtenerProveedores();
    }, [])


    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrar(valor)
        }
        else {
            actualizar();
        }
    }, [valor])


    const paginatedProveedor = proveedores.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );



    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }

    const obtenerProveedores = () => {
        if (user && user.token) {
            const proveedorApi = new ProveedorApi(user.token);

            proveedorApi.getProveedorPage()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setProveedores(datos?.content);
                    setTotalPages(datos?.totalPages);

                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener los datos:", error);
                });
        }
    }


    const handleModal = () => {
        setShowModal(!showModal);
        setIsEditar(false);


    };


    const formSubmit = (data) => {
        handleModal()
        const api = `${process.env.API_URL}api/proveedores/guardar`;
        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Proveedor Agregado');
            })
            .catch(() => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                obtenerProveedores();
                reset();


            })

    }

    const handleSetEditar = (id) => {
        const proveedor = proveedores.find(s => s.id === id);
        setProveedorEditar(proveedor);
        handleModal();
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, proveedor[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/proveedores/actualizar/${proveedorEditar.id}`;
        axios.post(api, {
            id: proveedorEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Proveedor Actualizado');
                obtenerProveedores();
            })
            .catch((error) => {
                toast.error('No se pudo actualizar!"');
            })
            .finally(() => {
                setProveedorEditar(undefined);
                setIsEditar(false);
                reset();


            })

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }
    const handleDelete = (id) => {
        const api = `${process.env.API_URL}api/proveedores/eliminar/${id}`;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${user.token}` } })
            .then(() => {
                toast.info('Proveedor Eliminado');
                obtenerProveedores();
            })
            .catch(() => {
                toast.error('No se pudo Eliminar!');
            })
            .finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })

    }

    const handleFiltrar = (valor) => {
        setCargando(true);
        setIsBuscar(true);
        const api = `${process.env.API_URL}api/proveedores/buscar?nombre=${valor}&ruc=${valor}`;
        axios.get(api,
            { headers: { "Authorization": `Bearer ${user.token}` } })
            .then((res) => {
                setProveedoresFiltrados(res.data)
            });
        setTimeout(() => {
            setCargando(false);
        }, 300);
    }

    return (
        <Layout pagina={"Proveedores"} titulo={"CRUD Proveedores"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title> {isEditar ? "Editar Proveedor" : "Agregar Proveedor"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Timbrado</Form.Label>
                            <Form.Control
                                {...register("timbrado", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Timbrado del Proveedor"
                                isInvalid={errors.timbrado}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Ruc</Form.Label>
                            <Form.Control
                                {...register("ruc", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Ruc del Proveedor"
                                isInvalid={errors.ruc}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del Proveedor"
                                isInvalid={errors.nombre}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Telefono</Form.Label>
                            <Form.Control
                                {...register("telefono", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Télefono del Proveedor"
                                isInvalid={errors.telefono}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Direccion</Form.Label>
                            <Form.Control
                                {...register("direccion", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Direccion del Proveedor"
                                isInvalid={errors.direccion}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Pais</Form.Label>
                            <Form.Control
                                {...register("pais", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Pais del Proveedor"
                                isInvalid={errors.pais}
                            />
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
                <div className="flex items-center">
                    <div className="px-5 w-3/4 flex items-center">
                        <Form.Control
                            placeholder="Has tu busqueda aquí"
                            value={valor}
                            onChange={e => setValor(e.target.value)}
                        />
                    </div>


                    <div className="w-1/4 pl-40">
                        <div className="flex justify-center mt-3">
                            <button
                                size="lg"
                                onClick={() => handleModal()}>
                                <div className="flex gap-1">
                                    <p className="text-center hover:text-blueEdition hover:font-bold">
                                        Agregar
                                    </p>
                                    <IoMdAddCircleOutline color="#808080" size="30px" onMouseOver={({ target }) => target.style.color = "blue"}
                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                </div>
                            </button>
                        </div>
                    </div>

                </div>

                {cargando ? (<div class="sk-circle">
                    <div class="sk-circle1 sk-child"></div>
                    <div class="sk-circle2 sk-child"></div>
                    <div class="sk-circle3 sk-child"></div>
                    <div class="sk-circle4 sk-child"></div>
                    <div class="sk-circle5 sk-child"></div>
                    <div class="sk-circle6 sk-child"></div>
                    <div class="sk-circle7 sk-child"></div>
                    <div class="sk-circle8 sk-child"></div>
                    <div class="sk-circle9 sk-child"></div>
                    <div class="sk-circle10 sk-child"></div>
                    <div class="sk-circle11 sk-child"></div>
                    <div class="sk-circle12 sk-child"></div>
                </div>) : (
                    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                        <div className="w-full overflow-x-auto">
                            <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                                <thead className="bg-blue-800">
                                    <tr>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Ruc</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Telefono</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Direccion</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Pais</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        proveedoresFiltrados?.map((proveedor, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{proveedor.ruc}</td>
                                                <td>{proveedor.nombre}</td>
                                                <td>{proveedor.telefono}</td>
                                                <td>{proveedor.direccion}</td>
                                                <td>{proveedor.pais}</td>
                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link" onClick={() => handleSetEditar(proveedor.id)}>
                                                            <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                        <Button size="sm" variant="link" onClick={() => handleSetDelete(proveedor.id)}>
                                                            <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedProveedor.map((proveedor, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{proveedor.ruc}</td>
                                            <td>{proveedor.nombre}</td>
                                            <td>{proveedor.telefono}</td>
                                            <td>{proveedor.direccion}</td>
                                            <td>{proveedor.pais}</td>
                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(proveedor.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(proveedor.id)}>
                                                        <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                {/* Paginación */}
                <div className="flex justify-center mt-5">
                    <nav className="inline-flex rounded-md shadow">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                            className="px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                onClick={() => handlePageChange(index)}
                                className={`px-3 py-2 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === index
                                    ? "text-blue-600 hover:text-blue-700"
                                    : "text-gray-500 hover:bg-gray-50"
                                    }`}
                            >
                                {index + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages - 1}
                            className="px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            Siguiente
                        </button>
                    </nav>
                </div>

            </div>

            <Modal show={showDeleteModal} onHide={() => { setShowDeleteModal(false) }}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Marca</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Esta Seguro de que desea eliminar este Proveedor?</p>
                </Modal.Body>

                <Modal.Footer>
                    <       Button variant="secondary" onClick={() => {
                        setShowDeleteModal(false)
                        setIdEliminar(-1)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)} >Eliminar</Button>
                </Modal.Footer>
            </Modal>


        </Layout >
    );
}


export default Proveedor;
