import api from "./api";
import type { LoginResponse, RegisterResponse } from "../types/auth";

/* Add Auth service functions,
 so we wrap it around a authService object with 
 the functions inside it */

export const authService = {
  // Login function
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Send a POST request to the backend by defining response and awaiting
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      /* Check to see if response returns session token,
       if it does save token to localStorage */

      if (response.data.session?.id) {
        localStorage.setItem("sessionToken", response.data.session.id);
      }

      // Lastly, return the response data
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      // Simple error handling, will be reused in other catch blocks
      throw new Error("Login failed");
    }
  },

  // Register function (just like login function)
  register: async (
    email: string,
    password: string,
    metadata = {}
  ): Promise<RegisterResponse> => {
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
        metadata,
      });

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Login failed");
    }
  },

  // Logout function (while user is signed in)
  logout: async (): Promise<void> => {
    try {
      // Get the session token, then call the backend logout endpoint
      const token = localStorage.getItem("sessionToken");
      if (token) {
        await api.post("/api/auth/logout");
      }
    } catch (error) {
      // If backend call fails, we still clear local data
      // Console log an error message using console.error
      console.error("Logout error:", error);
    } finally {
      // ALWAYS REMOVE TOKEN from local storage and redirect
      localStorage.removeItem("sessionToken");
      window.location.href = "/login";
    }
  },

  // HELPER FUNCTIONS
  // Check if user is logged in (we return a boolean value)
  isAuthenticated: (): boolean => {
    return localStorage.getItem("sessionToken") !== null;
  },

  // Get the current session token (as a string)
  getToken: (): string | null => {
    return localStorage.getItem("sessionToken");
  },
};
