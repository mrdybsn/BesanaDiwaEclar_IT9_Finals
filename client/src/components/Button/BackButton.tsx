import type { FC } from "react";
import { Link } from "react-router-dom";

interface BackButtonProps {
    label: string;
    newClassName?: string;
    className?: string;
    path: string;
}

const BackButton: FC<BackButtonProps> = ({
    label,
    newClassName,
    className,
    path,
}) => {
    return (
        <>
            <Link
                to={path}
                className={`${
                    newClassName
                        ? newClassName
                        : `bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-700 px-4 py-3 rounded-lg shadow-lg text-sm font-medium cursor-pointer ${className}`
                }`}
            >
                {label}
            </Link>
        </>
    );
};

export default BackButton;