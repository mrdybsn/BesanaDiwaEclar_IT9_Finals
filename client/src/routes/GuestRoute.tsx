import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const GuestRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <span className="text-sm text-gray-500">Loading…</span>
            </div>
        );
    }

    if (user) {
        return <Navigate to={user.role === "rider" ? "/rider/tasks" : "/admin/dashboard"} replace />;
    }

    return <Outlet />;
};

export default GuestRoute;
