// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import Navbar from './components/Navbar/Navbar';
import HomePage from "./pages/HomePage/HomePage";
import RegisterPage from './pages/RegisterPage/RegisterPage';
import LoginPage from "./pages/LoginPage/LoginPage";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { auth } from "./config/firebase";
import { setAuthUser} from "./redux/slices/authSlice";
import CartPage from "./pages/CartPage/CartPage";
import OrdersPage from "./pages/OrdersPage/OrdersPage";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Transform the Firebase user object to a serializable object
        const serializableUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        dispatch(setAuthUser(serializableUser));
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return (
    <div className="App">
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
          <Route path="/myorders" element={<OrdersPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
