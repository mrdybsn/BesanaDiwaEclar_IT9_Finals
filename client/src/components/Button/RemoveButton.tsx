import type { FC } from "react";

interface RemoveButtonProps {
    label: string;
    className?: string;
    newClassName?: string;
    onRemove: () => void;
}

const RemoveButton: FC<RemoveButtonProps> = ({
    label,
    className,
    newClassName,
    onRemove,
}) => {
    return (
        <button
            type="button"
            className={
                newClassName
                    ? newClassName
                    : `px-4 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow-lg ${className}`
            }
            onClick={onRemove}
        >
            {label}
        </button>
    );
};

export default RemoveButton;