import type { FC, ReactNode } from "react";
import { useLocation } from "react-router-dom";

export type PagePortal = "admin" | "rider";

interface PageHeaderProps {
    title: string;
    description?: string;
    portal?: PagePortal;
    badge?: string;
    children?: ReactNode;
}

const portalConfig: Record<PagePortal, { label: string; badge: string; badgeClass: string }> = {
    admin: {
        label: "Admin",
        badge: "🛡 Administrator",
        badgeClass: "bg-blue-100 text-blue-700",
    },
    rider: {
        label: "Rider",
        badge: "🚴 Delivery Rider",
        badgeClass: "bg-cyan-100 text-cyan-800",
    },
};

const PageHeader: FC<PageHeaderProps> = ({
    title,
    description,
    portal,
    badge,
    children,
}) => {
    const location = useLocation();
    const resolvedPortal: PagePortal =
        portal ?? (location.pathname.startsWith("/rider") ? "rider" : "admin");
    const config = portalConfig[resolvedPortal];

    return (
        <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold tracking-widest text-gray-400 uppercase">
                            {config.label}
                        </span>
                        <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${config.badgeClass}`}
                        >
                            {badge ?? config.badge}
                        </span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
                    {description && (
                        <p className="text-sm text-gray-400 mt-1">{description}</p>
                    )}
                </div>
                {children && <div className="shrink-0">{children}</div>}
            </div>
        </div>
    );
};

export default PageHeader;
