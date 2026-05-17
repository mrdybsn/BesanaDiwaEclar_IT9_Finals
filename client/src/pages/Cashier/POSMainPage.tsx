import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import OrderSummary from "./components/OrderSummary";
import PaymentModal from "./components/PaymentModal";

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

export interface Product {
    product_id: number;
    name: string;
    size: string;
    unit: string;
    price: number;
    container_deposit: number;
    description: string;
}

const products: Product[] = [
    {
        product_id: 1,
        name: "Purified Water",
        size: "500ml",
        unit: "bottle",
        price: 10.00,
        container_deposit: 0.00,
        description: "Small bottle — 500ml purified water",
    },
    {
        product_id: 2,
        name: "Purified Water",
        size: "1L",
        unit: "bottle",
        price: 15.00,
        container_deposit: 0.00,
        description: "Regular bottle — 1 liter purified water",
    },
    {
        product_id: 3,
        name: "Purified Water",
        size: "5gal (Exchange)",
        unit: "gallon",
        price: 35.00,
        container_deposit: 0.00,
        description: "Customer brings empty gallon — refill only",
    },
    {
        product_id: 4,
        name: "Purified Water",
        size: "5gal (New Container)",
        unit: "gallon",
        price: 185.00,
        container_deposit: 150.00,
        description: "New gallon container + water — includes ₱150 deposit",
    },
];

const POSMainPage = () => {
    const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);

    useEffect(() => {
        document.title = "POS — Walk-in Sales";
    }, []);

    const handleAddToCart = (product: Product) => {
        setOrderItems((prev) => {
            const existing = prev.findIndex((o) => o.product_id === product.product_id);
            if (existing !== -1) {
                const updated = [...prev];
                updated[existing].quantity += 1;
                updated[existing].subtotal = updated[existing].quantity * updated[existing].price;
                return updated;
            }
            return [
                ...prev,
                {
                    product_id: product.product_id,
                    name: product.name,
                    size: product.size,
                    unit: product.unit,
                    price: product.price,
                    container_deposit: product.container_deposit,
                    quantity: 1,
                    has_gallon: product.size.includes("Exchange"),
                    subtotal: product.price,
                },
            ];
        });
    };

    const handleRemoveItem = (index: number) => {
        setOrderItems((prev) => prev.filter((_, i) => i !== index));
    };

    const handleUpdateQuantity = (index: number, quantity: number) => {
        if (quantity < 1) return;
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
            <div className="flex gap-4 items-start">

                {/* Left — Product Cards */}
                <div className="flex-1">
                    <h2 className="text-base font-semibold text-gray-700 mb-3">
                        Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                onAddToCart={handleAddToCart}
                            />
                        ))}
                    </div>
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

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                orderItems={orderItems}
                onConfirm={() => {
                    setIsPaymentOpen(false);
                    handleClearOrder();
                }}
            />
        </>
    );
};

export default POSMainPage;