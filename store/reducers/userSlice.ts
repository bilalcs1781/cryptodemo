import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  age?: number;
  address?: string;
  createdAt?: string;
  token?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.token;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      // Update token in user object
      if (state.user) {
        state.user.token = action.payload;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
