import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

const ProductList = ({
  products,
  style,
  onCart,
  removeProductFromCart,
  updateProductQuantity,
  filterProductFromState,
}) => {
  // Component to display the product list
  return (
    <div className={styles.productListContainer}>
      {products.map((product, idx) => {
        return (
          <ProductCard
            product={product}
            key={idx}
            removeProductFromCart={removeProductFromCart}
            updateProductQuantity={updateProductQuantity}
            filterProductFromState={filterProductFromState}
            onCart={onCart}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
