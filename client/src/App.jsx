import { Route, Routes } from "react-router-dom";
import Navbar from "./components/navbar.component";
import UserAuthForm from "./pages/userAuthForm.page";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./common/session";
import Editor from "./pages/editor.pages";
import SendOtp from "./pages/otp.page";
import HomePage from "./pages/home.page";
import SearchPage from "./pages/search.page";
import PageNotFound from "./pages/404.page";
import ProfilePage from "./pages/profile.page";
import BlogPage from "./pages/blog.page";
import SideNav from "./components/sidenavbar.components";
import ChangePassword from "./pages/change-password.page";
import EditProfile from "./pages/edit-profile.pages";
import Notifications from "./pages/notifications";
import ManageBlogs from "./pages/manage-blogs";
import AdminUsers from "./pages/admin.users";
import TableAdmin from "./pages/admintable.components";
import AdminAllBlogs from "./pages/adminAllBlogs.components";
import TableBlogsAdmin from "./pages/adminTable.blogs.pages";
import TrenDing from "./pages/trending.page";
import ForgotPassword from "./pages/forgotpassword.page";
import SendOtpForgotPassword from "./pages/otpforgotPassword";
import ReturnPassword from "./pages/returnPassword.pages";
import Rules from "./pages/rules.page";
import Helppage from "./pages/help.page";
import Blogtroll from "./pages/blogtroll.page";

export const UserContext = createContext({});

const App = () => {
  const [userAuth, setUserAuth] = useState({});

  useEffect(() => {
    let userInSession = lookInSession("user");

    userInSession
      ? setUserAuth(JSON.parse(userInSession))
      : setUserAuth({ accsess_token: null });
  }, []);
  

  return (
    <UserContext.Provider value={{ userAuth, setUserAuth }}>
      <Routes>
        <Route path="/editor" element={<Editor />} />
        <Route path="/editor/:blog_id" element={<Editor />} />
        <Route path="/" element={<Navbar />}>
          <Route index element={<HomePage />} />
          <Route path="/trending" element={<TrenDing />} />
          <Route path="dashboard" element={<SideNav />}>
            <Route path="blogs" element= {<ManageBlogs />} />
            <Route path="notifications" element= {<Notifications />} />
          </Route>
          <Route path="admin" element={<SideNav />}>
            <Route path="users" element= {<AdminUsers />} />
            <Route path="allblogs" element= {<AdminAllBlogs />} />
            <Route path="tableUsers" element= {<TableAdmin />} />
            <Route path="tableBlogs" element= {<TableBlogsAdmin />} />
          </Route>
          <Route path="settings" element={<SideNav />}>
            <Route path="edit-profile" element= {<EditProfile />} />
            <Route path="change-password" element= {<ChangePassword />} />
          </Route>
          <Route path="signin" element={<UserAuthForm type={"sign-in"} />} />
          <Route path="signup" element={<UserAuthForm type={"sign-up"} />} />
          <Route path="search/:query" element={<SearchPage />} />
          <Route path="sendotp" element={<SendOtp />} />
          <Route path="forgotpassword" element={<ForgotPassword />} />
          <Route path="sendotpforgotpassword" element={<SendOtpForgotPassword />} />
          <Route path="returnpassword" element={<ReturnPassword />} />
          <Route path='user/:id' element={<ProfilePage />} />
          <Route path="blog/:blog_id" element={<BlogPage />} />
          <Route path="*" element={<PageNotFound />}/>
          <Route path="rules" element={<Rules />}/>
          <Route path="helppage" element={<Helppage />}/>
          <Route path="blogtroll" element={<Blogtroll />}/>
        </Route>
      </Routes>
    </UserContext.Provider>
  );
};

export default App;
