import { AxiosError } from "axios";

/**
 * Extract error message from API error response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    // Try different error message locations
    const errorData = error.response?.data;
    
    if (typeof errorData === "string") {
      return errorData;
    }
    
    if (errorData?.message) {
      return errorData.message;
    }
    
    if (errorData?.error) {
      return typeof errorData.error === "string" 
        ? errorData.error 
        : errorData.error.message || "An error occurred";
    }
    
    if (error.message) {
      return error.message;
    }
    
    // HTTP status code messages
    if (error.response?.status === 401) {
      return "Unauthorized. Please check your credentials.";
    }
    if (error.response?.status === 403) {
      return "Forbidden. You don't have permission to access this resource.";
    }
    if (error.response?.status === 404) {
      return "Endpoint not found. Please check the API URL.";
    }
    if (error.response?.status === 500) {
      return "Server error. Please try again later.";
    }
    
    return `Request failed with status ${error.response?.status || "unknown"}`;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred. Please try again.";
}

/**
 * Parse user data from API response
 */
export function parseUserData(responseData: any): { user: any; token: string | null } {
  // Handle different response structures
  const userData = responseData.data || responseData.user || responseData;
  const token = responseData.token || responseData.data?.token || userData?.token || null;
  
  return {
    user: userData,
    token,
  };
}

/**
 * Store user data in localStorage
 */
export function storeUserData(userData: any, token: string | null): void {
  const userToStore = {
    ...userData,
    token: token,
  };
  
  localStorage.setItem("user", JSON.stringify(userToStore));
}

