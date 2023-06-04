import Layout from "@/layout/Layout";
import { Modal, Button, Form } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from 'next/router'
import ServicioApi from "@/pages/api/ServiciosApi";
import { AuthContext } from "@/pages/contexts/AuthContext";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { IoMdAddCircleOutline } from "react-icons/io"
import { toast } from "react-toastify";


const PAGE_SIZE = 10;

const Servicio = ({ }) => {
    const ruta = useRouter();

    const [servicios, setServicios] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const { user } = useContext(AuthContext);

    useEffect(() => {
        obtenerServicios();
    }, [user]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const paginatedServicio = servicios.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [servicioEditar, setServicioEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [serviciosFiltrados, setServiciosFiltrados] = useState([]);
    const [valor, setValor] = useState("");
    const [iva, setIva] = useState(
        [
            { id: 1, value: 0.1 },
            { id: 2, value: 0.05 }
        ]
    )



    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrar(valor)
        }
        else {
            actualizar();
        }
    }, [valor])

    const obtenerServicios = () => {
        if (user && user.token) {
            const servicioServices = new ServicioApi(user.token);

            servicioServices.getServicios()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setServicios(datos?.content);
                    setTotalPages(datos?.totalPages);
                })
                .catch((error) => {
                    // Manejar el error
                    console.error("Error al obtener los datos:", error);
                });
        }
    }

    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }


    const handleModal = () => {
        setShowModal(!showModal);
        setIsEditar(false);


    };


    const formSubmit = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/servicios/guardar`;
        axios.post(
            api,
            {
                detalle: data.detalle,
                precio: data.precio,
                porcentajeIva: Number(data.porcentajeIva)
            },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Servicio Agregado');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                obtenerServicios();
                reset();

            })

    }

    const handleSetEditar = (id) => {
        const servicio = servicios.find(s => s.id === id);
        setServicioEditar(servicio);
        handleModal();
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, (servicio[key])));

    }


    const handleEditar = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/servicios/actulizar/${servicioEditar.id}`;
        axios.post(api, {
            id: servicioEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Servicio Actualizado');
                obtenerServicios();


            })
            .catch((error) => {
                toast.error('No se pudo actualizar el Servicio!!!"');

            })
            .finally(() => {
                setServicioEditar(undefined);
                setIsEditar(false);
                reset();

            })

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }
    const handleDelete = (id) => {
        const api = `${process.env.API_URL}api/servicios/eliminar/${id}`;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${user.token}` } })
            .then(() => {
                toast.info('Servicio Eliminado');
            })
            .catch(() => {
                toast.error('No se pudo Eliminar!');
            })
            .finally(() => {
                obtenerServicios();
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })

    }

    const handleFiltrar = (filtro) => {
        setCargando(true);
        setIsBuscar(true);
        const servicioApi = new ServicioApi(user.token);
        servicioApi.filterServicio(filtro)
            .then((datos) => {
                // Realizar algo con los datos obtenidos
                setServiciosFiltrados(datos);
            })
            .catch((error) => {
                // Manejar el error
                console.error("Error al obtener los datos:", error);
            });

        setTimeout(() => {
            setCargando(false);
        }, 500);
    }

    const convertidorIva = (value) => {
        if (value === 0.1) {
            return 10;
        }
        else {
            return 5;
        }
    }

    return (
        <Layout pagina={"Servicio"} titulo={"CRUD Servicio"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title> {isEditar ? "Editar Servicio" : "Agregar Servicio"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>


                        <Form.Group>
                            <Form.Label>Nombre del Servicio</Form.Label>
                            <Form.Control
                                {...register("detalle", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre del servicio"
                                isInvalid={errors.detalle}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Precio del Servicio</Form.Label>
                            <Form.Control
                                {...register("precio", {
                                    required: true
                                })}
                                type="number"
                                placeholder="Precio del Servicio"
                                isInvalid={errors.precio}
                            />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>IVA</Form.Label>
                            <Form.Select {...register("porcentajeIva", { required: true })} isInvalid={errors.procentajeIva}
                            >
                                <option defaultValue="" disabled selected hidden>IVA</option>

                                {iva?.map((iva) => (
                                    <option key={iva.id} value={iva.value}>{convertidorIva(iva.value)}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => { handleModal(), reset() }}>
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
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Precio</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white">Iva</th>
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        serviciosFiltrados?.map((servicio, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{servicio.detalle}</td>
                                                <td >{servicio.precio}</td>
                                                <td >{convertidorIva(servicio.porcentajeIva)} %</td>

                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link" onClick={() => handleSetEditar(servicio.id)}>
                                                            <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                        <Button size="sm" variant="link" onClick={() => handleSetDelete(servicio.id)}>
                                                            <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedServicio.map((servicio, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{servicio.detalle}</td>
                                            <td>{servicio.precio}</td>
                                            <td >{convertidorIva(servicio.porcentajeIva)} %</td>

                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(servicio.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(servicio.id)}>
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
                    <Modal.Title>Eliminar Servicio</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar este Servicio?</p>
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
};

export default Servicio;
