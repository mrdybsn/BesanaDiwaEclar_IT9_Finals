import type { Product, CartItem } from "../ShopMainPage";

interface ProductListProps {
    products: Product[];
    cartItems: CartItem[];
    onUpdateQuantity: (product: Product, quantity: number) => void;
}

const productImageMap: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1536939459926-301728717817?w=120&q=80",
    2: "https://images.unsplash.com/photo-1624958723474-76cfe7a7c44e?w=120&q=80",
    3: "https://images.unsplash.com/photo-1563351672-62b74891a28a?w=120&q=80",
    4: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=120&q=80",
};

const ProductList = ({ products, cartItems, onUpdateQuantity }: ProductListProps) => {
    return (
        <div className="space-y-3">
            {products.map((product) => {
                const cartItem = cartItems.find((c) => c.product_id === product.product_id);
                const qty = cartItem?.quantity ?? 0;

                return (
                    <div
                        key={product.product_id}
                        className={`bg-white rounded-2xl border shadow-sm flex items-center gap-4 p-4 transition-all ${
                            !product.is_available
                                ? "opacity-50 pointer-events-none border-gray-100"
                                : "border-gray-100 hover:shadow-md"
                        }`}
                    >
                        {/* Product Image */}
                        <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                                src={productImageMap[product.product_id]}
                                alt={product.size}
                                className="w-full h-full object-cover rounded-xl"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-800">
                                {product.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                                {product.description}
                            </p>
                            <p className="text-sm font-extrabold text-blue-600 mt-1">
                                ₱{product.price.toFixed(2)}
                                {product.container_deposit > 0 && (
                                    <span className="text-xs text-yellow-500 font-normal ml-1">
                                        +₱{product.container_deposit.toFixed(2)} deposit
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 shrink-0">
                            {qty > 0 ? (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(product, qty - 1)}
                                        className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-600 font-bold text-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                        −
                                    </button>
                                    <span className="text-base font-bold text-gray-800 w-5 text-center">
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => onUpdateQuantity(product, qty + 1)}
                                        className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-600 font-bold text-lg flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors"
                                    >
                                        +
                                    </button>
                                </>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => onUpdateQuantity(product, 1)}
                                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center cursor-pointer transition-colors"
                                >
                                    +
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;