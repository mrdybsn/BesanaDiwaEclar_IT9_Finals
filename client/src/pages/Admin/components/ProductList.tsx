import { useCallback, useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import LazyTableViewport from "../../../components/Table/LazyTableViewport";
import { useLazyPaginatedList } from "../../../hooks/useLazyPaginatedList";
import type { ProductColumns } from "../../../interfaces/ProductInterfaces";
import ProductService from "../../../services/ProductService";

interface ProductListProps {
    onAddProduct: () => void;
    onEditProduct: (product: ProductColumns) => void;
    onDeleteProduct: (product: ProductColumns) => void;
    onAvailabilityToggled: (message: string, isFailed?: boolean) => void;
    refreshKey: boolean;
}

const ProductList = ({
    onAddProduct,
    onEditProduct,
    onDeleteProduct,
    onAvailabilityToggled,
    refreshKey,
}: ProductListProps) => {
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchInput), 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchPage = useCallback(async (page: number) => {
        const response = await ProductService.loadProducts(page, debouncedSearch);
        const p = response.data.products;
        return { data: p.data, current_page: p.current_page, last_page: p.last_page };
    }, [debouncedSearch]);

    const {
        items: products,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
        reload,
    } = useLazyPaginatedList<ProductColumns>({
        fetchPage,
        resetKey: `${debouncedSearch}-${refreshKey}`,
    });

    const isLoading = initialLoading || loadingMore;

    const handleToggleAvailability = async (product: ProductColumns) => {
        try {
            await ProductService.toggleAvailable(product.product_id);
            const newStatus = !product.is_available;
            onAvailabilityToggled(
                `${product.name} (${product.size}) is now ${newStatus ? "Available" : "Unavailable"}.`
            );
            reload();
        } catch (error) {
            onAvailabilityToggled("Failed to update product availability.", true);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                    {isLoading && searchInput && (
                        <svg className="animate-spin h-4 w-4 text-blue-500 absolute right-2 top-2.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onAddProduct}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow"
                >
                    + Add Product
                </button>
            </div>

            <LazyTableViewport
                viewportRef={viewportRef}
                scrollRef={scrollRef}
                sentinelRef={sentinelRef}
                initialLoading={initialLoading}
                loadingMore={loadingMore}
                isEmpty={!initialLoading && products.length === 0}
                emptyMessage="No products found."
            >
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Image</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Product Name</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Size</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Unit</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Price</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Price/Liter</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Deposit</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Stock</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Availability</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {products.map((product, index) => (
                                <TableRow className="hover:bg-gray-50" key={product.product_id}>
                                    <TableCell className="px-4 py-3 text-center">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <img
                                            src={product.image ?? `https://ui-avatars.com/api/?background=DBEAFE&color=1D4ED8&name=${encodeURIComponent(product.name)}`}
                                            alt={product.name}
                                            className="w-10 h-10 rounded-lg object-cover mx-auto"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src =
                                                    `https://ui-avatars.com/api/?background=DBEAFE&color=1D4ED8&name=${encodeURIComponent(product.name)}`;
                                            }}
                                        />
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">{product.name}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">{product.size}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">{product.unit}</TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        ₱{Number(product.price).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        ₱{Number(product.price_per_liter).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        ₱{Number(product.container_deposit).toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className={`font-medium ${
                                            product.stock <= product.low_stock_threshold
                                                ? "text-red-600"
                                                : "text-gray-700"
                                        }`}>
                                            {product.stock}
                                            {product.stock <= product.low_stock_threshold && (
                                                <span className="ml-1 text-xs text-red-400">(Low)</span>
                                            )}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleAvailability(product)}
                                            className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                                                product.is_available
                                                    ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                    : "bg-red-100 text-red-700 hover:bg-red-200"
                                            }`}
                                        >
                                            {product.is_available ? "Available" : "Unavailable"}
                                        </button>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <div className="flex gap-4 justify-center">
                                            <button
                                                type="button"
                                                onClick={() => onEditProduct(product)}
                                                className="text-green-600 hover:underline font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => onDeleteProduct(product)}
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

export default ProductList;