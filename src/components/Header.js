import styles from "../styles/Header.module.css"
import { Button } from "react-bootstrap"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AiOutlineUser } from "react-icons/ai"

const Header = () => {
    return (
        <div className={`${styles.barra} px-6`} >

            <div className="">

                <div className={`${styles.ruta}`} >Dashboard / Balance</div>
                <div className="text-3xl mt-1">Balance</div>

            </div>

            <div className={`${styles.icons}`} >

                <Button variant="link">
                    <IoMdNotificationsOutline color="#808080" size="25px"/>
                </Button>
                <Button variant="link">

                    <AiOutlineUser color="#808080" size="25px"/>
                </Button>

                <div>
                    <p className="pr-2 my-0 text-center">User</p>
                </div>

                <div className="ml-4">
                    <Button variant="dark">
                    Cerrar Sesion
                    </Button>
                </div>

            </div>
        </div>
    )
}

export default Header
