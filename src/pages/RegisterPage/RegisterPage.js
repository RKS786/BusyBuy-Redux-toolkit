import React, {useRef, useEffect, useContext} from "react";
import {toast} from "react-toastify";
import {AuthContext} from "../../context/Auth/AuthContext";
import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    //Input refs
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const navigate = useNavigate();
    const { user, loading, error, message, signup, clearError } =
    useContext(AuthContext);
    const isAuth = user;

    useEffect(() => {
      // If user is authenticated redirect him to home page
      if (isAuth) {
        navigate("/");
      }
  
      // If some error occurs display the error
      if (error) {
        toast.error(message);
        clearError();
      }
    }, [error, user, message]);

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
        await signup({ name: nameVal, email: emailVal, password: passwordVal });
      };

    return (
        <div>
            <form onSubmit={onSubmitHandler}>
                <h2>Sign Up</h2>
                <input type="text" name="name" ref={nameRef} placeholder="Enter Your Name" ></input>
                <input type="email" name="email" ref={emailRef} placeholder="Enter your Email"></input>
                <input type="password" name="password" ref={passwordRef} placeholder="Enter your Password"></input>
                <button>Sign Up</button>
            </form>
        </div>
    )
}

export default RegisterPage;