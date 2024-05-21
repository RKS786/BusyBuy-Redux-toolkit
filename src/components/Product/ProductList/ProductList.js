import React from "react";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductList.module.css";

const ProductList = ({
  products,
  onCart,  
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
          />
        );
      })}
    </div>
  );
};

export default ProductList;
