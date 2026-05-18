import { useEffect, useState } from "react";
import { Star } from "lucide-react";

type FeedbackTarget = "cashier" | "rider";

const CustomerFeedbackPage = () => {
    const [targetType, setTargetType] = useState<FeedbackTarget>("rider");
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        document.title = "Submit Feedback";
    }, []);

    const handleSubmit = () => {
        if (rating === 0) return;
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="max-w-lg mx-auto mt-16 text-center space-y-4">
                <p className="text-5xl">🎉</p>
                <h2 className="text-xl font-bold text-gray-800">Thank you for your feedback!</h2>
                <p className="text-sm text-gray-500">
                    Your feedback has been submitted to the admin. We appreciate your time.
                </p>
                <button
                    type="button"
                    onClick={() => {
                        setSubmitted(false);
                        setRating(0);
                        setComment("");
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg cursor-pointer"
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-lg mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Submit Feedback</h1>
                <p className="text-sm text-gray-400 mt-1">
                    Share your experience with our cashier or rider.
                </p>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">

                {/* Who are you rating */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Feedback for</p>
                    <div className="flex gap-3">
                        {(["cashier", "rider"] as FeedbackTarget[]).map((type) => (
                            <button
                                key={type}
                                type="button"
                                onClick={() => setTargetType(type)}
                                className={`flex-1 py-2.5 rounded-xl border text-sm font-medium cursor-pointer transition-colors ${
                                    targetType === type
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 text-gray-500 hover:bg-gray-50"
                                }`}
                            >
                                {type === "cashier" ? "💁 Cashier" : "🏍️ Rider"}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Name of person */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                        {targetType === "cashier" ? "Which cashier?" : "Which rider?"}
                    </p>
                    <select className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        {targetType === "rider" ? (
                            <>
                                <option value="">Select Rider</option>
                                <option value="1">Reyes, Carlo B.</option>
                                <option value="2">Santos, Mark A.</option>
                                <option value="3">Dela Cruz, Jun R.</option>
                            </>
                        ) : (
                            <>
                                <option value="">Select Cashier</option>
                                <option value="walk-in">Walk-in Counter</option>
                            </>
                        )}
                    </select>
                </div>

                {/* Star Rating */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Rating</p>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                className="cursor-pointer"
                            >
                                <Star
                                    size={28}
                                    className={`transition-colors ${
                                        star <= (hovered || rating)
                                            ? "text-yellow-400 fill-yellow-400"
                                            : "text-gray-300 fill-gray-300"
                                    }`}
                                />
                            </button>
                        ))}
                        {rating > 0 && (
                            <span className="text-sm text-gray-500 ml-2">
                                {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Comment</p>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us about your experience..."
                        rows={4}
                        className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2.5 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                </div>

                {/* Submit */}
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={rating === 0}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl cursor-pointer transition-colors"
                >
                    Submit Feedback
                </button>
            </div>
        </div>
    );
};

export default CustomerFeedbackPage;