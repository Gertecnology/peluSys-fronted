import { createContext, useState, useEffect,useContext } from 'react';
import { AuthContext } from './AuthContext';
import ClienteApi from '../pages/api/ClienteApi';
import ProductoApi from '../pages/api/ProductoApi';

export const CajaContext = createContext();

export function CajaModuleProvider({ children }) {

  const { user } = useContext(AuthContext);

  const [carrito, setCarrito] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosBuscados, setProductosBuscados] = useState([]);

  useEffect(() => {
    obtenerClientes();
    obtenerProductos();
  }, [carrito])




  useEffect(() => {
    console.log(carrito);

  }, [carrito])




  const obtenerClientes = () => {

    const clienteApi = new ClienteApi(user.token);

    clienteApi.getClientes()
      .then((datos) => {
        // Realizar algo con los datos obtenidos
        setClientes(datos);
      })
      .catch((error) => {
        // Manejar el error
        console.error("Error al obtener los clientes:", error);
      });

  }

  const obtenerProductos = () => {

    const productoApi = new ProductoApi(user.token);

    productoApi.getProductoList()
      .then((datos) => {
        // Realizar algo con los datos obtenidos
        setProductos(datos);

      })
      .catch((error) => {
        // Manejar el error
        console.error("Error al obtener los productos:", error);
      });

  }


  const filtrarProducto = (filtro) => {
    const producto = productos.filter(p => p.nombre.includes(filtro));
    setProductosBuscados(producto);

  }


  return (
    <CajaContext.Provider value={{ carrito, setCarrito, filtrarProducto, productosBuscados }}>
      {children}
    </CajaContext.Provider>
  );
}
