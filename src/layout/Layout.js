import Head from "next/head"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import styles from "../styles/Layout.module.css"

import { ToastContainer } from "react-toastify";
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/pages/contexts/AuthContext"
import { useRouter } from "next/router"
import { Bars } from "react-loader-spinner"


import "react-toastify/dist/ReactToastify.css";

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};
const Layout = ({ children, pagina }) => {

  const { user } = useContext(AuthContext);
  const router = useRouter()
  const [mostarContenido, setMostrarContenido] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login")
    } else {
      setMostrarContenido(true)
    }
  }, [user])

  if (!mostarContenido)
    return (
      <div class="flex justify-center items-center h-screen">
        <Bars
          height="100"
          width="100"
          color="blue"
          ariaLabel="bars-loading"
          wrapperStyle={{}}
          wrapperClass="text-center justify-center"
          visible={true}
        />
      </div>

    )


  return (
    <>
      <Head>
        <title>CRUD - {pagina}</title>
      </Head>
      <div className={`md:flex`}>
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
      <ToastContainer />
    </>
  )
}

export default Layout
