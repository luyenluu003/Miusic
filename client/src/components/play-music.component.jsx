import { useEffect, useRef, useState } from "react";
import "./style/playmusic.scss"

const PlayMusic = ({ selectedBlog }) => {
    const [isPlaying, setPlaying] = useState(false);
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
        if (selectedBlog && selectedBlog.music) {
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
            const newAudioPlayer = new Audio(selectedBlog.music);
            audioPlayer.current = newAudioPlayer;
            audioPlayer.current.addEventListener("loadedmetadata", () => {
                const seconds = Math.floor(audioPlayer.current.duration);
                setDuration(seconds);
            });
        }
    }, [selectedBlog]);

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



    // const handleRepeatClick = () => {
    //     setIsRepeatClicked(!isRepeatClicked);

    //     // Nếu isRepeatClicked là true, bật chế độ lặp lại, ngược lại tắt
    //     audioPlayer.current.loop = isRepeatClicked;
    // };


    return (
        <>
            {
                selectedBlog ? (
                    <>
                        <div className="fixed bottom-0 left-0 w-full bg-gray-900 md:p-8 flex h-[64px] cursor-pointer">
                            <div className="w-[15%] h-80% flex items-center  ">
                                {selectedBlog ? (
                                    <>
                                        <img className="w-14 h-14 rounded-xl overflow-x-hidden	" src={selectedBlog.banner} />
                                        <div className="flex px-5 flex-col w-36">
                                            <span className="text-white overflow-hidden text-ellipsis	 whitespace-nowrap text-xl font-bold">{selectedBlog.title}</span>
                                            <span className="overflow-hidden whitespace-nowrap text-ellipsis text-[10px] text-[#d9d9d9]">{selectedBlog.author.personal_info.fullname}</span>
                                        </div></>
                                ) : null}
                            </div>
                            <div className="w-[61%]  flex items-center flex-col justify-center mt-2 relative">
                                {selectedBlog ? (
                                    <>
                                        <audio
                                            src={selectedBlog.music}
                                            // preload="metadata"
                                            ref={audioPlayer}
                                            onLoadedMetadata={onLoadedMetadata}
                                            onTimeUpdate={onTimeUpdate}
                                        />
                                        <div className="flex w-full justify-between text-[#fff] cursor-pointer items-center mt-4  absolute bottom-[-15px]">
                                            <div className="cursor-pointer text-xl">
                                                <i className="fi fi-rr-shuffle"></i>
                                            </div>
                                            <div className="cursor-pointer text-center items-center text-xl flex w-[20%] justify-between">
                                                <div className="text-xl">
                                                    <i className="fi fi-bs-angle-left mr-1"></i>
                                                </div>
                                                <div className="text-xl overflow-hidden  mt-3" onClick={changePlayPause}>
                                                    {isPlaying ? (
                                                        <i className="fi fi-ss-pause-circle  text-3xl"></i>
                                                    ) : (
                                                        <i className="fi fi-ss-play-circle  text-3xl"></i>

                                                    )}
                                                </div>
                                                <div className="text-xl">
                                                    <i className="fi fi-bs-angle-right"></i>
                                                </div>
                                            </div>
                                            <div className="cursor-pointer text-xl">
                                                <i className="fi fi-rr-arrows-repeat"></i>
                                            </div>
                                        </div>
                                        <div className="flex px-4 justify-around w-full mb-8 absolute top-2">
                                            <div className="text-[#f1f1f1] text-[12px] font-bold ">{CalculateTime(currentTime)}</div>
                                            <input type="range"
                                                ref={progressBar}
                                                onChange={changeProgress}
                                                min={0}
                                                max={duration}
                                                step={1} className=" progresBar w-[78%] relative h-1 outline-none appearance-none rounded-xl bg-dark-grey cursor-pointer overflow-hidden mt-[6px] " />
                                            <div className="text-[#f1f1f1] text-[12px] font-bold">
                                                {duration && !isNaN(duration) && CalculateTime(duration)
                                                    ? CalculateTime(duration)
                                                    : "00:00"}
                                            </div>
                                        </div>
                                    </>
                                ) : null}
                            </div >
                        </div >
                    </>
                ) : null}</>
    );
};

export default PlayMusic;
