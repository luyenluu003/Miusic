import axios from "axios"
import { useContext, useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import AnimationWrapper from "../common/page-animation"
import MenuHome from "./menu.home"
import InPageNavigation from "../components/inpage-navigation.component"
import { UserContext } from "../App"
import AboutUser from "../components/about.components"
import { filterPaginationData } from "../common/filter-pagination-data"
import BlogPostCard from "../components/blog-post.component"
import Loader from "../components/loader.component"
import PageNotFound from "./404.page"
import ImageBlogCard from "../components/imageblog.components"

export const profileDataStructure = {

    personal_info: {
        fullname: "",
        username: "",
        profile_img: "",
        bio: "",
    },
    account_info: {
        total_posts: 0,
        total_blogs: 0,
    },
    social_links: {},
    joinedAt: " ",
}
const ProfilePage = () => {
    let { id: profileId } = useParams()
    let [profile, setProfile] = useState(profileDataStructure)
    let [blogs, setBlogs] = useState(null)
    let [profileLoaded, setProfileLoaded] = useState("")
    let [loading, setLoading] = useState(true)
    let { personal_info: { fullname, username: profile_username, profile_img, bio }, account_info: { total_posts, total_reads }, social_links, joinedAt } = profile


    const getBlogs = ({ page = 1, user_id }) => {
        user_id = user_id == undefined ? blogs.user_id : user_id;
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-blogs", {
            author: user_id,
            page
        })
            .then(async ({ data }) => {
                let formatedData = await filterPaginationData({
                    state: blogs,
                    data: data.blogs,
                    page,
                    countRoute: "/search-blogs-count",
                    data_to_send: { author: user_id }
                })

                formatedData.user_id = user_id;
                setBlogs(formatedData)
            })
    }

    useEffect(() => {
        if (profileId !== profileLoaded) {
            setBlogs(null);
            setLoading(true);
        }
        if (!blogs) {
            fetchUserProfile();
        }
    }, [profileId, blogs, profileLoaded]);

    const fetchUserProfile = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-profile", { username: profileId })
            .then(({ data: user }) => {
                if (user != null) {
                    setProfile(user);
                    setProfileLoaded(profileId);
                    getBlogs({ user_id: user._id });
                    setLoading(false);
                }
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    };

    // const resetStates = () =>{
    //     setProfile(profileDataStructure)

    //     setLoading(true)
    //     setProfileLoaded("")
    // }

    let { userAuth: { username } } = useContext(UserContext)

    return (
        <AnimationWrapper>
            {
                loading ? <Loader /> :
                    profile_username.length ?
                        <div className="py-4 px-[5vw] md:px-[7vw] lg:px-[4vw] flex h-cover  justify-center gap-10 bg-gray ">
                            <MenuHome />

                            {/* home */}
                            <div className="w-full" >
                                <InPageNavigation routes={['menu', 'homeprofile']} defaultHidden={["menu", 'homeprofile']}>
                                    <>
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
                                    </>
                                    {
                                        <>
                                            <div className="flex flex-col md:flex-row w-full p-5 items-center md:items-start border-b-[1px] border-blue-gwen ">
                                                <img src={profile_img} className="w-40 h-40 rounded-full mb-5 md:mb-0" />
                                                <div className="flex flex-col md:ml-12 text-center md:text-start">
                                                    <h1 className="text-2xl font-medium text-white">@{profile_username}</h1>
                                                    <p className="text-xl capitalize text-white  mb-1">{fullname}</p>
                                                    <p className="text-white">
                                                        {total_posts != null ? total_posts.toLocaleString() : '0'} Blogs -
                                                        {total_reads != null ? total_reads.toLocaleString() : '0'} Reads
                                                    </p>
                                                    <div className="flex gap-4 mt-2 cursor-pointer justify-center md:justify-start">
                                                        {
                                                            profileId == username ? <Link className="btn-blue-gwen rounded-md " to="/settings/edit-profile">Edit Profile </ Link> :
                                                                <h1 className="text-xl text-white">Tìm hiểu thêm thông tin về {fullname} nhé!</h1>
                                                        }
                                                    </div>
                                                </div>
                                                <AboutUser bio={bio} social_links={social_links} joinedAt={joinedAt} />
                                            </div>
                                            <div className="flex flex-col md:flex-row w-full  items-center md:items-start mt-5">
                                                <div className="md:mt-12 w-full flex flex-wrap justify-center ">
                                                    <>
                                                        {
                                                            blogs == null ? (
                                                                <Loader />
                                                            ) : (
                                                                blogs.results.length ? (
                                                                    blogs.results.map((blog, i) => (
                                                                        <AnimationWrapper transition={{ duration: 1, delay: i * 0.05 }} key={i}>
                                                                            <ImageBlogCard content={blog} author={blog.author.personal_info} />
                                                                        </AnimationWrapper>
                                                                    ))
                                                                ) : (
                                                                    <h1 className="text-center text-xl text-white">Người dùng chưa đăng bài viết nào</h1>
                                                                )
                                                            )
                                                        }
                                                    </>
                                                </div>
                                            </div>
                                        </>
                                    }

                                </InPageNavigation>
                            </div>

                        </div>
                        :
                        <PageNotFound />
            }

        </AnimationWrapper >
    )
}

export default ProfilePage