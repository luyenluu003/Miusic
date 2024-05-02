import { useContext, useEffect, useState } from "react"
import AnimationWrapper from "../common/page-animation"
import { Link } from "react-router-dom"
import InPageNavigation from "../components/inpage-navigation.component"

import MenuHome from "./menu.home"
import { UserContext } from "../App"
import axios from "axios"
import Loader from "../components/loader.component"
import FriendPage from "./Friend.pages"
import PlayMusic from "../components/play-music.component"

const TrenDing = () => {
    const {
        userAuth: { username },
    } = useContext(UserContext);

    let [loading, setLoading] = useState(true)
    let [newAlBums, setNewAlbums] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null);


    const fetchNewAlBums = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/new-albums")
            .then(({ data }) => {
                console.log("data", data)
                setNewAlbums(data.blogs)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        console.log("newAlBums", newAlBums)
        fetchNewAlBums()
    }, [])

    const handleBlogCardClick = (blogData) => {
        setSelectedBlog(blogData);
    };



    return (
        <div>
            <div className="py-4 px-[5vw] md:px-[7vw] lg:px-[4vw] flex h-cover  justify-center gap-10 bg-gray ">
                <MenuHome />

                {/* home */}
                <div className="w-full " >
                    <InPageNavigation routes={['menu', 'trending', 'friends']} defaultHidden={["menu", 'trending', 'friends']}>
                        {/* <h2 className="text-white ">Where are you going :D</h2> */}
                        <div className="ml-10">
                            <div className="max-w-[10%] flex flex-col">
                                <p className="text-[#3D3B4A] font-bold leading-6 size-4 text-center">MENU</p>
                                <Link to='/' className="flex w-full mt-5 cursor-pointer  ">
                                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-home text-white"></i></div>
                                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Home</p>
                                </Link>
                                <Link to='/trending' className="flex w-full mt-5 cursor-pointer  ">
                                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-ss-flame text-white"></i></div>
                                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Trending</p>
                                </Link>
                                <Link to={`/user/${username}`} className="flex w-full mt-5 cursor-pointer  ">
                                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi-sr-rectangle-list text-white"></i></div>
                                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Profile</p>
                                </Link>
                                <Link to='/editor' className="flex w-full mt-5 cursor-pointer  ">
                                    <div className="min-w-8 min-h-8 text-center relative my-auto rounded-[10px] bg-[#3F95D7]"><i class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 fi fi fi-sr-blog-text text-white"></i></div>
                                    <p className="font-normal text-xl ml-10 text-center my-auto leading-6 text-[#3D3B4A] focus:text-[#3F95D7] hover:text-[#3F95D7]">Post</p>
                                </Link>
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
                        <>
                            <div className="w-full  ">
                                <div className="flex flex-col items-center md:items-start border-b-[1px] border-blue-gwen ">
                                    <h1 className="text-white text-2xl  text-center">New albums</h1>
                                    <div className="flex flex-row items-center flex-wrap overflow-auto gap-2 text-center justify-center max-h-[30vh] " style={{ scrollbarWidth: "none" }}>
                                        {
                                            newAlBums == null ? <Loader />
                                                :
                                                newAlBums.map((album, i) => {
                                                    return <div transition={{ duration: 1, delay: i * .1 }} key={i}>

                                                        <div className="p-2 mt-2 mb-2 w-36 flex flex-col cursor-pointer hover:scale-105 ease-in-out duration-100 rounded-xl hover:bg-blue-gwen focus:bg-blue-gwen">
                                                            <img src={album.banner} className="w-32 h-32  rounded-xl " onClick={() => handleBlogCardClick(album)} />
                                                            <Link to={`/blog/${album.blog_id}`}>
                                                            <p className="text-white text-xl line-clamp-1 mt-2">{album.title}</p>

                                                            </Link>
                                                            <Link to={`/user/${album.author.personal_info.username}`}>
                                                            <p className="text-white/70 text-sm line-clamp-1 mt-2">{album.author.personal_info.username}</p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                })
                                        }
                                    </div>
                                </div>
                                <div className="flex flex-col items-center md:items-start  ">
                                    <h1 className="text-white text-2xl mt-2  text-center">Top trending</h1>
                                    <div className="flex flex-row items-center flex-wrap overflow-auto gap-2 text-center justify-center">
                                        {
                                            newAlBums == null ? <Loader />
                                                :
                                                newAlBums.map((album, i) => {
                                                    return <div transition={{ duration: 1, delay: i * .1 }} key={i}>

                                                        <div className="p-2 mt-2 mb-2 w-36 flex flex-col cursor-pointer hover:scale-105 ease-in-out duration-100 rounded-xl hover:bg-blue-gwen focus:bg-blue-gwen">
                                                            <img src={album.banner} className="w-32 h-32  rounded-xl " onClick={() => handleBlogCardClick(album)} />
                                                            <Link to={`/blog/${album.blog_id}`}>
                                                            <p className="text-white text-xl line-clamp-1 mt-2">{album.title}</p>

                                                            </Link>
                                                            <Link to={`/user/${album.author.personal_info.username}`}>
                                                            <p className="text-white/70 text-sm line-clamp-1 mt-2">{album.author.personal_info.username}</p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                })
                                        }
                                    </div>
                                </div>

                            </div>

                        </>
                        <FriendPage />

                    </InPageNavigation>
                </div>
                {/* righthome */}
                <div className="min-w-[22%] lg:min-w[400px] max-w-min border-1 border-grey pl-8 max-md:hidden text-white mt-8">
                    <div className="w-full fixed">
                        <FriendPage />
                    </div>
                </div>
            </div>
            <PlayMusic selectedBlog={selectedBlog} />
        </div >
    )

}

export default TrenDing