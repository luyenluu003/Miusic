import { Link } from "react-router-dom"

const MenuHome = () => {
    return (
        <div className="min-w-[10%] lg:min-w[200px] max-w-min border-1 border-grey max-md:hidden">
            <div className=" fixed">
                <div className="max-w-[10%] flex flex-col">
                    <p className="text-[#3D3B4A] font-bold leading-6 size-4 text-center">MENU</p>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-home text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Home</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-ss-flame text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Trending</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-rectangle-list text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Playlist</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi fi-sr-blog-text text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Post</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-rr-book-bookmark text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Bookmark</p>
                    </div>
                </div>
                <div className="max-w-[10%] flex flex-col mt-8 border-b-[3px] border-t-[3px] border-[#262631]">
                    <p className="text-[#3D3B4A] font-bold leading-6 size-4 mt-5 text-center">CATEGORY</p>
                    <Link to='/' className="flex w-full mt-5 cursor-pointer  " >
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-ss-users-medical text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Community</p>
                    </Link>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-rs-credit-card text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Turturial</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-rs-comment-dots text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Message</p>
                    </div>
                    <div className="flex w-full mt-5 cursor-pointer mb-5  ">
                        <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-home text-white"></i></div>
                        <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Feedback</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MenuHome