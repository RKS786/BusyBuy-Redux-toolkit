import React,{useState, useEffect, useContext} from "react";
import styles from "./ProductCard.module.css";
import { toast } from "react-toastify";
import AuthContext from "../../../context/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { updateDoc, setDoc } from "firebase/firestore";

// Product Card component
const ProductCard = ({
  product: { title, price, image, id, quantity },
  onOwnPage,
  onCart,
  removeProductFromCart,
  updateProductQuantity,
  filterProductFromState,
}) => {

    const [productAddingToCart, setProductAddingToCart] = useState(false);
    const [productRemovingFromCart, setProductRemovingCart] = useState(false);
    // const { user } = useContext(AuthContext);

    console.log("in product card")
    // console.log("user in product card",user.displayName)
    
    // const navigate = useNavigate();
    // useEffect(() => {
    //     if(!user){
    //         navigate('/');
    //     }
    // },[user])


  return (
    <div className={styles.productContainer}>
        <div className={styles.imageContainer}>
            <img
                src={image}
                alt="Product"
                width="100%"
                height="100%"
                style={{ objectFit: "contain"}}
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
                        {/* <MinusIcon handleRemove={handleRemove} />
                            {quantity}
                        <PlusIcon handleAdd={handleAdd} /> */}
                    </div>
                )}
            </div>
        {/* Conditionally Rendering buttons based on the screen */}
            {!onCart ? (
                <button
                    className={styles.addBtn}
                    title="Add to Cart"
                    disabled={productAddingToCart}
                    // onClick={addProductToCart}
                    >
                    {productAddingToCart ? "Adding" : "Add To Cart"}
                </button>
            ) : (
                <button
                    className={styles.removeBtn}
                    title="Remove from Cart"
                    // onClick={removeProduct}
                    >
                    {productRemovingFromCart ? "Removing" : "Remove From Cart"}
                </button>
                )
            }
        </div>
    </div>
  );
};

export default ProductCard;
