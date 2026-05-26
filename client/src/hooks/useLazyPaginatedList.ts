import { useCallback, useEffect, useRef, useState } from "react";
import { useInView } from "./useInView";

export interface PaginatedResult<T> {
    data: T[];
    current_page: number;
    last_page: number;
}

export function useLazyPaginatedList<T>({
    fetchPage,
    resetKey,
    enabled = true,
}: {
    fetchPage: (page: number) => Promise<PaginatedResult<T>>;
    resetKey?: unknown;
    enabled?: boolean;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    const { ref: viewportRef, inView } = useInView({ rootMargin: "120px" });

    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const [initialLoading, setInitialLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const loadingRef = useRef(false);

    const loadPage = useCallback(
        async (pageNum: number, replace: boolean) => {
            if (loadingRef.current || !enabled) return;
            loadingRef.current = true;
            if (replace) setInitialLoading(true);
            else setLoadingMore(true);

            try {
                const res = await fetchPage(pageNum);
                setItems((prev) => (replace ? res.data : [...prev, ...res.data]));
                setPage(res.current_page);
                setLastPage(res.last_page);
            } catch (error) {
                console.error(error);
            } finally {
                loadingRef.current = false;
                setInitialLoading(false);
                setLoadingMore(false);
            }
        },
        [fetchPage, enabled]
    );

    const reset = useCallback(() => {
        setItems([]);
        setPage(0);
        setLastPage(1);
    }, []);

    useEffect(() => {
        reset();
    }, [resetKey, reset]);

    useEffect(() => {
        if (enabled && inView && page === 0 && items.length === 0 && !loadingRef.current) {
            loadPage(1, true);
        }
    }, [enabled, inView, page, items.length, loadPage]);

    useEffect(() => {
        const root = scrollRef.current;
        const sentinel = sentinelRef.current;
        if (!root || !sentinel || !enabled || !inView) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    page > 0 &&
                    page < lastPage &&
                    !loadingRef.current
                ) {
                    loadPage(page + 1, false);
                }
            },
            { root, threshold: 0.15 }
        );

        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [enabled, inView, page, lastPage, loadPage]);

    const reload = useCallback(() => {
        reset();
        if (enabled && inView) {
            loadPage(1, true);
        }
    }, [enabled, inView, loadPage, reset]);

    return {
        items,
        scrollRef,
        sentinelRef,
        viewportRef,
        initialLoading,
        loadingMore,
        hasMore: page > 0 && page < lastPage,
        reload,
        inView,
    };
}
