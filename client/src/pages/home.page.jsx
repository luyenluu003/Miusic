import { useContext, useEffect, useState } from "react"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import axios from "axios"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import PlayMusic from "../components/play-music.component"
import MenuHome from "./menu.home"
import FriendPage from "./Friend.pages"
import { Link } from "react-router-dom"
import { UserContext } from "../App"
const HomePage = () => {
    const {
        userAuth: { username, isAdmin },
        setUserAuth,
    } = useContext(UserContext);

    let [blogs, setBlog] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null);

    const fetchLatestBlogs = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/latest-blogs")
            .then(({ data }) => {
                setBlog(data.blogs)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        fetchLatestBlogs()
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
                    <InPageNavigation routes={['menu', 'home', 'friends']} defaultHidden={["menu", 'home', 'friends']}>
                        {/* <h2 className="text-white ">Where are you going :D</h2> */}
                        <div className="ml-10">
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
                        <>
                            {
                                blogs == null ? <Loader />
                                    :
                                    blogs.map((blog, i) => {
                                        return <div transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <BlogPostCard content={blog} author={blog.author.personal_info} onClick={() => handleBlogCardClick(blog)} />
                                        </div>

                                    })
                            }
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

export default HomePage