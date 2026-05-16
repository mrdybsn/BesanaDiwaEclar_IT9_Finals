import { Route, Routes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import UserMainPage from "../pages/Admin/UserManagementPage";
import ProductMainPage from "../pages/Admin/ProductManagementPage";
import CustomerMainPage from "../pages/Admin/CustomerManagementPage";
import InventoryMainPage from "../pages/Admin/InventoryManagementPage";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminAnalytics from "../pages/Admin/AdminAnalytics";
import GallonDebtsMainPage from "../pages/Admin/GallonDebtsMainPage";
import DeliveryMainPage from "../pages/Admin/DeliveryMainPage";
import RemittancesMainPage from "../pages/Admin/RemittancesMainPage";
import POSMainPage from "../pages/Staff/PosMainPage";


const AppRoutes = () => {
  return (
    <>
        <Routes>
            <Route element={<AppLayout />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/users" element={<UserMainPage />} />
                <Route path="/admin/products" element={<ProductMainPage />} />
                <Route path="/admin/customers" element={<CustomerMainPage />} />
                <Route path="/admin/inventory" element={<InventoryMainPage />} />
                <Route path="/admin/gallon-debts" element={<GallonDebtsMainPage />} />
                <Route path="/admin/deliveries" element={<DeliveryMainPage />} />
                <Route path="/admin/remittances" element={<RemittancesMainPage />} />


            </Route>
        </Routes>
    </>
  )
}

export default AppRoutes