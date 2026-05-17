import type { Product } from "../ShopMainPage";

interface ProductCardProps {
    product: Product;
    cartQuantity: number;
    onAddToCart: (product: Product) => void;
    onUpdateQuantity: (productId: number, quantity: number) => void;
}

const productImageMap: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1536939459926-301728717817?w=200&q=80",
    2: "https://images.unsplash.com/photo-1624958723474-76cfe7a7c44e?w=200&q=80",
    3: "https://images.unsplash.com/photo-1563351672-62b74891a28a?w=200&q=80",
    4: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80",
};

const productBgMap: Record<number, string> = {
    1: "bg-cyan-50",
    2: "bg-blue-50",
    3: "bg-indigo-50",
    4: "bg-sky-50",
};

const ProductCard = ({
    product,
    cartQuantity,
    onAddToCart,
    onUpdateQuantity,
}: ProductCardProps) => {
    const imageSrc = productImageMap[product.product_id];
    const bgColor = productBgMap[product.product_id] ?? "bg-gray-50";

    return (
        <div className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex gap-4 items-start ${
            !product.is_available ? "opacity-50 pointer-events-none" : "border-gray-200"
        }`}>
            {/* Image */}
            <div className={`${bgColor} rounded-xl w-20 h-20 flex items-center justify-center shrink-0 overflow-hidden`}>
                <img
                    src={imageSrc}
                    alt={product.size}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                    }}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 leading-tight">
                    {product.size}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {product.description}
                </p>
                <p className="text-sm font-bold text-gray-900 mt-2">
                    ₱{product.price.toFixed(2)}
                </p>
                {product.container_deposit > 0 && (
                    <p className="text-xs text-yellow-600 mt-0.5">
                        +₱{product.container_deposit.toFixed(2)} deposit included
                    </p>
                )}

                {/* Add / Quantity Controls */}
                {cartQuantity === 0 ? (
                    <button
                        type="button"
                        onClick={() => onAddToCart(product)}
                        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors"
                    >
                        Add to Cart
                    </button>
                ) : (
                    <div className="mt-3 flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.product_id, cartQuantity - 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 font-bold flex items-center justify-center cursor-pointer"
                        >
                            −
                        </button>
                        <span className="text-sm font-bold text-gray-800 w-6 text-center">
                            {cartQuantity}
                        </span>
                        <button
                            type="button"
                            onClick={() => onUpdateQuantity(product.product_id, cartQuantity + 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 hover:bg-gray-100 text-gray-600 font-bold flex items-center justify-center cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                )}

                {!product.is_available && (
                    <p className="mt-2 text-xs text-red-500 font-medium">
                        Currently unavailable
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProductCard;
