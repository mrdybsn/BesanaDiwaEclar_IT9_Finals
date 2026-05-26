import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LazyTableViewport from "../../../components/Table/LazyTableViewport";
import { useLazyPaginatedList } from "../../../hooks/useLazyPaginatedList";
import type { InventoryItem } from "../../../interfaces/InventoryInterfaces";
import InventoryService from "../../../services/InventoryService";

interface InventoryListProps {
    onEdit: (item: InventoryItem) => void;
    onDelete: (item: InventoryItem) => void;
    refreshKey: boolean;
}

const formatCategory = (category: string) =>
    category.charAt(0).toUpperCase() + category.slice(1);

const InventoryList = ({ onEdit, onDelete, refreshKey }: InventoryListProps) => {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchPage = useCallback(async (page: number) => {
        const response = await InventoryService.loadInventory(page, debouncedSearch);
        const block = response.data.items;
        return { data: block.data, current_page: block.current_page, last_page: block.last_page };
    }, [debouncedSearch]);

    const {
        items,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
    } = useLazyPaginatedList<InventoryItem>({
        fetchPage,
        resetKey: `${debouncedSearch}-${refreshKey}`,
    });

    const isLowStock = (quantity: number, threshold: number) => quantity <= threshold;

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <div className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-b border-gray-100">
                <input
                    type="text"
                    placeholder="Search inventory..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                />
            </div>

            <LazyTableViewport
                viewportRef={viewportRef}
                scrollRef={scrollRef}
                sentinelRef={sentinelRef}
                initialLoading={initialLoading}
                loadingMore={loadingMore}
                isEmpty={!initialLoading && items.length === 0}
                emptyMessage="No inventory items found."
            >
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
                                <TableRow className="hover:bg-gray-100" key={item.inventory_item_id}>
                                    <TableCell className="px-4 py-3 text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        {item.item_name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start capitalize">
                                        {formatCategory(item.category)}
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
                                                onClick={() => onEdit(item)}
                                                className="text-green-600 hover:underline font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDelete(item)}
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
            </LazyTableViewport>
        </div>
    );
};

export default InventoryList;
