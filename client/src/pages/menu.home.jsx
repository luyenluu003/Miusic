import { useContext } from "react";
import { Link } from "react-router-dom"
import { UserContext } from "../App";

const MenuHome = () => {
    const {
        userAuth: { username, isAdmin },
        setUserAuth,
    } = useContext(UserContext);
    return (<div className="min-w-[10%] lg:min-w[200px] max-w-min border-1 border-grey max-md:hidden">
        <div className=" fixed">
            <div className="max-w-[10%] flex flex-col space-y-10">
                <p className="text-white/80 font-bold leading-6 size-4 text-center">MENU</p>
                <Link to={"/"} className="flex w-full mt-5 cursor-pointer">
                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#353340] hover:bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-home text-[lightgray] hover:text-white"></i></div>
                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-white/80 focus:text-[#3F95D7] hover:text-[#3F95D7]">Home</p>
                </Link>
                <Link to={"/trending"} className="flex w-full mt-5 cursor-pointer  ">
                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#353340] hover:bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-ss-flame text-[lightgray] hover:text-white"></i></div>
                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-white/80 focus:text-[#3F95D7] hover:text-[#3F95D7]">Trending</p>
                </Link>
                <Link to={`/user/${username}`} className="flex w-full mt-5 cursor-pointer  ">
                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#353340] hover:bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-rectangle-list text-[lightgray] hover:text-white"></i></div>
                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-white/80 focus:text-[#3F95D7] hover:text-[#3F95D7]">Playlist</p>
                </Link>
                <Link to={"editor"} className="flex w-full mt-5 cursor-pointer  ">
                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#353340] hover:bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi fi-sr-blog-text text-[lightgray] hover:text-white"></i></div>
                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-white/80 focus:text-[#3F95D7] hover:text-[#3F95D7]">Post</p>
                </Link>
                <Link to={"/rules"} className="flex w-full mt-5 cursor-pointer  ">
                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#353340] hover:bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-rs-credit-card text-[lightgray] hover:text-white"></i></div>
                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-white/80 focus:text-[#3F95D7] hover:text-[#3F95D7]">Support</p>
                </Link>
            </div>
        </div>
    </div>
    )

}
export default MenuHome