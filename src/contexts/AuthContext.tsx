import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  type ReactNode,
} from "react";
import type { UserType } from "../types";
import { authClient } from "../auth";

type AuthProviderProps = {
  children: ReactNode;
};

type AuthResult = { success: boolean; error?: string };

type AuthContextType = {
  user: UserType | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  logIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (
    email: string,
    password: string,
    name?: string,
  ) => Promise<AuthResult>;
  logOut: () => Promise<void>;
};

type StateType = {
  user: UserType | null;
  isLoggedIn: boolean;
};

type ActionType = { type: "logIn"; payload: UserType } | { type: "logOut" };

const initialState: StateType = {
  user: null,
  isLoggedIn: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "logIn":
      return { ...state, user: action.payload, isLoggedIn: true };
    case "logOut":
      return { ...state, user: null, isLoggedIn: false };
  }
}

function getAuthErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.name === "AuthApiError" && err.message) {
    return err.message;
  }
  return "Something went wrong. Please try again.";
}

function toUser(u: {
  name?: string | null;
  email: string;
  image?: string | null;
}): UserType {
  return {
    name: u.name ?? u.email.split("@")[0],
    email: u.email,
    avatar:
      u.image ?? `https://i.pravatar.cc/100?u=${encodeURIComponent(u.email)}`,
  };
}

function AuthProvider({ children }: AuthProviderProps) {
  const [{ user, isLoggedIn }, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);

  async function loadSession(): Promise<boolean> {
    const result = await authClient.getSession();
    if (result.data?.session && result.data?.user) {
      dispatch({ type: "logIn", payload: toUser(result.data.user) });
      return true;
    }
    dispatch({ type: "logOut" });
    return false;
  }

  // restore the session on page load / refresh
  useEffect(() => {
    loadSession()
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);
  async function logIn(email: string, password: string): Promise<AuthResult> {
    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        console.error("Sign in error:", result.error);
        return { success: false, error: "Invalid email or password" };
      }
      const ok = await loadSession();
      return ok
        ? { success: true }
        : { success: false, error: "Could not start a session" };
    } catch (err) {
      console.error("Sign in threw:", err);
      return {
        success: false,
        error: getAuthErrorMessage(err, "Invalid email or password"),
      };
    }
  }

  async function signUp(
    email: string,
    password: string,
    name?: string,
  ): Promise<AuthResult> {
    try {
      const result = await authClient.signUp.email({
        name: name || email.split("@")[0] || "User",
        email,
        password,
      });
      if (result.error) {
        console.error("Sign up error:", result.error);
        return {
          success: false,
          error: result.error.message ?? "Sign up failed",
        };
      }
      const ok = await loadSession();
      return ok
        ? { success: true }
        : { success: false, error: "Could not start a session" };
    } catch (err) {
      console.error("Sign in threw:", err);
      return {
        success: false,
        error: getAuthErrorMessage(err, "Invalid email or password"),
      };
    }
  }

  async function logOut() {
    await authClient.signOut();
    dispatch({ type: "logOut" });
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn, isLoading, logIn, signUp, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined)
    throw new Error("The context was used outside of scope");

  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth, AuthProvider };
