import React, { useState, useEffect, useContext } from "react";
import { db } from "../../config/firebase";
import { getDoc, doc } from "firebase/firestore";
import { AuthContext } from "../../context/Auth/AuthContext";
import Loader from "../../UI/Loader";
import styles from "./OrdersPage.module.css";
import { toast } from "react-toastify";
import OrderTable from "../../components/OrderTable/OrderTable";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  // Fetch user orders from firestore
  const getOrders = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, "userOrders", user.email);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();

      // Display error message if no orders found
      if (!data || !data.orders) {
        return toast.error("No Orders Found!");
      }

      // Extract orders array from data
      const userOrders = data.orders;

      console.log("userOrders", userOrders)

      // Update state with orders array
      setOrders(userOrders);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (!loading && !orders.length) {
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => {
        return <OrderTable order={[order]} key={idx} />;
      })}
    </div>
  );
};

export default OrdersPage;
