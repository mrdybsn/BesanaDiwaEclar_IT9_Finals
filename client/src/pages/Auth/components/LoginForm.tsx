import { useState, type FC, type FormEvent } from "react";
import SubmitButton from "../../../components/Button/SubmitButton";
import FloatingLabelInput from "../../../components/Input/FloatingLabelInput";
import { useNavigate } from "react-router-dom";
import type { LoginCredentialsErrorFields } from "../../../interfaces/AuthInterface";
import { useAuth } from "../../../contexts/AuthContext";

interface LoginFormProps {
    message: (message: string, isFailed?: boolean) => void;
}

export const LoginForm: FC<LoginFormProps> = ({ message }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<LoginCredentialsErrorFields>({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const loggedInUser = await login(username, password);
            if (loggedInUser.role === "rider") {
                navigate("/rider/tasks");
            } else {
                navigate("/admin/dashboard");
            }
        } catch (error: unknown) {
            const err = error as { response?: { status?: number; data?: { message?: string; errors?: LoginCredentialsErrorFields } } };
            if (err.response?.status === 401) {
                setErrors({});
                message(err.response.data?.message ?? "Invalid credentials.", true);
            } else if (err.response?.status === 403) {
                message(err.response.data?.message ?? "Account inactive.", true);
            } else if (err.response?.status === 422) {
                setErrors(err.response.data?.errors ?? {});
            } else {
                message("Unable to connect to server. Please try again.", true);
                console.error("Login error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div className="mb-4">
                <FloatingLabelInput
                    label="Username"
                    type="text"
                    name="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    autoFocus
                    errors={errors.username}
                />
            </div>
            <div className="mb-4">
                <FloatingLabelInput
                    label="Password"
                    type="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    errors={errors.password}
                />
            </div>
            <SubmitButton
                className="w-full"
                label="Sign In"
                loading={isLoading}
                loadingLabel="Signing In..."
            />
        </form>
    );
};
