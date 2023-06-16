import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table, Container, Row, Col, Type } from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCountries } from "country-language";
import { AuthContext } from "./contexts/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { getFechaActual } from "@/helpers";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

import { FilePond, registerPlugin } from 'react-filepond';

import moment from "moment"
// Importa el plugin de vista previa de imágenes
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';

import 'filepond/dist/filepond.min.css';
import { IoMdAddCircleOutline, IoMdSearch } from "react-icons/io";

// Registra los plugins necesarios
registerPlugin(FilePondPluginImagePreview);



const Empleados = ({ }) => {
    const { user } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [showSiguienteModal, setShowSiguienteModal] = useState(false)
    const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, getValues, clearErrors,
    } = useForm();
    const { register: registerUser, handleSubmit: handleSubmitUser, watch: watchUser ,formState: { errors: errorsUser } } = useForm();
    const [cambiarModalError, setCambiarModalError] = useState(false);
    const [empleados, setEmpleados] = useState([])
    const [isEditar, setIsEditar] = useState(false)
    const [empleadoEditar, setEmpleadoEditar] = useState(undefined)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [datosForm, setDatosForm] = useState({})

    const nacionalidades = getCountries().map(country => country.name);
    const roles = {
        "Administrador": "ROLE_ADMINISTRADOR",
        "Gerente": "ROLE_GERENTE",
        "Peluquero": "ROL_PELUQUERO",
        "Recepcionista": "ROLE_RECEPCIONISTA",
        "RRHH": "ROLE_RRHH",
        "Usuario": "ROLE_USER"
    }

    const cargos = {
        "Gerente": "GERENTE",
        "Peluquero": "PELUQUERO",
        "Recepcionista": "RECEPCIONISTA",
        "RRHH": "RRHH",
    }
    const tiposSangre = {
        "0+": "TIPO_0_POSITIVO",
        "0-": "TIPO_0_NEGATIVO",
        "A+": "TIPO_A_POSITIVO",
        "A-": "TIPO_A_NEGATIVO",
        "B+": "TIPO_B_POSITIVO",
        "B-": "TIPO_B_NEGATIVO",
        "AB+": "TIPO_AB_POSITIVO",
        "AB-": "TIPO_AB_NEGATIVO"
    }


    useEffect(() => {
        obtenerDatos();
    },[])


    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/empleado/`;
        const token = user.accessToken;
        axios.get(api, {} ,{ headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
               setEmpleados(res.data.content)
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const cambiarModal = (data) => {
        setDatosForm({...data})
        setShowModal(false);
        setShowSiguienteModal(true);
    }

    const handleModal = () => {
        Object.keys(getValues()).forEach(key => setValue(key, ""))
        clearErrors()
        setShowModal(!showModal);

    };

    const formSubmit = (data) => {
        
        const api = `${process.env.API_URL}api/empleado/nuevo`;
        console.log(api)
        const token = user.accessToken
        setShowSiguienteModal(false)
        Object.keys(data).forEach((key) => data[key] = data[key] === null ? "" : data[key])
        console.log({...data,...datosForm, fotoPerfil:"",fechaContratacion: getFechaActual(),fechaAlta:"1970-01-01",aportePatronal:0,aporteObrero:0, salario:Number(datosForm["salario"]),photo:[""]})

        axios.post(
            api,
            {...data,...datosForm, fotoPerfil:"",fechaContratacion: getFechaActual() ,fechaAlta:"1970-01-01",aportePatronal:0,aporteObrero:0, salario:Number(datosForm["salario"]),photo:[""]} ,
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('Empleado Agregado');
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo agregar!"');
            });

    }

    const handleSetEditar = (id) => {
        const empleado = empleados.find(s => s.id === id)
        setEmpleadoEditar(empleado);
        handleModal();
        setIsEditar(true);
        console.log(empleadoEditar)
        Object.keys(getValues()).forEach(key => setValue(key, empleado[key]))
    }

    const handleEditar = (data) => {
        if (!user) return
        const api = `${process.env.API_URL}api/empleados/actualizar/` + empleadoEditar.id;
        const token = user.accessToken
        axios.post(
            api,
            {
                id: empleadoEditar.id,
                ...data
            },
            { headers: { "Authorization": `Bearer ${token}` } }
        )
            .then((response) => {
                toast.success('empleado Modificado');
                obtenerDatos();
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo modificar!"');
            }).finally(() => {
                setempleadoEditar(undefined)
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
        const api = `${process.env.API_URL}api/empleados/eliminar/${id}`;
        const token = user.accessToken;
        axios.delete(api,
            { headers: { "Authorization": `Bearer ${token}` } })
            .then(() => {
                toast.success('empleado Eliminado');
                obtenerDatos()
            })
            .catch((error) => {
                console.log(error)
                toast.error('No se pudo Eliminar!"');
            }).finally(() => {
                setShowDeleteModal(false)
                setIdEliminar(-1)
            })

    }


    return (
        <Layout pagina={"Empleados"}>


            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Eliminar Empleado</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <p>¿Estás Seguro de que desea eliminar el empleado?</p>
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


            <Modal show={showModal} onHide={handleModal} size="lg">

                <Form
                    onSubmit={handleSubmit(isEditar ? handleEditar : cambiarModal)}
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
                                            placeholder="Nombre del empleado"
                                            isInvalid={errors.nombre}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Apellido</Form.Label>
                                        <Form.Control
                                            {...register("apellido", { required: true })}
                                            type="text"
                                            placeholder="Apellido del empleado"
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
                                        <Form.Select
                                            {...register("sanguineo", {
                                                required: true, validate: {
                                                    seleccionado: v => v !== ""
                                                }
                                            })}
                                            isInvalid={errors.sanguineo}
                                        >
                                            <option selected key={""} value={""}>Seleccione Una opción</option>
                                            {Object.keys(tiposSangre).map((key) => (
                                                <option key={key} value={tiposSangre[key]}>
                                                    {key}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Cargo</Form.Label>
                                        <Form.Select
                                            {...register("cargo", {
                                                required: true, validate: {
                                                    seleccionado: v => v !== ""
                                                }
                                            })}
                                            isInvalid={errors.cargo}
                                        >
                                            <option selected key={""} value={""}>Seleccione Una opción</option>
                                            {Object.keys(cargos).map((key) => (
                                                <option key={cargos[key]} value={cargos[key]}>
                                                    {key}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                    <Form.Group>
                                        <Form.Label>Nacionalidad</Form.Label>
                                        <Typeahead
                                            id="nacionalidad"
                                            {...register("nacionalidad", { required: true })}
                                            onChange={(selected) => {
                                                setValue("nacionalidad", selected[0])
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
                                            type="number"
                                            placeholder="Salario"
                                            isInvalid={errors.salario}
                                        />
                                    </Form.Group>

                                    <Form.Group>
                                        <Form.Label>Foto de perfil</Form.Label>
                                        <Form.Control
                                            {...register("fotoPerfil", { required: false })}
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
                        <p className={`text-red-700 ${cambiarModalError ? "visible" : "invisible"}`}>Complete todos los campos antes de continuar.</p>
                        <Button variant="secondary" onClick={handleModal}>
                            Cerrar
                        </Button>
                        <Button type="submit">
                            Siguiente
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>




            <Modal size="lg" show={showSiguienteModal} onHide={() => setShowSiguienteModal(false)}>
            <Form onSubmit={handleSubmitUser(formSubmit)}>
                <Modal.Header closeButton>
                    <Modal.Title>Crear un usuario para el Empleado </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Nombre de usuario</Form.Label>
                                    <Form.Control
                                        {...registerUser("username", {
                                            required: true
                                        })}
                                        type="text"
                                        placeholder="Nombre de usuario"
                                        isInvalid={errorsUser.username}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        {...registerUser("email", {
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
                                        {...registerUser("password", {
                                            required: true,
                                            minLength: 6 //validar que la contraseña tenga al menos 8 caracteres
                                        })}
                                        type="password"
                                        placeholder="Contraseña"
                                        isInvalid={errorsUser.password}
                                    />
                                </Form.Group>

                                <Form.Group>
                                    <Form.Label>Confirmar contraseña</Form.Label>
                                    <Form.Control
                                        {...registerUser("confirmPassword", {
                                            required: true,
                                            validate: (value) => value === watchUser("password") //validar que la confirmación de contraseña sea igual a la contraseña ingresada
                                        })}
                                        type="password"
                                        placeholder="Confirmar contraseña"
                                        isInvalid={errorsUser.confirmPassword}
                                    />
                                </Form.Group>
                            </Col>
                            <Col>

                                <Form.Group>
                                    <Form.Label>
                                        Roles
                                    </Form.Label>

                                    <div>
                                        {Object.keys(roles).map((key) => (
                                            <Form.Check
                                                onChange={(selected) => {
                                                    setValue("roles", selected)
                                                    console.log(watch("roles"))
                                                }}
                                                isInvalid={errorsUser.roles}
                                                key={key}
                                                type="checkbox"
                                                label={key}
                                                value={roles[key]}
                                                {...registerUser("roles", { required: true })}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>
                            </Col>
                        </Row>
                    </Container>




                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => { setShowSiguienteModal(false) }} >
                        Cancelar
                    </Button>

                    <Button variant="success" type="submit">Guardar</Button>
                </Modal.Footer>
                </Form>                                 
            </Modal>





            <div className="block">
                <div className="px-5 flex justify-between gap-1 w-10/12">

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
                       <IoMdSearch /> 
                    </Button>

                    <div className="pl-40 w-2/12">
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

                <div className="px-5 mt-2 h-96 overflow-y-scroll">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead className="sticky top-0 bg-white">
                            <tr>
                                <th>Cedula</th>
                                <th>Nombre</th>
                                <th>Apellido</th>
                                <th>Cargo</th>
                                <th className="w-1/12">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados?.map((empleado, index) => (
                                <tr key={index}>
                                    <td>{empleado.cedula}</td>
                                    <td>{empleado.nombre}</td>
                                    <td>{empleado.apellido}</td>
                                    <td className="">{empleado.cargo}</td>
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