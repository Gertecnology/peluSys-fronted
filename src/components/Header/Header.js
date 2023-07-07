import { useContext, useEffect, useState } from "react"
import { AuthContext } from "@/pages/contexts/AuthContext"
import {BsPersonBoundingBox} from "react-icons/bs"
import { FiLogOut } from "react-icons/fi";


const Header = ({ }) => {
    const { user, setUser } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const  [urlPhoto , setUrlPhoto] = useState('')


    // console.log(user);

    useEffect(() => {
        if (!user) return
        setUsername(user?.username)
        setUrlPhoto(user?.urlPhoto)

    }, [user, username])


    return (

        <div>
            <div className="pt-0 pr-0 pb-0 pl-0 mt-0 mr-0 mb-0 ml-0 bg-white top-0 w-full z-50">
            <div className="bg-white">
                <div className="flex-col flex">
                    <div className="w-full border-b-2 border-gray-200">
                        <div className="bg-white h-16 justify-between items-center mx-auto px-4 flex">
                            {/*Logo*/}
                            <div>
                                <img
                                    src="https://res.cloudinary.com/speedwares/image/upload/v1659284687/windframe-logo-main_daes7r.png"
                                    className="block btn- h-8 w-auto" alt="" />
                            </div>
                            <div className="lg:block mr-auto ml-40 hidden relative max-w-xs">
                                <p className="pl-3 items-center flex absolute inset-y-0 left-0 pointer-events-none"> </p>
                            </div>
                            <div className="md:space-x-6 justify-end items-center ml-auto flex space-x-3">
                                <div className="justify-center items-center flex relative">
                                  { urlPhoto?.length ? <img
                                        src={urlPhoto}
                                        className="object-cover btn- h-9 w-9 rounded-full mr-2 bg-gray-300" alt="" /> :
                                        <BsPersonBoundingBox className="object-cover h-9 w-9 mr-2 bg-gray-300"/>    }
                                        <div className="block">                                    
                                        <p className="font-semibold text-sm mb-0">{username}</p>
                            
                                        <FiLogOut size={25} className="hover:cursor-pointer self-end justify-end text-right " onClick={() => setUser(undefined)}/>
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
    );
}

export default Header
