import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';

const initialState = {
  user: null,
  error: false,
  message: '',
  loading: false,
};

export const signup = createAsyncThunk('auth/signup', async ({ name, email, password }) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(auth.currentUser, { displayName: name });
  return { uid: res.user.uid, email: res.user.email, displayName: name };
});

export const login = createAsyncThunk('auth/login', async ({ email, password }) => {
  const res = await signInWithEmailAndPassword(auth, email, password);
  return { uid: res.user.uid, email: res.user.email };
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      const { uid, email, displayName } = action.payload;
      state.user = { uid, email, displayName }; // only store serializable data
    },
    clearError: (state) => {
      state.error = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.loading = true;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = true;
        state.message = action.error.message;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setAuthUser, clearError } = authSlice.actions;
export default authSlice.reducer;
