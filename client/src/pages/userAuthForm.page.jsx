import { useContext, useRef } from "react";
import AnimationWrapper from "../common/page-animation";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast";
import axios from "axios";
import { storeInSession } from "../common/session";
import { UserContext } from "../App";
import { authWithGoogle } from "../common/firebase";

const UserAuthForm = ({ type }) => {
  const authForm = useRef();
  const navigate = useNavigate();

  let {
    userAuth: { access_token },
    setUserAuth,
  } = useContext(UserContext);

  const userAuthThroughServer = (serverRoute, formData) => {
    axios
      .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
      .then(({ data }) => {
        console.log('data',data)
        storeInSession("user", JSON.stringify(data));
        setUserAuth(data);

      })
      .catch(({ response }) => {
        toast.error(response.data.error);
      });
  };

  // const userAuthThroughOtp = (serverRoute, formData) => {
  //   navigate("/sendotp", { state: { serverRoute, formData } });
  // };
  const userAuthThroughOtp = (serverRoute, formData) => {
    const route = "/check-email";

    if (serverRoute == "/signup") {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + route, formData)
        .then(({ data }) => {
          if (!data.isEmailExist) {
            storeInSession("user", JSON.stringify(data));
            setUserAuth(data);
            navigate("/sendotp", { state: { serverRoute, formData } });
          } else {
            toast.error(
              "The Email was registered. Please sign up for another email !"
            );
          }
        })
        .catch(({ response }) => {
          toast.error(response?.data?.error || "An error occurred");
        });
    } else if (serverRoute == "/signin") {
      axios
        .post(import.meta.env.VITE_SERVER_DOMAIN + serverRoute, formData)
        .then(({ data }) => {
          storeInSession("user", JSON.stringify(data));
          setUserAuth(data);

        })
        .catch(({ response }) => {
          toast.error(response.data.error);
        });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    let serverRoute = type == "sign-in" ? "/signin" : "/signup";

    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
    let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password

    //from data
    let form = new FormData(formElment);

    let formData = {};
    for (let [key, value] of form.entries()) {
      formData[key] = value;
    }

    let { fullname, email, password } = formData;

    //form validation
    if (fullname) {
      if (fullname.length < 3) {
        return toast.error("Fullname must be at least 3 letters long");
      }
    }
    if (!email.length) {
      return toast.error("Enter email");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6 to 20 characters long with a numeric , 1 lowercase and 1 uppercase letters"
      );
    }
    // userAuthThroughServer(serverRoute, formData);
    userAuthThroughOtp(serverRoute, formData);
  };

  const handleGoogleAuth = (e) => {
    e.preventDefault();

    authWithGoogle()
      .then((user) => {
        let serverRoute = "/google-auth";

        let formData = {
          access_token: user?.accessToken,
        };

        console.log(user);

        userAuthThroughServer(serverRoute, formData);
      })
      .catch((err) => {
        toast.error("trouble login through google");
        return console.log(err);
      });
  };

  return access_token ? (
    <Navigate to="/" />
  ) : (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center bg-gray-900">
        <Toaster />
        <form id="formElment" className="w-[80%] max-w-[400px] mb-[5%]">
          <h1 className="text-4xl text-white font-gelasio capitalize text-center mb-5">
            {type == "sign-in" ? "Welcome back" : "Join us today"}
          </h1>

          {type != "sign-in" ? (
            <InputBox
              name="fullname"
              type="text"
              placeholder="Full Name"
              icon="fi-rr-user"
            />
          ) : (
            ""
          )}

          <InputBox
            name="email"
            type="email"
            placeholder="Email"
            icon="fi-rr-envelope"
          />

          <InputBox
            name="password"
            type="password"
            placeholder="Password"
            icon="fi-rr-key"
          />

          <button
            className="btn-blue-gwen center mt-14"
            type="submit"
            onClick={handleSubmit}
          >
            {type.replace("-", " ")}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-white" />
            <p className="text-white">or</p>
            <hr className="w-1/2 border-white" />
          </div>

          <button
            className="btn-blue-gwen flex items-center justify-center gap-4 w-[90%] center "
            onClick={handleGoogleAuth}
          >
            <img src={googleIcon} className="w-5" />
            continue with google
          </button>

          {type == "sign-in" ? (
            <p className="mt-6 text-blue-gwen text-xl text-center">
              Don't have an account ?
              <Link to="/signup" className="underline text-white text-xl ml-1">
                Join us today
              </Link>
            </p>
          ) : (
            <p className="mt-6 text-blue-gwen text-xl text-center">
              Do you already have an account ?
              <Link to="/signin" className="underline text-white text-xl ml-1">
                Sign in here.
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
};

export default UserAuthForm;
