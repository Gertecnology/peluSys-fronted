import React, { useEffect, useState } from 'react';
import BigCalendar from '../shared/BigCalendar';
import Layout from '@/layout/Layout';
import moment from 'moment';

const Citas = () => {
  const [eventos, setEventos] = useState([])
  const [citas, setCitas] = useState([
    { fecha: '2023-05-01', hora: '08:00', motivo: 'Cita 1' },
    { fecha: '2023-05-01', hora: '10:30', motivo: 'Cita 2' },
    { fecha: '2023-05-02', hora: '09:15', motivo: 'Cita 3' },
    { fecha: '2023-05-02', hora: '14:00', motivo: 'Cita 4' },
    { fecha: '2023-05-03', hora: '11:30', motivo: 'Cita 5' },
    { fecha: '2023-05-03', hora: '16:45', motivo: 'Cita 6' },
    { fecha: '2023-05-04', hora: '13:15', motivo: 'Cita 7' },
    { fecha: '2023-05-05', hora: '15:30', motivo: 'Cita 8' },
    { fecha: '2023-05-05', hora: '17:45', motivo: 'Cita 9' },
    { fecha: '2023-05-11', hora: '11:30', motivo: 'Cita 5' },
    { fecha: '2023-05-11', hora: '16:45', motivo: 'Cita 6' },
    { fecha: '2023-05-11', hora: '13:15', motivo: 'Cita 7' },
    { fecha: '2023-05-11', hora: '15:30', motivo: 'Cita 8' },
    { fecha: '2023-05-11', hora: '17:45', motivo: 'Cita 9' },
  ])

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

  useEffect(actualizarEventos,[citas])

  return (
    <Layout pagina="Citas">
      <div className="flex flex-col w-full mx-10 lg:flex-row gap-2" >
        <div className="w-4/5 items-center mb-5 h-96 lg:w-1/2">
         <BigCalendar eventos={eventos} />
        </div>
        <div className="w-full lg:w-1/2">
          {/* Contenido de la segunda columna */}
        </div> 
      </div>
    </Layout>
  );
  
};

export default Citas;
