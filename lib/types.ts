// API Response Types
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
  token?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: "user" | "admin";
  createdAt?: string;
  token?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success?: boolean;
  user?: User;
  data?: User;
  token?: string;
  message?: string;
}
