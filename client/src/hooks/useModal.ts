import { useCallback, useState } from "react";

export const useModal = <T = undefined>(initialState: boolean) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const [selectedUser, setSelectedUser] = useState<T | null>(null);

    const openModal = useCallback((user?: T) => {
        if (user !== undefined) setSelectedUser(user);
        setIsOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setSelectedUser(null);
    }, []);

    const toggleModal = useCallback(() => setIsOpen((prev) => !prev), []);

    return { isOpen, selectedUser, openModal, closeModal, toggleModal };
};