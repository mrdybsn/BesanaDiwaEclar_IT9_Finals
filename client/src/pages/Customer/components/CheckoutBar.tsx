interface CheckoutBarProps {
    totalItems: number;
    totalAmount: number;
    onCheckout: () => void;
}

const CheckoutBar = ({ totalItems, totalAmount, onCheckout }: CheckoutBarProps) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-3 bg-linear-to-t from-white via-white to-transparent sm:left-64">
            <button
                type="button"
                onClick={onCheckout}
                className="w-full max-w-2xl mx-auto flex items-center justify-between bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl shadow-lg cursor-pointer transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="bg-blue-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                        {totalItems}
                    </span>
                    <span className="text-sm font-semibold">
                        {totalItems} item{totalItems > 1 ? "s" : ""} in cart
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold">
                        ₱{totalAmount.toFixed(2)}
                    </span>
                    <span className="text-sm font-semibold opacity-80">
                        Checkout →
                    </span>
                </div>
            </button>
        </div>
    );
};

export default CheckoutBar;