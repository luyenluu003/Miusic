import React from "react"
import { Link } from "react-router-dom"
import AboutUserAdmin from "./aboutuser.components.admin"
const ModalUser = ({ isVisible, user, onClose }) => {
    if (!isVisible) return null
    console.log("user:", user)
    const handleClose = (e) => {
        if (e.target.id === "wrapper") onClose();
    }
    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center transition transition-opacity" id="wrapper" onClick={handleClose}>
            <div className="w-full md:w-[600px] flex flex-col mx-2 md:mx-0 ">
                <div className="bg-white p-4 rounded">
                    <div className="flex flex-row justify-between relative">
                        <h1 className="text-base font-inter ">User information:</h1>
                        <div className="">
                            <button class="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={() => onClose()}><i class="fi fi-br-cross text-2xl mt-1"></i></button>
                        </div>
                    </div>
                    <div className="flex flex-row mt-2 justify-center">
                        <img src={user.personal_info.profile_img} className="w-32 h-32 rounded-full mr-5" alt="" />
                        <div className="flex flex-col justify-center ml-2">
                            <p className="text-2xl capitalize text-black">Fullname: {user.personal_info.fullname}</p>
                            <p className="text-xl  text-black">Email: {user.personal_info.email}</p>
                            <Link className="text-gray-dark text-xl" to={`/user/${user.personal_info.username}`}>Username :@{user.personal_info.username}</Link>
                            <p className="text-black">
                                {user.account_info.total_posts != null ? user.account_info.total_posts.toLocaleString() : '0'} Blogs -
                                {user.account_info.total_reads != null ? user.account_info.total_reads.toLocaleString() : '0'} Reads
                            </p>
                            
                        </div>

                    </div>
                    <div className="flex flex-row mt-2 justify-center ">
                        <AboutUserAdmin bio={user.personal_info.bio} social_links={user.social_links} joinedAt={user.joinedAt} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ModalUser