import { Link } from "react-router-dom";
import AnimationWrapper from "../common/page-animation";
import { useContext } from "react";
import { UserContext } from "../App";
import { removeFromSession } from "../common/session";

const UserNavigationPanel = () => {
  const {
    userAuth: { username ,isAdmin},
    setUserAuth,
  } = useContext(UserContext);

  const signOutUser = () => {
    removeFromSession("user");
    setUserAuth({ access_token: null });
  };
  return (
    <AnimationWrapper
      className="absolute right-0 z-50"
      transition={{ duration: 0.2 }}
    >
      <div className="bg-[#403D51] absolute right-0  rounded-2xl border-grey w-60  duration-200">


        <Link to={`/user/${username}`} className="link pl-8 py-4 rounded-2xl text-white">
          Profile
        </Link>


        <Link to="/settings/edit-profile" className="link pl-8 py-4 text-white">
          Settings
        </Link>

        <span className="absolute border-t ml-3 border-[#53BDFA] w-[90%]"></span>

        <button
          className="text-left p-4 rounded-2xl text-white hover:bg-grey hover:text-black w-full pl-8 py-4"
          onClick={signOutUser}
        >
          <h1 className="font-bold text-xl mg-1 ">Sign Out</h1>
          <p className="text-[#ccc] hover:text-dark-grey">@{username}</p>
        </button>
      </div>
    </AnimationWrapper>
  );
};

export default UserNavigationPanel;
