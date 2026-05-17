import type { Product } from "../POSMainPage";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

const productImageMap: Record<number, string> = {
    1: "https://images.unsplash.com/photo-1536939459926-301728717817?w=200&q=80", // small water bottle
    2: "https://images.unsplash.com/photo-1624958723474-76cfe7a7c44e?w=200&q=80", // 1L water bottle
    3: "https://images.unsplash.com/photo-1563351672-62b74891a28a?w=200&q=80",    // blue gallon jug exchange
    4: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80",    // new gallon container
};

const productBgMap: Record<number, string> = {
    1: "bg-cyan-50",
    2: "bg-blue-50",
    3: "bg-indigo-50",
    4: "bg-sky-50",
};

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const imageSrc = productImageMap[product.product_id];
    const bgColor = productBgMap[product.product_id] ?? "bg-gray-50";

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-4 flex gap-4 items-start">
            {/* Product Image */}
            <div className={`${bgColor} rounded-xl w-20 h-20 flex items-center justify-center shrink-0 overflow-hidden`}>
                <img
                    src={imageSrc}
                    alt={`${product.name} ${product.size}`}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                        // fallback to emoji if image fails
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
                    Price: ₱{product.price.toFixed(2)}
                </p>
                {product.container_deposit > 0 && (
                    <p className="text-xs text-yellow-600 mt-0.5">
                        Includes ₱{product.container_deposit.toFixed(2)} container deposit
                    </p>
                )}

                <button
                    type="button"
                    onClick={() => onAddToCart(product)}
                    className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded-lg cursor-pointer transition-colors duration-150"
                >
                    Add to cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;