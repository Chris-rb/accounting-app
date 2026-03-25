import React from "react";
import { createBrowserRouter, Navigate } from "react-router"
import LoginPage from "../views/LoginPage";
import Dashboard from "../views/protected/Dashboard";
import CreateAccountPage from "../views/CreateAccountPage";
import ForgotPasswordPage from "../views/ForgotPasswordPage";
import ResetPasswordPage from "../views/ResetPassowordPage";
import ChartOfAccountsModule from "../views/protected/ChartOfAccountsModule";
import AdminViews from "../views/protected/AdminViews";
import UserDetailsPage from "../views/protected/UserDetailsPage";
import ProtectedRoutes from "./protectedRoutes";
import { getUserData, getPendingUserData } from "../hooks/useUserData";


const adminLoaderData = async() => {
  const [activeUserData, pendingUserData] = await Promise.all([
    getUserData(),
    getPendingUserData()
  ])

  return ({activeUserData, pendingUserData});
}


const routes = createBrowserRouter([
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/create-account",
      element: <CreateAccountPage />
    },
    {
      path: "forgot-password",
      element: <ForgotPasswordPage />
    },
    {
      path: "reset-password/:token",
      element: <ResetPasswordPage />
    },
    {
      path:"",  // Move to Protected Routes after Dev
      element: <Dashboard />,
      children: [
        {
          path: "chart-of-accounts",
          element: <ChartOfAccountsModule />
        },
        {
          path: "admin-view",
          element: <AdminViews />,
          loader: adminLoaderData,
        },
        {
          path: "admin-view/user-details/:id",
          element: <UserDetailsPage />
        }
      ]
    },
    {
      element: <ProtectedRoutes />,
      children: [
        {
          path:"/dashboard",
          element: <Dashboard />,
          children: [
            {
              path: "chart-of-accounts",
              element: <ChartOfAccountsModule />
            },
            {
              path: "admin-view",
              element: <AdminViews />,
              loader: adminLoaderData,
            },
            {
              path: "admin-view/user-details/:id",
              element: <UserDetailsPage />
            }
          ]
        },
      ]
    },
    {
      path: "*",
      element: <Navigate to="/" />
    }
  ]);

  export default routes;



