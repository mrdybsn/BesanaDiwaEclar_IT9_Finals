import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ProductList from "./components/ProductList";
import CheckoutBar from "./components/CheckoutBar";

export interface Product {
    product_id: number;
    name: string;
    size: string;
    unit: string;
    price: number;
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

export const products: Product[] = [
    {
        product_id: 1,
        name: "Purified Water",
        size: "500ml",
        unit: "bottle",
        price: 10.00,
        container_deposit: 0.00,
        description: "500ml round bottle",
        is_available: true,
    },
    {
        product_id: 2,
        name: "Purified Water",
        size: "1L",
        unit: "bottle",
        price: 15.00,
        container_deposit: 0.00,
        description: "1 liter round bottle",
        is_available: true,
    },
    {
        product_id: 3,
        name: "Purified Water",
        size: "5gal (Exchange)",
        unit: "gallon",
        price: 35.00,
        container_deposit: 0.00,
        description: "5gal slim container — bring your empty",
        is_available: true,
    },
    {
        product_id: 4,
        name: "Purified Water",
        size: "5gal (New Container)",
        unit: "gallon",
        price: 185.00,
        container_deposit: 150.00,
        description: "5gal round container + water — includes deposit",
        is_available: true,
    },
];

const ShopMainPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Restore cart if coming back from the order form via "Edit cart"
    const [cartItems, setCartItems] = useState<CartItem[]>(
        location.state?.cartItems ?? []
    );
    const [activeCategory, setActiveCategory] = useState<"all" | "gallon" | "bottle">("all");

    useEffect(() => {
        document.title = "Water Shop";
    }, []);

    const handleUpdateQuantity = (product: Product, quantity: number) => {
        if (quantity < 0) return;
        setCartItems((prev) => {
            const existing = prev.findIndex((c) => c.product_id === product.product_id);
            if (quantity === 0) {
                return prev.filter((c) => c.product_id !== product.product_id);
            }
            if (existing !== -1) {
                const updated = [...prev];
                updated[existing] = {
                    ...updated[existing],
                    quantity,
                    subtotal: quantity * product.price,
                };
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
                    quantity,
                    subtotal: quantity * product.price,
                },
            ];
        });
    };

    const totalAmount = cartItems.reduce((sum, c) => sum + c.subtotal, 0);
    const totalItems  = cartItems.reduce((sum, c) => sum + c.quantity, 0);

    const filteredProducts = products.filter((p) => {
        if (activeCategory === "gallon") return p.size.includes("gal");
        if (activeCategory === "bottle") return !p.size.includes("gal");
        return true;
    });

    const categories = [
        { key: "all",    label: "All",     icon: "💧" },
        { key: "gallon", label: "Gallons", icon: "🛢️" },
        { key: "bottle", label: "Bottles", icon: "🍶" },
    ];

    return (
        <div className="max-w-2xl mx-auto pb-32">
            <div className="relative bg-linear-to-br from-blue-600 to-blue-800 rounded-2xl overflow-hidden mb-6 p-6 flex items-center justify-between">
                <div>
                    <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                        Soldier's Thirst
                    </p>
                    <h1 className="text-2xl font-extrabold text-white leading-tight">
                        Hydrated<br />All Along
                    </h1>
                    <p className="text-blue-200 text-sm mt-1">
                        Roxas City's finest purified water
                    </p>
                </div>
                <div className="text-7xl opacity-80 select-none">
                    💧
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-blue-500 opacity-30" />
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-blue-400 opacity-20" />
            </div>

            {/* Category Tabs */}
            <div className="flex gap-2 mb-5">
                {categories.map((cat) => (
                    <button
                        key={cat.key}
                        type="button"
                        onClick={() => setActiveCategory(cat.key as typeof activeCategory)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold cursor-pointer transition-colors border ${
                            activeCategory === cat.key
                                ? "bg-blue-600 text-white border-blue-600"
                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                        }`}
                    >
                        <span>{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            <p className="text-xs font-bold tracking-widest text-gray-400 uppercase mb-3">
                Available Products
            </p>

            <ProductList
                products={filteredProducts}
                cartItems={cartItems}
                onUpdateQuantity={handleUpdateQuantity}
            />

            {totalItems > 0 && (
                <CheckoutBar
                    totalItems={totalItems}
                    totalAmount={totalAmount}
                    onCheckout={() =>
                        navigate("/shop/order-form", { state: { cartItems } })
                    }
                />
            )}
        </div>
    );
};

export default ShopMainPage;