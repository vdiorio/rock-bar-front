import React from "react";
import "./App.css";
import AdminPage from "./pages/admin";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./errorPage";
import Header from "./pages/admin/components/Header";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.min.css";
import SellerPage from "./pages/seller";
import ProductPage from "./pages/products";
import CommandPage from "./pages/commandPage";
import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import UsersPage from "./pages/users";
import useApiMonitoring from "./helpers/useApiMonitoring";

const router = createBrowserRouter([
  {
    path: "/admin/command/:commandId",
    element: <CommandPage />,
  },
  {
    path: "/admin/products",
    element: <ProductPage />,
  },
  {
    path: "/admin/orders",
    element: <ProductPage />,
  },
  {
    path: "/admin/users",
    element: <UsersPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/seller",
    element: <SellerPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <Header />
      <RouterProvider router={router} />
      <ToastContainer />
    </React.StrictMode>
  );
}

export default App;
