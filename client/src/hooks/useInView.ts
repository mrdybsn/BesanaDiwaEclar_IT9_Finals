import { useEffect, useRef, useState } from "react";

export function useInView(options?: { rootMargin?: string; once?: boolean }) {
    const ref = useRef<HTMLDivElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    if (options?.once) observer.disconnect();
                } else if (!options?.once) {
                    setInView(false);
                }
            },
            { rootMargin: options?.rootMargin ?? "100px" }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [options?.rootMargin, options?.once]);

    return { ref, inView };
}
