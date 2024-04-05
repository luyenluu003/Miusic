import { useParams } from "react-router-dom"
import InPageNavigate from "../components/inpage-navigation.component"
import AnimationWrapper from "../common/page-animation"

import MenuHome from "./menu.home"
import { useEffect, useState } from "react"
import Loader from "../components/loader.component"
import PlayMusic from "../components/play-music.component"
import axios from "axios"
import BlogPostCard from "../components/blog-post.component"
import FriendPage from "./Friend.pages"
import { filterPaginationData } from "../common/filter-pagination-data"
import UserCard from "../components/usercard.components"
const SearchPage = () => {
    let [blogs, setBlog] = useState(null)
    let [users, setUsers] = useState(null)
    const [selectedBlog, setSelectedBlog] = useState(null);


    const handleBlogCardClick = (blogData) => {
        setSelectedBlog(blogData);
    };
    let { query } = useParams()

    const searchBlogs = ({ page = 1, create_new_arr = false }) => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", { query, page })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { query },
                    create_new_arr
                })
                setBlog(formatedData)
            }).catch((err) => {
                console.log(err)
            })
    }

    const fetchUsers = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-users", { query })
            .then(({ data: { users } }) => {
                setUsers(users)
            })
    }


    useEffect(() => {
        resetState()
        searchBlogs({ page: 1, create_new_arr: true })
        fetchUsers()
    }, [query])

    const resetState = () => {
        setBlog(null)
        setUsers(null)
    }

    const UserCardWrapper = () => {
        return (
            <>
                {
                    users == null ? <Loader /> :
                        users.length ?
                            users.map((user, i) => {
                                return (
                                    <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.08 }}>
                                        <UserCard user={user} />
                                    </AnimationWrapper>
                                )
                            })
                            : <p className="text-white ml-4 mt-4">User related to search <i className="fi fi-rr-user ml-1 mt-2"></i></p>
                }
            </>
        )
    }

    return (
        <AnimationWrapper>
            <section className="py-4 px-[5vw] md:px-[7vw] lg:px-[4vw] flex h-cover  justify-center gap-10 bg-gray ">
                <MenuHome />
                <div className="w-full bg-gray">
                    <InPageNavigate routes={['menu', `Search results from "${query}"`, "Accounts matched"]} defaultHidden={["menu", "Search results from '${query}'", "Accounts matched"]} >
                        <h2 className="text-white ">Where are you going :D</h2>
                        <>
                            {
                                blogs == null ? <Loader />
                                    :
                                    blogs.results.length ?
                                        blogs.results.map((blog, i) => {
                                            return <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                                                <BlogPostCard content={blog} author={blog.author.personal_info} onClick={() => handleBlogCardClick(blog)} />
                                            </AnimationWrapper>
                                        })
                                        : <p className="text-white">No result found</p>
                            }


                        </>

                        <h3 className="text-white">Hi</h3>

                    </InPageNavigate>

                </div>
                {/* righthome */}
                <div className="min-w-[22%] lg:min-w[400px] max-w-min border-1 border-grey pl-8 max-md:hidden text-white mt-8 ">
                    <div className="w-full fixed">
                        <div className="max-w-[20%] flex flex-col bg-[#252836] rounded-xl p-4 mt-4 max-h-[40vh] ">
                            <h4 className="ml-4 font-medium text-[16px] text-[#ffffff] line-clamp-2">User related to search {query}</h4>
                            <div className="flex flex-col overflow-auto " style={{ scrollbarWidth: "none" }}>
                                <UserCardWrapper />
                            </div>
                        </div>
                    </div>
                </div>

                {/* <FriendPage />   */}
            </section >
            <PlayMusic selectedBlog={selectedBlog} />
        </AnimationWrapper>
    )
}

export default SearchPage