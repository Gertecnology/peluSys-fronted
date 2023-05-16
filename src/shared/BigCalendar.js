import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Badge } from 'react-bootstrap';
import {AiFillCaretRight, AiFillCaretLeft, AiFillCalendar} from "react-icons/ai"

const localizer = momentLocalizer(moment);
moment.locale('es');

const BigCalendar = ({ eventos, setFechaSeleccionada }) => {
    const [selectedDate, setSelectedDate] = useState(Date.now());

    const handleDateSelect = (date) => {
        setSelectedDate(date);
        setFechaSeleccionada(moment(date))
    };

    const customDayPropGetter = (date) => {
        if (moment(date).isSame(selectedDate, 'day')) {
            return {
                className: 'bg-blue-300 text-white transition duration-500',
            };
        }
        return {className: "transition duration-100 hover:bg-blue-100",
            };
    };

    const CustomToolbar = ({ label, onNavigate }) => {
        return (
            <div className='flex justify-between'>
                <div className='flex justify-start items-center ml-4 capitalize'>
                    <span>{label}</span>
                </div>
                <div className="flex justify-end my-2 mx-1 gap-1">
                    <button
                        className="bg-blue-700 text-white rounded px-2 py-1"
                        style={{ color: 'white' }}
                        onClick={() => onNavigate('PREV')}
                    >
                        <AiFillCaretLeft />
                    </button>
                    <button
                        className="bg-blue-700 text-white rounded px-2 py-1"
                        onClick={() => onNavigate('DATE',moment())}
                    >
                         <AiFillCalendar />
                    </button>
                    <button
                        className="bg-blue-700 text-white rounded px-2 py-1"
                        onClick={() => onNavigate("NEXT")}
                    >
                         <AiFillCaretRight />
                    </button>
                </div>
            </div>

        );
    };

    const EventComponent = ({ event }) => {
        return (
            <div className='flex justify-center'>
                <Badge bg='primary'>{event.title}</Badge>
            </div>
        );
    };



    return (
            <Calendar
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="start"
                views={['month']}
                components={{
                    toolbar: CustomToolbar,
                    eventWrapper: EventComponent,
                }}
                style={{ height: '100%' }}
                className="bg-white"
                selectable
                onSelectSlot={({ start }) => handleDateSelect(start)}
                dayPropGetter={customDayPropGetter}
            />
    );
};

export default BigCalendar;
