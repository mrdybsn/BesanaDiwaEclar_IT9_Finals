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
                    <div className="min-h-screen" style={{ backgroundColor: "#EEF6FC" }}>
                        <AppHeader />
                        <AppSidebar />
                        {/* sm:ml-60 matches the sidebar width (w-60 = 15rem) */}
                        <main className="sm:ml-60 mt-14 min-h-screen">
                            <div className="p-5">
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