import { Badge } from "react-bootstrap";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/layout/Layout";
import { useContext, useEffect, useState  } from "react";
import jsPDF from 'jspdf';
import axios from "axios";
import moment from 'moment';
import { toast } from "react-toastify";



const TurnosPorDia = ({ }) => {
    const { user } = useContext(AuthContext)
    const [citas, setCitas] = useState([])
    const [dia, setDia] = useState(moment())
    const [peluqueros, setPeluqueros] = useState([])

    useEffect(() => {
        obtenerDatos()
        obtenerPeluqueros()
    }, [])


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

    const generarPDF = () => {
        if(!citas?.filter(cita => moment(cita.fechaEstimada).isSame(dia,"day") ).length){
            toast.info("Debe seleccionar un día con citas para generar el informe!")
            return
        }

        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('Citas Por Día', 10, 10);
        doc.text('Fecha: '+moment(dia).format("DD-MM-YYYY").toString(), 10, 20);
        let y=40
        doc.text("Hora", 10, y);
        doc.text("Cliente", 40, y);
        doc.text("Peluquero", 80, y);
        doc.text("Estado", 120, y);

         y = 55;

        citas.filter(cita => moment(cita.fechaEstimada).isSame(dia,"day") ).forEach((cita, index) => {
            const peluquero = peluqueros.find(p => p.empleado_id === cita.empleado_id)

            doc.setFontSize(12);
            doc.text(cita.horaEstimada.slice(0, -3), 10, y);
            doc.text(cita.nombreCliente, 40, y);
            doc.text(peluquero.nombre+" "+peluquero.apellido, 80, y);
            doc.text(cita.estado_cita, 120, y);
            y += 10;
        });

        doc.save('top_servicios.pdf');
    };


    return (<Layout pagina={"Turnos por Día"}>

        <h1 className="text-center">
            Turnos por Día
        </h1>

        <div className='flex justify-end pe-4'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generarPDF}>
                Guardar Informe
            </button>
        </div>

        <div className='flex justify-start ms-10 '>
            <label className="font-bold p-2">
                Selecciona el día:
            </label>
            <div className="relative">
                <input
                    type="date"
                    className="block w-full px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={dia}
                    onChange={e => setDia(e.target.value)}
                />
            </div>
        </div>


        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md mx-5 mt-3">
            <div className="w-full overflow-x-auto">
                <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="bg-blue-800 text-white p-10 text-lg   ">
                        <tr className="p-3">
                            <th>Hora</th>
                            <th>Cliente</th>
                            <th>Peluquero</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-xl">
                        {(citas?.filter(cita => moment(cita.fechaEstimada).isSame(dia,"day") ).map((cita, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td>{cita.horaEstimada.slice(0, -3)}</td>
                                <td>{cita.nombreCliente}</td>
                                <td>{peluqueros.find(p => p.empleado_id === cita.empleado_id)?.nombre}</td>
                                <td> <Badge >{cita.estado_cita}</Badge> </td>
                            </tr>
                        )))}
                        {!citas?.filter(cita => moment(cita.fechaEstimada).isSame(dia,"day") ).length && 
                                   <tr>
                                   <td className="px-6 p-2 text-xl text-center" colSpan="4">
                                     <span>No se encontraron citas en el dia seleccionado.</span>
                                   </td>
                                 </tr>}
                    </tbody>
                </table>
            </div>
        </div>

    </Layout>);
}

export default TurnosPorDia;