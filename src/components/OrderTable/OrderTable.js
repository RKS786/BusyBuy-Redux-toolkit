import React from "react";
import styles from "./OrderTable.module.css";

const OrderTable = ({ order }) => {
  console.log("order in table", order);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {order.date && <h2>Ordered On:- {new Date(order.date).toLocaleDateString()}</h2>}
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Total Price</th>
          </tr>
        </thead>
        <tbody>
          {order.products.map((product, idx) => (
            <tr key={idx}>
              <td>{product.title}</td>
              <td>{`₹ ${product.price}`}</td>
              <td>{`${product.quantity}`}</td>
              <td>{`₹ ${product.quantity * product.price}`}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className={styles.totalPrice}>
            <td colSpan="3">Total Price</td>
            <td>
              {`₹ ${order.products.reduce((acc, currentProduct) => acc + currentProduct.price * currentProduct.quantity, 0)}`}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default OrderTable;
