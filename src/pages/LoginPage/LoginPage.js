import React, { useRef, useEffect } from "react";
import { login, clearError } from "../../redux/slices/authSlice";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "./LoginPage.module.css";
import { NavLink } from "react-router-dom";
import SignInIcon from '../../assets/signin1.gif';

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const emailRef = useRef();
  const passwordRef = useRef();
  const { user, loading, error, message } = useSelector((state) => state.auth);

  useEffect(() => {
    // If user is authenticated redirect him to home page
    if (user && user.displayName) {
      navigate("/");
      toast.success(`Welcome, ${user.displayName}`);
    }

    // If some error occurs display the error
    if (error) {
      toast.error(message);
      dispatch(clearError());
    }
  }, [error, user, dispatch, message, navigate]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const emailVal = emailRef.current.value;
    const passwordVal = passwordRef.current.value;

    // Form validation
    if (emailVal === "" || passwordVal === "" || passwordVal.length < 6) {
      return toast.error("Please enter valid data!");
    }

    dispatch(login({email: emailVal, password: passwordVal}));
  };

  return (
    <div className={styles.container}>
      <div className={styles.containerLeft}>
        <img src={SignInIcon} alt=""></img>
      </div>
      <div className={styles.containerRight}>
      <form className={styles.form} onSubmit={onSubmitHandler}>
        <h2 className={styles.loginTitle}>Sign In</h2>
        <input
          type="email"
          name="email"
          ref={emailRef}
          className={styles.loginInput}
          placeholder="Enter Email"
        />
        <input
          type="password"
          name="password"
          ref={passwordRef}
          className={styles.loginInput}
          placeholder="Enter Password"
        />
        <button className={styles.loginBtn}>
          {loading ? "..." : "Sign In"}
        </button>
        <NavLink
          to="/signup"
          style={{
            textDecoration: "none",
            color: "#224957",
            fontFamily: "Quicksand",
          }}
        >
          <p style={{ fontWeight: "600", margin: 0 }}>Or SignUp instead</p>
        </NavLink>
      </form>
      </div>
      
    </div>
  );
};

export default LoginPage;
