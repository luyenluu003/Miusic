import { useContext, useEffect } from "react"
import { BlogContext } from "../pages/blog.page"
import { Link } from "react-router-dom"
import {UserContext} from "../App"
import { Toaster ,toast } from "react-hot-toast"
import axios from "axios"

const formatViews = (number) =>{
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'm'; 
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k'; 
    } else {
        return number.toString();
    }
}
const BlogInteraction = () => {

    let {blog, blog: {_id, blog_id, activity, activity: { total_likes, total_comments, total_reads }, author: { personal_info: { username: author_username } } }, setBlog,islikedByUser,setLikedByUser ,setCommentsWrapper} = useContext(BlogContext)

    let {userAuth:{username,access_token}} = useContext(UserContext)

    useEffect(()=>{
        if(access_token){
            axios.post(import.meta.env.VITE_SERVER_DOMAIN +'/isliked-by-user',{_id},{
                headers:{
                    'Authorization':`Bearer ${access_token}`
                }
            })
            .then(({data:{result}})=>{
                setLikedByUser(Boolean(result))
            })
            .catch(err =>{
                console.log(err)
            })
        }
    },[])

    const handleLike = () => {
        if(access_token){
            setLikedByUser(preVal => !preVal)
            !islikedByUser ?  total_likes ++ : total_likes --;

            setBlog({ ...blog,activity:{ ...activity, total_likes}})

            axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/like-blog", { _id,islikedByUser },{
                headers:{
                    'Authorization': `Bearer ${access_token}`
                }
            })
            .then(({data})=>{
                console.log(data)
            })
            .catch(err=>{
                console.log(err)
            })


        }else{
            toast.error("please login to like this blog.")
        }
    }

    
    const views = formatViews(total_reads); 
    const likes = formatViews(total_likes); 
    const comments = formatViews(total_comments);


    return (
        <>
        <Toaster />
            <div className="flex flex-col md:flex-row md:flex gap-6 justify-between p-5 bottom-0 absolute w-full">
                    <div className="flex gap-3 items-center ">
                        <button className="hidden w-8 h-8 rounded-full md:flex items-center justify-center leading-[0px] bg-grey/80">
                            <i className="fi fi-rr-eye"></i>
                        </button>
                        <p className="text-xl text-white/80 hidden md:block">{views}</p>
                        <button onClick={handleLike} 
                            className={"w-8 h-8 rounded-full flex items-center justify-center leading-[0px] " +(islikedByUser ? "bg-white text-red":"bg-grey/80")} >
                            <i className={"fi "+(islikedByUser?"fi-sr-heart":"fi-rr-heart")}></i>
                        </button>
                        <p className="text-xl text-white/80 ">{likes}</p>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center leading-[0px] bg-grey/80" onClick={()=>setCommentsWrapper(preVal => !preVal)}  >
                            <i className="fi fi-rr-comment-dots" ></i>
                        </button>
                        <p className="text-xl text-white/80">{comments}</p>
                    </div>
                        
                <div className="flex gap-6 items-center justify-between">
                    {
                        username== author_username?
                        <Link to={`/editor/${blog_id}`} className="underline hover:text-purple text-white">Edit</Link> :""
                    }
                    <Link to={`https://www.facebook.com`}><i class="fi fi-brands-facebook text-2xl text-white hover:text-blue-gwen"></i></Link>
                </div>
            </div>
        </>
    )
}

export default BlogInteraction