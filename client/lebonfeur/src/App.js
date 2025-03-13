import React from "react";
import { Routes, Route } from "react-router-dom";
import Register from "./components/Register/Register.js";
import Home from "./components/Home/Home.js";
import Account from "./components/Account/Account.js";
import Admin from "./components/Admin/Admin.js";
import Cart from "./components/Cart/Cart.js";
import Search from "./components/Search/Search.js"
import Payment from "./components/Payment/Payment.js"
import ProductDetails from "./components/ProductDetails/ProductDetails.js";
import AccessDenied from "./components/Admin/AccessDenied.js";
import CGV from "./components/Help/Cgv/Cgv.js";
import GLEA from "./components/Help/Glea/Glea.js";
import Support from "./components/Help/Support/Support.js";
import Tracking from "./components/Tracking/Tracking.js";
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
      <Toaster position="top-center" reverseOrder={false}/>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Home />} />
        <Route path="/account" element={<Account />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/search" element={<Search />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/cgv" element={<CGV />} />
        <Route path="/garantie-legale-et-assurance" element={<GLEA />} />
        <Route path="/support" element={<Support />} />
        <Route path="/AccessDenied" element={<AccessDenied />} />
        <Route path="/tracking/:trackingNumber" element={<Tracking />} />
      </Routes>
    </div>
  );
}

export default App;
