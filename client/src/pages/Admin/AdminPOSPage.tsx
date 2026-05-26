import { useEffect, useState } from "react";
import type { ProductColumns } from "../../interfaces/ProductInterfaces";
import ProductService from "../../services/ProductService";
import ProductCard from "./components/ProductCard";
import OrderSummary from "./components/OrderSummary";
import PaymentModal from "./components/PaymentModal";
import ToastMessage from "../../components/ToastMessage/ToastMessage";
import { useToastMessage } from "../../hooks/useToastMessage";
import PageHeader from "../../components/Layout/PageHeader";

export interface OrderItem {
    product_id: number;
    name: string;
    size: string;
    unit: string;
    price: number;
    container_deposit: number;
    quantity: number;
    has_gallon: boolean;
    subtotal: number;
}

const POSMainPage = () => {
    const [products, setProducts] = useState<ProductColumns[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const {
        message: toastMessage,
        isFailed: toastIsFailed,
        isVisible: toastMessageIsVisible,
        showToastMessage,
        closeToastMessage,
    } = useToastMessage("", false, false);

    useEffect(() => {
        document.title = "POS — Walk-in Sales";
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            // Load all available products (no pagination needed for POS)
            const response = await ProductService.loadProducts(1, "");
            const allProducts = response.data.products.data.filter(
                (p: ProductColumns) => p.is_available
            );
            setProducts(allProducts);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = (product: ProductColumns) => {
        setOrderItems((prev) => {
            const existing = prev.findIndex((o) => o.product_id === product.product_id);
            if (existing !== -1) {
                const updated = [...prev];
                updated[existing].quantity += 1;
                updated[existing].subtotal =
                    updated[existing].quantity * updated[existing].price;
                return updated;
            }
            return [
                ...prev,
                {
                    product_id:        product.product_id,
                    name:              product.name,
                    size:              product.size,
                    unit:              product.unit,
                    price:             Number(product.price),
                    container_deposit: Number(product.container_deposit),
                    quantity:          1,
                    has_gallon:        product.size === "5gal",
                    subtotal:          Number(product.price),
                },
            ];
        });
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantity = (index: number, quantity: number) => {
        if (quantity < 1) {
            handleRemoveItem(index);
            return;
        }
        setOrderItems((prev) => {
            const updated = [...prev];
            updated[index].quantity = quantity;
            updated[index].subtotal = quantity * updated[index].price;
            return updated;
        });
    };

    const handleClearOrder = () => {
        setOrderItems([]);
    };

    return (
        <>
            <ToastMessage
                message={toastMessage}
                isFailed={toastIsFailed}
                isVisible={toastMessageIsVisible}
                onClose={closeToastMessage}
            />
            <div className="space-y-4">
                <PageHeader
                    title="POS"
                    description="Process walk-in sales and manage transactions."
                />
                <div className="flex gap-4 items-start">
                    {/* Left — Product Cards */}
                    <div className="flex-1">
                        <h2 className="text-base font-semibold text-gray-700 mb-3">
                            Products
                        </h2>
                        {isLoading ? (
                            <div className="flex justify-center items-center h-40 text-blue-600 gap-2">
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                </svg>
                                <span className="text-sm">Loading products...</span>
                            </div>
                        ) : products.length === 0 ? (
                            <div className="flex justify-center items-center h-40 text-gray-400 text-sm">
                                No available products.
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product) => (
                                    <ProductCard
                                        key={product.product_id}
                                        product={product}
                                        onAddToCart={handleAddToCart}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right — Order Summary */}
                    <div className="w-80 shrink-0">
                        <OrderSummary
                            orderItems={orderItems}
                            onRemoveItem={handleRemoveItem}
                            onUpdateQuantity={handleUpdateQuantity}
                            onClearOrder={handleClearOrder}
                            onProceedPayment={() => setIsPaymentOpen(true)}
                        />
                    </div>
                </div>
            </div>

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                orderItems={orderItems}
                onPaymentSuccess={(msg) => showToastMessage(msg, false)}
                onSaleComplete={() => {
                    setIsPaymentOpen(false);
                    handleClearOrder();
                }}
            />
        </>
    );
};

export default POSMainPage;