import Layout from "@/layout/Layout";
import { Modal, Button, Form, Table, Container, Row, Col, Type } from "react-bootstrap";
import { Typeahead } from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import { useState, useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import { getCountries } from "country-language";
import { AuthContext } from "../contexts/AuthContext";
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
    const { register: registerUser, handleSubmit: handleSubmitUser, watch: watchUser, formState: { errors: errorsUser } } = useForm();
    const [cambiarModalError, setCambiarModalError] = useState(false);
    const [empleados, setEmpleados] = useState([])
    const [isEditar, setIsEditar] = useState(false)
    const [empleadoEditar, setEmpleadoEditar] = useState(undefined)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [idEliminar, setIdEliminar] = useState(-1)
    const [datosForm, setDatosForm] = useState({})
    const [pagina, setPagina] = useState({ numero: 0, size: 20 })
    const [photo, setPhoto] = useState(undefined)

    const nacionalidades = getCountries().map(country => country.name);
    const roles = {
        "Administrador": "ROLE_ADMINISTRADOR",
        "Gerente": "ROLE_GERENTE",
        "Peluquero": "ROLE_PELUQUERO",
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
    }, [])

    const handlePhoto = (files) => {
        const file = files[0].file;
        const reader = new FileReader();

        reader.onloadend = () => {
            const base64String = reader.result;
            console.log(base64String)
            setPhoto(base64String)
        };
        reader.readAsDataURL(file);

    }

    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/empleado/`;
        const token = user.token;
        axios.get(api, {
            headers: { "Authorization": `Bearer ${token}` },
            params: {
                page: pagina.numero,
                size: pagina.size
            }
        })
            .then(res => {
                setEmpleados(res.data.content)
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const cambiarModal = (data) => {
        setDatosForm({ ...data })
        setShowModal(false);
        setShowSiguienteModal(true);
    }

    const handleModal = () => {
        // Object.keys(getValues()).forEach(key => setValue(key, ""))
        clearErrors()
        setShowModal(!showModal);

    };

    const formSubmit = (data) => {

        const api = `${process.env.API_URL}api/empleado/nuevo`;
        console.log(api)
        const token = user.token
        setShowSiguienteModal(false)
        Object.keys(data).forEach((key) => data[key] = data[key] === null ? "" : data[key])
        if (!photo) return
        const jsonData = {
            profileImageBase64: photo,
            nombre: datosForm.nombre,
            apellido: datosForm.apellido,
            cedula: datosForm.cedula,
            fechaNacimiento: datosForm.fechaNacimiento,
            fechaContratacion: moment().format("YYYY-MM-DD").toString(),
            fechaAlta: "1980-01-01",
            direccion: datosForm.direccion,
            salario: Number(datosForm.salario),
            aportePatronal: 0,
            aporteObrero: 0,
            sanguineo: datosForm.sanguineo,
            cargo: datosForm.cargo,
            username: data.username,
            email: data.email,
            password: data.password,
            roles: data.roles,
        }

        axios.post(
            api,
            jsonData,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        )
            .then((response) => {
                toast.success('Empleado Agregado');
                obtenerDatos()
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
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>Foto de perfil</Form.Label>

                                        <FilePond
                                            allowMultiple={false}
                                            onupdatefiles={handlePhoto}
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
                <div className="flex justify-end text-right mx-5 ">
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
                       

                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md mx-5">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                            <thead className="bg-blue-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Nombre</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Apellido</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">RUC</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white">Cargo</th>
                                    <th scope="col" className="px-6 py-4 font-medium text-white w-1/12">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {(empleados?.map((empleado, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="ps-3">{empleado.nombre}</td>
                                        <td>{empleado.apellido}</td>
                                        <td>{empleado.cedula}</td>
                                        <td>{empleado.cargo}</td>
                                        <td>
                                            <div className="flex gap-2 ">
                                                <Button size="sm" variant="link" onClick={() => handleSetEditar(empleado.id)}>
                                                    <FiEdit2 color="#808080" size="25px" onMouseOver={({ target }) => target.style.color = "blue"}
                                                        onMouseOut={({ target }) => target.style.color = "#808080"} />
                                                </Button>
                                                <Button size="sm" variant="link" onClick={() => handleSetDelete(empleado.id)}>
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




            </div>
        </Layout>
    );
}

export default Empleados;