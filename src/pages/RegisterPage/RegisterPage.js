import React, {useRef, useEffect} from "react";
import {toast} from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { signup, clearError } from "../../redux/slices/authSlice";
import {useNavigate} from "react-router-dom";
import SignUpIcon from '../../assets/signup1.gif';
import styles from "./RegisterPage.module.css";

const RegisterPage = () => {
    //Input refs
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, loading, error, message } = useSelector((state) => state.auth);

    useEffect(() => {
      // If user is authenticated redirect him to home page
      if (user) {
        navigate("/");
        toast.success("Sign up Successfull!!");
      }
  
      // If some error occurs display the error
      if (error) {
        toast.error(message);
        dispatch(clearError());
      }
    }, [error, user, message, dispatch, navigate]);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const nameVal = nameRef.current.value;
        const emailVal = emailRef.current.value;
        const passwordVal = passwordRef.current.value;
    
        // Form validation
        if (
          emailVal === "" ||
          nameVal === "" ||
          passwordVal === "" ||
          passwordVal.length < 6
        ) {
          return toast.error("Please enter valid data!");
        }
    
        // call the signup function
        dispatch(signup({ name: nameVal, email: emailVal, password: passwordVal }));
      };

    return (
        <div className={styles.container}>
          <div className={styles.containerLeft}>
            <img src={SignUpIcon} alt=""></img>
          </div>
        <div className={styles.containerRight}>
            <form className={styles.form} onSubmit={onSubmitHandler}>
                <h2 className={styles.loginTitle}>Sign Up</h2>
                <input className={styles.loginInput} type="text" name="name" ref={nameRef} placeholder="Enter Your Name" ></input>
                <input className={styles.loginInput} type="email" name="email" ref={emailRef} placeholder="Enter your Email"></input>
                <input className={styles.loginInput} type="password" name="password" ref={passwordRef} placeholder="Enter your Password"></input>
                <button className={styles.loginBtn}>{loading ? "..." : "Sign Up"}</button>
            </form>
        </div>
        </div>
        
    )
}

export default RegisterPage;