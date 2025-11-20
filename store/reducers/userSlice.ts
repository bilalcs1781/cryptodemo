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

// Load initial state from localStorage if available
const getInitialState = (): UserState => {
  if (typeof window !== "undefined") {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        return {
          user: userData,
          token: userData?.token || null,
          isAuthenticated: !!userData?.token,
        };
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error);
    }
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  };
};

const initialState: UserState = getInitialState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.token = action.payload.token || null;
      state.isAuthenticated = !!action.payload.token;

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload));
      }
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;

      // Update token in user object and localStorage
      if (state.user) {
        state.user.token = action.payload;
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(state.user));
        }
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user");
      }
    },
  },
});

export const { setUser, setToken, logout } = userSlice.actions;
export default userSlice.reducer;
