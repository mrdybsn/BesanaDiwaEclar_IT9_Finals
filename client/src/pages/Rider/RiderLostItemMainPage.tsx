import { useEffect, useState } from "react";
import LostItemList from "./components/LostItemList";
import ReportLostItemModal from "./components/ReportLostItemModal";
import PageHeader from "../../components/Layout/PageHeader";

export interface LostItemReport {
    report_id: number;
    customer_name: string;
    delivery_address: string;
    item_description: string;
    item_type: "gallon" | "cap" | "seal" | "other";
    quantity: number;
    notes: string;
    reported_at: string;
    status: "pending" | "reviewed";
}

const RiderLostItemMainPage = () => {
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        document.title = "Lost Item Report";
    }, []);

    return (
        <>
            <PageHeader
                portal="rider"
                title="Lost Item Report"
                description="Report damaged or missing jugs during delivery."
            >
                <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shrink-0"
                >
                    + New Report
                </button>
            </PageHeader>

            <LostItemList refreshKey={refreshKey} />

            <ReportLostItemModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
                onSuccess={() => setRefreshKey((k) => k + 1)}
            />
        </>
    );
};

export default RiderLostItemMainPage;
