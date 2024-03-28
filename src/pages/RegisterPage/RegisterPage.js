import React, {useRef} from "react";
import {toast} from "react-toastify";
// import {useNavigate} from "react-router-dom";

const RegisterPage = () => {
    //Input refs
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    // const navigate = useNavigate();

    return (
        <div>
            <form>
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