import { forwardRef } from "react";
import type { OrderItem } from "../AdminPOSPage";
import "./POSReceipt.css";

const DIVIDER = "*******************************";

interface POSReceiptProps {
    orderItems: OrderItem[];
    orderId?: number;
    paymentMethod: string;
    paymentStatus?: "paid" | "unpaid";
    customerName?: string;
    change?: number;
    amountTendered?: number;
    riderName?: string;
    gallonDebtNote?: string;
}

const padLine = (left: string, right: string, width = 32) => {
    const gap = Math.max(1, width - left.length - right.length);
    return left + " ".repeat(gap) + right;
};

const paymentLabel = (method: string) => {
    switch (method) {
        case "gcash": return "GCash";
        case "maya":  return "Maya";
        case "cash":  return "Cash";
        default:      return method;
    }
};

const POSReceipt = forwardRef<HTMLDivElement, POSReceiptProps>(
    ({ orderItems, orderId, paymentMethod, paymentStatus = "paid", customerName, change, amountTendered, riderName, gallonDebtNote }, ref) => {
        const total = orderItems.reduce((s, i) => s + i.subtotal, 0);
        const now = new Date();
        const dateStr = now.toLocaleDateString("en-PH");
        const timeStr = now.toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" });

        return (
            <div ref={ref} className="thermal-receipt">
                <div className="receipt-tear receipt-tear-top" />

                <div className="receipt-body">
                    <p className="shop-name">SOLDIER&apos;S THIRST</p>
                    <p className="shop-line">Water Refilling Station</p>
                    <p className="shop-line">Roxas City, Capiz</p>
                    <p className="shop-line">Telp. 09XX-XXX-XXXX</p>

                    <p className="divider">{DIVIDER}</p>
                    <p className="receipt-title">CASH RECEIPT</p>
                    <p className="divider">{DIVIDER}</p>

                    {orderId && (
                        <p className="meta-line">Order #{orderId} · {dateStr} {timeStr}</p>
                    )}
                    {customerName && (
                        <p className="meta-line">Customer: {customerName}</p>
                    )}

                    <div className="items-header">
                        <span>Description</span>
                        <span>Price</span>
                    </div>

                    {orderItems.map((item, i) => {
                        const desc = `${item.name} ${item.size} x${item.quantity}`.slice(0, 22);
                        const price = item.subtotal.toFixed(2);
                        return (
                            <p key={i} className="item-row">{padLine(desc, price)}</p>
                        );
                    })}

                    <p className="divider">{DIVIDER}</p>

                    <p className="total-row">{padLine("Total", total.toFixed(2))}</p>

                    {paymentStatus === "unpaid" && (
                        <p className="item-row meta-line">Payment: CASH ON DELIVERY</p>
                    )}

                    {paymentStatus === "paid" && paymentMethod === "cash" && amountTendered !== undefined && (
                        <>
                            <p className="item-row">{padLine("Cash", amountTendered.toFixed(2))}</p>
                            <p className="item-row">{padLine("Change", (change ?? 0).toFixed(2))}</p>
                        </>
                    )}

                    <p className="divider">{DIVIDER}</p>

                    <p className="item-row">{padLine(paymentLabel(paymentMethod), total.toFixed(2))}</p>
                    {orderId && (
                        <p className="item-row">{padLine("Ref. No.", `#${orderId}`)}</p>
                    )}

                    {riderName && (
                        <>
                            <p className="divider">{DIVIDER}</p>
                            <p className="meta-line">Rider: {riderName}</p>
                        </>
                    )}

                    {gallonDebtNote && (
                        <p className="meta-line debt-note">{gallonDebtNote}</p>
                    )}

                    <p className="divider">{DIVIDER}</p>
                    <p className="thank-you">THANK YOU!</p>

                    <div className="barcode" aria-hidden="true">
                        {Array.from({ length: 48 }).map((_, i) => (
                            <span
                                key={i}
                                className="barcode-bar"
                                style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1 }}
                            />
                        ))}
                    </div>
                </div>

                <div className="receipt-tear receipt-tear-bottom" />
            </div>
        );
    }
);

POSReceipt.displayName = "POSReceipt";
export default POSReceipt;
