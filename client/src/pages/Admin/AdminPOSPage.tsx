import { useEffect } from "react";
import POSMainPage from "../Cashier/POSMainPage";

const AdminPOSPage = () => {
    useEffect(() => {
        document.title = "POS — Admin";
    }, []);

    return <POSMainPage />;
};

export default AdminPOSPage;