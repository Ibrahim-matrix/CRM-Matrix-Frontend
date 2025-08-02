import React, { ReactNode } from "react";

import LoginRoute from "../pages/login/LoginRoute";
import Cookies from "js-cookie";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import UserDashboard from "../pages/dashboard/UserDashboard";
import AdminDashboard from "../pages/dashboard/AdminDashboard";

// interface AuthState {
//   auth: boolean;
// }

interface PrivateRouteProps {
  children: ReactNode;
  requiredPermissions: string;
}

const PrivateRoute = ({ children, requiredPermissions }: PrivateRouteProps) => {
  // const { auth } = useSelector((state: { common: AuthState }) => state.common);
  const location = useLocation();
  const token = Cookies.get("token");

  interface SigninUser {
    signinuser: {
      UserType: number;
      UserProfile: string;
      menuPermissions: [string];
    };
  }
  const { signinuser } = useSelector(
    (state: { common: SigninUser }) => state.common
  );

  // Extract the permissions from the signinuser object
  const { UserType, menuPermissions } = signinuser || {};

  console.log(menuPermissions);

  if (!token) {
    console.log("auth please");
    return (
      <>
        <LoginRoute />
      </>
    );
  } else {
    if (UserType === 1) {
      return children;
    } else if (menuPermissions?.includes(requiredPermissions)) {
      if (requiredPermissions === "Dashboard") {
        if (signinuser?.UserType === 2) {
          return <AdminDashboard />;
        } else if (signinuser?.UserType === 3) {
          if (location?.pathname === "/admin-dashboard")
            return <Navigate to={"/unauthorized"} />;
          return <UserDashboard />;
        }
      } else {
        return children;
      }
    } else {
      return (
        <>
          <Navigate to="/unauthorized" />
        </>
      );
    }
  }
};

export default PrivateRoute;
