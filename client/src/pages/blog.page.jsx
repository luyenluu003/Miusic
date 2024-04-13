import axios from "axios";
import { createContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MenuHome from "./menu.home";
import Loader from "../components/loader.component";
import AnimationWrapper from "../common/page-animation";
import InPageNavigation from "../components/inpage-navigation.component"
import { getDay } from "../common/date";
import BlogInteraction from "../components/blog-interaction";
import "../components/style/playmusic.scss"
import CommentsContainer, { fetchComments } from "../components/comments.components";

export const blogStructure = {
    title: '',
    des: '',
    content: [],
    music: '',
    tag: [],
    author: { personal_info: {} },
    banner: '',
    publishedAt: '',
}

export const BlogContext  = createContext({})

const BlogPage = () => {
    let { blog_id } = useParams();
    const [blog, setBlog] = useState(blogStructure)
    const [loading, setLoading] = useState(true)
    const [islikedByUser , setLikedByUser] = useState(false)
    const [commentsWrapper,setCommentsWrapper] = useState(false)
    const [totalParentCommentsLoaded,setTotalParentCommentsLoaded] = useState(0)



    const [isPlaying, setPlaying] = useState(false);



    let { title, content, banner, des, music, author: { personal_info: { fullname, username, profile_img } }, publishedAt } = blog

    const fetchBlog = () => {
        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/get-blog", { blog_id })
            .then(async ({ data: { blog } }) => 
            {
                blog.comments= await fetchComments({blog_id:blog._id,setParentCommentCountFun:setTotalParentCommentsLoaded})
                setBlog(blog)
                setLoading(false)
            })
            .catch(err => {
                console.log(err)
            })
    }

    useEffect(() => {
        resetStates()
        fetchBlog()
    }, [])

    const resetStates=()=>{
        setBlog(blogStructure);
        setLoading(true);
        setLikedByUser(false)
        setCommentsWrapper(false);
        setTotalParentCommentsLoaded(0)
    }




    //chạy nhạc
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isUserInteracted, setIsUserInteracted] = useState(false); // Cờ tương tác của người dùng
    const [isRepeatClicked, setIsRepeatClicked] = useState(false); // click vào repeat
    const [israndomClicked, setIsRandomClicked] = useState(false); // click vào random

    const progressBar = useRef();
    const animationRef = useRef();
    const audioPlayer = useRef(new Audio())


    useEffect(() => {
        if (music) {
            // Dừng bài hát hiện tại nếu đang phát
            if (isPlaying) {
                audioPlayer.current.pause();
                setPlaying(false);
                cancelAnimationFrame(animationRef.current);
            }

            // Đặt lại thời gian hiện tại và giá trị của thanh tiến trình về 0
            setCurrentTime(0);
            progressBar.current.value = 0;

            // Thiết lập bài hát mới cho audio player
            const newAudioPlayer = new Audio(music);
            audioPlayer.current = newAudioPlayer;
            audioPlayer.current.addEventListener("loadedmetadata", () => {
                const seconds = Math.floor(audioPlayer.current.duration);
                setDuration(seconds);
            });
        }
    }, [music]);

    // //next song
    // const playNextSong = () => {
    //     if (currentSongIndex < songs.length - 1) {
    //         setCurrentSongIndex((prevIndex) => prevIndex + 1);
    //     } else {
    //         // Nếu là bài hát cuối cùng, quay lại bài hát đầu tiên
    //         setCurrentSongIndex(0);
    //     }
    //     setIsUserInteracted(true); // Đánh dấu rằng người dùng đã tương tác
    // };
    // const playprevSong = () => {
    //     if (currentSongIndex > 0) {
    //         setCurrentSongIndex((prevIndex) => prevIndex - 1);
    //     } else {
    //         setCurrentSongIndex(songs.length - 1);
    //     }
    //     setIsUserInteracted(true); // Đánh dấu rằng người dùng đã tương tác
    // };

    // useEffect(() => {
    //     audioPlayer.current.src = songs[currentSongIndex].song;

    //     audioPlayer.current.load();
    //     // Kiểm tra nếu người dùng đã tương tác, thì mới tự động play nhạc
    //     if (isUserInteracted && !isRepeatClicked) {
    //         audioPlayer.current.play();
    //     }

    //     // Đặt chế độ lặp lại
    //     audioPlayer.current.loop = isRepeatClicked;
    // }, [songs, currentSongIndex, isUserInteracted, isRepeatClicked]);

    const changePlayPause = () => {
        const prevValue = isPlaying;
        setPlaying(!prevValue);
        if (!prevValue) {
            audioPlayer.current.play();
            animationRef.current = requestAnimationFrame(whilePlaying);
        } else {
            audioPlayer.current.pause();
            cancelAnimationFrame(animationRef.current);
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

    // //sử dụng để liên tục cập nhập thanh tiếng trình
    const whilePlaying = () => {
        if (audioPlayer.current) {
            progressBar.current.value = audioPlayer.current.currentTime;
            changeCurrenTime();
            animationRef.current = requestAnimationFrame(whilePlaying);
        }
    };
    // //xử lý khi thanh tiến trình thay đổi người dùng bấm vào
    const changeProgress = () => {
        audioPlayer.current.currentTime = progressBar.current.value;
        changeCurrenTime();
    };

    //cập nhập thời gian với thanh tiếng trình
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
    //gọi dữ liệu file âm thanh đồng bộ hóa tiền trình thanh phát
    const onTimeUpdate = () => {
        setCurrentTime(audioPlayer.current.currentTime);
        progressBar.current.style.setProperty(
            "--player-played",
            `${(audioPlayer.current.currentTime / duration) * 100}%`
        );
    };

    return (
        <AnimationWrapper>
            {   
            
                loading ? <Loader /> :
                <BlogContext.Provider value={{blog,setBlog,islikedByUser,setLikedByUser,commentsWrapper,setCommentsWrapper,totalParentCommentsLoaded,setTotalParentCommentsLoaded}}>
                    <CommentsContainer />
                    <div className="py-4 px-[5vw] md:px-[7vw] lg:px-[4vw] flex h-cover  justify-center gap-10 bg-gray ">
                        <MenuHome />

                        {/* home */}
                        <div className="w-full" >
                                    <audio
                                            src={music}
                                            // preload="metadata"
                                            ref={audioPlayer}
                                            onLoadedMetadata={onLoadedMetadata}
                                            onTimeUpdate={onTimeUpdate}
                                        />  
                            <InPageNavigation routes={['menu', 'blogpage']} defaultHidden={["menu", 'blogpage']}>
                                <h1 className="text-white">Menu home</h1>
                                {
                                    <>
                                        <div className="w-full h-[90%] flex flex-row bg-gray-dark rounded-xl">
                                            <div className="w-[20%] hidden md:block">
                                                <img src={banner} className=" rounded-l-xl" />
                                            </div>
                                            <div className="w-full md:w-[80%] relative">
                                                <div className="flex flex-row border-b-[1px] p-4 border-blue-gwen ">
                                                    <div className=" flex gap-5 items-start">
                                                        <img src={profile_img} className="w-14 h-14 rounded-full" />
                                                        <p className="text-white capitalize">{fullname}
                                                            <br />
                                                            @
                                                            <Link to={`/user/${username}`} className="underline text-grey">{username}
                                                            </Link>
                                                        </p>
                                                    </div>
                                                    <p className="text-white opacity-90  ml-5 hidden md:inline-block">published on {getDay(publishedAt)}</p>
                                                </div>
                                                <div className="flex flex-col bg-[#252836] rounded-xl p-4 mt-4 mx-2 h-[31vh] ">
                                                    <h4 className="ml-4 font-medium text-[16px] text-[#ffffff]">Lyric</h4>
                                                    <div className="flex flex-col overflow-auto " style={{ scrollbarWidth: "none" }}>
                                                        <p className="font-normal mt-2 text-[16px] text-[#ffffff] leading-5 ml-5" style={{ whiteSpace: 'pre-line' }}>{des}</p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-row mt-3 absolute w-full bottom-0">
                                                    <div className="w-48 h-60 relative">
                                                        <img src={banner} />
                                                        <div className="absolute h-[40%] flex bg-[#3F95D7] w-full bottom-0 bg-opacity-60 cursor-pointer text-center items-center text-xl justify-around text-white">
                                                            <div className="text-xl">
                                                                <i class="fi fi-rr-arrow-circle-left text-2xl"></i>
                                                            </div>
                                                            <div className="text-xl overflow-hidden" onClick={changePlayPause}>
                                                                {isPlaying ? (
                                                                    <i className="fi fi-ss-pause-circle  text-3xl"></i>
                                                                ) : (
                                                                    <i className="fi fi-ss-play-circle  text-3xl"></i>

                                                                )}
                                                            </div>
                                                            <div className="text-xl">
                                                                <i class="fi fi-rr-arrow-circle-right text-2xl"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col w-full ">
                                                        <div className="w-full h-[50%] relative">
                                                            <BlogInteraction />
                                                        </div>
                                                        <div className="w-full h-[50%] bg-[#3F95D7] rounded-br-xl p-4 relative">                              
                                                            <span className="text-white overflow-hidden text-ellipsis whitespace-nowrap text-xl line-clamp-1 max-w-48 md:w-full ">{title}</span>
                                                            <div className="flex justify-around w-full mb-8 absolute bottom-1 left-0">
                                                                <div className="text-[#f1f1f1] text-[12px] font-bold  hidden md:block">
                                                                    {CalculateTime(currentTime)}
                                                                </div>
                                                                <input type="range"
                                                                    ref={progressBar}
                                                                    onChange={changeProgress}
                                                                    min={0}
                                                                    max={duration}
                                                                    step={1} className=" progresBar w-[90%] md:w-[78%] relative h-1 outline-none appearance-none rounded-xl bg-dark-grey cursor-pointer overflow-hidden mt-[6px] " />
                                                                <div className="text-[#f1f1f1] text-[12px] font-bold hidden md:block">
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
                                    </>
                                }

                            </InPageNavigation>
                        </div>

                    </div>
                </BlogContext.Provider>
            }

        </AnimationWrapper >
    )
}

export default BlogPage