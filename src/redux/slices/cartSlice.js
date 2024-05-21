
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, arrayUnion, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Define the initial state for the cart
const initialState = {
  cartProducts: [], // Array to store cart products
  cartProductsMap: [], // Map to store cart products
  totalPrice: 0, // Total price of all items in the cart
  purchasing: false, // Flag to indicate if a purchase is in progress
  loading: false, // Flag to indicate if data is loading
  error: null, // Error message if any
};

// Thunk action to fetch cart data
export const fetchCartData = createAsyncThunk('cart/fetchCartData', async (email) => {
  // Fetch user's cart data from Firestore
  const userRef = doc(db, "usersCarts", email);
  const userCartSnapshot = await getDoc(userRef);
  const currentUserCartData = userCartSnapshot.data();
  
  // If user has a cart and it's not empty, return cart data
  if (currentUserCartData && currentUserCartData.cart) {
    const cartProductsArray = currentUserCartData.cart.items;
    return {
      cartProducts: cartProductsArray,
      totalPrice: currentUserCartData.cart.cost,
    };
  }
  // If user has no cart or it's empty, return empty cart data
  return { cartProducts: [], totalPrice: 0 };
});

// Thunk action to purchase products
export const purchaseProducts = createAsyncThunk('cart/purchaseProducts', async (email, { getState }) => {
  // Get the current state
  const state = getState();
  const { cartProductsMap } = state.cart;
  console.log("cartProductsMap",cartProductsMap)
  
  // Reference to the user's orders collection in Firestore
  const docRef = doc(db, "userOrders", email);
  const docSnap = await getDoc(docRef);
  const data = docSnap.data();
  
  // If user has existing orders, update with new order
  if (data) {
    await updateDoc(docRef, {
      orders: arrayUnion({ ...cartProductsMap, date: Date.now() }),
    });
  } else { // If user has no existing orders, create new order
    await setDoc(docRef, {
      orders: [{ ...cartProductsMap, date: Date.now() }],
    });
  }
  
  // Clear user's cart after purchase
  const userCartRef = doc(db, "usersCarts", email);
  await deleteDoc(userCartRef);
  
  return [];
});

// Thunk action to add a product to the cart
export const addProductToCart = createAsyncThunk('cart/addProductToCart', async ({ product, email }) => {
  // Reference to the user's cart document in Firestore
  const userRef = doc(db, 'usersCarts', email);
  const userCartSnapshot = await getDoc(userRef);
  const currentUserCartData = userCartSnapshot.data();
  
  // If user has a cart, update cart with new product
  if (currentUserCartData && currentUserCartData.cart) {
    const cartProducts = [...currentUserCartData.cart.items];
    const productIndex = cartProducts.findIndex(item => item.id === product.id);
    
    // If product already exists in cart, increase quantity
    if (productIndex !== -1) {
      cartProducts[productIndex].quantity += 1;
    } else { // If product is new to cart, add it
      cartProducts.push({ ...product, quantity: 1 });
    }
    
    // Calculate total price of cart after adding product
    const totalPrice = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    
    // Update user's cart data in Firestore
    await updateDoc(userRef, {
      cart: { items: cartProducts, cost: totalPrice }
    });
    
    return { cartProducts, totalPrice };
  } else { // If user has no cart, create new cart with the product
    const cartProducts = [{ ...product, quantity: 1 }];
    const totalPrice = product.price;
    
    // Set user's cart data in Firestore
    await setDoc(userRef, {
      cart: { items: cartProducts, cost: totalPrice }
    });
    
    return { cartProducts, totalPrice };
  }
});

// Thunk action to remove a product from the cart
export const removeProductFromCart = createAsyncThunk('cart/removeProductFromCart', async ({ productId, email }) => {
  // Reference to the user's cart document in Firestore
  const userRef = doc(db, 'usersCarts', email);
  const userCartSnapshot = await getDoc(userRef);
  const currentUserCartData = userCartSnapshot.data();
  
  // If user has a cart and it's not empty, remove product from cart
  if (currentUserCartData && currentUserCartData.cart) {
    const cartProducts = currentUserCartData.cart.items.filter(item => item.id !== productId);
    const totalPrice = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    
    // Update user's cart data in Firestore after removing product
    await updateDoc(userRef, {
      cart: { items: cartProducts, cost: totalPrice }
    });
    
    return { cartProducts, totalPrice };
  }
  // If user has no cart or it's empty, return empty cart data
  return { cartProducts: [], totalPrice: 0 };
});

