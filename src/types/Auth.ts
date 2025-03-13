import { UserLoginSchema } from "../schemas/userSchema";

export interface AuthTokens {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

export interface User {
  email: string;
  token?: AuthTokens;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (credentials: UserLoginSchema) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}
