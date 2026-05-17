import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import GallonDeclarationForm from "./components/GallonDeclarationForm";
import DeliveryDetailsForm from "./components/DeliveryDetailsForm";
import OrderReviewPanel from "./components/OrderReviewPanel";
import OrderConfirmModal from "./components/OrderConfirmModal";
import type { CartItem } from "./ShopMainPage";

export interface GallonDeclaration {
    product_id: number;
    size: string;
    quantity: number;
    gallons_owned: number;
}

export interface DeliveryDetails {
    delivery_address: string;
    contact_number: string;
    payment_method: "cash" | "gcash" | "maya";
    delivery_type: "one_time" | "recurring";
    preferred_date: string;
    preferred_day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "";
    notes: string;
}

const OrderFormMainPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const cartItems: CartItem[] = location.state?.cartItems ?? [];

    const [declarations, setDeclarations] = useState<GallonDeclaration[]>(
        cartItems
            .filter((c) => c.size.includes("5gal"))
            .map((c) => ({
                product_id: c.product_id,
                size: c.size,
                quantity: c.quantity,
                gallons_owned: 0,
            }))
    );

    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
        delivery_address: "",
        contact_number: "",
        payment_method: "cash",
        delivery_type: "one_time",
        preferred_date: "",
        preferred_day: "",
        notes: "",
    });

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    useEffect(() => {
        document.title = "Order Form";
        if (cartItems.length === 0) {
            navigate("/shop");
        }
    }, []);

    const handleDeclarationChange = (productId: number, gallonsOwned: number) => {
        setDeclarations((prev) =>
            prev.map((d) =>
                d.product_id === productId ? { ...d, gallons_owned: gallonsOwned } : d
            )
        );
    };

    const handleDeliveryChange = (field: keyof DeliveryDetails, value: string) => {
        setDeliveryDetails((prev) => ({ ...prev, [field]: value }));
    };

    const computedItems = cartItems.map((item) => {
        const declaration = declarations.find((d) => d.product_id === item.product_id);
        if (!declaration) return item;

        const exchangeQty = Math.min(declaration.gallons_owned, item.quantity);
        const newContainerQty = item.quantity - exchangeQty;
        const subtotal = exchangeQty * 35 + newContainerQty * 185;

        return { ...item, subtotal };
    });

    const totalAmount = computedItems.reduce((sum, c) => sum + c.subtotal, 0);

    return (
        <>
            <div className="mb-6 flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/shop")}
                    className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                    ← Back
                </button>
                <div>
                    <p className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                        Customer
                    </p>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order Form
                    </h1>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-4">
                    {declarations.length > 0 && (
                        <GallonDeclarationForm
                            declarations={declarations}
                            cartItems={cartItems}
                            onDeclarationChange={handleDeclarationChange}
                        />
                    )}
                    <DeliveryDetailsForm
                        details={deliveryDetails}
                        onChange={handleDeliveryChange}
                    />
                </div>
                <div className="md:col-span-1">
                    <OrderReviewPanel
                        cartItems={cartItems}
                        computedItems={computedItems}
                        declarations={declarations}
                        totalAmount={totalAmount}
                        deliveryDetails={deliveryDetails}
                        onPlaceOrder={() => setIsConfirmOpen(true)}
                    />
                </div>
            </div>

            <OrderConfirmModal
                isOpen={isConfirmOpen}
                computedItems={computedItems}
                totalAmount={totalAmount}
                deliveryDetails={deliveryDetails}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={() => {
                    setIsConfirmOpen(false);
                    navigate("/shop/history");
                }}
            />
        </>
    );
};

export default OrderFormMainPage;