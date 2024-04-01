import { createContext, useReducer } from "react";///Imports necessary functions and hooks from the React library.
import {auth} from "../../config/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";

// Create a new context to manage authentication state and provide authentication-related functions
const AuthContext = createContext();

// Reducer function to manage state updates based on actions dispatched to the context
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

// Custom authentication context provider component
function CustomAuthContextProvider({ children }) {
    // Initialize authentication context state
    const initialState = {
        user: null,
        error: false,
        message: "",
        loading: false,
      };

    // Use reducer hook to manage state updates based on actions
    const [state, dispatch] = useReducer(AuthReducer, initialState);

    // Function to set authenticated user in the context
    const setAuthUser = (user) => {
      dispatch({ type: "SET_AUTH_USER", payload: user });
    };
  
    // Function to sign up a new user
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

      // Function to log in a user
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

      // Function to log out a user
      const logout = async () => {
        try {
          const res = await signOut(auth);
          console.log(res);
          dispatch({ type: "LOGOUT", payload: "Signed out successfully!" });
        } catch (error) {
          dispatch({ type: "CLEAR_ERROR_MESSAGE" });
        }
      };

      // Function to clear error messages
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
// Export authentication context and provider component
export {AuthContext};
export default CustomAuthContextProvider;