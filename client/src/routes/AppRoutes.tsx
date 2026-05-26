import { Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import UserMainPage from "../pages/Admin/UserManagementPage";
import ProductMainPage from "../pages/Admin/ProductManagementPage";
import CustomerMainPage from "../pages/Admin/CustomerManagementPage";
import InventoryMainPage from "../pages/Admin/InventoryManagementPage";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminReportsPage from "../pages/Admin/AdminReportsPage";
import GallonDebtsMainPage from "../pages/Admin/GallonDebtsMainPage";
import DeliveryMainPage from "../pages/Admin/DeliveryMainPage";
import RemittancesMainPage from "../pages/Admin/RemittancesMainPage";
import RiderTasksMainPage from "../pages/Rider/RiderTasksMainPage";
import RiderMapMainPage from "../pages/Rider/RiderMapMainPage";
import RiderCollectionMainPage from "../pages/Rider/RiderCollectionMainPage";
import RiderLostItemMainPage from "../pages/Rider/RiderLostItemMainPage";
import AdminNotificationsMainPage from "../pages/Admin/AdminNotificationsMainPage";
import AdminPOSPage from "../pages/Admin/AdminPOSPage";
import AdminOrdersMainPage from "../pages/Admin/AdminOrdersMainPage";
import RiderWeeklyScheduleMainPage from "../pages/Rider/RiderWeeklyScheduleMainPage";
import LoginPage from "../pages/Auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import GuestRoute from "./GuestRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/analytics" element={<AdminDashboard />} />
          <Route path="/admin/pos" element={<AdminPOSPage />} />
          <Route path="/admin/orders" element={<AdminOrdersMainPage />} />
          <Route path="/admin/recurring" element={<Navigate to="/admin/orders?tab=recurring" replace />} />
          <Route path="/admin/users" element={<UserMainPage />} />
          <Route path="/admin/products" element={<ProductMainPage />} />
          <Route path="/admin/customers" element={<CustomerMainPage />} />
          <Route path="/admin/inventory" element={<InventoryMainPage />} />
          <Route path="/admin/gallon-debts" element={<GallonDebtsMainPage />} />
          <Route path="/admin/deliveries" element={<DeliveryMainPage />} />
          <Route path="/admin/remittances" element={<RemittancesMainPage />} />
          <Route path="/admin/notifications" element={<AdminNotificationsMainPage />} />

          <Route path="/rider/tasks" element={<RiderTasksMainPage />} />
          <Route path="/rider/map" element={<RiderMapMainPage />} />
          <Route path="/rider/collection" element={<RiderCollectionMainPage />} />
          <Route path="/rider/lost-items" element={<RiderLostItemMainPage />} />
          <Route path="/rider/schedule" element={<RiderWeeklyScheduleMainPage />} />
          <Route path="/rider/notifications" element={<Navigate to="/rider/tasks" replace />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/logout" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
