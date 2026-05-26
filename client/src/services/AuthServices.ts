import AxiosInstance from "./AxiosInstance";
import type { AuthUser } from "../interfaces/AuthInterface";

const AuthService = {
    login: async (credentials: { username: string; password: string }) => {
        return AxiosInstance.post<{ user: AuthUser; token: string }>("/login", credentials);
    },

    logout: async () => {
        return AxiosInstance.post("/logout");
    },

    me: async () => {
        return AxiosInstance.get<{ user: AuthUser }>("/me");
    },
};

export default AuthService;
