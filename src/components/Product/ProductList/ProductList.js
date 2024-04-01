import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

const ProductList = ({
  products,
  onCart,
  removeFromCartState,
  calculateTotalPrice,
  setTotalPrice
  
}) => {

  // Component to display the product list
  return (
    <div className={styles.productListContainer}>
      {products.map((product, idx) => {
        return (
          <ProductCard
            product={product}
            key={idx}
            onCart={onCart}
            removeFromCartState={removeFromCartState}
            calculateTotalPrice={calculateTotalPrice}
            setTotalPrice={setTotalPrice}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
