import { Badge } from "react-bootstrap";
import { AuthContext } from "@/contexts/AuthContext";
import Layout from "@/layout/Layout";
import { useContext, useEffect, useState  } from "react";
import jsPDF from 'jspdf';
import axios from "axios";
import moment from 'moment';
import { toast } from "react-toastify";
import Select from "react-select";



const TurnosPorDia = ({ }) => {
    const { user } = useContext(AuthContext)
    const [citas, setCitas] = useState([])
    const [peluquero, setPeluquero] = useState(undefined)
    const [peluqueros, setPeluqueros] = useState([])

    useEffect(() => {
        obtenerDatos()
        obtenerPeluqueros()
    }, [])

    useEffect(() => console.log(peluquero),[peluquero])

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
        if(!peluquero){
            toast.info("Debe seleccionar un peluquero para generar el informe!")
            return
        }
        const p= peluqueros.find(p => p.empleado_id === peluquero.value)
        const doc = new jsPDF();


        doc.setFontSize(20);
        doc.text('Citas Por Peluquero', 10, 10);
        doc.text('Peluquero: '+p.nombre+" "+p.apellido, 10, 20);
        let y=40
        doc.text("Hora", 10, y);
        doc.text("Cliente", 40, y);
        doc.text("Peluquero", 80, y);
        doc.text("Estado", 120, y);

         y = 55;

        citas.filter(cita => cita.empleado_id == p.empleado_id ).forEach((cita, index) => {

            doc.setFontSize(12);
            doc.text(cita.horaEstimada.slice(0, -3), 10, y);
            doc.text(cita.nombreCliente, 40, y);
            doc.text(p.nombre+" "+p.apellido, 80, y);
            doc.text(cita.estado_cita, 120, y);
            y += 10;
        });

        doc.save(`citas_${p.nombre}_${p.apellido}.pdf`);
    };


    return (<Layout pagina={"Turnos por Peluquero"}>

        <h1 className="text-center">
            Turnos por Peluquero
        </h1>

        <div className='flex justify-end pe-4'>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={generarPDF}>
                Guardar Informe
            </button>
        </div>

        <div className='flex justify-start ms-10 '>
            <label className="font-bold p-2">
                Selecciona el Peluquero:
            </label>
            <div className="relative">
            <Select
                     className="w-40"
                      isMulti={false}
                      options={peluqueros.map(p => { return { value: p.empleado_id, label: p.nombre + " " + p.apellido } })}
                      value={peluquero}
                      onChange={(v) =>  setPeluquero( v ) }
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
                        {(citas?.filter(cita => cita.empleado_id === peluquero?.value).map((cita, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td>{cita.horaEstimada.slice(0, -3)}</td>
                                <td>{cita.nombreCliente}</td>
                                <td>{peluqueros.find(p => p.empleado_id === peluquero?.value).nombre}</td>
                                <td> <Badge >{cita.estado_cita}</Badge> </td>
                            </tr>
                        )))}
                        {!citas?.filter(cita => cita.empleado_id === peluquero?.value ).length && 
                                   <tr>
                                   <td className="px-6 p-2 text-xl text-center" colSpan="4">
                                     <span>No se encontraron citas para el peluquero seleccionado.</span>
                                   </td>
                                 </tr>}
                    </tbody>
                </table>
            </div>
        </div>

    </Layout>);
}

export default TurnosPorDia;