// Thunk action to increase the quantity of a product in the cart
export const increaseQuantity = createAsyncThunk('cart/increaseQuantity', async ({ productId, email }) => {
  // Reference to the user's cart document in Firestore
  const userRef = doc(db, 'usersCarts', email);
  const userCartSnapshot = await getDoc(userRef);
  const currentUserCartData = userCartSnapshot.data();
  
  // If user has a cart and it's not empty, increase product quantity
  if (currentUserCartData && currentUserCartData.cart) {
    const cartProducts = currentUserCartData.cart.items.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    const totalPrice = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    
    // Update user's cart data in Firestore after increasing quantity
    await updateDoc(userRef, {
      cart: { items: cartProducts, cost: totalPrice }
    });
    
    return { cartProducts, totalPrice };
  }
  // If user has no cart or it's empty, return empty cart data
  return { cartProducts: [], totalPrice: 0 };
});

// Thunk action to decrease the quantity of a product in the cart
export const decreaseQuantity = createAsyncThunk('cart/decreaseQuantity', async ({ productId, email }, { dispatch }) => {
  const userRef = doc(db, 'usersCarts', email);
  const userCartSnapshot = await getDoc(userRef);
  const currentUserCartData = userCartSnapshot.data();
  
  if (currentUserCartData && currentUserCartData.cart) {
    let cartProducts = currentUserCartData.cart.items.map(item => {
      if (item.id === productId && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    }).filter(item => item.id !== productId || item.quantity > 0); // Remove product if quantity is 0
    
    const totalPrice = cartProducts.reduce((total, product) => total + product.price * product.quantity, 0);
    
    await updateDoc(userRef, {
      cart: { items: cartProducts, cost: totalPrice }
    });

    // Dispatch removeProductFromCart action if quantity is 0
    const product = currentUserCartData.cart.items.find(item => item.id === productId);
    if (product && product.quantity === 1) {
      dispatch(removeProductFromCart({ productId, email }));
    }
    
    return { cartProducts, totalPrice };
  }
  return { cartProducts: [], totalPrice: 0 };
});


  const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
      // No additional reducer functions defined in this example
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchCartData.pending, (state) => {
          // Set loading state while fetching cart data
          state.loading = true;
        })
        .addCase(fetchCartData.fulfilled, (state, action) => {
          // Set cart data and total price after successful fetch
          state.loading = false;
          state.cartProducts = action.payload.cartProducts;
          state.totalPrice = action.payload.totalPrice;
          state.cartProductsMap = { products: action.payload.cartProducts };
        })
        .addCase(fetchCartData.rejected, (state, action) => {
          // Handle fetch data error
          state.loading = false;
          state.error = action.error.message;
        })
        .addCase(purchaseProducts.pending, (state) => {
          // Set purchasing state while purchasing products
          state.purchasing = true;
        })
        .addCase(purchaseProducts.fulfilled, (state) => {
          // Reset cart state after successful purchase
          state.purchasing = false;
          state.cartProducts = [];
          state.totalPrice = 0;
          state.cartProductsMap = [];
        })
        .addCase(purchaseProducts.rejected, (state, action) => {
          // Handle purchase error
          state.purchasing = false;
          state.error = action.error.message;
        })
        .addCase(addProductToCart.fulfilled, (state, action) => {
          // Update cart state after adding a product to cart
          state.cartProducts = action.payload.cartProducts;
          state.cartProductsMap = { products: action.payload.cartProducts };
          state.totalPrice = action.payload.totalPrice;
        })
        .addCase(increaseQuantity.fulfilled, (state, action) => {
          // Update cart state after increasing quantity of a product
          state.cartProducts = action.payload.cartProducts;
          state.cartProductsMap = { products: action.payload.cartProducts };
          state.totalPrice = action.payload.totalPrice;
        })
        .addCase(decreaseQuantity.fulfilled, (state, action) => {
          // Update cart state after decreasing quantity of a product
          state.cartProducts = action.payload.cartProducts;
          state.cartProductsMap = { products: action.payload.cartProducts };
          state.totalPrice = action.payload.totalPrice;
        })
        .addCase(removeProductFromCart.fulfilled, (state, action) => {
          // Update cart state after removing a product from cart
          state.cartProducts = action.payload.cartProducts;
          state.cartProductsMap = { products: action.payload.cartProducts };
          state.totalPrice = action.payload.totalPrice;
        });
    },
  });
  
  // Export reducer 
  export default cartSlice.reducer;
