import React, { useEffect, useRef, useState } from "react"
import { getDay } from "../common/date"

const ModalBlog = ({ isVisible, blog, onClose }) => {
    if (!isVisible) return null
    console.log("blog:", blog)
    // Đang bị lỗi vòng lặp vô hạn
    const handleClose = (e) => {
        if (e.target.id === "wrapper"){
            stopMusic(); 
            onClose();
        }
    }

    const formatViews = (number) => {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + 'm';
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + 'k';
        } else {
            return number.toString();
        }
    }
    //chạy nhạc
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setPlaying] = useState(false);



    const progressBar = useRef();
    const animationRef = useRef();
    const audioPlayer = useRef(new Audio())
    


    const stopMusic = () => {
        if (isPlaying) {
            audioPlayer.current.pause(); 
            setPlaying(false); 
            cancelAnimationFrame(animationRef.current); 
        }
    };

    useEffect(() => {
        if (blog.music) {
            audioPlayer.current.src = blog.music; 
            audioPlayer.current.addEventListener("loadedmetadata", () => {
                const seconds = Math.floor(audioPlayer.current.duration);
                setDuration(seconds);
            });
        }
        
        return () => {
            stopMusic(); 
        };
    }, [blog.music]);

    const changePlayPause = () => {
        if (!isPlaying) {
            audioPlayer.current.play(); 
            setPlaying(true);
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            stopMusic(); 
        }
    };
    // //tính thời gian kiểu phút và giây
    const CalculateTime = (sec) => {
        const minutes = Math.floor(sec / 60);
        //10 or -> 09 or 11,12
        const returnMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
        const seconds = Math.floor(sec % 60);
        const returnSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

        return `${returnMin}:${returnSec}`;
    };

    const whilePlaying = () => {
        if (audioPlayer.current) {
            progressBar.current.value = audioPlayer.current.currentTime;
            changeCurrenTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    };

    const changeProgress = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changeCurrenTime();
    };


    const changeCurrenTime = () => {
        progressBar.current.style.setProperty(
            "--player-played",
            `${(progressBar.current.value / duration) * 100}%`
        );
        setCurrentTime(progressBar.current.value);
    };

    const onLoadedMetadata = () => {
        const seconds = Math.floor(audioPlayer.current.duration);
        setDuration(seconds);
        progressBar.current.max = seconds;
    };

    const onTimeUpdate = () => {
        setCurrentTime(audioPlayer.current.currentTime);
        progressBar.current.style.setProperty(
            "--player-played",
            `${(audioPlayer.current.currentTime / duration) * 100}%`
        );
    };

    const views = formatViews(blog.activity.total_reads)
    const likes = formatViews(blog.activity.total_likes)
    const comments = formatViews(blog.activity.total_comments)
    return (
        <div className="fixed z-50 inset-0 bg-black bg-opacity-10 backdrop-blur-sm flex justify-center items-center overflow-auto " id="wrapper" onClick={handleClose}>
            <audio
                src={blog.music}
                preload="metadata"
                ref={audioPlayer}
                onLoadedMetadata={onLoadedMetadata}
                onTimeUpdate={onTimeUpdate}
            />
            <div className="w-full md:w-[600px] flex flex-col mx-2 md:mx-0 ">
                <div className="bg-white p-4 rounded">
                    <div className="flex flex-row justify-between relative">
                        <h1 className="text-base font-inter ">Blog information:</h1>
                        <div className="">
                            <button class="absolute top-0 right-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey" onClick={() => onClose()}><i class="fi fi-br-cross text-2xl mt-1"></i></button>
                        </div>
                    </div>
                    <div className="flex flex-row mt-2 ">
                        <img src={blog.banner} className="w-32 h-32 rounded-xl mr-5" alt="" />
                        <div className="flex flex-col ml-2">
                            <p className="text-2xl text-black line-clamp-1">Title: {blog.title}</p>
                            <p className="text-sm">Tags: {blog.tags}</p>
                            <p className=" text-sm">Published on: {getDay(blog.publishedAt)}</p>
                            <div className="flex gap-3 flex-row">
                                <p className="text-sm">Views: {views}</p>
                                <p className="text-sm">Likes: {likes}</p>
                                <p className="text-sm">Comments: {comments}</p>
                            </div>
                        </div>


                    </div>
                    <div className="flex flex-col gap-2 h-[31vh] mt-5 border-t border-blue-gwen border-1">

                        <p className="text-2xl mt-5">Lyrics</p>
                        <div className="flex flex-col overflow-auto " style={{ scrollbarWidth: "none" }}>
                            <p className="font-normal mt-2 text-[16px] text-black leading-5 ml-5" style={{ whiteSpace: 'pre-line' }}>{blog.des}</p>
                        </div>
                    </div>
                    <div className="flex flex-row mt-3  w-full bottom-0  border-t border-blue-gwen border-1">
                        <div className="w-32 h-20 relative mt-5">
                            <img src={blog.banner} className="rounded-xl" />
                            <div className="absolute h-[40%] flex bg-[#3F95D7] rounded-b-xl w-full bottom-0 bg-opacity-60 cursor-pointer text-center items-center text-xl justify-around text-white">

                                <div className="text-xl overflow-hidden" onClick={changePlayPause}>
                                    {isPlaying ? (
                                        <i className="fi fi-ss-pause-circle  text-3xl"></i>
                                    ) : (
                                        <i className="fi fi-ss-play-circle  text-3xl"></i>

                                    )}
                                </div>

                            </div>
                        </div>
                        <div className="w-full  rounded-br-xl p-2 mt-2 relative">
                            <div className="overflow-hidden w-full"> 
                                <span className="inline-block whitespace-nowrap text-black text-xl animation-marquee">
                                    {blog.title}
                                </span>
                            </div>
                            <div className="flex justify-around w-full mb-4 absolute bottom-1 left-0">
                                <div className="text-black/80 text-[12px] font-bold  hidden md:block">
                                    {CalculateTime(currentTime)}
                                </div>
                                <input type="range"
                                    ref={progressBar}
                                    onChange={changeProgress}
                                    min={0}
                                    max={duration}
                                    step={1} className=" progresBar w-[90%] md:w-[78%] relative h-1 outline-none appearance-none rounded-xl bg-dark-grey cursor-pointer overflow-hidden mt-[6px] " />
                                <div className="text-black/80 text-[12px] font-bold hidden md:block">
                                    {duration && !isNaN(duration) && CalculateTime(duration)
                                        ? CalculateTime(duration)
                                        : "00:00"}
                                </div>

                            </div>
                        </div>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default ModalBlog