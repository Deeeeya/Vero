import api from "./api";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  metadata?: Record<string, any>;
}

interface User {
  id: string;
  email: string;
  metadata: Record<string, any>;
}

interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  metadata: Record<string, any>;
}

interface LoginResponse {
  message: string;
  user: User;
  session: Session;
}

interface RegisterResponse {
  user: User;
}

// Auth service functions
export const authService = {
  // Login function
  login: async (email: string, password: string): Promise<LoginResponse> => {
    try {
      // Send POST request to backend
      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      if (response.data.session?.id) {
        localStorage.setItem("sessionToken", response.data.session.id);
      }

      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Login failed";
      throw new Error(errorMessage);
    }
  },

  // Register function
  register: async (
    email: string,
    password: string,
    metadata: {}
  ): Promise<RegisterResponse> => {
    try {
      const response = await api.post("/api/auth/register", {
        email,
        password,
        metadata,
      });

      return response.data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      throw new Error(errorMessage);
    }
  },
};
