import Layout from "@/layout/Layout";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../pages/contexts/AuthContext";
import axios from "axios";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Bar } from "react-chartjs-2";




const TopClientes = ({ }) => {
    const { user } = useContext(AuthContext)
    const [topClientes, setTopClientes] = useState([])
    const [chartData, setChartData] = useState({})
    const [chartOptions, setChartOptions] = useState({})

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
      );

      const colores = [
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(255, 99, 132)',
        'rgb(255, 205, 86)',
        'rgb(153, 102, 255)',
      ];
      

    useEffect(() => obtenerTopClientes(), [])
    useEffect( ()=>{
        setChartData(
            {
                labels: topClientes?.map(c => c.cliente.nombre),
                datasets: [
                  {
                    label: 'Cantidad',
                    data:  topClientes?.map(c=> c.cantidadCitasFinalizadas),
                    backgroundColor: colores,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 0,
                  },
                ],
              }
        )
        setChartOptions(
            {
                scales: {
                  y: {
                    beginAtZero: true,
                    maxTicksLimit: 2,
                    max: Math.round(Math.max(...topClientes?.map(p => p.cantidadCitasFinalizadas)) + (Math.max(...topClientes?.map(p => p.cantidadCitasFinalizadas))/3))
                  },
                },
              }
        )
    }, [topClientes] )

    const obtenerTopClientes = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/informes/topClientes`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
              console.log(res.data)
                setTopClientes(res.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }


    return (
         topClientes.length ? <Bar data={chartData} options={chartOptions} /> : "Aun no se registraron clientes con citas finalizadas."
    );
}

export default TopClientes;