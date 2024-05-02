import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import axios from "axios"
import PageNotFound from "./404.page"
import { Toaster } from "react-hot-toast"
import Loader from "../components/loader.component"
import { Link } from "react-router-dom"
import ModalUser from "../components/modal-user.components"

const AdminUsers= () => {
    let {userAuth:{isAdmin} } = useContext(UserContext)
    const [query,setQuery] = useState("")
    const [showMore, setShowMore] = useState(false);
    const [allUsers,setAllUsers] =useState(null)
    const [currentUser,setCurrentUser] = useState(null)

    const fetchAllUsers = () =>{
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/admin-get-all-users")
        .then(({data})=>{
            setAllUsers(data.users)
        })
        .catch(err=>{
            console.log(err)
        })
    }

    const fetchUser = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/search-user-admin", { query })
            .then(({ data: { user } }) => {
                console.log("User:", user); 
                setAllUsers(user)
            })
    }


    useEffect(()=>{
        fetchAllUsers()
        fetchUser()
    },[query])

    const handleSearch = (e) =>{
        let searchQuery= e.target.value;
        setQuery(searchQuery);
        if(e.keyCode==13 && searchQuery.length){
            setAllUsers(null);
        } 
    }


    const handleChange =(e) =>{
        if(!e.target.value.length){
            setQuery("");
            setAllUsers(null);
        }
    }

    const handleShowMore = (user) => {
        setCurrentUser(user); 
        setShowMore(true); 
    };

    
    
    
    return(
        <>
            {
            isAdmin ?
            <>
                <h1 className="max-md:hidden text-blue-gwen">All users</h1>
                <Toaster />
                <div className="relative max-md:mt-5 md:mt-8 mb-10">
                <input type="search" 
                className="w-full bg-grey p-4 pl-12 pr-6 rounded-full placeholder:text-drak-gray"
                placeholder="Search users"
                onChange={handleChange}
                onKeyDown={handleSearch}
                />
                <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-drak-gray"></i>
                </div>
                {
                    allUsers == null  ? <Loader />:
                    allUsers.map((user,i)=>{
                        return (
                            <>
                                <div className="flex mb-2 justify-between  border-b-[1px] p-4 border-blue-gwen relative  ">
                                    <h1 className="text-white mr-2 absolute bottom-[40%]">{i+1}</h1>
                                    <div className="flex flex-row ml-5">
                                        <img src={user.personal_info.profile_img} className="w-14 h-14 rounded-full"  />
                                        <div className="flex flex-col justify-center ml-2">
                                            <p className="text-white capitalize">{user.personal_info.fullname}</p>
                                            <Link className="text-white/80 text-sm" to={`/user/${user.personal_info.username}`}>@{user.personal_info.username}</Link>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-10 justify-around">
                                        <div className=" flex-col justify-center ml-2 hidden xl:flex">
                                            <p className="text-white capitalize">Blogs</p>
                                            <p className="text-white/80 text-sm text-center">{user.account_info.total_posts}</p>
                                        </div>
                                        <div className="hidden xl:flex flex-col justify-center ml-2">
                                            <p className="text-white capitalize">Reads</p>
                                            <p className="text-white/80 text-sm text-center">{user.account_info.total_reads}</p>
                                        </div>
                                        <button className="pr-4 py-2 underline text-[#22AA4A]" onClick={() => handleShowMore(user)}>See more</button>
                                        {/* <button className="pr-4 py-2 underline text-red/80 hidden xl:block" >Delete</button> */}

                                    </div>
                                    
                                </div>
                            </>
                        )
                    })
                }
                
                <ModalUser isVisible = {showMore} user={currentUser} onClose= {()=>setShowMore(false)} />
                
            </>
            :<PageNotFound />
            }
        </>
        
    )
}

export default AdminUsers