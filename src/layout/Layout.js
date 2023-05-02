import Head from "next/head"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import styles from "../styles/Layout.module.css"

const Layout = ({ children, pagina }) => {
    return (
        <>
            <Head>
                <title>CRUD - {pagina}</title>
            </Head>
            <div className="md:flex">
                <aside className="md:w-3/12 bg-blueEdition">
                    <Sidebar />
                </aside>

                <div className="md:w-9/12 bg-bgEdition ">
                    <div className="grid grid-flow-row-2">
                        <div className={`${styles.border}`} >
                            <Header />
                        </div>
                        <main className="h-screen ">
                            {children}
                        </main>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Layout