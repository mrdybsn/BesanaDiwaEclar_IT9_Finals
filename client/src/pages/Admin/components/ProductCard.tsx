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
        <button
            type="button"
            onClick={() => product.is_available && onAddToCart(product)}
            disabled={!product.is_available}
            className={`bg-white rounded-2xl border shadow-sm flex flex-col items-center justify-center p-4 aspect-square transition-all text-center w-full ${
                !product.is_available
                    ? "opacity-50 cursor-not-allowed border-gray-100"
                    : "border-gray-100 hover:shadow-lg hover:border-blue-300 cursor-pointer active:scale-95"
            }`}
        >
            <div className="w-20 h-20 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 overflow-hidden mb-3">
                <img
                    src={imageSrc}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-2xl"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src =
                            `${DEFAULT_PRODUCT_IMAGE}${encodeURIComponent(product.name)}`;
                    }}
                />
            </div>

            <p className="text-sm font-bold text-gray-800 line-clamp-2">{product.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{product.size}</p>
            <p className="text-base font-extrabold text-blue-600 mt-2">
                ₱{Number(product.price).toFixed(2)}
            </p>
            {Number(product.container_deposit) > 0 && (
                <p className="text-[10px] text-yellow-600 mt-0.5">+₱{Number(product.container_deposit).toFixed(2)} deposit</p>
            )}
            {product.stock <= product.low_stock_threshold && (
                <p className="text-[10px] text-red-400 mt-1">Low: {product.stock} left</p>
            )}
            <p className="text-[10px] text-blue-500 mt-2 font-medium">Tap to add</p>
        </button>
    );
};

export default ProductCard;
