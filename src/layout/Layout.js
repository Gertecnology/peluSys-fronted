import Head from "next/head"
import Sidebar from "../components/Sidebar/Sidebar"
import Header from "../components/Header/Header"
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
      <div className="flex justify-center items-center h-screen">
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
          <div>

              <Header />
              <Sidebar>{children}</Sidebar>
          </div>
          <ToastContainer />
      </>

  )
}

export default Layout
