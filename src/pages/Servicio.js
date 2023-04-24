import Layout from "@/layout/Layout"
import Table from "../components/Table"
import Filtro from "@/shared/Filtro"



const Servicio = () => {
    return (
        <>
            <Layout pagina={"Servicio"}>
                <div>

                    <Filtro
                        titulo="Servicios del Sistema"
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

export default Servicio
