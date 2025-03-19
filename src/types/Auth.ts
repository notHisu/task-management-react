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
  id: number | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: UserLoginSchema,
    loginFn: (creds: UserLoginSchema) => Promise<AuthTokens>
  ) => Promise<void>;
  logout: () => void;
  clearErrors: () => void;
}
