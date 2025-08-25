export interface User {
  id: string;
  email: string;
  metadata: object;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  metadata: object;
}

export interface LoginResponse {
  message: string;
  session: Session;
  user: User;
}

export interface RegisterResponse {
  user: User;
}
