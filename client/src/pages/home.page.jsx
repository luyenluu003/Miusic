import { useEffect, useState } from "react"
import AnimationWrapper from "../common/page-animation"
import InPageNavigation from "../components/inpage-navigation.component"
import axios from "axios"
import Loader from "../components/loader.component"
import BlogPostCard from "../components/blog-post.component"
import PlayMusic from "../components/play-music.component"
import MenuHome from "./menu.home"
import FriendPage from "./Friend.pages"
const HomePage = () => {

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
                        <h2 className="text-white ">Where are you going :D</h2>
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