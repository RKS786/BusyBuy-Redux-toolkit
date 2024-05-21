import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Initial state for the products slice
const initialState = {
  loading: false,          // Indicates if products are being fetched
  products: [],            // Array to store fetched products
  filteredProducts: [],    // Array to store filtered products based on user input
  error: '',               // Stores any error messages
};

// Async thunk to fetch products from Firestore
export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const productsRef = collection(db, 'products');   // Reference to the 'products' collection
  const productsSnapshot = await getDocs(productsRef); // Fetch all documents in the collection
  return productsSnapshot.docs.map((doc) => doc.data()); // Map documents to their data
});

// Slice for managing products state
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Reducer to filter products based on search query, price range, and categories
    filterProducts: (state, action) => {
      const { searchQuery, priceRange, categories } = action.payload; // Extract payload data
      let filteredProducts = state.products; // Start with all products

      // Filter by search query
      if (searchQuery) {
        filteredProducts = filteredProducts.filter((product) =>
          product.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Filter by categories
      const activeCategories = Object.keys(categories).filter(key => categories[key]); // Get active categories
      if (activeCategories.length > 0) {
        filteredProducts = filteredProducts.filter((product) => {
          if (categories.mensFashion && product.category === "men's clothing") return true;
          if (categories.womensClothing && product.category === "women's clothing") return true;
          if (categories.electronics && product.category === "electronics") return true;
          if (categories.jewelery && product.category === "jewelery") return true;
          return false;
        });
      }

      // Filter by price range
      if (priceRange) {
        filteredProducts = filteredProducts.filter((product) => product.price < priceRange);
      }

      // Update the state with filtered products
      state.filteredProducts = filteredProducts;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;  // Set loading to true while fetching
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;          // Set loading to false after fetching
        state.products = action.payload; // Store fetched products
        state.filteredProducts = action.payload; // Initialize filteredProducts with all products
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;         // Set loading to false on error
        state.error = action.error.message; // Store the error message
      });
  },
});

// Export actions and reducer
export const { filterProducts } = productsSlice.actions;
export default productsSlice.reducer;
