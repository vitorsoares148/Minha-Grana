import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  login as loginService,
  register as registerService,
  userInfo as userInfoService,
  updateBalance as updateBalanceService,
  logout as logoutService,
} from "../services/auth.service";

import type { User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loadingDate: boolean;
  isAuthenticated: boolean;

  login: (username: string, password: string) => Promise<string>;

  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<string>;

  getUserInfo: () => Promise<void>;
  getUserInfoDate: (Month: number, Year: number) => Promise<void>;
  updateBalance: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingDate, setLoadingDate] = useState(false);

  // ======================================================
  // DELAY DO LOADING DE DATA
  // ======================================================

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  // ======================================================
  // LOGIN
  // ======================================================

  const login = useCallback(async (username: string, password: string) => {
    const result = await loginService(username, password);

    if (result === "SUCCESS") {
      await getUserInfo();
    }

    return result;
  }, []);

  // ======================================================
  // REGISTER
  // ======================================================

  const register = useCallback(
    async (username: string, email: string, password: string) => {
      const result = await registerService(username, email, password);

      if (result === "SUCCESS") {
        await getUserInfo();
      }

      return result;
    },
    [],
  );

  // ======================================================
  // INFORMAÇÕES DO USUÁRIO ATUAL
  // ======================================================

  const getUserInfo = useCallback(async () => {
    try {
      const result = await userInfoService(new Date());

      if (result.message === "AUTHENTICATED") {
        setUser(result.userinfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // INFORMAÇÕES DO USUÁRIO EM OUTRA DATA
  // ======================================================

  const getUserInfoDate = useCallback(async (month: number, year: number) => {
    const timer = setTimeout(() => {
      setLoadingDate(true);
    }, 300);

    try {
      const date = new Date(year, month, 1);
      const result = await userInfoService(date);

      if (result.message === "AUTHENTICATED") {
        setUser(result.userinfo);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      clearTimeout(timer);
      setLoadingDate(false);
    }
  }, []);

  // ======================================================
  // ATUALIZAR BALANÇA
  // ======================================================

  const updateBalance = useCallback(async () => {
    try {
      const result = await updateBalanceService();

      if (result.message === "SUCCESS") {
        setUser((prevUser) => {
          if (!prevUser) {
            return null;
          }

          return {
            ...prevUser,
            balance: result.balance,
          };
        });
      }
    } catch {
      // Axios interceptor handles 401
    }
  }, []);

  // ======================================================
  // LOGOUT
  // ======================================================

  const logout = useCallback(async () => {
    try {
      await logoutService();
    } catch (error) {
      console.error(error);
    } finally {
      setUser(null);
    }
  }, []);

  // Checar autenticação quando o aplicativo começar
  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loadingDate,
        isAuthenticated: user !== null,
        login,
        register,
        getUserInfo,
        getUserInfoDate,
        updateBalance,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// HOOK
// ======================================================

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}
