import { createContext, useContext, useEffect, useState, type FC, type ReactNode } from "react";
import type { AuthUser } from "../interfaces/AuthInterface";
import AuthService from "../services/AuthServices";

interface AuthContextType {
    user: AuthUser | null;
    loading: boolean;
    login: (username: string, password: string) => Promise<AuthUser>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);

    const login = async (username: string, password: string) => {
        const res = await AuthService.login({ username, password });

        if (res.status === 200) {
            localStorage.setItem("token", res.data.token ?? "");
            setUser(res.data.user);
            return res.data.user;
        }
        console.error("Unexpected status during login:", res.status);
        throw new Error("Login failed");
    };

    const logout = async () => {
        try {
            const res = await AuthService.logout();
            if (res.status === 200) {
                localStorage.removeItem("token");
                setUser(null);
            }
        } catch {
            localStorage.removeItem("token");
            setUser(null);
        }
    };

    const checkAuth = async () => {
        setLoading(true);
        const token = localStorage.getItem("token");

        if (token) {
            try {
                const res = await AuthService.me();
                if (res.status === 200) {
                    setUser(res.data.user);
                } else {
                    localStorage.removeItem("token");
                    setUser(null);
                }
            } catch {
                localStorage.removeItem("token");
                setUser(null);
            }
        } else {
            setUser(null);
        }
        setLoading(false);
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
