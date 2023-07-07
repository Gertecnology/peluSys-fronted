import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import Image from 'next/image';
import LoginImg from "../../public/LoginImage.png"
import { Bars } from 'react-loader-spinner';
import { fetchUser } from '@/data/authentication';
import { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useRouter } from 'next/router';


const Login = () => {
    const regexEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const {user, setUser} = useContext(AuthContext);
    const [submitError, setSubmitError] = useState(false);
    const router = useRouter();

    const onSubmit = async (data) => {
        const respuesta = await fetchUser(data);
        if(!respuesta || !Object.keys(respuesta).includes("token")){
            setSubmitError(true);
            return
        }
        if(respuesta.status || respuesta.code || respuesta.mensaje){
            setSubmitError(true);
            return
        }
        await setUser(respuesta);
        router.push("/citas")
        return
    }

    return (
        <div
            className="h-screen block align-middle p-10"
            style={{
                backgroundImage:
                    "linear-gradient(to bottom, #1D158C 50%, #FFF 50%)",
            }}
        >


            <div>
                <h1 className="text-4xl font-bold mb-2 text-white font-impact text-left">
                    Bienvenido al panel administrativo
                </h1>
                <h3 className="mb-8 text-white font-impact text-left">
                    Sistema ERP para Peluquerias
                </h3>
            </div>

            <div class="relative">
                <div className='hidden lg:block absolute -top-20 right-36 '>
                    <div>
                        <Image src={LoginImg} width={300} height={300} />
                    </div>
                </div>
            </div>

            <div className="flex justify-center align-middle">
                
                <div className="w-full max-w-3xl bg-white p-8 m-3 rounded-lg shadow shadow-black">

                    
                    <h2 className="text-2xl font-bold mb-8">Iniciar sesión</h2>
                    <p className={`${!submitError ? "invisible" : ""} text-red-700`}>Usuario o contraseña incorrectos.</p> 
                    <Form onSubmit={handleSubmit(onSubmit)}>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Correo Electronico
                            </Form.Label>
                            <Form.Control
                                {...register("email", {
                                    required: true
                                })}

                                isInvalid={errors.email}
                                placeholder="Ingrese su correo electronico"
                            />
                        </Form.Group>



                        <Form.Group className="mb-3">
                            <Form.Label>
                                Contraseña
                            </Form.Label>
                            <Form.Control
                                {...register("password", { required: true })}

                                isInvalid={errors.password}
                                placeholder="Ingrese su Contraseña"
                                type="password"
                            />
                        </Form.Group>

                        <div className="flex items-center justify-between w-full">
                            <button
                                className=" w-full justify-center text-center align-middle bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                {isSubmitting ? <Bars
                                    height="25"
                                    width="25"
                                    color="#FFF"
                                    ariaLabel="bars-loading"
                                    wrapperStyle={{}}
                                    wrapperClass="text-center justify-center"
                                    visible={true}
                                /> : "Iniciar Sesion"}
                            </button>
                        </div>
                    </Form>
                </div>
            </div>


        </div>
    );
};

export default Login;
