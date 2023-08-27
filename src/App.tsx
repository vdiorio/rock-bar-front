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
    path: "/admin",
    element: <AdminPage />,
  },
  {
    path: "/seller",
    element: <SellerPage />,
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
