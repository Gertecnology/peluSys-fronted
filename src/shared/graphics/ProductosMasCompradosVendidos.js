import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { AuthContext } from "../../contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const colores = [
  '#14b8a6', // Color para productos comprados
  '#16a34a', // Color para productos vendidos
];

const ProductosMasComprados = () => {
  const { user } = useContext(AuthContext);
  const [productosMasComprados, setProductosMasComprados] = useState([]);
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    obtenerProductosMasComprados();
    obtenerProductosMasVendidos();
  }, []);

  useEffect(() => {
    const labels = productosMasComprados?.map(p => p.productos.nombre) || [];
    const datasets = [
      {
        label: 'Cantidad (Compras)',
        data: productosMasComprados?.map(p => p.cantidad) || [],
        backgroundColor: colores[0], // Color para productos comprados
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 0,
      },
      {
        label: 'Cantidad (Ventas)',
        data: productosMasVendidos?.map(p => p.cantidad) || [],
        backgroundColor: colores[1], // Color para productos vendidos
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 0,
      },
    ];

    setChartData({ labels, datasets });

    const maxCompras = Math.max(...(productosMasComprados?.map(p => p.cantidad) || [])) || 0;
    const maxVentas = Math.max(...(productosMasVendidos?.map(p => p.cantidad) || [])) || 0;
    const maxTicksLimit = 2;
    const max = Math.round(Math.max(maxCompras, maxVentas) + (Math.max(maxCompras, maxVentas) / 3));

    setChartOptions({
      indexAxis: 'x',
      plugins: {
        legend: {
          position: 'bottom',
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
          maxTicksLimit,
          max,
        },
      },
    });
  }, [productosMasComprados, productosMasVendidos]);

  const obtenerProductosMasComprados = () => {
    if (!user) return;
    const api = `${process.env.API_URL}api/informes/topProductos?eCompra=COMPRA`;
    const token = user.token;
    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setProductosMasComprados(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const obtenerProductosMasVendidos = () => {
    if (!user) return;
    const api = `${process.env.API_URL}api/informes/topProductos?eCompra=VENTA`;
    const token = user.token;
    axios.get(api, { headers: { "Authorization": `Bearer ${token}` } })
      .then(res => {
        setProductosMasVendidos(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    productosMasComprados.length || productosMasVendidos.length ? <Bar data={chartData} options={chartOptions} /> : null
  );
};

export default ProductosMasComprados;
