import { useEffect, useState } from "react";
import { useModal } from "../../hooks/useModal";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import DeliveryList from "./components/DeliveryList";
import AssignDeliveryModal from "./components/AssignDeliveryModal";
import ViewDeliveryModal from "./components/ViewDeliveryModal";
import DeleteDeliveryModal from "./components/DeleteDeliveryModal";
import type { Delivery } from "../../interfaces/DeliveryInterfaces";
import PageHeader from "../../components/Layout/PageHeader";

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const DeliveryMainPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [refreshKey, setRefreshKey]     = useState(0);

    // Typed modals — viewModal and deleteModal carry a Delivery
    const assignModal = useModal<undefined>(false);
    const viewModal   = useModal<Delivery>(false);
    const deleteModal = useModal<Delivery>(false);

    const refresh = () => setRefreshKey((k) => k + 1);

    useEffect(() => {
        document.title = "Delivery Manager";
    }, []);

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth()    === b.getMonth()    &&
        a.getDate()     === b.getDate();

    // TODO: replace with real scheduled dates from API if needed
    const scheduledDates: Date[] = [];

    const tileClassName = ({ date }: { date: Date }) =>
        scheduledDates.some((d) => isSameDay(d, date)) ? "has-delivery" : null;

    return (
        <>
        <div className="space-y-4">
            <PageHeader
                title="Deliveries"
                description="Track and manage daily delivery routes and assign riders."
            />
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row gap-6">

                    {/* Calendar */}
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 shrink-0">
                        <h2 className="text-sm font-semibold text-gray-700 mb-3">Delivery Schedule</h2>
                        <style>{`
                            .has-delivery { background-color: #dbeafe !important; color: #1d4ed8 !important; font-weight: 600; border-radius: 6px; }
                            .react-calendar { border: none !important; font-family: inherit !important; }
                            .react-calendar__tile--active { background: #2563eb !important; border-radius: 6px !important; }
                            .react-calendar__tile:hover { background: #f3f4f6 !important; border-radius: 6px !important; }
                        `}</style>
                        <Calendar
                            onChange={(val: CalendarValue) => { if (val instanceof Date) setSelectedDate(val); }}
                            value={selectedDate}
                            tileClassName={tileClassName}
                        />
                        <div className="flex items-center gap-2 mt-3">
                            <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-400" />
                            <span className="text-xs text-gray-500">Has scheduled deliveries</span>
                        </div>
                    </div>

                    {/* Stats + Assign button */}
                    <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-sm font-semibold text-gray-700">
                                Deliveries on{" "}
                                <span className="text-blue-600">
                                    {selectedDate.toLocaleDateString("en-PH", {
                                        weekday: "long", year: "numeric", month: "long", day: "numeric",
                                    })}
                                </span>
                            </h2>
                            <button
                                type="button"
                                onClick={() => assignModal.openModal()}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow transition-colors"
                            >
                                + Assign Rider
                            </button>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="bg-blue-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="text-xl font-bold text-blue-600">—</p>
                            </div>
                            <div className="bg-green-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500">Delivered</p>
                                <p className="text-xl font-bold text-green-600">—</p>
                            </div>
                            <div className="bg-yellow-50 rounded-lg p-3 text-center">
                                <p className="text-xs text-gray-500">Pending</p>
                                <p className="text-xl font-bold text-yellow-600">—</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Delivery List Table */}
                <DeliveryList
                    onView={(delivery) => viewModal.openModal(delivery)}
                    onDelete={(delivery) => deleteModal.openModal(delivery)}
                    refreshKey={refreshKey}
                />

                {/* Modals */}
                <AssignDeliveryModal
                    isOpen={assignModal.isOpen}
                    onClose={assignModal.closeModal}
                    onSuccess={refresh}
                />
                <ViewDeliveryModal
                    isOpen={viewModal.isOpen}
                    onClose={viewModal.closeModal}
                    delivery={viewModal.selectedUser ?? null}
                />
                <DeleteDeliveryModal
                    isOpen={deleteModal.isOpen}
                    onClose={deleteModal.closeModal}
                    delivery={deleteModal.selectedUser ?? null}
                    onSuccess={refresh}
                />
            </div>
        </div>
        </>
    );
};

export default DeliveryMainPage;