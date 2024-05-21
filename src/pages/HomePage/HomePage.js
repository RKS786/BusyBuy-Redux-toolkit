// src/pages/HomePage/HomePage.js
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts, filterProducts } from "../../redux/slices/productSlice";
import styles from "./HomePage.module.css";
import ProductList from "../../components/Product/ProductList/ProductList";
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import Loader from "../../UI/Loader";

const HomePage = () => {
  const [query, setQuery] = useState("");
  const [priceRange, setPriceRange] = useState(75000);
  const [categories, setCategories] = useState({
    mensFashion: false,
    electronics: false,
    jewelery: false,
    womensClothing: false,
  });

  const { products, loading, filteredProducts } = useSelector((state) => state.products);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    dispatch(filterProducts({ searchQuery: query, priceRange, categories }));
  }, [query, priceRange, categories, dispatch]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className={styles.homePageContainer}>
      <FilterSidebar
        setPriceRange={setPriceRange}
        setCategories={setCategories}
        priceRange={priceRange}
      />
      <form className={styles.form}>
        <input
          type="search"
          placeholder="Search By Name"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </form>
      {products.length ? (
        <ProductList products={filteredProducts} />
      ) : null}
    </div>
  );
};

export default HomePage;
