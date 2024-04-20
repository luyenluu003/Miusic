import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import testlogo from "../imgs/testlogo.svg";
import AnimationWrapper from "../common/page-animation";
import defaultBanner from "../imgs/blog banner.png";
import { uploadAudio, uploadImage } from "../common/aws";
import { useContext, useEffect, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { EditorContext } from "../pages/editor.pages";
import EditorJS from "@editorjs/editorjs";
import { tools } from "./tools.component";
import axios from "axios";
import { UserContext } from "../App";

const BlogEditor = () => {
  const navigate = useNavigate()
  let {blog_id} = useParams()
  const [musicFile, setMusicFile] = useState("");
  let {
    blog,
    blog: { title, banner, music, content, tags, des },
    setBlog,
    textEditor,
    setTextEditor,
    setEditorState,
  } = useContext(EditorContext);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);
  // const { access_token } = useContext(UserContext).userAuth;
  //UseEffect
  useEffect(() => {
    setTextEditor(
      new EditorJS({
        holderId: "textEditor",
        data: Array.isArray(content) ? content[0] : content,
        tools: tools,
        placeholder: "Let's write an awesome story",
      })
    );
  }, []);

  const handleBannerUpload = (e) => {
    let img = e.target.files[0];
    if (img) {
      let loadingToast = toast.loading("Uploading...");

      uploadImage(img)
        .then((url) => {
          if (url) {
            toast.dismiss(loadingToast);
            toast.success("Uploaded !");

            setBlog({ ...blog, banner: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleMusicUpload = (event) => {
    const audio = event.target.files[0];

    if (audio) {
      setMusicFile(audio);
      uploadAudio(audio)
        .then((url) => {
          if (url) {
            setBlog({ ...blog, music: url });
          }
        })
        .catch((err) => {
          toast.dismiss(loadingToast);
          return toast.error(err);
        });
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = defaultBanner;
  };

  const handlePublishEvent = () => {
    if (!banner.length || !banner) {
      return toast.error("Upload a post banner to publish it");
    }
    if (!title || !title.length) {
      return toast.error("Write post title to publish it");
    }
    if (!music.length || !music) {
      return toast.error("Upload a post music to publish it")
    }
    if (textEditor.isReady) {
      textEditor
        .save()
        .then((data) => {
          if (data.blocks.length) {
            setBlog({ ...blog, content: data });
            setEditorState("publish");
          } else {
            return toast.error("Wrtie something in your blog to publish it");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const handleSaveDraft = (e) => {
    if (e.target.className.includes("disable")) {
      return;
    }
    if (!title || !title.length) {
      return toast.error("write blog title before saving it as a draft");
    }

    let loadingToast = toast.loading("Saving draft...");

    e.target.classList.add("diable");
    if (textEditor.isReady) {
      textEditor.save().then((content) => {
        let blogObj = {
          title,
          banner,
          music,
          des,
          content,
          tags,
          draft: true
        };
        axios
          .post(import.meta.env.VITE_SERVER_DOMAIN + "/create-blog", {...blogObj,id:blog_id}, {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          })
          .then(() => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast)
            toast.success("Saved")

            setTimeout(() => {
              navigate('/dashboard/blogs?tab=draft')
            }, 500)
          })
          .catch((response) => {
            e.target.classList.remove('disable');
            toast.dismiss(loadingToast)
            return toast.error(response.data.error)
          })
      })
    }
  }

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none w-10">
          <img src={testlogo} />
        </Link>

        <p className="max-md:hidden text-white line-clamp-1 w-full">
          {blog && blog.title && typeof blog.title === "string" && blog.title.length
            ? blog.title
            : "New Blog"}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>Save Draft</button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section className="bg-gray">
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-blue-gwen">
              <label htmlFor="uploadBanner">
                <img src={banner} className="z-20" onError={handleError} />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <div className="relative text-center mt-2 ">
              <label htmlFor="uploadMusic" className="flex justify-center cursor-pointer w-full">
                <div className="text-white text-center m-5 btn-blue-gwen w-[20%]">Upload Music</div>
                <input
                  className="absolute top-0 left-0 w-full h-full opacity-0"
                  id="uploadMusic"
                  type="file"
                  accept=".mp3, .wav"
                  hidden
                  onChange={handleMusicUpload}
                />
              </label>
              <audio className="w-full" controls="controls" id="audio">
                {music && music.length ? (
                  <source id="audioSource" src={music} />
                ) : (
                  musicFile && (
                    <source
                      id="audioSource"
                      src={URL.createObjectURL(musicFile)}
                    />
                  )
                )}
              </audio>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full rounded-lg h-20 outline-none resize-non mt-10 leading-tight placeholder:opacity-40 "
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />

            <div id="textEditor" className="font-gelasio"></div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
