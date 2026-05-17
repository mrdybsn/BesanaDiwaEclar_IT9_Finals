import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../components/Table";
import { AlertTriangle } from "lucide-react";

const items = [
    {
        item_id: 1,
        item_name: "5-Gallon Container",
        category: "Containers",
        quantity: 120,
        unit: "pcs",
        low_stock_threshold: 20,
    },
    {
        item_id: 2,
        item_name: "Bottle Caps",
        category: "Caps",
        quantity: 12,
        unit: "pcs",
        low_stock_threshold: 100,
    },
    {
        item_id: 3,
        item_name: "Sediment Filter",
        category: "Filters",
        quantity: 8,
        unit: "pcs",
        low_stock_threshold: 5,
    },
    {
        item_id: 4,
        item_name: "Chlorine Solution",
        category: "Chemicals",
        quantity: 3,
        unit: "liters",
        low_stock_threshold: 5,
    },
    {
        item_id: 5,
        item_name: "Water Pump",
        category: "Equipment",
        quantity: 2,
        unit: "units",
        low_stock_threshold: 1,
    },
];

const CashierInventoryPage = () => {
    useEffect(() => {
        document.title = "Inventory — Cashier";
    }, []);

    const isLowStock = (quantity: number, threshold: number) => quantity <= threshold;
    const lowStockCount = items.filter((i) => isLowStock(i.quantity, i.low_stock_threshold)).length;

    return (
        <div className="space-y-4">

            {/* Low Stock Alert Banner */}
            {lowStockCount > 0 && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
                    <AlertTriangle size={18} className="text-red-500 shrink-0" />
                    <p className="text-sm text-red-700 font-medium">
                        {lowStockCount} item{lowStockCount !== 1 ? "s are" : " is"} running low on stock. Please notify the admin.
                    </p>
                </div>
            )}

            {/* Read-only note */}
            <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400 italic">
                    You are viewing inventory in read-only mode. Contact admin to update stock levels.
                </p>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                <div className="max-w-full overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    No.
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Item Name
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Category
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Quantity
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Unit
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Threshold
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Status
                                </TableCell>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                            {items.map((item, index) => {
                                const low = isLowStock(item.quantity, item.low_stock_threshold);
                                return (
                                    <TableRow
                                        className={`${low ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"}`}
                                        key={index}
                                    >
                                        <TableCell className="px-4 py-3 text-center">
                                            {item.item_id}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start font-medium text-gray-800">
                                            {item.item_name}
                                            {low && (
                                                <AlertTriangle size={13} className="inline ml-1.5 text-red-500" />
                                            )}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {item.category}
                                        </TableCell>
                                        <TableCell className={`px-4 py-3 text-center font-bold ${low ? "text-red-600" : "text-gray-800"}`}>
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">
                                            {item.unit}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            {item.low_stock_threshold}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                                low
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-green-100 text-green-700"
                                            }`}>
                                                {low ? "Low Stock" : "OK"}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default CashierInventoryPage;