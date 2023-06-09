import Layout from "@/layout/Layout";
import ProductosMasComprados from "@/shared/graphics/ProductosMasComprados";
import ProductosMasVendidos from "@/shared/graphics/ProductosMasVendidos";
import ServiciosMasVendidos from "@/shared/graphics/ServiciosMasVendidos";
import TopClientes from "@/shared/graphics/TopClientes";

const Dashboard = ({}) => {
    return (
        <Layout>
            <div className="flex-row gap-10 justify-center items-center align-middle">
                    <div className="font-bold text-3xl m-3 text-center">Dashboard</div>

                    <div className="font-bold text-xl mb-3 text-center">Productos Más Comprados</div>
                    <div className="flex justify-center h-80">
                        <ProductosMasComprados /> 
                    </div>
                    <div className="font-bold text-xl mb-3 mt-5 text-center">Productos Más Vendidos</div>
                    <div className="flex justify-center h-80">
                      <ProductosMasVendidos />
                    </div>

                    <div className="font-bold text-xl mb-3 mt-5 text-center">Servicios Más Vendidos</div>
                    <div className="flex justify-center h-80">
                        <ServiciosMasVendidos />
                    </div>

                    <div className="font-bold text-xl mb-3 mt-5 text-center">Top Clientes</div>
                    <div className="flex justify-center h-80">
                        <TopClientes />
                    </div>
                    
                      
            </div>
        </Layout>
     );
}
 
export default Dashboard;