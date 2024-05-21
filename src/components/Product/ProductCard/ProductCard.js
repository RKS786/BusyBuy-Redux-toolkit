
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ProductCard.module.css";
import { addProductToCart, removeProductFromCart, increaseQuantity, decreaseQuantity } from "../../../redux/slices/cartSlice";
import PlusIcon from "../../../assets/plusIcon.png";
import MinusIcon from "../../../assets/minusIcon.png";

// Product card component
const ProductCard = ({ product, onCart }) => {
  // Destructure product details
  const { title, price, image } = product;
  // Retrieve user authentication state from Redux store
  const user = useSelector((state) => state.auth.user);
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // State for tracking adding product to cart loading state
  const [productAddingToCart, setProductAddingToCart] = useState(false);
  // State for tracking removing product from cart loading state
  const [productRemovingFromCart, setProductRemovingFromCart] = useState(false);

  // Function to handle adding product to cart
  const handleAddToCart = async () => {
    setProductAddingToCart(true);
    if (!user) {
      toast.error("Please first login!");
      setProductAddingToCart(false);
      return;
    }
    try {
      // Dispatch action to add product to cart
      dispatch(addProductToCart({ product, email: user.email }));
      toast.success("Product added to cart!");
    } catch (error) {
      console.error("Error adding product to cart:", error);
      toast.error("Error adding product to cart.");
    } finally {
      setProductAddingToCart(false);
    }
  };

  // Function to handle removing product from cart
  const handleRemoveFromCart = async () => {
    setProductRemovingFromCart(true);
    if (!user) {
      toast.error("Please first login!");
      setProductRemovingFromCart(false);
      return;
    }
    try {
      // Dispatch action to remove product from cart
      dispatch(removeProductFromCart({ productId: product.id, email: user.email }));
      toast.success("Product removed from cart!");
    } catch (error) {
      console.error("Error removing product from cart:", error);
      toast.error("Error removing product from cart.");
    } finally {
      setProductRemovingFromCart(false);
    }
  };

  // Function to handle increasing product quantity
  const handleIncreaseQuantity = async () => {
    if (!user) {
      toast.error("Please first login!");
      return;
    }
    try {
      // Dispatch action to increase product quantity
      dispatch(increaseQuantity({ productId: product.id, email: user.email }));
      toast.success("Product quantity increased");
    } catch (error) {
      console.error("Error increasing product quantity:", error);
      toast.error("Error increasing product quantity.");
    }
  };

  // Function to handle decreasing product quantity
  const handleDecreaseQuantity = async () => {
    if (!user) {
      toast.error("Please first login!");
      return;
    }
    try {
      // Dispatch action to decrease product quantity
      dispatch(decreaseQuantity({ productId: product.id, email: user.email }));
      toast.success("Product quantity decreased");
    } catch (error) {
      console.error("Error decreasing product quantity:", error);
      toast.error("Error decreasing product quantity.");
    }
  };

  return (
    <div className={styles.productContainer}>
      {/* Product image */}
      <div className={styles.imageContainer}>
        <img src={image} alt="Product" width="100%" height="100%" style={{ objectFit: "contain" }} />
      </div>
      {/* Product details */}
      <div className={styles.productDetails}>
        {/* Product name */}
        <div className={styles.productName}>
          <p>{title.slice(0, 35)}...</p>
        </div>
        {/* Product options */}
        <div className={styles.productOptions}>
          {/* Product price */}
          <p>₹ {price}</p>
          {/* Quantity controls if product is in cart */}
          {onCart && (
            <div className={styles.quantityContainer}>
              <img src={MinusIcon} alt="Decrease" onClick={handleDecreaseQuantity} />
              {product.quantity}
              <img src={PlusIcon} alt="Increase" onClick={handleIncreaseQuantity} />
            </div>
          )}
        </div>
        {/* Add to cart or remove from cart button */}
        {!onCart ? (
          <button className={styles.addBtn} title="Add to Cart" onClick={handleAddToCart}>
            {productAddingToCart ? "Adding" : "Add To Cart"}
          </button>
        ) : (
          <button className={styles.removeBtn} title="Remove from Cart" onClick={handleRemoveFromCart}>
            {productRemovingFromCart ? "Removing" : "Remove From Cart"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
