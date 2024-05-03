import testlogo from "../imgs/testlogo.svg";
import notfound from "../imgs/404.jpg";
import naruto from "../imgs/naruto1.png";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
const Helppage = () => {
    const navgate = useNavigate();
    return (
        <div className="h-cover relative pl-10 pt-3 pb-2  flex flex-col bg-gray">
                <h1 className="font-black text-2xl lg:text-3xl text-white">Contact us</h1>
                <form className="bg-dark-grey shadow-md  px-8 pt-6 pb-8 mb-4 flex flex-col rounded-5 w-% max-w-[600px]">
                    <input type="text" id="name" required placeholder="Your Name" 
                    className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5]"/>
                    <input type="email" id="email" required placeholder="Email id"
                    className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5]"/>
                    <input type="text" id="phone" required placeholder="Phone no"
                    className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5]"/>
                    <textarea id="message" required placeholder="How can i help you?" rows="4"
                    className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5]"></textarea>
                    <button type="submit" className="bg-[#8da4f1] text-white rounded-0 m-2.5 [margin-left:200px]  p-5 w-[150px] [border-radius:30px]">Send</button>
                </form>
        </div>
    )
}

export default Helppage