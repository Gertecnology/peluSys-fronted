import { useContext, useEffect, useState } from "react"
import styles from "../styles/Header.module.css"
import { Button } from "react-bootstrap"
import { IoMdNotificationsOutline } from "react-icons/io"
import { AiOutlineUser } from "react-icons/ai"
import { AuthContext } from "@/pages/contexts/AuthContext"
import { Button } from "react-bootstrap";

const Header = ({}) => {
    const {user, setUser} = useContext(AuthContext);
    const [username, setUsername] = useState("");
    

    useEffect( () => {
        if(!user) return
        setUsername(user?.username)
    },[user,username])


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

                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                <p className="px-2">{username}</p>
                <Button variant="outlined" onClick={() => setUser(undefined)}>Cerrar Sesion</Button>
            </div>
        </div>
    )
}

export default Header
