import { useEffect } from "react";
import { useModal } from "../../hooks/useModal";

import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useState } from "react";
import AssignDeliveryModal from "../Admin/components/AssignDeliveryModal";
import ViewDeliveryModal from "../Admin/components/ViewDeliveryModal";
import DeleteDeliveryModal from "../Admin/components/DeleteDeliveryModal";
import DeliveryList from "../Admin/components/DeliveryList";

type ValuePiece = Date | null;
type CalendarValue = ValuePiece | [ValuePiece, ValuePiece];

const CashierDeliveriesMainPage = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const assignModal = useModal(false);
    const viewModal = useModal(false);
    const deleteModal = useModal(false);

    useEffect(() => {
        document.title = "Deliveries — Cashier";
    }, []);

    const scheduledDates = [
        new Date(2026, 4, 16),
        new Date(2026, 4, 19),
        new Date(2026, 4, 20),
        new Date(2026, 4, 23),
        new Date(2026, 4, 26),
    ];

    const isSameDay = (a: Date, b: Date) =>
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate();

    const tileClassName = ({ date }: { date: Date }) => {
        if (scheduledDates.some((d) => isSameDay(d, date))) {
            return "has-delivery";
        }
        return null;
    };

    return (
        <div className="space-y-6">

            {/* Top — Calendar + Stats */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* Calendar */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-3">
                        Delivery Schedule
                    </h2>
                    <style>{`
                        .has-delivery {
                            background-color: #dbeafe !important;
                            color: #1d4ed8 !important;
                            font-weight: 600;
                            border-radius: 6px;
                        }
                        .react-calendar {
                            border: none !important;
                            font-family: inherit !important;
                        }
                        .react-calendar__tile--active {
                            background: #2563eb !important;
                            border-radius: 6px !important;
                        }
                        .react-calendar__tile:hover {
                            background: #f3f4f6 !important;
                            border-radius: 6px !important;
                        }
                    `}</style>
                    <Calendar
                        onChange={(val: CalendarValue) => {
                            if (val instanceof Date) setSelectedDate(val);
                        }}
                        value={selectedDate}
                        tileClassName={tileClassName}
                    />
                    <div className="flex items-center gap-2 mt-3">
                        <div className="w-3 h-3 rounded-sm bg-blue-100 border border-blue-400" />
                        <span className="text-xs text-gray-500">Has scheduled deliveries</span>
                    </div>
                </div>

                {/* Selected Date Summary */}
                <div className="flex-1 bg-white rounded-lg border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-semibold text-gray-700">
                            Deliveries on{" "}
                            <span className="text-blue-600">
                                {selectedDate.toLocaleDateString("en-PH", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </span>
                        </h2>
                        <button
                            type="button"
                            onClick={assignModal.openModal}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow"
                        >
                            + Assign Delivery
                        </button>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Total Deliveries</p>
                            <p className="text-xl font-bold text-blue-600">12</p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Completed</p>
                            <p className="text-xl font-bold text-green-600">8</p>
                        </div>
                        <div className="bg-yellow-50 rounded-lg p-3 text-center">
                            <p className="text-xs text-gray-500">Pending</p>
                            <p className="text-xl font-bold text-yellow-600">4</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery List */}
            <DeliveryList
                onView={viewModal.openModal}
                onDelete={deleteModal.openModal}
            />

            {/* Modals */}
            <AssignDeliveryModal
                isOpen={assignModal.isOpen}
                onClose={assignModal.closeModal}
            />
            <ViewDeliveryModal
                isOpen={viewModal.isOpen}
                onClose={viewModal.closeModal}
            />
            <DeleteDeliveryModal
                isOpen={deleteModal.isOpen}
                onClose={deleteModal.closeModal}
            />
        </div>
    );
};

export default CashierDeliveriesMainPage;