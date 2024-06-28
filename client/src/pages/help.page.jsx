import testlogo from "../imgs/testlogo.svg";
import notfound from "../imgs/404.jpg";
import naruto from "../imgs/naruto1.png";
import { FaArrowLeft } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from "react-hot-toast";


const Helppage = () => {
    const navgate = useNavigate();
    const [checksend, setChecksend] = useState(false);

    const form = useRef();

    const sendEmail = (e) => {
        e.preventDefault();

        emailjs
            .sendForm('service_kh0nqvo', 'template_082lpwz', form.current, {
                publicKey: 'EDLUctPCftx4Dot6M',
            })
            .then(
                () => {
                    toast.success('SUCCESS!');
                    setChecksend(true)
                },
                (error) => {
                    toast.error('FAILED...', error.text);
                },
            );
    };
    const handleClick = () => {
        if(checksend){
            toast.success("Email sent successfully!")
            navgate("/");
        }
    }
    return (
        <AnimationWrapper>
            <Toaster />
            <div className="w-full flex flex-col text-center  justify-center bg-gray">
                <h1 className="text-white line-clamp-1 mt-5 text-2xl">Contact Us </h1>
                <p className="text-white line-clamp-4 ">Thank you for your interest in Music. We are always happy to hear from you. You can connect with us through the following methods</p>
                <div className="flex flex-row justify-around mt-5">
                    <div className=" flex-col md:flex-col hidden md:flex gap-10 ">
                        <div className="flex flex-row gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mt-2">
                                <i class="fi fi-ss-marker text-2xl"></i>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl text-blue-gwen text-start">Address</h1>
                                <p className="text-white/80 line-clamp-1">35 Ninh Binh</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <i class="fi fi-rr-phone-call text-2xl"></i>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl text-blue-gwen text-start">Phone</h1>
                                <p className="text-white/80 line-clamp-1">1234567</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-3">
                            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                                <i class="fi fi-rr-envelope text-2xl"></i>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-2xl text-blue-gwen text-start">Email</h1>
                                <p className="text-white/80 line-clamp-1">luyenluu003@gmail.com</p>
                            </div>
                        </div>
                    </div>
                    <div className="h-cover relative flex flex-col rounded-2xl">
                        <form className="bg-gray-dark shadow-md rounded-2xl  md:px-8 md:pt-6 md:pb-8 p-2  flex flex-col rounded-5 w-% md:max-w-[600px] w-full" ref={form} onSubmit={sendEmail}>
                            <input type="text" name="username" required placeholder="Your Name"
                                className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5] rounded-xl" />
                            <input type="email" name="email" required placeholder="Email"
                                className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5] rounded-xl" />
                            <input type="text" name="phone" required placeholder="Phone number"
                                className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5] rounded-xl" />
                            <textarea name="message" required placeholder="How can i help you?" rows="4 "
                                className="rounded-0 m-2.5 p-5 outline-none bg-[#f5f5f5] rounded-xl"></textarea>
                            <button type="submit" className="bg-blue-gwen text-white rounded-0 m-2.5 [margin-left:200px]  p-4 w-[150px] [border-radius:30px]" onClick={handleClick()}>Send</button>
                        </form>

                    </div>
                </div>
                <div className="flex items-end justify-end fixed bottom-0 right-0 mb-4 mr-4 z-10 mt-10">
                    <div>
                        <Link title="Buy me a beer" to="/" target="_blank" className="block w-20 h-20 rounded-full transition-all shadow hover:shadow-lg transform hover:scale-110 hover:rotate-12 animate-bounce">
                            <img className="object-cover object-center w-full h-full rounded-full" src={naruto} />
                        </Link>
                    </div>
                </div>
            </div>
        </AnimationWrapper>
    )
}

export default Helppage