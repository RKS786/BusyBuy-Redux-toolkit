import React,{useState, useEffect, useContext} from "react";
import { toast } from "react-toastify";
import {AuthContext} from "../../../context/Auth/AuthContext";
import {useNavigate} from "react-router-dom";
import styles from "./ProductCard.module.css";
import { db } from "../../../config/firebase";
import { updateDoc,setDoc,getDoc, doc, arrayUnion, onSnapshot, arrayRemove } from "firebase/firestore";
import PlusIcon from "../../../assets/plusIcon.png";
import MinusIcon from "../../../assets/minusIcon.png";

// Product Card component
const ProductCard = ({
  product,
  onOwnPage,
  onCart,
  removeProductFromCart,
  updateProductQuantity,
  filterProductFromState,
}) => {
    
    const  { title, price, image, id } = product;

    const [productAddingToCart, setProductAddingToCart] = useState(false);
    const [productRemovingFromCart, setProductRemovingFromCart] = useState(false);
    const [itemInCart,setItemInCart]=useState(0);
    // all products in cart
    const [cart, setCart] = useState({ count: 0, cost: 0, items: [] });
    // all order placed by user
    const [myorders,setMyOrders]=useState([]);
    // total amount of user's cart
    const [total,setTotal]=useState(0);

    const navigate = useNavigate();
    const { user, loading, error, message, signup, clearError } = useContext(AuthContext);

    useEffect(() => {
      // If user is authenticated redirect him to home page
      if (user) {
        navigate("/");
      }
    });

    // function to add product to cart
async function addProductToCart(product) {
    setProductAddingToCart(true);
    if (!user) {
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
            const existingItemIndex = (currentCartData.cart.items || []).findIndex(item => item.id === product.id);
            if (existingItemIndex !== -1) {
                // If the product already exists in the cart, update its quantity
                const updatedItems = [...currentCartData.cart.items];
                updatedItems[existingItemIndex].quantity++; // Increase quantity by 1
                const updatedCart = {
                    ...currentCartData.cart,
                    cost: currentCartData.cart.cost + product.price,
                    count: currentCartData.cart.count + 1, // Increment total count by 1
                    items: updatedItems
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
                { ...product, quantity: 1 } // Add quantity property to the product
            ]
        };

        await setDoc(userRef, { cart: updatedCart });

        // Update local state or UI as needed
        toast.success("Added to your Cart!!");
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    } finally {
        setProductAddingToCart(false);
    }
}








    // Function to remove a product from the cart
async function removeProductFromCart(productId) {
    setProductRemovingFromCart(true);
    if (!user) {
        toast.error("Please first Login !!!");
        return;
    }
    try {
        // Update the cart in Firestore
        const userRef = doc(db, "userCart", user.email);
        const userCartSnapshot = await getDoc(userRef);
        const currentCartData = userCartSnapshot.data();

        // If cart exists and the product is in the cart, remove it or decrease its quantity
        if (currentCartData && currentCartData.cart) {
            const existingItem = (currentCartData.cart.items || []).find(item => item.id === productId);
            if (existingItem) {
                let updatedItems;
                let updatedCart;
                if (existingItem.quantity > 1) {
                    // If the product has more than one quantity, decrease its quantity by 1
                    updatedItems = currentCartData.cart.items.map(item => {
                        if (item.id === productId) {
                            return { ...item, quantity: item.quantity - 1 };
                        }
                        return item;
                    });
                    updatedCart = {
                        ...currentCartData.cart,
                        cost: currentCartData.cart.cost - existingItem.price,
                        count: currentCartData.cart.count - 1,
                        items: updatedItems
                    };
                } else {
                    // If the product has only one quantity, remove it from the cart
                    updatedItems = currentCartData.cart.items.filter(item => item.id !== productId);
                    updatedCart = {
                        ...currentCartData.cart,
                        cost: currentCartData.cart.cost - existingItem.price,
                        count: currentCartData.cart.count - 1,
                        items: updatedItems
                    };
                }
                await setDoc(userRef, { cart: updatedCart });
                toast.success("Removed product from Cart!");
                return;
            }
        }
        toast.error("Product not found in Cart!");
    } catch (error) {
        console.log(error);
        toast.error(error.message);
    } finally {
        setProductRemovingFromCart(false);
    }
}


    // to increase item's quantity
    async function increaseQuant(product){
        // finding item's index in cart array
        const index=cart.findIndex((item) => item.id === product.id);
        // increase product quantity and update in useState
        cart[index].quantity++; 
        setCart(cart);

        // update cart in firebase database
        const userRef = doc(db, "userCart", user.uid);
        await updateDoc(userRef, {
            cart: cart
        });
        // increase itemCount and total amount
        setItemInCart(itemInCart + 1);
        setTotal(Number(total + cart[index].price));
    }




    // to decrease item's quantity
    async function decreaseQuant(product){
        // finding item's index
        const index=cart.findIndex((item) => item.name === product.name);
        // reduce total amount
        setTotal(Number(total - cart[index].price));
        
        // change quantity of product and update cart array
        if(cart[index].quantity > 1){
            cart[index].quantity--;
        }
        else{
            cart.splice(index,1);
        }

        // update cart and item Count
        setCart(cart);
        setItemInCart(itemInCart -1 );

        // update cart in array
        const userRef = doc(db, "userCart", user.uid);
        await updateDoc(userRef, {
            cart: cart
        });
    }  


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
                        <MinusIcon handleRemove={decreaseQuant} />
                            {/* {quantity} */}
                        <PlusIcon handleAdd={increaseQuant} />
                    </div>
                )}
            </div>
        {/* Conditionally Rendering buttons based on the screen */}
            {!onCart ? (
                <button
                    className={styles.addBtn}
                    title="Add to Cart"
                    disabled={productAddingToCart}
                    onClick={()=> addProductToCart(product)}
                    >
                    {productAddingToCart ? "Adding" : "Add To Cart"}
                </button>
            ) : (
                <button
                    className={styles.removeBtn}
                    title="Remove from Cart"
                    onClick={()=>removeProductFromCart(product.id)}
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
