import { useEffect, type FC } from "react";

interface ToastMessageProps {
    message: string;
    isFailed?: boolean;
    isVisible: boolean;
    onClose: () => void;
}

const ToastMessage: FC<ToastMessageProps> = ({
    message,
    isFailed,
    isVisible,
    onClose,
}) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    return (
        <div
            className={`fixed top-20 right-4 z-999999 flex items-center w-full max-w-xs p-4 text-gray-800
                ${isFailed ? "bg-red-100" : "bg-green-100"}
                rounded-lg shadow-lg transition-all duration-300
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
            role="alert"
        >
            <div
                className={`inline-flex items-center justify-center shrink-0 w-7 h-7 rounded-lg
                    ${isFailed ? "text-red-500 bg-red-200" : "text-green-500 bg-green-200"}`}
            >
                {isFailed ? (
                    <>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18 17.94 6M18 18 6.06 6"
                            />
                        </svg>
                        <span className="sr-only">Error icon</span>
                    </>
                ) : (
                    <>
                        <svg
                            className="w-5 h-5"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            width="24"
                            height="24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 11.917 9.724 16.5 19 7.5"
                            />
                        </svg>
                        <span className="sr-only">Check icon</span>
                    </>
                )}
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
            <button
                type="button"
                onClick={onClose}
                className="ms-auto -mx-1.5 -my-1.5 rounded-lg p-1.5 inline-flex items-center justify-center h-7 w-7 text-gray-400 hover:text-gray-900 hover:bg-white/50 transition-colors"
                aria-label="Close"
            >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                </svg>
            </button>
        </div>
    );
};

export default ToastMessage;