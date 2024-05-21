// src/redux/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { db } from '../../config/firebase';
import { getDoc, doc } from 'firebase/firestore';

// Define the initial state for orders slice
const initialState = {
  orders: [],
  loading: false,
  error: null,
};

// Async thunk for fetching orders from Firestore
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async (email) => {
  const docRef = doc(db, "userOrders", email);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();

  // Throw an error if no orders found
  if (!data || !data.orders) {
    throw new Error("No Orders Found!");
  }

  return data.orders;
});

// Create the order slice
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {}, // No additional reducer functions defined in this example
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        // Set loading state while fetching orders
        state.loading = true;
        state.error = null; // Clear any previous error
        state.orders = [];
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        // Set orders data after successful fetch
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        // Handle fetch orders error
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the reducer function
export default orderSlice.reducer;
