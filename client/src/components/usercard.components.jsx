import { Link } from "react-router-dom"

const UserCard = ({ user }) => {
    let { personal_info: { fullname, username, profile_img } } = user

    return (
        <Link to={`/user/${username}`} className="flex flex-row w-[80%] mt-4 items-center ml-4 relative ">
            <img className="w-[40px] h-[40px] rounded-full" src={profile_img} />
            {/* <div className="w-3 h-3 rounded-full bg-[#53bdfa] absolute bottom-0 left-8">
                <i className="fi fi-sr-check absolute text-[4px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white"></i>
            </div> */}
            <div className="ml-3"> 
                <h1 className="font-medium text-xl line-clamp-2">{fullname}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        </Link>
    )
}



export default UserCard