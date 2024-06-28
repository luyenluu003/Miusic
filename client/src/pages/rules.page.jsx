import testlogo from "../imgs/testlogo.svg";
import notfound from "../imgs/404.jpg";
import naruto from "../imgs/naruto1.png";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
const Rules = () => {
    const navgate = useNavigate();
    return (
        <section className="h-cover relative p-10 flex flex-col bg-gray">
            <div className="min-w-screen  bg-blue-100 flex items-center p-5 overflow-hidden relative">
                <div className=" h-full mt-10 min-w-full rounded-3xl bg-blue-gwen  shadow-xl p-10  text-gray-800 relative md:flex items-center text-center md:text-left">
                    <div className="w-full relative">
                        <div className="rules">
                          
                            <Link to="/helppage" className="mt-5 flex items-center justify-center text-center text-17xl font-bold outline-none 
                            focus:outline-none transform transition-all hover:scale-110 text-yellow-500 text-white hover:text-yellow-600 cursor-pointer">
                                <div className="w-[180px] h-10 bg-gray-900 justify-center text-center rounded-3xl">
                                    <p className="text-7xl pt-2">Support mailbox</p>
                                </div>
                            </Link>
                            <Link to="/blogtroll" className="mt-5 flex items-center justify-center text-center text-17xl font-bold outline-none 
                            focus:outline-none transform transition-all hover:scale-110 text-yellow-500 text-white hover:text-yellow-600 cursor-pointer">
                                <div className="w-[180px] h-10 bg-gray-900 justify-center text-center rounded-3xl">
                                    <p className="text-7xl pt-2">terms of use</p>
                                </div>
                            </Link>
                        </div>
                        <div className="mb-20 md:mb-0">
                            <button onClick={()=>navgate("/")} className="flex items-center justify-center text-center text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 text-white hover:text-yellow-600"><i className=" mr-2" ></i><FaArrowLeft className="mr-2" />Go Back</button>
                        </div>
                    </div>
                </div>
                <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
                <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
            </div>
            <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
                <div>
                    <Link title="Buy me a beer" to="/" target="_blank" className="block w-20 h-20 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12 animate-bounce">
                        <img className="object-cover object-center w-full h-full rounded-full" src={naruto} />
                    </Link>   
                </div>
            </div>
        </section>
    )
}

export default Rules