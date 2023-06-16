import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table, FormGroup, Row, Col, Badge } from "react-bootstrap";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { FaSearch } from 'react-icons/fa';
import { toast } from "react-toastify";
import { AuthContext } from "../contexts/AuthContext";
import { IoMdAddCircleOutline, IoMdSearch } from "react-icons/io";
import { BsEyeFill } from "react-icons/bs";


const Cliente = ({ }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const { register, handleSubmit, formState: { errors, isLoading }, setValue, reset, getValues
    } = useForm();
    const { register: registerBuscar, handleSubmit: handleSubmitBuscar } = useForm()
    const [clientes, setClientes] = useState([])
    const [isEditar, setIsEditar] = useState(false)
    const [clienteEditar, setClienteEditar] = useState(undefined)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [showCliente, setShowCliente] = useState({})
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [citas,setCitas] = useState([])
    const [serviciosCitas, setServiciosCitas] = useState({});



    useEffect(() => {
        obtenerDatos();
        obtenerCitas()
    }, [])
    useEffect( () => {
        if(!citas) return
        setServiciosCitas([])
        citas.forEach((cita) => obtenerServiciosCitas(cita.id))
      }, [citas] )


    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setClientes(res.data);
            })
            .catch((error) => {
                console.log(error)
            });

    }
    const buscarDatos = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/buscar/${data.nombre}&${data.ruc}`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setClientes(res.data);
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const obtenerCitas = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/cita/page`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
          .then(res => {
            setCitas(res.data.content);
          })
          .catch((error) => {
            console.log(error)
          });
    
      }
      const obtenerServiciosCitas = async (id) => {
        if (!user) return;
        const token = user.token;
        const api = `${process.env.API_URL}api/servicios/findByCitas/${id}`;
      
        try {
          const response = await axios.get(api, { headers: { "Authorization": `Bearer ${token}` } });
          const servicios = response.data;
          setServiciosCitas(prevState => ({ ...prevState, [id]: servicios }));
        } catch (error) {
          console.log(error);
        }
      };

    const handleModal = () => {
        Object.keys(getValues()).forEach(key => setValue(key, ""))
        setShowModal(!showModal);

    };

    // guardo un nuevo cliente
    const formSubmit = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/guardar/`;
        const token = user.token
        handleModal()
        Object.keys(data).forEach((key) => data[key] = data[key] === null ? "" : data[key])

        axios.post(
            api,
            {
                ...data,
                credito: 0,
                credito_maximo: 0
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                obtenerDatos()
                toast.success('cliente Agregado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo agregar!"');
            });

    }

    const handleSetEditar = (id) => {
        const cliente = clientes.find(s => s.id === id)
        setClienteEditar(cliente);
        handleModal();
        setIsEditar(true);
        console.log(clienteEditar)
        Object.keys(getValues()).forEach(key => setValue(key, cliente[key]))
    }

    const handleEditar = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/clientes/actualizar/` + clienteEditar.id;
        const token = user.token
        axios.post(
            api,
            {
                id: clienteEditar.id,
                ...data
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Cliente Modificado');
                obtenerDatos();
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo modificar!"');
            }).finally(() => {
                setClienteEditar(undefined)
                setIsEditar(false)
            })
        handleModal()


    }

    const handleSetDelete = (id) => {
        setShowDeleteModal(true)
        setIdEliminar(id);
    }

    const handleDelete = (id) => {
        if (!id || !user) return
        const api = `${process.env.API_URL}api/clientes/eliminar/${id}`;
        const token = user.token;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.success('cliente Eliminado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo Eliminar!"'); handleSetDelete
            }).finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })
    }

    const handleDetailModal = (id) => {
        setShowCliente(clientes.find(c => c.id === id))
        setShowDetailModal(true)
    }

    return (
        <Layout pagina={"cliente"}>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Cliente</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar el cliente?</p>
                </Modal.Body>

                <Modal.Footer>
                    <       Button variant="secondary" onClick={() => {
                        setShowDeleteModalModal(false)
                        setIdEliminar(-1)
                    }}>
                        Cancelar
                    </Button>

                    <Button variant="danger" type="submit" onClick={() => handleDelete(idEliminar)} >Eliminar</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showModal} onHide={handleModal}>
                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : formSubmit)}
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

                        <Form.Group>
                            <Form.Label>RUC</Form.Label>
                            <Form.Control

                                {...register("ruc", {
                                    required: false
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
                                    required: false
                                })}
                                type="text"
                                placeholder="Dirección"
                                isInvalid={errors.direccion}
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

            <Modal size="lg" show={showDetailModal} onHide={() => setShowDetailModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Detalles del cliente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
  <Row className="mx-2 text-xl">
    <Col md={8}>
      <div className="font-bold text-3xl">
        {showCliente?.nombre}
      </div>
      <div className="font-bold mt-3">
        RUC:{" "}
        <span className="font-normal">{showCliente?.ruc}</span>
      </div>
      <div className="font-bold mt-3">
        Email:{" "}
        <span className="font-normal">{showCliente?.email}</span>
      </div>
      <div className="font-bold mt-3">
        Dirección:{" "}
        <span className="font-normal">{showCliente?.direccion}</span>
      </div>
    </Col>
    <Col md={4}>
      <div className="font-bold mt-3">
        Teléfono:{" "}
        <span className="font-normal">{showCliente?.telefono}</span>
      </div>
      <div className="font-bold mt-3">
        Crédito:{" "}
        <span className="font-normal">{showCliente?.credito}</span>
      </div>
      <div className="font-bold mt-3">
        Crédito máximo:{" "}
        <span className="font-normal">{showCliente?.credito_maximo}</span>
      </div>
    </Col>
  </Row>
  <Row>
  <table className="min-w-full divide-y divide-gray-200 mt-3">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha
                                </th>
                                <th scope="col" className="px-4 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                    Servicios
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                           {citas?.filter(cita => cita.nombreCliente === showCliente?.nombre)
                                   .filter(cita => cita.estado_cita === "FINALIZADO")
                                   .map(cita => {
                                        const servicios = serviciosCitas[cita.id] ?? []
                                        return <tr key={cita.id}>
                                             <td className="px-4 py-2 text-gray-700">
                                                {cita?.fechaEstimada}
                                             </td>
                                             <td className="px-4 py-2 text-gray-700 gap-2">
                                                {servicios?.map(servicio => <><Badge bg="success">{servicio.detalle}</Badge>{" "}</>)}
                                             </td>

                                        </tr>
                                   })}
                        </tbody>
                    </table>

  </Row>
</Modal.Body>


                    <Modal.Footer>
                        <Button onClick={() => setShowDetailModal(false)}>
                            Cerrar
                        </Button>

                    </Modal.Footer>
            </Modal>


            <div className="flex justify-center">
                <div className="flex flex-row items-center">
                    <Form onSubmit={handleSubmitBuscar(buscarDatos)}>
                        <div className="flex flex-row gap-3">
                            <FormGroup>
                                <Form.Control {...registerBuscar("nombre")} placeholder="Nombre del cliente" />
                            </FormGroup>
                            <FormGroup>
                                <Form.Control {...registerBuscar("ruc")} placeholder="RUC del cliente" />
                            </FormGroup>
                            <Button variant="primary" type="submit"> <IoMdSearch /> </Button>
                        </div>
                    </Form>
                </div>
                <div className="pl-40">
                    <div className="flex justify-center mt-3">
                        <button size="lg" onClick={() => handleModal()}>
                            <div className="flex gap-1">
                                <p className="text-center hover:text-blueEdition hover:font-bold">Agregar</p>
                                <IoMdAddCircleOutline
                                    color="#808080"
                                    size="30px"
                                    onMouseOver={({ target }) => (target.style.color = "blue")}
                                    onMouseOut={({ target }) => (target.style.color = "#808080")}
                                />
                            </div>
                        </button>
                    </div>
                </div>
            </div>








            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md m-5">
                <div className="w-full overflow-x-auto">
                    <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                        <thead className="bg-blue-800">
                            <tr>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">RUC</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Direccion</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white">Telefono</th>
                                <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {(clientes?.map((cliente, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="ps-3">{cliente.nombre}</td>
                                    <td>{cliente.ruc}</td>
                                    <td>{cliente.direccion}</td>
                                    <td>{cliente.telefono}</td>
                                    <td>
                                        <div className="flex gap-2 ">
                                            <Button size="sm" variant="link" onClick={() => handleSetEditar(cliente.id)}>
                                                <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link" onClick={() => handleSetDelete(cliente.id)}>
                                                <AiOutlineDelete color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "red"}
                                                    onMouseOut={({ target }) => target.style.color = "#808080"} />
                                            </Button>
                                            <Button size="sm" variant="link" onClick={() => handleDetailModal(cliente.id)}>
                                                <BsEyeFill color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "green"}
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

        </Layout >
    );
}


export default Cliente;
