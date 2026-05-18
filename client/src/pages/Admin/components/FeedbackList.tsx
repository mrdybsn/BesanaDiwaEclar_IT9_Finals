import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import { Star } from "lucide-react";

interface FeedbackListProps {
    onView: () => void;
}

type FeedbackTarget = "cashier" | "rider";

const feedbacks = [
    {
        feedback_id: 1,
        customer_name: "Dela Cruz, Juan M.",
        target_type: "rider" as FeedbackTarget,
        target_name: "Reyes, Carlo B.",
        rating: 5,
        comment: "Very fast delivery, very polite rider!",
        date: "2026-05-16",
        is_read: false,
    },
    {
        feedback_id: 2,
        customer_name: "Santos, Maria L.",
        target_type: "cashier" as FeedbackTarget,
        target_name: "Staff — Walk-in Counter",
        rating: 4,
        comment: "Good service but had to wait a bit.",
        date: "2026-05-16",
        is_read: false,
    },
    {
        feedback_id: 3,
        customer_name: "Reyes, Carlo B.",
        target_type: "rider" as FeedbackTarget,
        target_name: "Santos, Mark A.",
        rating: 2,
        comment: "Delivery was late by 2 hours. No update given.",
        date: "2026-05-15",
        is_read: true,
    },
    {
        feedback_id: 4,
        customer_name: "Garcia, Ana P.",
        target_type: "cashier" as FeedbackTarget,
        target_name: "Staff — Walk-in Counter",
        rating: 5,
        comment: "Very accommodating and friendly!",
        date: "2026-05-14",
        is_read: true,
    },
];

const targetConfig: Record<FeedbackTarget, { label: string; className: string }> = {
    cashier: { label: "Cashier", className: "bg-orange-100 text-orange-700" },
    rider: { label: "Rider", className: "bg-blue-100 text-blue-700" },
};

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                size={13}
                className={star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300 fill-gray-300"}
            />
        ))}
    </div>
);

const FeedbackList: FC<FeedbackListProps> = ({ onView }) => {
    const unreadCount = feedbacks.filter((f) => !f.is_read).length;
    const avgRating = (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1);

    return (
        <div className="space-y-4">

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg border border-blue-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Total Feedback</p>
                    <p className="text-2xl font-bold text-blue-600">{feedbacks.length}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg border border-yellow-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Average Rating</p>
                    <p className="text-2xl font-bold text-yellow-600">{avgRating} ⭐</p>
                </div>
                <div className="bg-red-50 rounded-lg border border-red-100 p-4 text-center">
                    <p className="text-xs text-gray-500">Unread</p>
                    <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Customer</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">For</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Name</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Rating</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">Comment</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Date</TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {feedbacks.map((feedback, index) => {
                                const target = targetConfig[feedback.target_type];
                                return (
                                    <TableRow
                                        className={`${!feedback.is_read ? "bg-blue-50 hover:bg-blue-100" : "hover:bg-gray-100"}`}
                                        key={index}
                                    >
                                        <TableCell className="px-4 py-3 text-center">{feedback.feedback_id}</TableCell>
                                        <TableCell className="px-4 py-3 text-start">{feedback.customer_name}</TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${target.className}`}>
                                                {target.label}
                                            </span>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">{feedback.target_name}</TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <StarRating rating={feedback.rating} />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start text-xs max-w-xs truncate">
                                            {feedback.comment}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center text-xs">{feedback.date}</TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={onView}
                                                className="text-blue-600 hover:underline font-medium"
                                            >
                                                View
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default FeedbackList;