
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCartData, purchaseProducts } from '../../redux/slices/cartSlice';
import styles from './CartPage.module.css';
import Loader from '../../UI/Loader';
import ProductList from '../../components/Product/ProductList/ProductList';
import { useNavigate } from 'react-router-dom';

// Cart page component
const CartPage = () => {
  // Redux dispatch
  const dispatch = useDispatch();
  // Navigation hook
  const navigate = useNavigate();
  // User authentication state from Redux store
  const { user } = useSelector(state => state.auth);
  // Cart state from Redux store
  const { cartProducts, totalPrice, loading, purchasing } = useSelector(state => state.cart);

  // Fetch cart data on component mount
  useEffect(() => {
    if (user) {
      dispatch(fetchCartData(user.email));
    }
  }, [dispatch, user]);

  // Function to handle purchase of products
  const handlePurchase = () => {
    dispatch(purchaseProducts(user.email)).then(() => {
      navigate('/myorders'); // Redirect to orders page after successful purchase
    });
  };

  // Render loading indicator while fetching data
  if (loading) return <Loader />;

  return (
    <div className={styles.cartPageContainer}>
      {/* Render total price and purchase button if cart is not empty */}
      {!!cartProducts.length && (
        <aside className={styles.totalPrice}>
          <p>Total Price: ₹{totalPrice}/-</p>
          <button className={styles.purchaseBtn} onClick={handlePurchase} disabled={purchasing}>
            {purchasing ? 'Purchasing' : 'Purchase'}
          </button>
        </aside>
      )}
      {/* Render product list if cart is not empty, otherwise display message */}
      {!!cartProducts.length ? (
        <ProductList
          products={cartProducts}
          onCart={true}
        />
      ) : (
        <h1 style={{ textAlign: "center" }}>Cart is Empty!</h1>
      )}
    </div>
  );
};

export default CartPage;
