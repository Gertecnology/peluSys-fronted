import Layout from "@/layout/Layout"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";
import { Modal, Button, Form, Table } from "react-bootstrap";
import axios from "axios";

const Caja = () => {

    const ruta = useRouter();

    const [opciones, setOpciones] = useState([
        { id: 1, value: "Pagado" },
        { id: 2, value: "Pendientes" }

    ]);
    const [opcionSeleccionada, setOpcionSeleccionada] = useState("");
    const [valor, setValor] = useState("");


    const [facturas, setFaturas] = useState([]);
    const [clientes, setClientes] = useState([]);


    useEffect(() => {
        obtenerFacturas();
        obtenerClientes();
    }, [])


    const obtenerFacturas = () => {

        const api = `${process.env.API_URL}/factura/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setFaturas(res.data);
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                console.log(facturas)
            })

    }


    const obtenerClientes = () => {

        const api = `${process.env.API_URL}/clientes/`;
        const token = process.env.TOKEN;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setClientes(res.data);
            })
            .catch((error) => {
                console.log(error)
            })

    }


    const nombreCliente = (id) => {
        const datoCliente = clientes.filter(cliente => cliente.id === id);
        console.log(datoCliente);
    }


    return (
        <Layout pagina={"Caja"} titulo={"Caja"} ruta={ruta.pathname} >
            <div className="block">

                <div className="px-5 flex justify-between gap-3">
                    <Form.Select
                        value={opcionSeleccionada}
                        onChange={(e) => setOpcionSeleccionada(e.target.value)}
                    >
                        {opciones?.map((opcion) => (
                            <option key={opcion.id} value={opcion.id}>{opcion.value}</option>
                        ))}
                    </Form.Select>

                    <Form.Control
                        className="w-1/6"
                        placeholder="Has tu busqueda"
                        value={valor}
                        onChange={e => setValor(e.target.value)}
                    />

                    <Button variant="secondary" onClick={() => handleFiltrar(valor)}>
                        Buscar
                    </Button>

                    <Button variant="primary" size="sm">Abrir Caja</Button>

                </div>

                <div className="px-5 flex justify-between gap-3">
                    <Table bordered hover size="sm" className="bg-white mt-10">
                        <thead>
                            <tr>
                                <th>Ruc</th>
                                <th>Cliente</th>
                                <th>Fecha</th>
                                <th>Hora</th>
                                <th>Estado</th>
                                <th>Nro. Factura</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {facturas.map((factura, index) => (
                                <tr key={index} onClick={e => ruta.push('/ServiciosFinalizadosDetalles/[url]', `/ServiciosFinalizadosDetalles/${factura.id}`)}>
                                    <td>{factura.ruc}</td>
                                    <td>{nombreCliente(factura.cliente_id)}</td>
                                    <td>{factura.numero_factura}</td>
                                    <td>{factura.pagado}</td>
                                    <td>{factura.precio_total}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            </div>
        </Layout>



    )
}

export default Caja
