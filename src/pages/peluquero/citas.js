import Layout from "@/layout/Layout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import {  Alert } from "react-bootstrap";
import moment from "moment";
import { AiOutlineReload } from "react-icons/ai";
import { BsCreditCard2Back, BsScissors } from "react-icons/bs";
import { toast } from "react-toastify";



const Citas = () => {
    const { user } = useContext(AuthContext)
    const [citas, setCitas] = useState([])
    const [peluquero, setPeluquero] = useState({})

    const coloresEstados = {
        "ESPERA": "#0369a1",
        "PROCESO": "#be185d",
        "FINALIZADO": "#15803d"
    }

    const textoEstados ={
        "ESPERA" : <>                                            
                    Comenzar Trabajo
                    <BsScissors/>
                    </>,
        "PROCESO": <>
                        Finalizar Trabajo
                   </>,
        "FINALIZADO": <>
                        Generar Factura
                        <BsCreditCard2Back/>
                    </>
    }

    const estados = ["ESPERA","PROCESO","FINALIZADO"]

    useEffect(() => {
        obtenerDatos()
        obtenerPeluquero();
    }, [])

    const obtenerDatos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/cita/page`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setCitas(res.data.content.filter(cita => cita.empleado_id === user.empleado_id ));
            })
            .catch((error) => {
                console.log(error)
            });

    }

    const obtenerPeluquero = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/empleado/buscar/${user.empleado_id}`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                console.log(res.data)
                setPeluquero(res.data)
            })
            .catch((error) => {
                console.log(error)
            });
    }

    const generarFactura = (id) => {

    }

    const cambiarEstado = (id) => {
        if (!user) return
        const api = `${process.env.API_URL}api/cita/estado/${id}`;
        const token = user.token;
        const cita = citas.find(cita => cita.id === id)
        const estado =  estados[estados.indexOf(cita.estado_cita)+1]
        console.log(id)
        if(cita.estado_cita==="FINALIZADO") return
        console.log(estado)
        axios.post(api, 
            estado
            ,{ headers: { "Authorization": `Bearer ${token}`,
                        "content-type": "application/json" },
                 })
        .then(res => {
            obtenerDatos()
        })
        .catch((error) => {
            toast.error('No fue posible cambiar el estado de la cita.');
            console.log(error)
        });
    }
    


    return (
        <Layout>


            <div>
                <div className="flex justify-end mt-2 mr-10">
                    <button 
                        onClick={obtenerDatos}
                        className="flex items-center bg-green-800 hover:bg-green-900 text-white font-bold py-1 px-3 rounded">
                        <AiOutlineReload className="mr-1" />
                        Refrescar
                    </button>
                </div>

                <div className="flex-row  p-1 justify-center align-middle text-center">
                    {citas.length ? (
                        <>
                            {citas.filter(cita => moment(cita.fechaEstimada).isSame(moment(),"day")).sort((citaA, citaB) =>
                                moment(citaA.horaEstimada, 'HH:mm').diff(moment(citaB.horaEstimada, 'HH:mm'))
                            ).map(cita => (
                                <div className="border border-gray-300 rounded-md p-3 text-start w-3/5 mx-32 mt-3" key={cita.id}>
                                    <div className="flex justify-between">
                                        <div className="text-2xl font-bold mb-2 text-center">{cita.horaEstimada.slice(0, -3)} Hs</div>
                                        <div className={`rounded font-bold flex items-center -mt-10`}
                                            style={
                                                {
                                                    color: coloresEstados[cita.estado_cita]
                                                }
                                            }>
                                            {cita.estado_cita}
                                        </div>
                                    </div>
                                    <div className="mb-4">
                                        <p className="font-bold mb-2 text-lg">Cliente: <span className="font-normal">{cita.nombreCliente}</span></p>
                                        <p className="text-gray-700">
                                            {cita.detalle}
                                        </p>
                                        <p className="font-bold mb-2 text-lg">
                                            Servicios Solicitados:
                                            <span className="font-normal"> /*Listado de Servicios*/</span>
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <button  
                                            onClick={() => cambiarEstado(cita.id)}
                                            className={`flex items-center gap-2 bg-indigo-700 hover:bg-indigo-800 text-white font-bold py-2 px-4 rounded`}>
                                            {textoEstados[cita.estado_cita]}
                                        </button>
                                    </div>
                                </div>

                            ))}
                        </>
                    ) : (
                        <Alert variant="info">
                            Aún no se agendaron citas el día de hoy para{' '}
                            <span className="font-bold">{peluquero.nombre + ' ' + peluquero.apellido}</span>.
                        </Alert>
                    )}
                </div>
            </div>


        </Layout>);
}

export default Citas;