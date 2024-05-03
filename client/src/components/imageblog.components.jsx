import { Link } from "react-router-dom"
import { useEffect, useRef, useState } from "react"

const ImageBlogCard = ({ content, author, onClick }) => {
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




    return (
        <>
            <Link to={`/blog/${id}`}>
               <div className="flex flex-wrap flex-row">
                    <div className="flex items-center relative bg-[darkgrey] rounded-xl  hover:scale-125 hover:shadow-5 hover:z-20">
                        <img src={banner} className=" w-60 h-40 md:ml-0  md:w-250px md:h-123px rounded-xl" />
                            <p className="text-white line-clamp-2 bg-dark-grey text-xs font-extralight absolute bottom-2 right-2.5 rounded-lg px-3 py-1 opacity-80"> {duration && !isNaN(duration) && CalculateTime(duration)
                                ? CalculateTime(duration)
                                : "00:00"}</p>
                    </div>
               </div>
            </Link>
        </>
    )
}

export default ImageBlogCard;