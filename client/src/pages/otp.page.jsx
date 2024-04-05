import { useContext, useEffect, useRef, useState } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const SendOtp = ({ type }) => {
  const authForm = useRef();

  const location = useLocation();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form = new FormData(formElment);
    let formOtp = {};
    for (let [key, value] of form.entries()) {
      formOtp[key] = value;
    }
    if (!formOtp.otp) {
      return toast.error("Enter OTP");
    }

    const route = "/verify-code"; //
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + route, {
        email: formData.email,
        code: formOtp.otp,
      })
      .then(({ data }) => {
        if (data == "Xác nhận thành công.") {
          const Routesingup = "/signup";
          userAuthThroughServer(Routesingup, formData);
        } else {
          toast.error("Wrong otp, please re-enter otp !");
        }
      })
      .catch(({ error }) => {
        console.error("An error occurred:", error);
        toast.error(error?.response?.data?.error || "An error occurred");
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center bg-gray-900 rounded-b-3xl">
        <Toaster />
        <form id="formElment" className="w-[80%] max-w-[400px] mb-[5%]">
          <h1 className="text-4xl text-white font-gelasio capitalize text-center mb-5">
            Send OTP
          </h1>

          <InputBox name="otp" type="otp" placeholder="otp" icon="fi-rr-key" />

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

export default SendOtp;
