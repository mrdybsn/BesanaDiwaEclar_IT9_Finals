/** Weekly recurring stops always require cash collection on delivery. */
export function deliveryNeedsCollection(task: {
    payment_status: "paid" | "unpaid";
    is_recurring: boolean;
}): boolean {
    if (task.is_recurring) return true;
    return task.payment_status !== "paid";
}
