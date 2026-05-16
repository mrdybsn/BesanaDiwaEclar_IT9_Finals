import type { FC } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface InventoryListProps {
    onEdit: () => void;
    onDelete: () => void;
}

const InventoryList: FC<InventoryListProps> = ({ onEdit, onDelete }) => {
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
            quantity: 500,
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

    const isLowStock = (quantity: number, threshold: number) => quantity <= threshold;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
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
                                Low Stock Threshold
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Status
                            </TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                Action
                            </TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {items.map((item, index) => (
                            <TableRow className="hover:bg-gray-100" key={index}>
                                <TableCell className="px-4 py-3 text-center">
                                    {item.item_id}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {item.item_name}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {item.category}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {item.quantity}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-start">
                                    {item.unit}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    {item.low_stock_threshold}
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <span
                                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            isLowStock(item.quantity, item.low_stock_threshold)
                                                ? "bg-red-100 text-red-700"
                                                : "bg-green-100 text-green-700"
                                        }`}
                                    >
                                        {isLowStock(item.quantity, item.low_stock_threshold)
                                            ? "Low Stock"
                                            : "OK"}
                                    </span>
                                </TableCell>
                                <TableCell className="px-4 py-3 text-center">
                                    <div className="flex gap-4 justify-center">
                                        <button
                                            type="button"
                                            onClick={onEdit}
                                            className="text-green-600 hover:underline font-medium"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onDelete}
                                            className="text-red-600 hover:underline font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default InventoryList;