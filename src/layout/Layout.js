import Head from "next/head"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import styles from "../styles/Layout.module.css"
import { ToastContainer } from "react-toastify";


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
      <ToastContainer />
    </>
  )
}


export default Layout
