import React from "react";
import styles from "./FilterSidebar.module.css";

const FilterSidebar = ({ setCategories, setPriceRange, priceRange }) => {

  const handleCategoryChange = (event) => {
    const { name, checked } = event.target;
    setCategories((prevCategories) => ({
      ...prevCategories,
      [name]: checked,
    }));
  };

  const handlePriceChange = (event) => {
    setPriceRange(event.target.value);
  };

  return (
    <aside className={styles.filterContainer}>
      <h2>Filter</h2>
      <form>
        <label htmlFor="price">Price: {priceRange}</label>
        <input
        type="range"
        min="1"
        name="price"
        max="100000"
        value={priceRange}
        onChange={handlePriceChange}
      />
        <h2>Category</h2>
        <div className={styles.categoryContainer}>
          <div className={styles.inputContainer}>
            <input
            type="checkbox"
            id="mensFashion"
            name="mensFashion"
            onChange={handleCategoryChange}
            />
            <label htmlFor="mensFashion">Men's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
            type="checkbox"
            id="womensFashion"
            name="womensFashion"
            onChange={handleCategoryChange}
          />
            <label htmlFor="womensFashion">Women's Clothing</label>
          </div>
          <div className={styles.inputContainer}>
            <input
            type="checkbox"
            id="jewelery"
            name="jewelery"
            onChange={handleCategoryChange}
          />
            <label htmlFor="jewelery">Jewelery</label>
          </div>
          <div className={styles.inputContainer}>
            <input
            type="checkbox"
            id="electronics"
            name="electronics"
            onChange={handleCategoryChange}
          />
            <label htmlFor="electronics">Electronics</label>
          </div>
        </div>
      </form>
    </aside>
  );
};

export default FilterSidebar;
