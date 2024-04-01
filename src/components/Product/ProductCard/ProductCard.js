import React, { useState, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../../../context/Auth/AuthContext";
import styles from "./ProductCard.module.css";
import { db } from "../../../config/firebase";
import { setDoc, getDoc, doc } from "firebase/firestore";
import PlusIcon from "../../../assets/plusIcon.png";
import MinusIcon from "../../../assets/minusIcon.png";

// Product Card component
const ProductCard = ({
  product,
  onCart,
  removeFromCartState,
  setTotalPrice,
  calculateTotalPrice,
}) => {
  const { title, price, image } = product; // Destructure product props
  const { user } = useContext(AuthContext); // Access user from AuthContext

  // State variables for product actions
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  const [productRemovingFromCart, setProductRemovingFromCart] = useState(false);

  // State variable for cart
  const [cart, setCart] = useState({ count: 0, cost: 0, items: [] });

  // Function to add product to cart
  async function addProductToCart(product) {
    setProductAddingToCart(true); // Set adding to cart state
    if (!user) {
      // Check if user is logged in
      toast.error("Please first Login !!!");
      return;
    }
    try {
      // Update the cart in Firestore
      const userRef = doc(db, "userCart", user.email);
      const userCartSnapshot = await getDoc(userRef);
      const currentCartData = userCartSnapshot.data();

      // If cart exists then update the cart
      if (currentCartData && currentCartData.cart) {
        const existingItemIndex = (currentCartData.cart.items || []).findIndex(
          (item) => item.id === product.id
        );
        if (existingItemIndex !== -1) {
          // If the product already exists in the cart, update its quantity
          const updatedItems = [...currentCartData.cart.items];
          updatedItems[existingItemIndex].quantity++; // Increase quantity by 1
          const updatedCart = {
            ...currentCartData.cart,
            cost: currentCartData.cart.cost + product.price,
            count: currentCartData.cart.count + 1, // Increment total count by 1
            items: updatedItems,
          };
          await setDoc(userRef, { cart: updatedCart });
          toast.success("Increased product count!");
          return;
        }
      }

      // If the product is not already in the cart, add it to the cart
      const updatedCart = {
        cost: (currentCartData?.cart?.cost || 0) + product.price,
        count: (currentCartData?.cart?.count || 0) + 1,
        items: [
          ...(currentCartData?.cart?.items || []),
          { ...product, quantity: 1 }, // Add quantity property to the product
        ],
      };

      await setDoc(userRef, { cart: updatedCart });
      setCart(updatedCart);

      // Update local state or UI as needed
      toast.success("Added to your Cart!!");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setProductAddingToCart(false); // Reset adding to cart state
    }
  }

  // Function to remove a product from the cart
  async function removeProductFromCart(productId) {
    setProductRemovingFromCart(true); // Set removing from cart state
    if (!user) {
      // Check if user is logged in
      toast.error("Please first Login !!!");
      return;
    }
    try {
      // Update the cart in Firestore
      const userRef = doc(db, "userCart", user.email);
      const userCartSnapshot = await getDoc(userRef);
      const currentCartData = userCartSnapshot.data();

      // If cart exists and the product is in the cart, remove it
      if (currentCartData && currentCartData.cart) {
        const existingItem = currentCartData.cart.items.find(
          (item) => item.id === productId
        );
        if (existingItem) {
          // Calculate the cost to be deducted based on the quantity of the product being removed
          const costToDeduct = existingItem.price * existingItem.quantity;

          const updatedItems = currentCartData.cart.items.filter(
            (item) => item.id !== productId
          );
          const updatedCart = {
            ...currentCartData.cart,
            cost: currentCartData.cart.cost - costToDeduct,
            count: currentCartData.cart.count - existingItem.quantity,
            items: updatedItems,
          };

          await setDoc(userRef, { cart: updatedCart });
          setCart(updatedCart);

          // Call removeFromCart function passed from CartPage to update cartProducts state
          removeFromCartState(productId);
          setTotalPrice(updatedCart.cost);
          toast.success("Removed product from Cart!");
          return;
        } else {
          toast.error("Product not found in Cart!");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setProductRemovingFromCart(false); // Reset removing from cart state
    }
  }

  // Function to increase item's quantity
  async function increaseQuant(product) {
    const userRef = doc(db, "userCart", user.email);
    const userCartSnapshot = await getDoc(userRef);
    const currentCartData = userCartSnapshot.data();

    let updatedItems;
    let updatedCart;
    // If the product has more than one quantity, increase its quantity by 1
    updatedItems = currentCartData.cart.items.map((item) => {
      if (item.id === product.id) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    updatedCart = {
      ...currentCartData.cart,
      cost: currentCartData.cart.cost + product.price,
      count: currentCartData.cart.count + 1,
      items: updatedItems,
    };

    try {
      await setDoc(userRef, { cart: updatedCart });
      setCart(updatedCart); // Update the cart state with the new array
      calculateTotalPrice(updatedCart.items);
      toast.success("Product count increased");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  // Function to decrease item's quantity
  async function decreaseQuant(product) {
    const userRef = doc(db, "userCart", user.email);
    const userCartSnapshot = await getDoc(userRef);
    const currentCartData = userCartSnapshot.data();

    let updatedItems;
    let updatedCart;

    // Decrease the quantity of the product by 1
    updatedItems = currentCartData.cart.items.map((item) => {
      if (item.id === product.id) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });

    updatedCart = {
      ...currentCartData.cart,
      cost: currentCartData.cart.cost - product.price, // Subtract product price
      count: currentCartData.cart.count - 1, // Decrease total count by 1
      items: updatedItems,
    };

    try {
      await setDoc(userRef, { cart: updatedCart });
      setCart(updatedCart); // Update the cart state with the new array
      calculateTotalPrice(updatedCart.items);
      toast.success("Product count decreased");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }

  return (
    <div className={styles.productContainer}>
      <div className={styles.imageContainer}>
        <img
          src={image}
          alt="Product"
          width="100%"
          height="100%"
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className={styles.productDetails}>
        <div className={styles.productName}>
          <p>{`${title.slice(0, 35)}...`}</p>
        </div>
        <div className={styles.productOptions}>
          <p>₹ {price}</p>
          {onCart && (
            <div className={styles.quantityContainer}>
              <img
                src={MinusIcon}
                alt="Decrease"
                onClick={() => decreaseQuant(product)}
              />
              {cart.items.find((item) => item.id === product.id)?.quantity ||
                product.quantity}
              <img
                src={PlusIcon}
                alt="Increase"
                onClick={() => increaseQuant(product)}
              />
            </div>
          )}
        </div>
        {/* Conditionally Rendering buttons based on the screen */}
        {!onCart ? (
          <button
            className={styles.addBtn}
            title="Add to Cart"
            // disabled={productAddingToCart}
            onClick={() => addProductToCart(product)}
          >
            {productAddingToCart ? "Adding" : "Add To Cart"}
          </button>
        ) : (
          <button
            className={styles.removeBtn}
            title="Remove from Cart"
            onClick={() => removeProductFromCart(product.id)}
          >
            {productRemovingFromCart ? "Removing" : "Remove From Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
