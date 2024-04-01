import {createContext} from 'react';
import { useReducer } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

const ProductsContext = createContext();
console.log("ProductsContext",ProductsContext);
  
  const ProductsReducer= (state, action) => {
    switch (action.type) {
      case "SET_PRODUCTS":
        return {
          ...state,
          loading: false,
          products: action.payload,
          filteredProducts: action.payload,
        };
      case "SET_FILTERED_PRODUCTS":
        return {
          ...state,
          filteredProducts: action.payload,
        };
      case "SET_ERROR":
        return {
          ...state,
          error: action.payload,
          loading: false,
        };
      case "TOGGLE_LOADING":
        return {
          ...state,
          loading: !state.loading,
        };
      case "SET_CART_PRODUCTS":
        return {
          ...state,
          cartProducts: action.payload,
        };
      default:
        return state;
    }
  };
  
const ProductContextProvider = ({ children }) => {
  const initialState = {
    loading: false,
    products: [],
    filteredProducts: [],
    cartProducts: [],
    error: "",
  };

  const [state, dispatch] = useReducer(ProductsReducer, initialState);

  const getAllProducts = async () => {
    try {
      dispatch({ type: "TOGGLE_LOADING" });
      const productsRef = collection(db, "products");

      const productsSnapshot = await getDocs(productsRef);

      const productsData = productsSnapshot.docs.map((doc) => ({
        ...doc.data(),
      }));

      dispatch({ type: "SET_PRODUCTS", payload: productsData });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  // Function to filter and search products
  const filterProducts = (filterObj) => {
    const {
      searchQuery,
      priceRange,
      categories: { mensFashion, womensFashion, jewelery, electronics },
    } = filterObj;

    let filteredProducts = state.products;
    if (searchQuery) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.title.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }
    if (mensFashion || womensFashion || jewelery || electronics) {
      filteredProducts = filteredProducts.filter((product) => {
        if (mensFashion && product.category === "men's clothing") {
          return true;
        }
        if (womensFashion && product.category === "women's clothing") {
          return true;
        }
        if (electronics && product.category === "electronics") {
          return true;
        }
        if (jewelery && product.category === "jewelery") {
          return true;
        }
        return false;
      });
    }

    if (priceRange) {
      filteredProducts = filteredProducts.filter((product) => {
        return product.price < priceRange;
      });
    }

    dispatch({ type: "SET_FILTERED_PRODUCTS", payload: filteredProducts });
  };

  return (
    <ProductsContext.Provider
      value={{
        products: state.products,
        filteredProducts: state.filteredProducts,
        loading: state.loading,
        getAllProducts,
        filterProducts,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export {ProductsContext};
export default ProductContextProvider;
