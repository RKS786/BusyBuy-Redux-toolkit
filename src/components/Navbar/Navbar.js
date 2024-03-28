import React,{useContext} from "react";
import {NavLink} from "react-router-dom";
import './Navbar.css'
import {AuthContext} from "../../context/Auth/AuthContext";

import CartIcon from "../../assets/cart.png";
import homeIcon from "../../assets/home.png";
import signInIcon from "../../assets/signin.png";
import logoutIcon from "../../assets/logout.png";
import ordersIcon from "../../assets/orders.png";


const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
  const isAuthenticated = user;

  // Function to logout from app
  const onLogoutHandler = () => {
    logout(); // inbuilt firebase function to logout
  };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">BusyBuy</NavLink>
                <div className="nav-menu">
                    <div className="nav-items">
                        <NavLink className="nav-links" to="/">
                            <img 
                                className="nav-items-icons"
                                src={homeIcon}
                                alt="Home_Img"
                            />
                            <span>
                            Home
                            </span>
                        </NavLink>
                    </div>
                    {isAuthenticated && (
                        <>
                            <div className="nav-items">
                                <NavLink className="nav-links" to="/myorders">
                                    <img
                                        className="nav-items-icons"
                                        src={ordersIcon}
                                        alt="MyOrders_Img"
                                    />
                                    My orders
                                </NavLink>
                            </div>
                            <div className="nav-items">
                                <NavLink className="nav-links" to="/cart">
                                    <img
                                        className="nav-items-icons"
                                        src={CartIcon}
                                        alt="Cart_Img"
                                    />
                                    <span>
                                    Cart
                                    </span>
                                </NavLink>
                            </div>
                        </>
                    )}
                    {isAuthenticated ? (
                        <div className="nav-items">
                        <NavLink className="nav-links" to="/" onClick={onLogoutHandler}>
                            <img
                                className="nav-items-icons"
                                src={logoutIcon}
                                alt="Logout_Img"
                            />
                            Logout
                        </NavLink>
                    </div>
                    ) : (
                        <div className="nav-items">
                        <NavLink className="nav-links" to="/signin">
                            <img
                                className="nav-items-icons"
                                src={signInIcon}
                                alt="SignIn_Img"
                            />
                            SignIn
                        </NavLink>
                    </div>  
                    )
                    }
                    
                </div>
            </div>
        </nav>
    )
}

export default Navbar;