import { useContext, useEffect, useRef, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const ForgotPassword = ({ type }) => {
  const authForm = useRef();

  const location = useLocation();

  const navigate = useNavigate()

  useEffect(() => {
    const { serverRoute, formData } = location.state || {};
  }, [location.state]);
  const formData = location.state?.formData || null;

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user?.accessToken,
        };


        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google");
        return console.log(err);
      });
  };

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);
      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  const userAuthThroughOtp = (serverRoute, formData) => {
    const route = "/check-email-register";

    if (serverRoute == "/forgotpassword") {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + route, formData)
        .then(({ data }) => {
          if (data.isEmailExist) {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
            navigate("/sendotpforgotpassword", { state: { serverRoute, formData } });
          } else {
            toast.error(
              "Email is not registered. Please enter correct email !"
            );
          }
        })
        .catch(({ response }) => {
          toast.error(response?.data?.error || "An error occurred");
        });
    }
    
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = "/forgotpassword";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email

    //from data
    let form = new FormData(formElment);

    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let {  email } = formData;

    //form validation

    if (!email.length) {
      return toast.error("Enter email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }

    // userAuthThroughServer(serverRoute, formData);
    userAuthThroughOtp(serverRoute, formData);
  };
  

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center bg-gray-900 rounded-b-3xl">
        <Toaster />
        <form id="formElment" className="w-[80%] max-w-[400px] mb-[5%]">
          <h1 className="text-4xl text-white font-gelasio capitalize text-center mb-5">
            Enter Gmail
          </h1>

          <InputBox name="email" type="email" placeholder="email" icon="fi-rr-envelope" />

          <button
            className="btn-blue-gwen center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {/* {type.replace("-", " ")} */}
            Submit
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button
            className="btn-blue-gwen flex items-center justify-center gap-4 w-[90%] center mt-[-15%]"
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          <p className="mt-6 text-blue-gwen text-xl text-center">
            Do you already have an account ?
            <Link to="/signin" className="underline text-white text-xl ml-1">
              Sign in here.
            </Link>
          </p>

        </form>
      </section>
    </AnimationWrapper>
  );
};

export default ForgotPassword;
