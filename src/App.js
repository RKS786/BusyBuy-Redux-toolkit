import React, {useContext, useEffect} from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar/Navbar';
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from "./pages/LoginPage/LoginPage";
import { onAuthStateChanged } from "firebase/auth";
import {AuthContext} from "./context/Auth/AuthContext";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import {auth} from "./config/firebase";
import ProductContextProvider from "./context/Products/ProductContext";
import CartPage from "./pages/CartPage/CartPage";


function App() {

  const { setAuthUser } = useContext(AuthContext);

  // Authenticate the user if he is already logged in and set the user in the auth context.
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("user in app.js",user.displayName);
        setAuthUser(user);
      }
    });
  }, []);

  return (
    <div className="App">
      <ProductContextProvider>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/signin" element={<LoginPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </BrowserRouter>
      </ProductContextProvider>
    </div>
  );
}

export default App;
