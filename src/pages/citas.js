import React, { useEffect, useState } from 'react';
import BigCalendar from '../shared/BigCalendar';
import Layout from '@/layout/Layout';
import moment from 'moment';
import { Badge, Button, Table, Accordion } from 'react-bootstrap';
import { FaCalendar } from 'react-icons/fa';
import { FiEdit2 } from 'react-icons/fi';
import { AiOutlineDelete } from 'react-icons/ai';

const Citas = () => {
  const [eventos, setEventos] = useState([])
  const [citas, setCitas] = useState([
    { fecha: '2023-05-01', hora: '08:00', detalle: 'El cliente solicitó un corte de pelo de estilo X', cliente: 'Cliente 1', peluquero: 'Peluquero 1', estado: 'Espera' },
    { fecha: '2023-05-01', hora: '10:30', detalle: 'El cliente quiere un tintado de cabello de color X', cliente: 'Cliente 2', peluquero: 'Peluquero 2', estado: 'Espera' },
    { fecha: '2023-05-02', hora: '09:15', detalle: 'El cliente solicitó un corte de pelo de estilo Y', cliente: 'Cliente 3', peluquero: 'Peluquero 3', estado: 'Espera' },
    { fecha: '2023-05-02', hora: '14:00', detalle: 'El cliente quiere un peinado para una ocasión especial', cliente: 'Cliente 4', peluquero: 'Peluquero 4', estado: 'Espera' },
    { fecha: '2023-05-03', hora: '11:30', detalle: 'El cliente quiere un cambio de look radical', cliente: 'Cliente 5', peluquero: 'Peluquero 5', estado: 'Espera' },
    { fecha: '2023-05-03', hora: '16:45', detalle: 'El cliente solicita un tratamiento para hidratar su cabello', cliente: 'Cliente 6', peluquero: 'Peluquero 6', estado: 'Espera' },
    { fecha: '2023-05-04', hora: '13:15', detalle: 'El cliente quiere un cambio de color en su cabello', cliente: 'Cliente 7', peluquero: 'Peluquero 7', estado: 'Espera' },
    { fecha: '2023-05-05', hora: '15:30', detalle: 'El cliente solicita un corte de pelo clásico', cliente: 'Cliente 8', peluquero: 'Peluquero 8', estado: 'Espera' },
    { fecha: '2023-05-05', hora: '17:45', detalle: 'El cliente quiere un peinado para una fiesta', cliente: 'Cliente 9', peluquero: 'Peluquero 9', estado: 'Espera' },
    { fecha: '2023-05-11', hora: '11:30', detalle: 'El cliente quiere un corte de pelo moderno', cliente: 'Cliente 10', peluquero: 'Peluquero 10', estado: 'Espera' },
    { fecha: '2023-05-11', hora: '16:45', detalle: 'El cliente quiere un peinado recogido y El cliente quiere un cambio de look radical y El cliente quiere un peinado para una fiesta', cliente: 'Cliente 11', peluquero: 'Peluquero 11', estado: 'Espera' }
  ])
  const [fechaSeleccionada, setFechaSeleccionada] = useState(moment())
  const [filaSeleccionada, setFilaSeleccionada] = useState(-1)


  useEffect(() => {
    if (!fechaSeleccionada) return
    setFilaSeleccionada(-1)
  }, [fechaSeleccionada])

  const actualizarEventos = () => {
    const eventosActualizados = citas.reduce((eventos, cita) => {
      const { fecha } = cita;
      const eventoExistente = eventos.find((evento) =>
        moment(evento.start).isSame(fecha, 'day')
      );

      if (eventoExistente) {
        eventoExistente.title = (parseInt(eventoExistente.title) + 1).toString();
      } else {
        eventos.push({
          id: eventos.length + 1,
          title: '1',
          start: moment(fecha).toDate(),
        });
      }

      return eventos;
    }, []);

    setEventos(eventosActualizados);
  };

  useEffect(actualizarEventos, [citas])

  return (
    <Layout pagina="Citas">
      <div className="flex flex-col w-full mx-10 lg:flex-row gap-3" >
        <div className="w-4/5 items-center mb-5 h-96 lg:w-6/12">
          <BigCalendar eventos={eventos} setFechaSeleccionada={setFechaSeleccionada} />
        </div>
        <div className="w-full lg:w-5/12 h-96 bg-white rounded">

          <div className='flex p-1 capitalize justify-between mx-2'>
            <h3>{fechaSeleccionada.format('dddd, D [de] MMMM')} </h3>

            <div className='block'>
              <Button>
                <div className="flex justify-between gap-2 items-center">
                  <div>Agendar</div>
                  <div className="flex align-middle items-center">
                    <FaCalendar />
                  </div>
                </div>
              </Button>
            </div>

          </div>

          <div className='flex p-1 justify-center text-center'>
            {citas.filter(cita => moment(cita.fecha).startOf("day").isSame(fechaSeleccionada.startOf("day"))).length ?
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
                      {citas.filter(cita => moment(cita.fecha).startOf("day").isSame(fechaSeleccionada.startOf("day")))
                        .sort((citaA, citaB) => moment(citaA.hora, 'HH:mm').diff(moment(citaB.hora, 'HH:mm')))
                        .map((cita, index) =>
                          <>
                            <tr key={index} className='text-center justify-center align-middle items-center hover:cursor-pointer'
                              onClick={() => setFilaSeleccionada(index)}
                            >
                              <td>{cita.hora}</td>
                              <td>{cita.cliente}</td>
                              <td>{cita.peluquero}</td>
                              <td> <Badge>{cita.estado}</Badge> </td>
                              <td>
                                <div className="flex text-center justify-center align-middle items-center">
                                  <Button size="sm" variant="link">
                                    <FiEdit2 color="#808080" size="20px" onMouseOver={({ target }) => target.style.color = "blue"}
                                      onMouseOut={({ target }) => target.style.color = "#808080"} />
                                  </Button>
                                  <Button size="sm" variant="link" >
                                    <AiOutlineDelete color="#808080" size="20px" onMouseOver={({ target }) => target.style.color = "red"}
                                      onMouseOut={({ target }) => target.style.color = "#808080"} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                            {filaSeleccionada === index && (
                              <tr>
                                <td colSpan="5">
                                  <Accordion defaultActiveKey="0" className={`transition-all duration-500 ${filaSeleccionada === index ?  "visible" : "invisible"}`}>
                                    <Accordion.Item eventKey="0">
                                      <Accordion.Body>{cita.detalle}</Accordion.Body>
                                    </Accordion.Item>
                                  </Accordion>
                                </td>
                              </tr>
                            )}
                          </>
                        )}
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

};

export default Citas;
