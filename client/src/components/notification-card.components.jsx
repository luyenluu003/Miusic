import { Link } from "react-router-dom"

const NotificationCard = ({data,index,notificationState}) => {

    let {type,replied_on_comment,user:{personal_info:{fullname,username,profile_img}},blog:{blog_id,title} } = data

    return (
        <div className="p-6 border-b border-grey border-1-black">
            <div className="flex gap-5 mb-3">
                <img src={profile_img}  className="w-14 h-14 flex-none rounded-full"/>
                <div className="w-full">
                    <h1 className="font-medium text-xl text-dark-grey">
                        <span className="lg:inline-block hidden capitalize">{fullname}</span>
                        <Link to={`/user/${username}`} className="mx-1 text-white underline" >@{username}</Link>
                        <span className="font-normal">
                            {
                                type == 'like' ? "liked your blog":
                                type == 'comment' ? 'commented on' :"replied on"
                            }
                        </span>
                    </h1>

                    {
                        type == 'reply' ? 
                        <div className="p-4 mt-4 rounded-md bg-grey">
                            <p>{replied_on_comment.comment}</p>
                        </div>            
                        : 
                        <Link to={`/blog/${blog_id}`} className="font-medium text-dark-grey hover:underline line-clamp-1">{`"${title}"`}</Link>
                    }
                </div>

            </div>
        </div>
    )
}

export default NotificationCard