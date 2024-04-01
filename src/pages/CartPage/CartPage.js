import React, { useEffect, useContext, useState } from "react";
import { AuthContext } from "../../context/Auth/AuthContext";
import { doc, getDoc } from "firebase/firestore"; // Importing necessary Firestore functions
import { db } from "../../config/firebase"; // Importing Firebase configuration
import ProductList from "../../components/Product/ProductList/ProductList"; // Importing ProductList component
import styles from "./CartPage.module.css"; // Importing CSS styles for CartPage
import Loader from "../../UI/Loader"; // Importing Loader component for loading state

const CartPage = () => {
  // State variables for cart data, total price, purchasing state, and loading state
  const [cartProducts, setCartProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [purchasing, setPurchasing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Extracting user from AuthContext
  const { user } = useContext(AuthContext);

  // Function to fetch cart data from Firestore
  const fetchCartData = async () => {
    // Check if user is logged in
    if (user) {
      setLoading(true); // Set loading state to true
      try {
        const userRef = doc(db, "userCart", user.email); // Reference to user's cart document
        const userCartSnapshot = await getDoc(userRef); // Get cart document snapshot
        const currentUserCartData = userCartSnapshot.data(); // Extract cart data from snapshot
        
        // Set total price if cart data exists
        if (currentUserCartData && currentUserCartData.cart) {
          setTotalPrice(currentUserCartData.cart.cost);
          
          // Set cart products if items exist in cart
          if (currentUserCartData.cart.items) {
            setCartProducts(currentUserCartData.cart.items);
          }
        }
      } catch (error) {
        console.log("Error fetching cart data:", error);
      } finally {
        setLoading(false); // Set loading state to false after fetching data
      }
    }
  };

  useEffect(() => {
    fetchCartData(); // Fetch cart data on component mount
  }, []);
  
  // Render loader if data is being loaded
  if (loading) return <Loader />;

  // Function to remove a product from cart state
  const removeFromCartState = (productId) => {
    setCartProducts((prevCartProducts) =>
      prevCartProducts.filter((item) => item.id !== productId)
    );
  };
  
  // Function to calculate total price based on items in cart
  const calculateTotalPrice = (cartProducts) => {
    const updatedTotalPrice = cartProducts.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );
    setTotalPrice(updatedTotalPrice); // Update total price
    return updatedTotalPrice; // Return the updated total price
  };

  return (
    <div className={styles.cartPageContainer}>
      {/* Render loader if data is being loaded, otherwise render cart content */}
      {loading ? (
        <Loader />
      ) : (
        <>
          {/* Render total price and purchase button if cart is not empty */}
          {!!cartProducts.length && (
            <aside className={styles.totalPrice}>
              <p>TotalPrice:- ₹{totalPrice}/-</p>
              <button className={styles.purchaseBtn}>
                {purchasing ? "Purchasing" : "Purchase"}
              </button>
            </aside>
          )}
          {/* Render ProductList component with cart products */}
          {!!cartProducts.length ? (
            <ProductList
              products={cartProducts}
              onCart={true}
              removeFromCartState={removeFromCartState}
              calculateTotalPrice={calculateTotalPrice}
              setTotalPrice={setTotalPrice}
            />
          ) : (
            // Render message if cart is empty
            <h1>Cart is Empty!</h1>
          )}
        </>
      )}
    </div>
  );
};

export default CartPage;
