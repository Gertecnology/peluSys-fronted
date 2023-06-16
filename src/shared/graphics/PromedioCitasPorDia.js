import { useContext, useEffect, useState } from "react";
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
import { AuthContext } from "../../pages/contexts/AuthContext";
import { Circles } from "react-loader-spinner";

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

const PromedioCitasPorDia = () => {
    const { user } = useContext(AuthContext);
    const [promedioCitas, setPromedioCitas] = useState([]);
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [fechaInicio, setFechaInicio] = useState("");
    const [fechaCierre, setFechaCierre] = useState("");

    useEffect(() => {
        obtenerPromedioCitas();
    }, [fechaInicio, fechaCierre]);

    useEffect(() => {
        if(!promedioCitas) return
        const labels = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const data = labels.map((dia, index) => {
            const promedio = promedioCitas?.find(p => p.dia === index) ?? null;
            return promedio ? promedio.cantidad : 0;
        });
        const datasets = [
            {
                label: 'Promedio de citas',
                data,
                backgroundColor: colores[0],
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 0,
            },
        ];

        setChartData({ labels, datasets });

        const max = Math.round(Math.max(...data) + (Math.max(...data) / 3));

        setChartOptions({
            scales: {
                y: {
                    beginAtZero: true,
                    maxTicksLimit: 2,
                    max,
                },
            },
        });
    }, [promedioCitas]);

    const obtenerPromedioCitas = () => {
        if (!user) return;

        const validarFechas = (fechaInicio, fechaCierre) => {
            const fechaInicioValida = fechaInicio && !isNaN(Date.parse(fechaInicio));
            const fechaCierreValida = fechaCierre && !isNaN(Date.parse(fechaCierre));
            return fechaInicioValida && fechaCierreValida;
        };

        const obtenerFechaPorDefecto = () => {
            const fechaActual = new Date();
            const anioActual = fechaActual.getFullYear();
            const fechaInicioDefecto = `${anioActual}-01-01`;
            const fechaCierreDefecto = `${anioActual}-12-31`;
            return { fechaInicio: fechaInicioDefecto, fechaCierre: fechaCierreDefecto };
        };

        const fechasValidas = validarFechas(fechaInicio, fechaCierre);

        if (!fechasValidas) {
            const { fechaInicio: fechaInicioDefecto, fechaCierre: fechaCierreDefecto } = obtenerFechaPorDefecto();
            setFechaInicio(fechaInicioDefecto);
            setFechaCierre(fechaCierreDefecto);
            return;
        }

        const api = `${process.env.API_URL}api/informes/promedioCitasPorDia`;
        const token = user.token;
        axios.get(api, {
            headers: { "Authorization": `Bearer ${token}` },
            params: {
                fechaInicio,
                fechaCierre
            }
        })
            .then(res => {
                setPromedioCitas(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const handleFechaInicioChange = (event) => {
        setFechaInicio(event.target.value);
    };

    const handleFechaCierreChange = (event) => {
        setFechaCierre(event.target.value);
    };

    return (
        <div>
            <div className="flex items-center">
                <div className="w-1/3">
                    <label htmlFor="fechaInicio" className="text-lg font-medium text-gray-800">
                        Fecha de inicio:
                    </label>
                    <input
                        id="fechaInicio"
                        type="date"
                        value={fechaInicio}
                        onChange={handleFechaInicioChange}
                        className="w-full py-2 px-4 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
                <div className="w-1/3">
                    <label htmlFor="fechaCierre" className="text-lg font-medium text-gray-800">
                        Fecha de cierre:
                    </label>
                    <input
                        id="fechaCierre"
                        type="date"
                        value={fechaCierre}
                        onChange={handleFechaCierreChange}
                        className="w-full py-2 px-4 mt-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>
            <div className="w-full max-w-md">
                {promedioCitas.length ? <Bar data={chartData} options={chartOptions} /> : "Cargando..."}
            </div>
        </div>
    );
}

export default PromedioCitasPorDia;
