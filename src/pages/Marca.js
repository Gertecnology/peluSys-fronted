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
import MarcaApi from "./api/MarcaApi";

const PAGE_SIZE = 10;

const Marca = ({ }) => {
    const ruta = useRouter();
    const { user } = useContext(AuthContext);

    const [marcas, setMarcas] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [showModal, setShowModal] = useState(false);
    const [isEditar, setIsEditar] = useState(false);
    const [isBuscar, setIsBuscar] = useState(false);
    const [cargando, setCargando] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [marcaEditar, setMarcaEditar] = useState(undefined);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const [marcasFiltradas, setMarcasFiltradas] = useState([]);
    const [valor, setValor] = useState("");

    useEffect(() => {
        obtenerMarcas();
    }, [])


    useEffect(() => {
        if (valor.length > 3) {
            handleFiltrar(valor)
        }
        else {
            actualizar();
        }
    }, [valor])


    const paginatedMarca = marcas.slice(
        currentPage * PAGE_SIZE,
        (currentPage + 1) * PAGE_SIZE
    );



    const actualizar = () => {
        valor === "" ? setIsBuscar(false) : null;
    }

    const obtenerMarcas = () => {
        if (user && user.token) {
            const marcaApi = new MarcaApi(user.token);

            marcaApi.getMarcasPage()
                .then((datos) => {
                    // Realizar algo con los datos obtenidos
                    setMarcas(datos?.content);
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
        const api = `${process.env.API_URL}api/marca/guardar/`;
        axios.post(
            api,
            data,
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then((response) => {
                toast.success('Marca Agregada');
            })
            .catch((error) => {
                toast.error('No se pudo agregar!"');
            })
            .finally(() => {
                obtenerMarcas();
                reset();


            })

    }

    const handleSetEditar = (id) => {
        const marca = marcas.find(s => s.id === id);
        setMarcaEditar(marca);
        handleModal();
        setIsEditar(true);
        Object.keys(getValues()).forEach(key => setValue(key, marca[key]));

    }


    const handleEditar = (data) => {
        handleModal();
        const api = `${process.env.API_URL}api/marca/actualizar/${marcaEditar.id}`;
        axios.post(api, {
            id: marcaEditar.id,
            ...data
        },
            { headers: { "Authorization": `Bearer ${user.token}` } }
        )
            .then(() => {
                toast.success('Marca Actualizado');
                obtenerMarcas();
            })
            .catch((error) => {
                toast.error('No se pudo actualizar!"');
            })
            .finally(() => {
                setMarcaEditar(undefined);
                setIsEditar(false);
                reset();
                setValor("");



            })

    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }
    const handleDelete = (id) => {
        const api = `${process.env.API_URL}api/marca/eliminar/${id}`;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${user.token}` } })
            .then(() => {
                toast.info('Marca Eliminado');
                obtenerMarcas();
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
        const marcaFiltrada = marcas.filter(m => m.nombre.toLowerCase().includes(valor.toLowerCase()));
        setMarcasFiltradas(marcaFiltrada)
        setTimeout(() => {
            setCargando(false);
        }, 300);
    }

    return (
        <Layout pagina={"Marcas"} titulo={"CRUD Marcas"} ruta={ruta.pathname}>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
                >
                    <Modal.Header closeButton>
                        <Modal.Title> {isEditar ? "Editar Marca" : "Agregar Marca"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <Form.Group>
                            <Form.Label>Nombre de la Marca</Form.Label>
                            <Form.Control
                                {...register("nombre", {
                                    required: true
                                })}
                                type="text"
                                placeholder="Nombre de la Marca"
                                isInvalid={errors.nombre}
                            />
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
                                        <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {isBuscar ? (
                                        marcasFiltradas?.map((marca, index) => (
                                            <tr key={index} className="hover:bg-gray-50">
                                                <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{marca.nombre}</td>
                                                <td>
                                                    <div className="flex gap-2 ">
                                                        <Button size="sm" variant="link" onClick={() => handleSetEditar(marca.id)}>
                                                            <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                        <Button size="sm" variant="link" onClick={() => handleSetDelete(marca.id)}>
                                                            <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                                onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (paginatedMarca.map((marca, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="flex gap-3 px-6 py-4 font-normal text-gray-900">{marca.nombre}</td>
                                            <td>
                                                <div className="flex gap-2 ">
                                                    <Button size="sm" variant="link" onClick={() => handleSetEditar(marca.id)}>
                                                        <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                            onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                    </Button>
                                                    <Button size="sm" variant="link" onClick={() => handleSetDelete(marca.id)}>
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
                    <p>¿Estás Seguro de que desea eliminar esta Marca?</p>
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


export default Marca;
