import type { ReactNode } from "react";
import { useLazySlice } from "../../hooks/useLazySlice";

export interface LazyDashboardTableProps<T> {
    title: string;
    items: T[];
    headers: ReactNode;
    renderRow: (item: T) => ReactNode;
    getRowKey: (item: T) => string | number;
    emptyMessage?: string;
    pageSize?: number;
    colSpan?: number;
}

export default function LazyDashboardTable<T>({
    title,
    items,
    headers,
    renderRow,
    getRowKey,
    emptyMessage = "All stock levels are healthy.",
    pageSize = 6,
    colSpan = 3,
}: LazyDashboardTableProps<T>) {
    const { visibleItems, sentinelRef, hasMore, total } = useLazySlice(items, pageSize);

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
                {total > 0 && (
                    <span className="text-xs text-red-600 font-medium">
                        {total} alert{total !== 1 ? "s" : ""}
                    </span>
                )}
            </div>
            <div className="overflow-x-auto overflow-y-auto max-h-56">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-red-50 text-xs text-red-700 sticky top-0">{headers}</tr>
                    </thead>
                    <tbody>
                        {total === 0 ? (
                            <tr>
                                <td colSpan={colSpan} className="px-4 py-6 text-center text-gray-400 text-sm">
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            visibleItems.map((item) => (
                                <tr key={getRowKey(item)} className="border-b border-gray-50">
                                    {renderRow(item)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {hasMore && (
                    <div className="px-4 py-2 text-center text-xs text-gray-400 border-t border-gray-50">
                        Scroll for more…
                    </div>
                )}
                <div ref={sentinelRef} className="h-1" aria-hidden />
            </div>
        </div>
    );
}
