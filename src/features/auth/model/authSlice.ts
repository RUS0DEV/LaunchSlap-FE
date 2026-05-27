import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/entities/user/model/types';

const TOKEN_STORAGE_KEY = 'launchslab_token';

export interface AuthState {
  token: string | null;
  user: User | null;
  isInitialized: boolean;
}

const readInitialToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const initialState: AuthState = {
  token: readInitialToken(),
  user: null,
  isInitialized: false,
};

const persistToken = (token: string | null) => {
  if (typeof window === 'undefined') {
    return;
  }

  if (token) {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(
      state,
      action: PayloadAction<{ token: string; user: User | null }>,
    ) {
      state.token = action.payload.token;
      state.user = action.payload.user;
      persistToken(action.payload.token);
    },
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
    },
    logout(state) {
      state.token = null;
      state.user = null;
      state.isInitialized = true;
      persistToken(null);
    },
    setInitialized(state, action: PayloadAction<boolean>) {
      state.isInitialized = action.payload;
    },
  },
});

export const { setCredentials, setUser, logout, setInitialized } =
  authSlice.actions;
export default authSlice.reducer;
