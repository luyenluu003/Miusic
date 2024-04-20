import { useContext, useEffect, useState } from "react"
import { UserContext } from "../App"
import axios from "axios"
import Loader from "../components/loader.component"
import { Link } from "react-router-dom"



const FriendPage = () =>{

    let [users,setUsers] = useState(null)
    let [viewUsers,setViewUsers] = useState(null)

    const fetchUser = () => {
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-users")
        .then(({data})=>{
            console.log(data)
            setUsers(data.users)
        })
        .catch(err => {
            console.log(err)
        })      
    }
    const fetchViewUser = () =>{
        axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/view-arrange-user")
        .then(({data})=>{
            console.log(data);
            setViewUsers(data.users)
        })
    }
    useEffect(() => {
        fetchUser()
        fetchViewUser()
    },[])
    return (
        
        <>
            <div className="w-full md:max-w-[20%] flex flex-col bg-[#252836] rounded-xl p-4">
                    <h4 className="ml-4 font-medium text-[16px] text-[#ffffff]">Top Views</h4>
                    <div className="flex w-full flex-wrap  max-h-[150px] mt-4 justify-around gap-8 overflow-auto"  style={{ scrollbarWidth: "none" }}>
                    {
                        viewUsers == null ? <Loader />:
                        viewUsers.map((viewUser,i) =>{
                            return(
                                <div transition={{ duration: 1, delay: i * .1 }} key={i}>
                                    <div className="w-[60px] h-[60px] relative ">
                                        <Link to={`/user/${viewUser.personal_info.username}`}>
                                            <img className="rounded-full" src={viewUser.personal_info.profile_img}/>
                                        </Link>
                                        <div className="w-3 h-3 rounded-full bg-[#53bdfa] absolute bottom-0  left-12">
                                            <i  className="fi fi-sr-check absolute text-[4px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2   text-white"></i>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                    </div>
                
                </div>
                
                <div className="f-full md:max-w-[20%] flex flex-col bg-[#252836] rounded-xl p-4 mt-4 max-h-[40vh] ">
                    <h4 className="ml-4 font-medium text-[16px] text-[#ffffff]">Friends</h4>
                    <div className="flex flex-col overflow-auto "  style={{ scrollbarWidth: "none" }}>
                        <>
                        {
                            users == null ? <Loader />:
                            users.map((user,i) =>{
                                return <div transition={{ duration: 1, delay: i * .1 }} key={i}>
                                            <div className="flex flex-row w-[80%] mt-4 items-center ml-4 relative ">
                                                <img className="w-[40px] h-[40px] rounded-full" src={user.personal_info.profile_img} alt="" />
                                                <div className="w-3 h-3 rounded-full bg-[#53bdfa] absolute bottom-0 left-8">
                                                    <i  className="fi fi-sr-check absolute text-[4px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"></i>
                                                </div>
                                                <div className="flex flex-col">
                                                    <p className="font-normal text-[16px] text-[#ffffff] leading-5 ml-5 line-clamp-2">{user.personal_info.fullname}</p>
                                                    <Link to={`/user/${user.personal_info.username}`} className="font-normal text-[12px] text-white/50 leading-5 ml-5 line-clamp-2">@{user.personal_info.username}</Link>
                                                </div>
                                                
                                            </div>
                                        </div>
                            })
                        }
                        </>
                        
                    </div>
                </div>
        </>
    )
}

export default FriendPage