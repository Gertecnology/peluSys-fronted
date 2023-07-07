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




const ProductosMasVendidos = ({ }) => {
    const { user } = useContext(AuthContext)
    const [productosMasVendidos, setProductosMasVendidos] = useState([])
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
      

    useEffect(() => obtenerProductosMasVendidos(), [])
    useEffect( ()=>{
        setChartData(
            {
                Title: "PRODUCTOS MAS COMPRADOS",
                labels: productosMasVendidos?.map(p => p.productos.nombre),
                datasets: [
                  {
                    label: 'Cantidad',
                    data:  productosMasVendidos?.map(p => p.cantidad),
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
                    max: Math.round(Math.max(...productosMasVendidos?.map(p => p.cantidad)) + (Math.max(...productosMasVendidos?.map(p => p.cantidad))/3))
                  },
                },
              }
        )
    }, [productosMasVendidos] )

    const obtenerProductosMasVendidos = () => {
        if (!user) return
        const api = `${process.env.API_URL}api/informes/topProductos?eCompra=VENTA`;
        const token = user.token;
        axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                setProductosMasVendidos(res.data)
            })
            .catch((error) => {
                console.log(error)
            });

    }


    return (
         productosMasVendidos.length ? <Bar data={chartData} options={chartOptions} /> : ""
    );
}

export default ProductosMasVendidos;