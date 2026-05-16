import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";

interface ProductListProps {
    onEdit: () => void;
    onDelete: () => void;
}

const ProductList = ({ onEdit, onDelete }: ProductListProps) => {
    const products = [
        {
            product_id: 1,
            name: "Purified Water",
            size: "500ml",
            unit: "bottle",
            price: 10.00,
            container_deposit: 0.00,
            stock: 200,
            low_stock_threshold: 50,
            is_available: true,
        },
        {
            product_id: 2,
            name: "Purified Water",
            size: "1L",
            unit: "bottle",
            price: 15.00,
            container_deposit: 0.00,
            stock: 150,
            low_stock_threshold: 30,
            is_available: true,
        },
        {
            product_id: 3,
            name: "Purified Water",
            size: "5gal",
            unit: "gallon",
            price: 35.00,
            container_deposit: 150.00,
            stock: 12,
            low_stock_threshold: 10,
            is_available: true,
        },
    ];

    return (
        <>
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="max-w-full max-h-[calc(100vh)] overflow-x-auto">
                    <Table>
                        <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                            <TableRow>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    No.
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-start">
                                    Product Name
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Size
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Unit
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Price
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Deposit
                                </TableCell>
                                <TableCell isHeader className="px-5 py-3 font-medium text-center">
                                    Stock
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
                            {products.map((product, index) => (
                                <TableRow className="hover:bg-gray-100" key={index}>
                                    <TableCell className="px-4 py-3 text-center">
                                        {product.product_id}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-start">
                                        {product.name}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        {product.size}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        {product.unit}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        ₱{product.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        ₱{product.container_deposit.toFixed(2)}
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className={`font-medium ${
                                            product.stock <= product.low_stock_threshold
                                                ? "text-red-600"
                                                : "text-gray-700"
                                        }`}>
                                            {product.stock}
                                        </span>
                                    </TableCell>
                                    <TableCell className="px-4 py-3 text-center">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                            product.is_available
                                                ? "bg-green-100 text-green-700"
                                                : "bg-red-100 text-red-700"
                                        }`}>
                                            {product.is_available ? "Available" : "Unavailable"}
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
        </>
    );
};

export default ProductList;