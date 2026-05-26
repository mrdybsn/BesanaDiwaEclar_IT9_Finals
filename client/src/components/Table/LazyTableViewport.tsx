import type { FC, ReactNode, RefObject } from "react";

interface LazyTableViewportProps {
    viewportRef?: RefObject<HTMLDivElement | null>;
    scrollRef?: RefObject<HTMLDivElement | null>;
    sentinelRef?: RefObject<HTMLDivElement | null>;
    showBuiltInSentinel?: boolean;
    children: ReactNode;
    initialLoading?: boolean;
    loadingMore?: boolean;
    emptyMessage?: string;
    isEmpty?: boolean;
    maxHeight?: string;
    colSpan?: number;
}

const LazyTableViewport: FC<LazyTableViewportProps> = ({
    viewportRef,
    scrollRef,
    sentinelRef,
    children,
    initialLoading = false,
    loadingMore = false,
    emptyMessage = "No records found.",
    isEmpty = false,
    maxHeight = "min(70vh, 32rem)",
    showBuiltInSentinel = true,
}) => {
    return (
        <div ref={viewportRef} className="w-full">
            <div
                ref={scrollRef}
                className="overflow-x-auto overflow-y-auto"
                style={{ maxHeight }}
            >
                {initialLoading ? (
                    <div className="px-4 py-10 text-center text-sm text-blue-600">
                        Loading…
                    </div>
                ) : isEmpty ? (
                    <div className="px-4 py-10 text-center text-sm text-gray-400">
                        {emptyMessage}
                    </div>
                ) : (
                    children
                )}
                {loadingMore && (
                    <div className="px-4 py-3 text-center text-xs text-blue-600 border-t border-gray-100">
                        Loading more…
                    </div>
                )}
                {showBuiltInSentinel && (
                    <div ref={sentinelRef} className="h-1 w-full shrink-0" aria-hidden />
                )}
            </div>
        </div>
    );
};

export default LazyTableViewport;
