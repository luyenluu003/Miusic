import testlogo from "../imgs/testlogo.svg";
import notfound from "../imgs/404.jpg";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
const PageNotFound = () => {
    const navgate = useNavigate();
    return (
        <section className="h-cover relative p-10 flex flex-col bg-gray">
            <div className="min-w-screen  bg-blue-100 flex items-center p-5 overflow-hidden relative">
                <div className="flex-1 min-h-full min-w-full rounded-3xl bg-dark-grey shadow-xl p-10  text-gray-800 relative md:flex items-center text-center md:text-left">
                    <div className="w-full md:w-1/2">
                        <div className="mb-10 lg:mb-15 flex items-center">
                            <img className="w-12 h-12 bg-dark-grey " src={testlogo}/>
                            <p className="text-3xl text-white font-black ml-5">MIUSIC</p>
                        </div>
                        <div className="mb-10 md:mb-20 text-white font-light">
                            <h1 className="font-black uppercase text-3xl lg:text-5xl text-yellow-500 mb-10">You seem to be lost!</h1>
                            <p>The page you're looking for isn't available.</p>
                            <p>Try searching again or use the Go Back button below.</p>
                        </div>
                        <div className="mb-20 md:mb-0">
                            <button onClick={()=>navgate("/")} className="flex items-center justify-center text-center text-lg font-light outline-none focus:outline-none transform transition-all hover:scale-110 text-yellow-500 text-white hover:text-yellow-600"><i className=" mr-2" ></i><FaArrowLeft className="mr-2" />Go Back</button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 text-center">
                 
                       <img className="w-full rounded-2xl opacity-[0.9] max-w-lg lg:max-w-full mx-auto " src={notfound}  />
                        <a className="text-xs text-white">Please contact the hotline to fix the problem - luyenluu003@gmail.com</a>
                    </div>
                </div>
                <div className="w-64 md:w-96 h-96 md:h-full bg-blue-200 bg-opacity-30 absolute -top-64 md:-top-96 right-20 md:right-32 rounded-full pointer-events-none -rotate-45 transform"></div>
                <div className="w-96 h-full bg-yellow-200 bg-opacity-20 absolute -bottom-96 right-64 rounded-full pointer-events-none -rotate-45 transform"></div>
            </div>
            <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10">
                <div>
                    <Link title="Buy me a beer" to="/" target="_blank" className="block w-16 h-16 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12">
                        <img className="object-cover object-center w-full h-full rounded-full" src={testlogo} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default PageNotFound