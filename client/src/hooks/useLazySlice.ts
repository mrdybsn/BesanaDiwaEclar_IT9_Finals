import { useEffect, useState } from "react";
import { useInView } from "./useInView";

/** Reveals more rows from an in-memory array as the user scrolls (dashboard tables). */
export function useLazySlice<T>(allItems: T[], pageSize = 8) {
    const { ref: sentinelRef, inView } = useInView();
    const [visibleCount, setVisibleCount] = useState(pageSize);

    useEffect(() => {
        setVisibleCount(pageSize);
    }, [allItems, pageSize]);

    useEffect(() => {
        if (inView && visibleCount < allItems.length) {
            setVisibleCount((c) => Math.min(c + pageSize, allItems.length));
        }
    }, [inView, allItems.length, visibleCount, pageSize]);

    return {
        visibleItems: allItems.slice(0, visibleCount),
        sentinelRef,
        hasMore: visibleCount < allItems.length,
        total: allItems.length,
    };
}
