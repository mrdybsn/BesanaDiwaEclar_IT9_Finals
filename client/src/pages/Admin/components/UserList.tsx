import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../../components/Table";
import type { UserColumns } from "../../../interfaces/UserInterfaces";
import UserService from "../../../services/UserService";

const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=";

interface UserListProps {
    onAddUser: () => void;
    onEditUser: (user: UserColumns) => void;
    onDeleteUser: (user: UserColumns) => void;
    onStatusToggled: (message: string, isFailed?: boolean) => void;
    refreshKey: boolean;
}

const UserList = ({
    onAddUser,
    onEditUser,
    onDeleteUser,
    onStatusToggled,
    refreshKey,
}: UserListProps) => {
    const [users, setUsers] = useState<UserColumns[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Debounce: wait 400ms after user stops typing before searching
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchInput);
            setCurrentPage(1);
        }, 400);
        return () => clearTimeout(timer);
    }, [searchInput]);

    const fetchUsers = async (page: number, searchTerm: string) => {
        setIsLoading(true);
        try {
            const response = await UserService.loadUsers(page, searchTerm);
            setUsers(response.data.users.data);
            setCurrentPage(response.data.users.current_page);
            setLastPage(response.data.users.last_page);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, debouncedSearch);
    }, [currentPage, debouncedSearch, refreshKey]);

    const handleStatusToggle = async (user: UserColumns) => {
        try {
            await UserService.updateStatus(user.user_id);
            const newStatus = !user.is_active;
            onStatusToggled(
                `${user.first_name} ${user.last_name} is now ${newStatus ? "Active" : "Inactive"}.`
            );
            fetchUsers(currentPage, debouncedSearch);
        } catch (error) {
            onStatusToggled("Failed to update user status.", true);
        }
    };

    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between gap-2 p-4 border-b border-gray-100">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="px-4 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
                    />
                    {isLoading && searchInput && (
                        <svg
                            className="animate-spin h-4 w-4 text-blue-500 absolute right-2 top-2.5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                        </svg>
                    )}
                </div>
                <button
                    type="button"
                    onClick={onAddUser}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium cursor-pointer rounded-lg shadow"
                >
                    + Add User
                </button>
            </div>

            <div className="max-w-full overflow-x-auto">
                <Table>
                    <TableHeader className="border-b border-gray-200 bg-blue-600 sticky text-white top-0 text-xs">
                        <TableRow>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Profile</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Full Name</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Username</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Role</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Contact No.</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-start">Birth Date</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Age</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Status</TableCell>
                            <TableCell isHeader className="px-5 py-3 font-medium text-center">Action</TableCell>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-gray-100 text-gray-500 text-sm">
                        {isLoading ? (
                            <TableRow>
                                <TableCell className="py-10 text-center" colSpan={10}>
                                    <div className="flex justify-center items-center gap-2 text-blue-600">
                                        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        <span>Loading users...</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell className="py-10 text-center text-gray-400" colSpan={10}>
                                    No users found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user, index) => {
                                const fullName = [
                                    user.last_name,
                                    user.first_name,
                                    user.middle_name ? user.middle_name.charAt(0) + "." : null,
                                    user.suffix_name ?? null,
                                ]
                                    .filter(Boolean)
                                    .join(", ");

                                const avatarName = encodeURIComponent(`${user.first_name} ${user.last_name}`);

                                return (
                                    <TableRow className="hover:bg-gray-50" key={user.user_id}>
                                        <TableCell className="px-4 py-3 text-center">
                                            {(currentPage - 1) * 15 + index + 1}
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <img
                                                src={user.profile_picture ? user.profile_picture : `${DEFAULT_AVATAR}${avatarName}`}
                                                alt={fullName}
                                                className="w-9 h-9 rounded-full object-cover mx-auto border border-gray-200"
                                            />
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-start">{fullName}</TableCell>
                                        <TableCell className="px-4 py-3 text-start">{user.username}</TableCell>
                                        <TableCell className="px-4 py-3 text-start capitalize">{user.role}</TableCell>
                                        <TableCell className="px-4 py-3 text-start">{user.contact_number ?? "—"}</TableCell>
                                        <TableCell className="px-4 py-3 text-start">{user.birth_date}</TableCell>
                                        <TableCell className="px-4 py-3 text-center">{user.age}</TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleStatusToggle(user)}
                                                className={`px-2 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${
                                                    user.is_active
                                                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                        : "bg-red-100 text-red-700 hover:bg-red-200"
                                                }`}
                                            >
                                                {user.is_active ? "Active" : "Inactive"}
                                            </button>
                                        </TableCell>
                                        <TableCell className="px-4 py-3 text-center">
                                            <div className="flex gap-4 justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => onEditUser(user)}
                                                    className="text-green-600 hover:underline font-medium"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => onDeleteUser(user)}
                                                    className="text-red-600 hover:underline font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {!isLoading && lastPage > 1 && (
                <div className="flex justify-center items-center gap-2 py-4 border-t border-gray-100">
                    <button
                        type="button"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage((p) => p - 1)}
                        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
                    >
                        Prev
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {currentPage} of {lastPage}
                    </span>
                    <button
                        type="button"
                        disabled={currentPage === lastPage}
                        onClick={() => setCurrentPage((p) => p + 1)}
                        className="px-3 py-1 text-sm rounded border border-gray-300 disabled:opacity-40 hover:bg-gray-100"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserList;