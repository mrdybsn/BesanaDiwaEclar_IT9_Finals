import { useEffect, useState } from "react";
import LostItemList from "./components/LostItemList";
import ReportLostItemModal from "./components/ReportLostItemModal";

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

    useEffect(() => {
        document.title = "Lost Item Report";
    }, []);

    return (
        <>
            {/* Page Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                        Rider
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Lost Item Report
                    </h1>
                    <p className="text-sm text-gray-400 mt-1">
                        Report damaged or missing jugs during delivery.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsReportOpen(true)}
                    className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg shrink-0"
                >
                    + New Report
                </button>
            </div>

            <LostItemList />

            <ReportLostItemModal
                isOpen={isReportOpen}
                onClose={() => setIsReportOpen(false)}
            />
        </>
    );
};

export default RiderLostItemMainPage;