import type { GallonDeclaration } from "../OrderFormMainPage";
import type { CartItem } from "../ShopMainPage";

interface GallonDeclarationFormProps {
    declarations: GallonDeclaration[];
    cartItems: CartItem[];
    onDeclarationChange: (productId: number, gallonsOwned: number) => void;
}

const GallonDeclarationForm = ({
    declarations,
    cartItems,
    onDeclarationChange,
}: GallonDeclarationFormProps) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-start gap-3 mb-4">
                <span className="text-2xl">🪣</span>
                <div>
                    <p className="text-base font-bold text-gray-800">
                        Gallon Declaration
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                        Tell us how many empty gallons you already own. Exchange gallons save you the container deposit.
                    </p>
                </div>
            </div>

            <div className="space-y-4">
                {declarations.map((declaration) => {
                    const cartItem = cartItems.find(
                        (c) => c.product_id === declaration.product_id
                    );
                    if (!cartItem) return null;

                    const exchangeQty = Math.min(declaration.gallons_owned, cartItem.quantity);
                    const newContainerQty = cartItem.quantity - exchangeQty;

                    return (
                        <div
                            key={declaration.product_id}
                            className="p-4 bg-gray-50 rounded-xl border border-gray-200"
                        >
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                {cartItem.name} — {cartItem.size.replace(" (Exchange)", "").replace(" (New Container)", "")}
                                <span className="ml-2 text-xs text-gray-400 font-normal">
                                    (Ordering {cartItem.quantity})
                                </span>
                            </p>

                            {/* Gallons Owned Input */}
                            <div className="flex items-center gap-3 mb-3">
                                <p className="text-sm text-gray-600 flex-1">
                                    How many empty gallons do you have?
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeclarationChange(
                                                declaration.product_id,
                                                Math.max(0, declaration.gallons_owned - 1)
                                            )
                                        }
                                        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center cursor-pointer"
                                    >
                                        −
                                    </button>
                                    <span className="text-base font-bold text-gray-800 w-6 text-center">
                                        {declaration.gallons_owned}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onDeclarationChange(
                                                declaration.product_id,
                                                Math.min(cartItem.quantity, declaration.gallons_owned + 1)
                                            )
                                        }
                                        className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-200 text-gray-600 font-bold flex items-center justify-center cursor-pointer"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            {/* Breakdown */}
                            <div className="space-y-1">
                                {exchangeQty > 0 && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-blue-600">
                                            🔄 Exchange × {exchangeQty}
                                        </span>
                                        <span className="text-blue-600 font-semibold">
                                            ₱{(exchangeQty * 35).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                                {newContainerQty > 0 && (
                                    <div className="flex justify-between text-xs">
                                        <span className="text-yellow-600">
                                            🆕 New Container × {newContainerQty}
                                        </span>
                                        <span className="text-yellow-600 font-semibold">
                                            ₱{(newContainerQty * 185).toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GallonDeclarationForm;