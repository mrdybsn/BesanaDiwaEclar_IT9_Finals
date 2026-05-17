import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./components/ProductCard";
import CartSummary from "./components/CartSummary";

export interface Product {
    product_id: number;
    name: string;
    size: string;
    unit: string;
    price: number;
    price_per_liter: number;
    container_deposit: number;
    description: string;
    is_available: boolean;
}

export interface CartItem {
    product_id: number;
    name: string;
    size: string;
    unit: string;
    price: number;
    container_deposit: number;
    quantity: number;
    subtotal: number;
}

const products: Product[] = [
    {
        product_id: 1,
        name: "Purified Water",
        size: "500ml",
        unit: "bottle",
        price: 10.00,
        price_per_liter: 20.00,
        container_deposit: 0.00,
        description: "Small purified water bottle — perfect for on-the-go.",
        is_available: true,
    },
    {
        product_id: 2,
        name: "Purified Water",
        size: "1L",
        unit: "bottle",
        price: 15.00,
        price_per_liter: 20.00,
        container_deposit: 0.00,
        description: "1 liter purified water bottle for everyday use.",
        is_available: true,
    },
    {
        product_id: 3,
        name: "Purified Water",
        size: "5gal (Exchange)",
        unit: "gallon",
        price: 35.00,
        price_per_liter: 20.00,
        container_deposit: 0.00,
        description: "Bring your empty gallon — refill only. No deposit needed.",
        is_available: true,
    },
    {
        product_id: 4,
        name: "Purified Water",
        size: "5gal (New Container)",
        unit: "gallon",
        price: 185.00,
        price_per_liter: 20.00,
        container_deposit: 150.00,
        description: "Brand new gallon container + purified water. Includes ₱150 deposit.",
        is_available: true,
    },
];

const ShopMainPage = () => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Shop — Order Water";
    }, []);

    const handleAddToCart = (product: Product) => {
        setCartItems((prev) => {
            const existing = prev.findIndex((c) => c.product_id === product.product_id);
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
                    subtotal: product.price,
                },
            ];
        });
    };

    const handleUpdateQuantity = (productId: number, quantity: number) => {
        if (quantity < 1) {
            setCartItems((prev) => prev.filter((c) => c.product_id !== productId));
            return;
        }
        setCartItems((prev) =>
            prev.map((c) =>
                c.product_id === productId
                    ? { ...c, quantity, subtotal: quantity * c.price }
                    : c
            )
        );
    };

    const handleRemoveItem = (productId: number) => {
        setCartItems((prev) => prev.filter((c) => c.product_id !== productId));
    };

    const handleProceed = () => {
        navigate("/shop/order-form", { state: { cartItems } });
    };

    return (
        <>
            {/* Page Header */}
            <div className="mb-6">
                <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-1">
                    Customer
                </p>
                <h1 className="text-2xl font-bold text-gray-800">
                    Order Water
                </h1>
                <p className="text-sm text-gray-400 mt-1">
                    Select your products and place a delivery order.
                </p>
            </div>

            <div className="flex gap-4 items-start">
                {/* Left — Products */}
                <div className="flex-1">
                    <h2 className="text-sm font-semibold text-gray-600 mb-3">
                        Available Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {products.map((product) => (
                            <ProductCard
                                key={product.product_id}
                                product={product}
                                cartQuantity={
                                    cartItems.find((c) => c.product_id === product.product_id)
                                        ?.quantity ?? 0
                                }
                                onAddToCart={handleAddToCart}
                                onUpdateQuantity={handleUpdateQuantity}
                            />
                        ))}
                    </div>
                </div>

                {/* Right — Cart */}
                <div className="w-80 shrink-0">
                    <CartSummary
                        cartItems={cartItems}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemoveItem={handleRemoveItem}
                        onProceed={handleProceed}
                    />
                </div>
            </div>
        </>
    );
};

export default ShopMainPage;