import type { FC } from "react";
import Spinner from "../Spinner/Spinner";

interface SubmitButtonProps {
    label: string;
    newClassName?: string;
    disabled?: boolean;
    className?: string;
    loading?: boolean;
    loadingLabel?: string;
}

const SubmitButton: FC<SubmitButtonProps> = ({
    label,
    newClassName,
    className,
    loading,
    loadingLabel,
}) => {
    return (
        <>
            <button
                type="submit"
                className={`${
                    newClassName
                        ? newClassName
                        : `px-4 py-3 bg-[#5352ED] hover:bg-[#4543D4] text-white rounded-lg shadow-lg text-sm font-medium cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`
                }`}
                disabled={loading}
            >
                {loading ? (
                    <>
                        {<Spinner size="xs" />}
                        {loadingLabel}
                    </>
                ) : (
                    label
                )}
            </button>
        </>
    );
};

export default SubmitButton;