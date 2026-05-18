import { Outlet } from "react-router-dom";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";
import { SidebarProvider } from "../contexts/SidebarContext";
import { HeaderProvider } from "../contexts/HeaderContext";
import { NotificationProvider } from "../contexts/NotificationContext";

const AppLayout = () => {
    return (
        <NotificationProvider>
            <SidebarProvider>
                <HeaderProvider>
                    <div className="min-h-screen bg-gray-50">
                        <AppHeader />
                        <AppSidebar />
                        <main className="p-4 sm:ml-64 mt-14">
                            <div className="p-4">
                                <Outlet />
                            </div>
                        </main>
                    </div>
                </HeaderProvider>
            </SidebarProvider>
        </NotificationProvider>
    );
};

export default AppLayout;