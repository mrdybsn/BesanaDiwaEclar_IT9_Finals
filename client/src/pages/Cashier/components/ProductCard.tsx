import type { ProductColumns } from "../../../interfaces/ProductInterfaces";

const DEFAULT_PRODUCT_IMAGE = "https://ui-avatars.com/api/?background=DBEAFE&color=1D4ED8&name=";

interface ProductCardProps {
    product: ProductColumns;
    onAddToCart: (product: ProductColumns) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
    const imageSrc = product.image
        ? product.image
        : `${DEFAULT_PRODUCT_IMAGE}${encodeURIComponent(product.name)}`;

    return (
        <div
            className={`bg-white rounded-2xl border shadow-sm flex items-center gap-4 p-4 transition-all ${
                !product.is_available
                    ? "opacity-50 pointer-events-none border-gray-100"
                    : "border-gray-100 hover:shadow-md"
            }`}
        >
            {/* Product Image */}
            <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            `${DEFAULT_PRODUCT_IMAGE}${encodeURIComponent(product.name)}`;
                    }}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800">{product.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{product.size} — {product.unit}</p>
                <p className="text-sm font-extrabold text-blue-600 mt-1">
                    ₱{Number(product.price).toFixed(2)}
                    {Number(product.container_deposit) > 0 && (
                        <span className="text-xs text-yellow-500 font-normal ml-1">
                            +₱{Number(product.container_deposit).toFixed(2)} deposit
                        </span>
                    )}
                </p>
                {product.stock <= product.low_stock_threshold && (
                    <p className="text-xs text-red-400 mt-0.5">
                        Low stock ({product.stock} left)
                    </p>
                )}
            </div>

            {/* Add to Cart */}
            <button
                type="button"
                onClick={() => onAddToCart(product)}
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg flex items-center justify-center cursor-pointer transition-colors shrink-0"
            >
                +
            </button>
        </div>
    );
};

export default ProductCard;