import { Link } from "react-router-dom"
import { getDay } from "../common/date"
import PlayMusic from "./play-music.component"
import { useEffect, useRef, useState } from "react"
import  axios  from "axios";
const formatViews = (number) =>{
    if (number >= 1000000) {
        return (number / 1000000).toFixed(1) + 'm'; 
    } else if (number >= 1000) {
        return (number / 1000).toFixed(1) + 'k'; 
    } else {
        return number.toString();
    }
}
const BlogPostCard = ({ content, author, onClick }) => {
    let { publishedAt, tags, title, des, banner, music, activity: { total_likes, total_comments, total_reads }, blog_id: id } = content
    let { fullname, profile_img, username } = author
    const audioPlayer = useRef(new Audio())
    const [duration,setDuration] = useState(0)
    

    const toggleHearts = (showicon, hideicon) => {
        document.getElementById(showicon).style.display = 'inline-block'
        document.getElementById(hideicon).style.display = 'none'
    }

    useEffect(() => {
        if (music) {
            const newAudioPlayer = new Audio(music);
            audioPlayer.current = newAudioPlayer;
            audioPlayer.current.addEventListener("loadedmetadata", () => {
                const seconds = Math.floor(audioPlayer.current.duration);
                setDuration(seconds);
                console.log()
            });
        }    
    }, [music]);

    const CalculateTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        //10 or -> 09 or 11,12
        const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(sec % 60);
        const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;
        return `${returnMin}:${returnSec}`;
    };


    const views = formatViews(total_reads); 
    const likes = formatViews(total_likes); 
    const comments = formatViews(total_comments);

    return (
        // <Link to={`/blog/${id}`} className="flex gap-8 items-center">
        <>
            <div className="w-full" >
                <div className="flex md:card w-full bg-colorcard m-2 p-2 md:m-6 md:p-8 rounded-xl cursor-pointer hover:shadow-2xl" onClick={onClick}>
                    <div className="flex items-center relative bg-[darkgrey] rounded-xl">
                        <img src={banner} className=" w-60 h-40 md:ml-0  md:w-250px md:h-123px rounded-xl" />
                        <p className="text-white line-clamp-2 bg-dark-grey text-xs font-extralight absolute bottom-[-10px] right-[-20px] rounded-lg px-3 py-1 opacity-80"> {duration && !isNaN(duration) && CalculateTime(duration)
                                                    ? CalculateTime(duration)
                                                    : "00:00"}</p>
                    </div>
                    <div className="w-full flex flex-col pl-5">
                        <div className="flex w-full justify-between ">
                            <p className="text-xl md:leading-5 text-white font-bold line-clamp-1">{title}</p>
                            <i id="heartrs" className="fi fi-rs-heart w-6 h-6 text-white" onClick={() => toggleHearts('heartrs', 'heartss')}></i>
                            <i id="heartss" className="fi fi-ss-heart w-6 h-6 text-white hidden" onClick={() => toggleHearts('heartss', 'heartrs')}></i>
                        </div>
                        <div className=" md:flex md:gap-5">
                            <div className="md:flex md:gap-4 gap-1 flex  ">
                                <span className="flex items-center md:gap-2 text-dark-grey line-clamp-1">
                                    <i className="fi fi-rs-eye mt-[4px] mr-2 md:mr-0"></i>
                                    {views} views
                                </span>
                            </div>
                            <div className="flex gap-4 ">
                                <span className="flex items-center gap-2 text-dark-grey line-clamp-1">
                                    <i className="fi fi-rs-heart mt-[4px]"></i>
                                    {likes} likes
                                </span>
                            </div>
                            <div className="flex gap-4 ">
                                <span className="flex items-center gap-2 text-dark-grey line-clamp-1">
                                    <i className="fi fi-rs-comment-dots mt-[4px]"></i>
                                    {comments} comments
                                </span>
                            </div>
                            <span className="btn-light py-1 px-4 md:flex hidden">{tags[0]}</span>
                        </div>
                        <div className="flex gap-3 mt-4 relative" >
                            <div className="flex items-center">
                                <img src={profile_img} className="w-9 h-9 rounded-full" />
                            </div>
                            <div className="flex  flex-col justify-start ">
                                <p className="line-clamp-1  text-dark-grey font-light leading-2 hidden md:block ">{fullname}</p>
                                <p className="line-clamp-1 text-dark-grey font-light leading-2 hidden md:block">{getDay(publishedAt)}</p>
                            </div>
                          
                            <Link to={`/blog/${id}`}  className="btn-blue-gwen p-2  md:py-3 md:px-6 right-1 absolute ">
                                See more
                            </Link>
                        </div>
                        
                    </div>
                </div>
            </div>
        </>
        // </Link >
    )
}

export default BlogPostCard;