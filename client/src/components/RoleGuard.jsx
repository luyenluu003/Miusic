import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../App";

const RoleGuard = ({ allowedRoles = [] }) => {
    const {
        userAuth,
        setUserAuth,
      } = useContext(UserContext);

  if (!userAuth) {
    return <Navigate to="/signin" replace />; 
  }

  const userRole = userAuth.isAdmin ? "admin" : "user";
  console.log("RoleGuard - userRole:", userRole); 
  console.log("isAdmin", userAuth.isAdmin); 

  return allowedRoles.includes(userRole) 
    ? <Outlet />
    : <Navigate to="/404" replace />;
};

export default RoleGuard;
