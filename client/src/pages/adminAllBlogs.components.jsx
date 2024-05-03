import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Toaster } from "react-hot-toast";
import PageNotFound from "./404.page";
import axios from "axios";
import Loader from "../components/loader.component";
import { Link } from "react-router-dom";
import ModalBlog from "../components/modalBlog.components";
import BlogPostCard from "../components/blog-post.component";

const AdminAllBlogs = () => {
    let {userAuth:{isAdmin} } = useContext(UserContext)
    const [query,setQuery] = useState("")
    const [allBlogs,setAllBlogs] =useState(null)
    const [showMore, setShowMore] = useState(false);
    const [currentBlog,setCurrentBlog] = useState(null)


    const fetChAllBlogs = () =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin-get-all-blogs")
        .then(({data})=>{
            setAllBlogs(data.blogs)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    
    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blog-admin", { query })
            .then(({ data: { blog } }) => {
                setAllBlogs(blog)
            })
    }

    useEffect(()=>{
        fetChAllBlogs()
        fetchBlog()
    },[query])

    const handleSearch = (e) =>{
        let searchQuery= e.target.value;
        setQuery(searchQuery);
        if(e.keyCode==13 && searchQuery.length){
            setAllBlogs(null);
        } 
    }



   


    const handleChange =(e) =>{
        if(!e.target.value.length){
            setQuery("");
            setAllBlogs(null);
        }
    }

    
    const handleShowMore = (blog) => {
        setCurrentBlog(blog); 
        setShowMore(true); 
    };


    return (
        <>
        {
        isAdmin ?
        <>
            <h1 className="max-md:hidden text-blue-gwen">All blogs</h1>
            <Toaster />
            <div className="relative max-md:mt-5 md:mt-8 mb-10">
            <input type="search" 
            className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-drak-gray"
            placeholder="Search blogs"
            onChange={handleChange}
            onKeyDown={handleSearch}
            />
            <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-drak-gray"></i>
            </div>

            {
                    allBlogs == null  ? <Loader />:
                    allBlogs.map((blog,i)=>{
                        return (
                            <>
                                <div className="flex mb-2 justify-between  border-b-[1px] p-4 border-blue-gwen relative  ">
                                    <h1 className="text-white mr-2 absolute bottom-[40%]">{i+1}</h1>
                                    <div className="flex flex-row ml-5">
                                        <img src={blog.banner} className="w-16 h-16 rounded-xl"  />
                                        <div className="flex flex-col justify-center ml-2">
                                            <Link className="text-white text-xl" to={`/blog/${blog.blog_id}`}>{blog.title}</Link>

                                        </div>
                                        
                                    </div>
                                    <div className="flex flex-row gap-10 justify-around">
                                        <div className=" flex-col justify-center ml-2 hidden xl:flex">
                                        <span class="btn-light py-1 px-4 block">{blog.tags}</span>

                                        </div>
                                        <div className=" flex-col justify-center ml-2 hidden xl:flex">
                                            <p className="text-white capitalize">views</p>
                                            <p className="text-white/80 text-sm text-center">{blog.activity.total_reads}</p>
                                        </div>
                                        <div className="hidden xl:flex flex-col justify-center ml-2">
                                            <p className="text-white capitalize">likes</p>
                                            <p className="text-white/80 text-sm text-center">{blog.activity.total_likes}</p>
                                        </div>
                                        <div className="hidden xl:flex flex-col justify-center ml-2">
                                            <p className="text-white capitalize">comments</p>
                                            <p className="text-white/80 text-sm text-center">{blog.activity.total_comments}</p>
                                        </div>
                                        <button className="pr-4 py-2 underline text-[#22AA4A]" onClick={() => handleShowMore(blog)}>See more</button>
                                        {/* <button className="pr-4 py-2 underline text-red/80 hidden xl:block" >Delete</button> */}

                                    </div>
                                    
                                </div>
                            </>
                        )
                    })
                }
                {/* <>
                            {
                                allBlogs == null ? <Loader />
                                    :
                                    allBlogs.map((blog, i) => {
                                        return <div transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <BlogPostCard content={blog} author={blog.author.personal_info} onClick={() => handleBlogCardClick(blog)} />
                                        </div>

                                    })
                            }
                        </> */}
            <ModalBlog isVisible = {showMore} blog={currentBlog} onClose= {()=>setShowMore(false)} />
            
        </>
        :<PageNotFound />
        }
    </>
    )
}

export default AdminAllBlogs