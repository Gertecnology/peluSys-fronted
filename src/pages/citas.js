import React, { useContext, useEffect, useState } from 'react';
import BigCalendar from '../shared/BigCalendar';
import Layout from '@/layout/Layout';
import moment from 'moment';
import { Badge, Button, Table, Accordion, Form, Modal, Container, Row, Col } from 'react-bootstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { FaCalendar } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';
import { useForm } from 'react-hook-form';
import Select from "react-select"
import axios from "axios"
import { AuthContext } from '../contexts/AuthContext';
import { convertirHora } from '@/helpers';
import { toast } from "react-toastify";
import { BsX } from 'react-icons/bs';


const Citas = () => {
  const { user } = useContext(AuthContext)
  const [eventos, setEventos] = useState([])
  const [citas, setCitas] = useState([])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(moment())
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1)
  const { register, handleSubmit, formState: { errors, isValid }, setValue, watch, getValues, clearErrors, } = useForm()
  const [showModal, setShowModal] = useState(false)
  const [serviciosSeleccionados, setServiciosSeleccionados] = useState([])
  const [clientes, setClientes] = useState([])
  const [servicios, setServicios] = useState([])
  const [peluqueros, setPeluqueros] = useState([])
  const [peluqueroSeleccionado, setPeluqueroSeleccionado] = useState(0)
  const [serviciosCitas, setServiciosCitas] = useState({});
  
  const coloresEstados = {
    "ESPERA": "#0369a1",
    "PROCESO": "#be185d",
    "FINALIZADO": "#15803d"
}

  useEffect(() => {
    obtenerDatos()
    obtenerClientes()
    obtenerServicios()
    obtenerPeluqueros()
  }, [])

  useEffect( () => {
    if(!citas) return
    setServiciosCitas([])
    citas.forEach((cita) => obtenerServiciosCitas(cita.id))
  }, [citas] )


  useEffect( () => console.log(fechaSeleccionada), [fechaSeleccionada] )

  useEffect(() => {
    if (!fechaSeleccionada) return
    setFilaSeleccionada(-1)
  }, [fechaSeleccionada])

  const obtenerDatos = () => {
    if (!user) return
    const api = `${process.env.API_URL}api/cita/page`;
    const token = user.token;
    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        console.log(res.data.content)
        setCitas(res.data.content);
      })
      .catch((error) => {
        console.log(error)
      });

  }

  const actualizarEventos = () => {
    const eventosActualizados = citas.reduce((eventos, cita) => {
      const { fechaEstimada } = cita;
      const eventoExistente = eventos.find((evento) =>
        moment(evento.start).isSame(fechaEstimada, 'day')
      );

      if (eventoExistente) {
        eventoExistente.title = (parseInt(eventoExistente.title) + 1).toString();
      } else {
        eventos.push({
          id: eventos.length + 1,
          title: '1',
          start: moment(fechaEstimada).toDate(),
        });
      }

      return eventos;
    }, []);

    setEventos(eventosActualizados);
  };

  useEffect(actualizarEventos, [citas])


  const handleModal = () => {
    Object.keys(getValues()).forEach(k => setValue(k, ""))
    setPeluqueroSeleccionado(0)
    setShowModal(!showModal)
  }

  const submit = (data) => {
    handleModal()
    if (!user) return
    const api = `${process.env.API_URL}api/cita/nuevo`;
    const token = user.accessToken
    handleModal()

    const datos = {
      nombreCliente: data.nombre_cliente,
      empleado_id: peluqueroSeleccionado.value,
      horaEstimada: data.horaEstimada,
      detalle: data.detalle ?? "",
      estado_cita: "ESPERA",
      estado_pago: "PENDIENTE",
      fechaEstimada: fechaSeleccionada.format("YYYY-MM-DD"),
      servicio_id: serviciosSeleccionados.map(servicio => servicio.value)
    }
    console.log(datos)

    axios.post(
      api,
      datos,
      { headers: { "Authorization": `Bearer ${token}` } }
    )
      .then((response) => {
        obtenerDatos();
        toast.info('Servicio Agregado');
      })
      .catch((error) => {
        console.log(error)
        toast.error('No se pudo agregar!"');
      });

  }

  const obtenerClientes = () => {
    if (!user) return
    const token = user.token;
    const api = `${process.env.API_URL}api/clientes/`;

    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setClientes(res.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  const obtenerServicios = () => {
    if (!user) return
    const token = user.token;
    const api = `${process.env.API_URL}api/servicios/`;

    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setServicios(res.data);
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
  const cambiarEstado = (id) => {
    if (!user) return
    const api = `${process.env.API_URL}api/cita/estado/${id}`;
    const token = user.token;
    const cita = citas.find(cita => cita.id === id)
    const estado = "CANCELADO"
    if (cita.estado_cita === "FINALIZADO") return
    if (cita.estado_cita === "CANCELADO") return
    axios.post(api,
        estado
        , {
            headers: {
                "Authorization": `Bearer ${token}`,
                "content-type": "application/json"
            },
        })
        .then(res => {
            obtenerDatos()
        })
        .catch((error) => {
            toast.error('No fue posible cambiar el estado de la cita.');
            console.log(error)
        });
}
  

  const obtenerPeluqueros = () => {
    if (!user) return
    const api = `${process.env.API_URL}api/empleado/?page=0&size=100&sort=asc`;
    const token = user.token;
    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        const empleados = res.data.content
        setPeluqueros(empleados.filter(empleado => empleado.cargo === "PELUQUERO"))
      })
      .catch((error) => {
        console.log(error)
      });

  }


  return (
    <Layout pagina="Citas">
      <Modal show={showModal} onHide={handleModal} size="lg">
        <Form onSubmit={handleSubmit(submit)}>
          <Modal.Header closeButton>
            <Modal.Title>Agendar Nueva Cita</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Container>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Cliente</Form.Label>
                    <Typeahead
                      id="cliente"
                      {...register("nombre_cliente", { required: true })}
                      onChange={(selected) => {
                        setValue("nombre_cliente", selected[0]);
                      }}
                      options={clientes?.map(cliente => cliente.nombre)}
                      placeholder="Seleccione un cliente"
                      name="cliente"
                      isInvalid={errors.nombre_cliente}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Peluquero</Form.Label>
                    <Select
                      isMulti={false}
                      options={peluqueros.map(p => { return { value: p.empleado_id, label: p.nombre + " " + p.apellido } })}
                      value={peluqueroSeleccionado}
                      onChange={(v) => setPeluqueroSeleccionado(v)}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      {...register("horaEstimada", { required: true })}
                      type="time"
                      placeholder="Hora de la cita"
                      isInvalid={errors.horaEstimada}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Servicios</Form.Label>
                    <Select
                      isMulti={true}
                      options={servicios?.map(s => { return { value: s.id, label: s.detalle } })}
                      value={serviciosSeleccionados}
                      onChange={(selectedOptions) => {
                        setServiciosSeleccionados(selectedOptions);
                      }}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>Detalle</Form.Label>
                    <Form.Control
                      as="textarea"
                      {...register("detalle", { required: false })}
                      placeholder="Detalle de la cita"
                      isInvalid={errors.detalle}
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
            <Button type="submit" variant="success">Agendar</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <div className="flex flex-col w-full mx-10 lg:flex-row gap-3">
        <div className="w-4/5 items-center mb-5 h-96 lg:w-6/12">
          <BigCalendar eventos={eventos} setFechaSeleccionada={setFechaSeleccionada} />
        </div>
        <div className="w-full lg:w-5/12 h-96 bg-white rounded">
          <div className="flex p-1 capitalize justify-between mx-2">
            <h3>{fechaSeleccionada.format('dddd, D [de] MMMM')} </h3>
            <div className="block">
              <Button variant="success" onClick={handleModal}>
                <div className="flex justify-between gap-2 items-center">
                  <div>Agendar</div>
                  <div className="flex align-middle items-center">
                    <FaCalendar />
                  </div>
                </div>
              </Button>
            </div>
          </div>
          <div className="flex p-1 justify-center text-center">
            {citas.filter(cita => moment(cita.fechaEstimada).startOf("day").isSame(fechaSeleccionada.startOf("day"))).length ?
              <>
                <div className="mt-2 h-96">
                  <Table hover size="sm" className="bg-white transition-all w-full">
                    <thead className="bg-white">
                      <tr>
                        <th>Hora</th>
                        <th>Cliente</th>
                        <th>Peluquero</th>
                        <th>Estado</th>
                        <th className="w-1/12">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {citas.filter(cita => moment(cita.fechaEstimada).isSame(fechaSeleccionada,"day") )
                          .sort((citaA, citaB) => moment(citaA.horaEstimada, 'HH:mm').diff(moment(citaB.horaEstimada, 'HH:mm')))
                          .map((cita, index) =>{

                            const servicios = serviciosCitas[cita.id] || [];

                           return <>
                              <tr key={index} className="text-center justify-center align-middle items-center hover:cursor-pointer" onClick={() => setFilaSeleccionada(index)}>
                                <td>{cita.horaEstimada.slice(0, -3)}</td>
                                <td>{cita.nombreCliente}</td>
                                <td>{peluqueros.find(p => p.empleado_id === cita.empleado_id)?.nombre}</td>
                                <td> <Badge style={{backgroundColor: coloresEstados[cita.estado_cita]}}>{cita.estado_cita}</Badge> </td>
                                <td>
                                  <div className="flex text-center justify-center align-middle items-center">
                                    <Button size="sm" variant="link" onClick={() => cambiarEstado(cita.id)}  >
                                        <BsX />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                              {filaSeleccionada === index && (
                                <tr>
                                  <td colSpan="5">
                                    <Accordion defaultActiveKey="0" className={`transition-all duration-500 ${filaSeleccionada === index ? "visible" : "invisible"}`}>
                                      <Accordion.Item eventKey="0">
                                        <Accordion.Body>
                                          <div className="block text-center">
                                            <div>{cita.detalle}</div>
                                            <div className="mt-3 font-bold">Servicios:</div>
                                            <div className="gap-3">
                                              {servicios?.map((servicio) => <Badge bg="success" className="mx-1">{servicio.detalle}</Badge>)}
                                            </div>
                                          </div>
                                        </Accordion.Body>
                                      </Accordion.Item>
                                    </Accordion>
                                  </td>
                                </tr>
                              )}
                            </>}
                          )
                      }
                    </tbody>
                  </Table>
                </div>
              </>
              : "Aún no se agendaron citas para este día."}
          </div>
        </div>
      </div>
    </Layout>

  );
}

export default Citas;

