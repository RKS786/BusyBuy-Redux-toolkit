import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../UI/Loader";
import styles from "./OrdersPage.module.css";
import { fetchOrders } from "../../redux/slices/orderSlice";
import OrderTable from "../../components/OrderTable/OrderTable";

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, loading} = useSelector((state) => state.orders);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrders(user.email));
    }
  }, [dispatch, user]);

  if (loading) {
    return <Loader />;
  }

  if (!loading && (!orders || orders.length === 0)) {
    return <h1 style={{ textAlign: "center" }}>No Orders Found!</h1>;
  }

  return (
    <div className={styles.ordersContainer}>
      <h1>Your Orders</h1>
      {orders.map((order, idx) => (
        <OrderTable order={order} key={idx} />
      ))}
    </div>
  );
};

export default OrdersPage;
