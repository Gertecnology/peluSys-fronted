import Layout from "@/layout/Layout"
import Table from "../components/Table"
import Filtro from "@/shared/Filtro"

const Producto = () => {
    return (
        <>
            <Layout pagina={"Producto"}>
                <div>

                    <Filtro
                        titulo="Productos del Sistema"
                        opciones={"Filtrar por"}
                        texto={"Buscar"}
                        sTexto={"Agregar Nuevo"}
                    />
                    <div>

                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Producto
