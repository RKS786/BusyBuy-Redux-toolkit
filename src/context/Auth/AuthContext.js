import { createContext, useState, useContext, useReducer } from "react";
import {auth} from "../../config/firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

// Create a new context
const AuthContext = createContext();

const AuthReducer = (state, action) => {
    switch (action.type) {
      case "LOGIN_SUCCESS":
        return {
          ...state,
          user: action.payload,
          error: false,
          loading: false,
        };
      case "LOGOUT":
        return {
          user: null,
          error: false,
          message: action.payload,
          loading: false,
        };
      case "LOGIN_FAIL":
        return {
          user: null,
          error: true,
          message: action.payload,
          loading: false,
        };
      case "SET_AUTH_USER":
        return {
          ...state,
          user: action.payload,
        };
      case "CLEAR_ERROR_MESSAGE":
        return {
          ...state,
          error: false,
          message: "",
        };
      case "SIGNUP_SUCCESS":
        return {
          ...state,
          user: action.payload,
          error: false,
          loading: false,
        };
      case "SIGNUP_FAIL":
        return {
          ...state,
          error: true,
          message: action.payload,
          loading: false,
        };
      case "TOGGLE_LOADING":
        return {
          ...state,
          loading: !state.loading,
        };
      default:
        return state;
    }
  };

function CustomAuthContextProvider({ children }) {
    // const auth = getAuth();
    const initialState = {
        user: null,
        error: false,
        message: "",
        loading: false,
      };

    const [state, dispatch] = useReducer(AuthReducer, initialState);

     // Sets the authenticated user
  const setAuthUser = (user) => {
    dispatch({ type: "SET_AUTH_USER", payload: user });
  };
  

    const signup = async (formData) => {
        dispatch({ type: "TOGGLE_LOADING" });
        try {
          const { name, email, password } = formData;
    
          const res = await createUserWithEmailAndPassword(auth, email, password);
    
          await updateProfile(auth.currentUser, {
            displayName: name,
          });
    
          dispatch({ type: "SIGNUP_SUCCESS", payload: res.user });
        } catch (error) {
          console.log(error);
          dispatch({
            type: "SIGNUP_FAIL",
            payload: error.message.split(": ")[1],
          });
        }
      };

      const login = async (email, password) => {
        dispatch({ type: "TOGGLE_LOADING" });
        try {
          const res = await signInWithEmailAndPassword(auth, email, password);
          console.log("res in login",res);
          dispatch({ type: "LOGIN_SUCCESS", payload: res.user });
        } catch (error) {
            console.log("login",error);
          dispatch({
            type: "LOGIN_FAIL",
            payload: error.message.split(": ")[1],
          });
        }
      };

      const logout = async () => {
        try {
          const res = await signOut(auth);
          console.log(res);
          dispatch({ type: "LOGOUT", payload: "Signed out successfully!" });
        } catch (error) {
          dispatch({ type: "CLEAR_ERROR_MESSAGE" });
        }
      };

      const clearError = () => {
        dispatch({ type: "CLEAR_ERROR_MESSAGE" });
      };
    
      const changeLoadingState = () => {
        dispatch({ type: "TOGGLE_LOADING" });
      };
    

      // Provide the context value to the children components
      return (
        <AuthContext.Provider
          value={{
            user: state.user,
            message: state.message,
            error: state.error,
            loading: state.loading,
            login,
            logout,
            signup,
            clearError,
            setAuthUser,
            changeLoadingState,
          }}
        >
          {children}
        </AuthContext.Provider>
      );

}
export {AuthContext};
export default CustomAuthContextProvider;